(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{226:function(t,e,a){"use strict";a.r(e);var r=a(7),c=(a(206),a(207),a(205));function n(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,r)}return a}class i extends c.a{constructor(t,...e){super(function(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?n(Object(a),!0).forEach((function(e){Object(r.a)(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):n(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}({},t,{defaultValue:"defaultValue"in t&&t.defaultValue}),...e),Object(r.a)(this,"serialize",t=>t[this.path]),Object(r.a)(this,"deserialize",t=>t[this.path]),Object(r.a)(this,"getFilterGraphQL",({type:t,value:e})=>{const a="is"===t?"".concat(this.path):"".concat(this.path,"_").concat(t);return"".concat(a,": ").concat(e)}),Object(r.a)(this,"getFilterLabel",({label:t})=>"".concat(this.label," ").concat(t.toLowerCase())),Object(r.a)(this,"formatFilter",({label:t,value:e})=>"".concat(this.getFilterLabel({label:t}),': "').concat(e,'"')),Object(r.a)(this,"getFilterTypes",()=>[{type:"is",label:"Is",getInitialValue:()=>"true"},{type:"not",label:"Is not",getInitialValue:()=>"true"}])}}e.default=i}}]);