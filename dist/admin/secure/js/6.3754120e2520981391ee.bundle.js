(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{212:function(t,e,a){"use strict";a.r(e);var n=a(7),c=a(205);class i extends c.a{constructor(...t){super(...t),Object(n.a)(this,"getFilterGraphQL",({type:t,value:e})=>{switch(t){case"is":return"".concat(this.path,': "').concat(e,'"');case"not":return"".concat(this.path,'_not: "').concat(e,'"');case"in":return"".concat(this.path,"_in: [").concat(e.split(",").map(t=>'"'.concat(t.trim(),'"')).join(","),"]");case"not_in":return"".concat(this.path,"_not_in: [").concat(e.split(",").map(t=>'"'.concat(t.trim(),'"')).join(","),"]")}}),Object(n.a)(this,"getFilterLabel",({label:t,type:e})=>{let a="";return["in","not_in"].includes(e)&&(a=" (comma separated)"),"".concat(this.label," ").concat(t.toLowerCase()).concat(a)}),Object(n.a)(this,"formatFilter",({label:t,type:e,value:a})=>{let n=a;return["in","not_in"].includes(e)&&(n=a.split(",").map(t=>t.trim()).join(", ")),"".concat(this.label," ").concat(t.toLowerCase(),": ").concat(n)}),Object(n.a)(this,"getFilterTypes",()=>[{type:"is",label:"Is exactly",getInitialValue:()=>""},{type:"not",label:"Is not",getInitialValue:()=>""},{type:"in",label:"Is one of",getInitialValue:()=>""},{type:"not_in",label:"Is not one of",getInitialValue:()=>""}])}}e.default=i}}]);