"use strict";(self.webpackChunk_rnx_kit_docsite=self.webpackChunk_rnx_kit_docsite||[]).push([[5068],{5318:function(e,r,t){t.d(r,{Zo:function(){return u},kt:function(){return d}});var n=t(7378);function i(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function a(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){i(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function l(e,r){if(null==e)return{};var t,n,i=function(e,r){if(null==e)return{};var t,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(i[t]=e[t]);return i}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var c=n.createContext({}),s=function(e){var r=n.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):a(a({},r),e)),t},u=function(e){var r=s(e.components);return n.createElement(c.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,i=e.mdxType,o=e.originalType,c=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=s(t),d=i,f=m["".concat(c,".").concat(d)]||m[d]||p[d]||o;return t?n.createElement(f,a(a({ref:r},u),{},{components:t})):n.createElement(f,a({ref:r},u))}));function d(e,r){var t=arguments,i=r&&r.mdxType;if("string"==typeof e||i){var o=t.length,a=new Array(o);a[0]=m;var l={};for(var c in r)hasOwnProperty.call(r,c)&&(l[c]=r[c]);l.originalType=e,l.mdxType="string"==typeof e?e:i,a[1]=l;for(var s=2;s<o;s++)a[s]=t[s];return n.createElement.apply(null,a)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},939:function(e,r,t){t.r(r),t.d(r,{assets:function(){return u},contentTitle:function(){return c},default:function(){return d},frontMatter:function(){return l},metadata:function(){return s},toc:function(){return p}});var n=t(5773),i=t(808),o=(t(7378),t(5318)),a=["components"],l={},c="metro-serializer",s={unversionedId:"tools/metro-serializer",id:"tools/metro-serializer",title:"metro-serializer",description:"",source:"@site/docs/tools/metro-serializer.mdx",sourceDirName:"tools",slug:"/tools/metro-serializer",permalink:"/rnx-kit/docs/tools/metro-serializer",editUrl:"https://github.com/microsoft/rnx-kit/tree/main/docsite/docs/tools/metro-serializer.mdx",tags:[],version:"current",frontMatter:{},sidebar:"toolsSidebar",previous:{title:"metro-resolver-symlinks",permalink:"/rnx-kit/docs/tools/metro-resolver-symlinks"},next:{title:"metro-serializer-esbuild",permalink:"/rnx-kit/docs/tools/metro-serializer-esbuild"}},u={},p=[{value:"Usage",id:"usage",level:2}],m={toc:p};function d(e){var r=e.components,t=(0,i.Z)(e,a);return(0,o.kt)("wrapper",(0,n.Z)({},m,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"metro-serializer"},"metro-serializer"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"@rnx-kit/metro-serializer")," is Metro's default JavaScript bundle serializer, but\nwith support for plugins."),(0,o.kt)("h2",{id:"usage"},"Usage"),(0,o.kt)("p",null,"Import and set the serializer to ",(0,o.kt)("inlineCode",{parentName:"p"},"serializer.customSerializer")," in your\n",(0,o.kt)("inlineCode",{parentName:"p"},"metro.config.js"),", then add your desired plugins. For instance, to add\n",(0,o.kt)("inlineCode",{parentName:"p"},"CyclicDependencies")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"DuplicateDependencies")," plugins:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'const { makeMetroConfig } = require("@rnx-kit/metro-config");\nconst {\n  CyclicDependencies,\n} = require("@rnx-kit/metro-plugin-cyclic-dependencies-detector");\nconst {\n  DuplicateDependencies,\n} = require("@rnx-kit/metro-plugin-duplicates-checker");\nconst { MetroSerializer } = require("@rnx-kit/metro-serializer");\n\nmodule.exports = makeMetroConfig({\n  projectRoot: __dirname,\n  serializer: {\n    customSerializer: MetroSerializer([\n      CyclicDependencies(),\n      DuplicateDependencies(),\n    ]),\n  },\n});\n')))}d.isMDXComponent=!0}}]);