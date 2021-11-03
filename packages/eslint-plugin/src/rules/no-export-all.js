// @ts-check
"use strict";

/**
 * @typedef {import("@typescript-eslint/types").TSESTree.Node} Node
 * @typedef {import("eslint").Rule.RuleContext} ESLintRuleContext
 * @typedef {{ exports: string[], types: string[] }} NamedExports
 *
 * @typedef {{
 *   id: ESLintRuleContext["id"];
 *   options: ESLintRuleContext["options"];
 *   settings: ESLintRuleContext["settings"];
 *   parserPath: ESLintRuleContext["parserPath"];
 *   parserOptions: ESLintRuleContext["parserOptions"];
 *   parserServices: ESLintRuleContext["parserServices"];
 *   filename: string;
 * }} RuleContext
 */

const fs = require("fs");
const path = require("path");

const DEFAULT_CONFIG = {
  ecmaVersion: 9,
  ecmaFeatures: { globalReturn: false, jsx: true },
  sourceType: "module",
  loc: true,
  range: true,
  raw: true,
  tokens: true,
  comment: true,
  eslintVisitorKeys: true,
  eslintScopeManager: true,
};

const MAX_DEPTH = 5;

/**
 * Returns whether there are any named exports.
 * @param {NamedExports?} namedExports
 * @returns {namedExports is null}
 */
function isEmpty(namedExports) {
  return (
    !namedExports ||
    (namedExports.exports.length === 0 && namedExports.types.length === 0)
  );
}

/**
 * Creates and returns an ES tree traverser.
 * @returns {{ traverse: (node: Node, options: {}) => void; }}
 */
function makeTraverser() {
  const Traverser = require(path.join(
    path.dirname(require.resolve("eslint/package.json")),
    "lib",
    "shared",
    "traverser"
  ));
  return new Traverser();
}

/**
 * Resolves specified `moduleId` starting from `fromDir`.
 */
const resolveFrom =
  /** @type {() => (fromDir: string, moduleId: string) => string} */
  (
    () => {
      if (process.env.NODE_ENV === "test") {
        return (_, moduleId) => moduleId;
      }

      const resolve = require("enhanced-resolve").create.sync({
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      });

      return (fromDir, moduleId) => {
        const m = resolve(fromDir, moduleId);
        if (!m) {
          throw new Error(
            `Module not found: ${moduleId} (start path: ${fromDir})`
          );
        }
        return m;
      };
    }
  )();

/**
 * Converts ESLint's `RuleContext` to our `RuleContext`.
 * @param {ESLintRuleContext} context
 * @returns {RuleContext}
 */
function toRuleContext(context) {
  return {
    id: context.id,
    options: context.options,
    settings: context.settings,
    parserPath: context.parserPath,
    parserOptions: context.parserOptions,
    parserServices: context.parserServices,
    filename: context.getFilename(),
  };
}

/**
 * Parses specified file and returns an AST.
 * @param {RuleContext} context
 * @param {string} moduleId
 * @returns {{ ast: Node; filename: string; } | null}
 */
function parse({ filename, parserPath, parserOptions }, moduleId) {
  const { parseForESLint } = require(parserPath);
  if (typeof parseForESLint !== "function") {
    return null;
  }

  try {
    const parentDir = path.dirname(filename);
    const modulePath = resolveFrom(parentDir, moduleId);
    const code = fs.readFileSync(modulePath, { encoding: "utf-8" });
    return {
      ast: parseForESLint(code, {
        ...DEFAULT_CONFIG,
        ...parserOptions,
        filePath: modulePath,
      }).ast,
      filename: modulePath,
    };
  } catch (_) {
    /* ignore */
  }

  return null;
}

/**
 * Extracts exports from specified file.
 * @param {RuleContext} context
 * @param {unknown} moduleId
 * @param {number=} depth
 * @returns {NamedExports | null}
 */
function extractExports(context, moduleId, depth = 0) {
  if (depth >= MAX_DEPTH || typeof moduleId !== "string") {
    return null;
  }

  const parseResult = parse(context, moduleId);
  if (!parseResult?.ast) {
    return null;
  }

  const { ast, filename } = parseResult;
  try {
    /** @type {NamedExports} */
    const result = { exports: [], types: [] };
    const traverser = makeTraverser();
    traverser.traverse(ast, {
      /** @type {(node: Node, parent: Node) => void} */
      enter: (node, _parent) => {
        switch (node.type) {
          case "ExportNamedDeclaration":
            if (node.declaration) {
              switch (node.declaration.type) {
                case "ClassDeclaration":
                // fallthrough
                case "FunctionDeclaration": {
                  const name = node.declaration.id?.name;
                  if (name) {
                    result.exports.push(name);
                  }
                  break;
                }

                case "TSInterfaceDeclaration":
                // fallthrough
                case "TSTypeAliasDeclaration": {
                  const name = node.declaration.id?.name;
                  if (name) {
                    result.types.push(name);
                  }
                  break;
                }

                case "VariableDeclaration":
                  node.declaration.declarations.forEach((declaration) => {
                    if (declaration.id.type === "Identifier") {
                      result.exports.push(declaration.id.name);
                    }
                  });
                  break;
              }
            } else {
              const list =
                node.exportKind === "type" ? result.types : result.exports;
              node.specifiers.forEach((spec) => {
                const name = spec.exported.name;
                if (name !== "default") {
                  list.push(name);
                }
              });
            }
            break;

          case "ExportAllDeclaration": {
            const source = node.source?.value;
            if (source) {
              const namedExports = extractExports(
                { ...context, filename },
                source,
                depth + 1
              );
              if (namedExports) {
                result.exports.push(...namedExports.exports);
                result.types.push(...namedExports.types);
              }
            }
            break;
          }
        }
      },
    });
    return result;
  } catch (_) {
    /* ignore */
  }

  return null;
}

/** @type {import("eslint").Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "disallow `export *`",
      category: "Possible Errors",
      recommended: true,
      url: require("../../package.json").homepage,
    },
    fixable: "code",
    schema: [], // no options
  },
  create: (context) => {
    return {
      ExportAllDeclaration: (node) => {
        const result = extractExports(
          toRuleContext(context),
          node.source.value
        );
        context.report({
          node,
          message:
            "Prefer explicit exports over `export *` to avoid name clashes, and improve tree-shakeability.",
          fix: isEmpty(result)
            ? null
            : (fixer) => {
                /** @type {string[]} */
                const lines = [];
                if (result.exports.length > 0) {
                  const names = result.exports.sort().join(", ");
                  lines.push(`export { ${names} } from ${node.source.raw};`);
                }
                if (result.types.length > 0) {
                  const types = result.types.sort().join(", ");
                  lines.push(
                    `export type { ${types} } from ${node.source.raw};`
                  );
                }
                return fixer.replaceText(node, lines.join("\n"));
              },
        });
      },
    };
  },
};