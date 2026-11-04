/* 由 tools/build.mjs 从 src/client/index.js 生成 —— 请勿手改。
 * 重新生成：npm run build
 */
window.__ModuleLoader__.load({
  id: "@tom2012/dsh-notes",
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
    var mt=Object.create;var ue=Object.defineProperty;var ht=Object.getOwnPropertyDescriptor;var bt=Object.getOwnPropertyNames;var yt=Object.getPrototypeOf,wt=Object.prototype.hasOwnProperty;var vt=(e,t)=>{for(var r in t)ue(e,r,{get:t[r],enumerable:!0})},Ae=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of bt(t))!wt.call(e,a)&&a!==r&&ue(e,a,{get:()=>t[a],enumerable:!(n=ht(t,a))||n.enumerable});return e};var fe=(e,t,r)=>(r=e!=null?mt(yt(e)):{},Ae(t||!e||!e.__esModule?ue(r,"default",{value:e,enumerable:!0}):r,e)),kt=e=>Ae(ue({},"__esModule",{value:!0}),e);var Ut={};vt(Ut,{apply:()=>Ht,inject:()=>jt});module.exports=kt(Ut);var Wt=fe(require("react")),zt=fe(require("react/jsx-runtime")),Bt=fe(require("react-dom")),Dt=fe(require("react-dom/client"));var g=require("react");var z="/-/notes";function xt(e){return e===404?"接口不存在（宿主插件可能未加载）":e===403?"没有权限（宿主鉴权拒绝了请求）":e===409?"内容已在别处修改":e===413?"内容过大":e===503?"宿主服务不可用，请重启 dsh web":e>=500?"宿主内部错误":`HTTP ${e}`}async function H(e){let t=null;try{t=await e.json()}catch{t=null}if(!e.ok||t&&t.ok===!1){let r=new Error(t&&t.error||xt(e.status));throw r.status=e.status,t&&t.current!==void 0&&(r.current=t.current),r}return t||{}}function G(e){let t=[];for(let[r,n]of Object.entries(e||{}))n==null||n===""||t.push(`${encodeURIComponent(r)}=${encodeURIComponent(String(n))}`);return t.length?`?${t.join("&")}`:""}var x={base:z,async status(){return H(await fetch(`${z}/status`,{credentials:"same-origin"}))},async tree(){return H(await fetch(`${z}/tree`,{credentials:"same-origin"}))},async readPage(e){return(await H(await fetch(`${z}/page${G({id:e})}`,{credentials:"same-origin"}))).page},async savePage({id:e,title:t,blocks:r,rev:n,baseMtimeMs:a,baseSize:c}){let i={title:t,rev:n,baseMtimeMs:a,baseSize:c};return Array.isArray(r)&&(i.blocks=r),H(await fetch(`${z}/page${G({id:e})}`,{method:"PUT",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}))},async createPage({notebookId:e,title:t,blocks:r,markdown:n}){let a={notebookId:e,title:t};return Array.isArray(r)&&(a.blocks=r),typeof n=="string"&&(a.markdown=n),(await H(await fetch(`${z}/page`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}))).page},async deletePage(e){return H(await fetch(`${z}/page${G({id:e})}`,{method:"DELETE",credentials:"same-origin"}))},async createNotebook({parentId:e=null,title:t,workspacePath:r=null,workspaceLabel:n=null}){return(await H(await fetch(`${z}/notebook`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({parentId:e,title:t,workspacePath:r,workspaceLabel:n})}))).notebook},async updateNotebook(e,t){return(await H(await fetch(`${z}/notebook${G({id:e})}`,{method:"PATCH",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(t||{})}))).notebook},async deleteNotebook(e){return H(await fetch(`${z}/notebook${G({id:e})}`,{method:"DELETE",credentials:"same-origin"}))},async findWorkspace(e){return(await H(await fetch(`${z}/workspace${G({path:e})}`,{credentials:"same-origin"}))).notebook},async bindWorkspace({workspacePath:e,title:t,workspaceLabel:r}){return H(await fetch(`${z}/workspace`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({workspacePath:e,title:t,workspaceLabel:r})}))},async search(e,t=30){return(await H(await fetch(`${z}/search${G({q:e,limit:t})}`,{credentials:"same-origin"}))).results||[]},async uploadAsset(e){let t=(e.name.split(".").pop()||"").toLowerCase(),r=await fetch(`${z}/asset`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":e.type||"application/octet-stream","x-notes-ext":t},body:e});return H(r)},exportUrl(e){return`${z}/export${G({id:e})}`}};var v=require("react");var We="/-/notes/client",De={},oe=null;function je(e){Object.assign(De,e||{})}function ze(){return e=>{let t=De[e];if(t!==void 0)return t;throw new Error(`dsh-notes: 编辑器模块请求了未注册的依赖 ${e}`)}}function He(){return oe||(oe=new Promise((e,t)=>{if(typeof document>"u"){t(new Error("dsh-notes: 没有 document，无法加载编辑器"));return}let r="dsh-notes-editor-css";if(!document.getElementById(r)){let i=document.createElement("link");i.id=r,i.rel="stylesheet",i.href=`${We}/editor.css`,document.head.append(i)}let n="__DSH_NOTES_EDITOR_FACTORY__",a=window[n];if(typeof a=="function"){try{e(a(ze()))}catch(i){t(Be(i))}return}let c=document.createElement("script");c.src=`${We}/editor.js`,c.async=!0,c.onload=()=>{let i=window[n];if(typeof i!="function"){t(new Error("dsh-notes: 编辑器模块加载后没有注册工厂"));return}try{e(i(ze()))}catch(l){t(Be(l))}},c.onerror=()=>t(new Error("dsh-notes: 编辑器模块下载失败（/-/notes/client/editor.js）")),document.head.append(c)}),oe.catch(()=>{oe=null}),oe)}function Be(e){return e instanceof Error?e:new Error(String(e))}var b=require("react/jsx-runtime"),A={fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"};function Z(e,t){return(0,b.jsx)("svg",{viewBox:"0 0 24 24",width:e,height:e,"aria-hidden":"true",focusable:"false",fill:"none",children:t})}function ee({size:e=16}){return Z(e,(0,b.jsx)(b.Fragment,{children:(0,b.jsx)("path",{d:"M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-6-3.5-6 3.5V5A1.5 1.5 0 0 1 6 3.5Z",...A})}))}function Ue({size:e=16}){return Z(e,(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("path",{d:"M7 3.5h7.2L18.5 7.8V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z",...A}),(0,b.jsx)("path",{d:"M13.8 3.8V8h4.2",...A})]}))}function Ke(){return(0,b.jsxs)("svg",{viewBox:"0 0 24 24",width:"20",height:"20","aria-hidden":"true",focusable:"false",fill:"none",children:[(0,b.jsx)("path",{d:"M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-6-3.5-6 3.5V5A1.5 1.5 0 0 1 6 3.5Z",...A}),(0,b.jsx)("path",{d:"M9.5 9h5M9.5 12.5h3",...A})]})}function xe({size:e=14}){return Z(e,(0,b.jsx)("path",{d:"M12 5.5v13M5.5 12h13",...A}))}function _e({size:e=12,open:t=!1}){return(0,b.jsx)("svg",{viewBox:"0 0 24 24",width:e,height:e,"aria-hidden":"true",focusable:"false",fill:"none",style:{transform:t?"rotate(90deg)":"none",transition:"transform 120ms ease"},children:(0,b.jsx)("path",{d:"M9 5.5 15.5 12 9 18.5",...A})})}function Fe({size:e=14}){return Z(e,(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("circle",{cx:"11",cy:"11",r:"5.75",...A}),(0,b.jsx)("path",{d:"M15.4 15.4 19 19",...A})]}))}function Ne({size:e=14}){return Z(e,(0,b.jsx)(b.Fragment,{children:(0,b.jsx)("path",{d:"M4.5 7h15M10 4.5h4M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12",...A})}))}function ge({size:e=14}){return Z(e,(0,b.jsx)(b.Fragment,{children:(0,b.jsx)("path",{d:"M4.5 19.5h4L19 9a2 2 0 0 0 0-2.8l-1.2-1.2A2 2 0 0 0 15 5L4.5 15.5v4Z",...A})}))}function le({size:e=14}){return Z(e,(0,b.jsx)("path",{d:"M6 6l12 12M18 6 6 18",...A}))}function Ve({size:e=14}){return Z(e,(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("path",{d:"M12 3.5v11M8 10.5 12 14.5 16 10.5",...A}),(0,b.jsx)("path",{d:"M5 17v2a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-2",...A})]}))}function qe({size:e=14}){return Z(e,(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("path",{d:"M6 3.5h9.2L19 7.3V18a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 18V6a2.5 2.5 0 0 1 1-2Z",...A}),(0,b.jsx)("path",{d:"M8.5 3.5v5h6M8.5 20.5v-6h7v6",...A})]}))}var me=require("react");function Ce(){return typeof document>"u"||!document.body?"light":document.body.hasAttribute("data-ds-dark-theme")?"dark":"light"}function Je(){let[e,t]=(0,me.useState)(Ce);return(0,me.useEffect)(()=>{if(typeof MutationObserver!="function"||typeof document>"u"||!document.body)return;let r=new MutationObserver(()=>t(Ce()));return r.observe(document.body,{attributes:!0,attributeFilter:["data-ds-dark-theme","class"]}),t(Ce()),()=>r.disconnect()},[]),e}var m=require("react/jsx-runtime"),Nt=800,Ct=16*1024*1024;function St(e){if(typeof e!="string"||!e.startsWith("asset://"))return e;let t=e.slice(8),r=t.lastIndexOf("."),n=r===-1?t:t.slice(0,r),a=r===-1?"png":t.slice(r+1);return`/-/notes/asset?sha=${encodeURIComponent(n)}&ext=${encodeURIComponent(a)}`}function Ze({pageId:e,t,onChanged:r,onGone:n}){let[a,c]=(0,v.useState)(null),[i,l]=(0,v.useState)("idle"),[h,S]=(0,v.useState)("");return(0,v.useEffect)(()=>{if(!e){c(null),l("idle");return}let y=!1;return l("loading"),S(""),x.readPage(e).then(w=>{y||(c(w),l("ready"))}).catch(w=>{y||(S(String(w&&w.message||w)),l("error"),w&&w.status===404&&typeof n=="function"&&n())}),()=>{y=!0}},[e,n]),e?i==="loading"||i==="idle"?(0,m.jsx)("div",{className:"n-empty",children:t.loading}):i==="error"?(0,m.jsx)("div",{className:"n-empty",children:h}):a?(0,m.jsx)(Pt,{page:a,t,onSaved:r},a.id):(0,m.jsx)("div",{className:"n-empty",children:t.loading}):(0,m.jsx)("div",{className:"n-empty",children:t.noPage})}function It({t:e}){return(0,m.jsxs)("div",{className:"n-editor-skeleton",role:"status","aria-live":"polite",children:[(0,m.jsx)("div",{className:"n-skel-line",style:{width:"38%",height:"18px"}}),(0,m.jsx)("div",{className:"n-skel-line",style:{width:"92%"}}),(0,m.jsx)("div",{className:"n-skel-line",style:{width:"86%"}}),(0,m.jsx)("div",{className:"n-skel-line",style:{width:"70%"}}),(0,m.jsx)("div",{className:"n-skel-hint",children:e.loading})]})}function Pt({page:e,t,onSaved:r}){let[n,a]=(0,v.useState)(null),[c,i]=(0,v.useState)(""),[l,h]=(0,v.useState)(e.title&&e.title!==t.untitled?e.title:""),[S,y]=(0,v.useState)("saved"),[w,C]=(0,v.useState)(null),[O,k]=(0,v.useState)(""),L=(0,v.useRef)({...e}),u=(0,v.useRef)(!1),R=(0,v.useRef)(null),B=(0,v.useRef)(!1),I=(0,v.useRef)(null),q=(0,v.useRef)(l),F=(0,v.useRef)(t),Y=(0,v.useRef)(r);q.current=l,F.current=t,Y.current=r,(0,v.useEffect)(()=>{let f=!1;return He().then(P=>{f||a(P)}).catch(P=>{f||i(String(P&&P.message||P))}),()=>{f=!0}},[]);let T=(0,v.useCallback)(async({force:f=!1,rev:P}={})=>{let M=I.current;if(!M||B.current||!u.current&&!f)return;let Q=L.current,J;try{J=JSON.parse(JSON.stringify(M.document))}catch($){k(String($&&$.message||$));return}B.current=!0,y("saving");try{let $=await x.savePage({id:Q.id,title:q.current.trim()||F.current.untitled,blocks:J,rev:P===void 0?Q.rev:P,baseMtimeMs:Q.mtimeMs,baseSize:Q.size});if(L.current={...$.page},u.current=!1,y("saved"),C(null),$.conflictFile){let se=String($.conflictFile).split(/[\\/]/).pop();k(`已保存；外部改动留档为 ${se}`)}typeof Y.current=="function"&&Y.current($.page)}catch($){$&&$.status===409?(C($.current||null),y("error")):(y("error"),k(String($&&$.message||$)))}finally{B.current=!1}},[]),U=(0,v.useCallback)(()=>{R.current&&clearTimeout(R.current),R.current=setTimeout(()=>{R.current=null,T()},Nt)},[T]);(0,v.useEffect)(()=>()=>{R.current&&(clearTimeout(R.current),R.current=null),u.current&&T({force:!0}).catch(()=>{})},[T]),(0,v.useEffect)(()=>{let f=P=>{(P.metaKey||P.ctrlKey)&&!P.altKey&&String(P.key).toLowerCase()==="s"&&(P.preventDefault(),T({force:!0}))};return window.addEventListener("keydown",f,!0),()=>window.removeEventListener("keydown",f,!0)},[T]);let de=(0,v.useCallback)(async f=>{if(f&&f.size>Ct)throw new Error(F.current.imageTooLarge);let P=await x.uploadAsset(f);return`asset://${P.sha}.${P.ext}`},[]),pe=(0,v.useCallback)(async f=>St(f),[]),re=(0,v.useMemo)(()=>({initialContent:Array.isArray(e.blocks)&&e.blocks.length>0?e.blocks:void 0,uploadFile:de,resolveFileUrl:pe}),[e.id]);return(0,m.jsxs)("div",{className:"n-main",children:[(0,m.jsxs)("div",{className:"n-topbar",children:[(0,m.jsx)("input",{className:"n-title-input",value:l,placeholder:t.untitled,"aria-label":t.title,onChange:f=>{h(f.target.value),u.current=!0,y("dirty"),U()},onBlur:()=>T()}),(0,m.jsx)("span",{className:`n-save-state${S==="error"?" is-error":""}`,role:"status","aria-live":"polite",children:S==="saving"?t.saving:S==="dirty"?t.unsaved:S==="error"?t.conflict:t.saved}),(0,m.jsx)("a",{className:"n-btn is-icon",href:x.exportUrl(e.id),download:!0,title:t.exportMd,"aria-label":t.exportMd,children:(0,m.jsx)(Ve,{})}),(0,m.jsx)("button",{type:"button",className:"n-btn is-icon",title:t.save,"aria-label":t.save,onClick:()=>T({force:!0}),children:(0,m.jsx)(qe,{})})]}),w&&(0,m.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,m.jsxs)("span",{className:"n-banner-text",children:[(0,m.jsx)("b",{children:t.conflict})," — ",t.conflictBody]}),(0,m.jsx)("button",{type:"button",className:"n-btn",onClick:()=>{let f=w.rev;C(null),u.current=!0,T({force:!0,rev:f})},children:t.overwrite}),(0,m.jsx)("button",{type:"button",className:"n-btn",onClick:async()=>{C(null);try{let f=await x.readPage(L.current.id);L.current={...f},h(f.title===t.untitled?"":f.title);let P=I.current;P&&Array.isArray(f.blocks)&&P.replaceBlocks(P.document,f.blocks),u.current=!1,y("saved")}catch(f){k(String(f&&f.message||f))}},children:t.reload})]}),O&&(0,m.jsxs)("div",{className:"n-banner",role:"status",children:[(0,m.jsx)("span",{className:"n-banner-text",children:O}),(0,m.jsx)("button",{type:"button",className:"n-btn is-icon","aria-label":t.close,onClick:()=>k(""),children:(0,m.jsx)(le,{})})]}),(0,m.jsx)("div",{className:"n-editor-scroll",children:(0,m.jsxs)("div",{className:"n-editor",children:[c&&(0,m.jsx)("div",{className:"n-empty",children:c}),!n&&!c&&(0,m.jsx)(It,{t}),n&&(0,m.jsx)(Et,{runtime:n,options:re,t,onReady:f=>{I.current=f},onChange:()=>{u.current=!0,y(f=>f==="saving"?f:"dirty"),U()}})]})})]})}function Et({runtime:e,options:t,t:r,onReady:n,onChange:a}){let{useCreateBlockNote:c,BlockNoteView:i}=e,l=Je(),h=c(t);return(0,v.useEffect)(()=>{h&&n(h)},[h,n]),h?(0,m.jsx)("div",{className:"n-blocknote",children:(0,m.jsx)(i,{editor:h,theme:l,onChange:a})}):null}var Tt={label:"全部笔记本",panelLabel:"笔记本",title:"全部笔记本",currentWorkspace:"当前工作区",noWorkspace:"未选择工作区",createNotebook:"新建笔记本",openNotebook:"打开笔记本",orphan:"游离",newPage:"新建页面",newChild:"新建子笔记本",rename:"重命名",delete:"删除",exportMd:"导出 Markdown",save:"保存",saved:"已保存",saving:"保存中…",unsaved:"未保存",conflict:"他处已修改",conflictBody:"这份笔记在别处被改过。覆盖会丢掉对方的改动。",overwrite:"覆盖",reload:"载入最新",empty:"还没有笔记本",emptyHint:"在左侧选中一个工作区，点「新建笔记本」开始。",noPage:"选一个页面开始编辑，或者新建一页。",untitled:"无标题",searchPlaceholder:"搜索标题与正文…",searchEmpty:"没有命中",deleteNotebookConfirm:e=>`删除笔记本「${e}」？它和里面的页面都会进回收站。`,deletePageConfirm:e=>`删除页面「${e}」？会进回收站。`,renamePrompt:"新名字",loading:"载入中…",retry:"重试",unavailable:"笔记本服务不可用",unavailableHint:"宿主路由没有注册成功，请重启 dsh web 后刷新页面。",imageTooLarge:"图片太大（上限 16MB）",uploadFailed:"图片上传失败",chars:e=>`${e} 字`,more:"更多",noResults:"没有结果",notebook:"笔记本",page:"页面",rightTab:"笔记本",rightTabDesc:"浏览全部工作区的笔记本",rightEmptyHint:"点上面的「新建笔记本」开始。",close:"关闭"},Mt={label:"All notebooks",panelLabel:"Notebook",title:"All notebooks",currentWorkspace:"Current workspace",noWorkspace:"No workspace selected",createNotebook:"New notebook",openNotebook:"Open notebook",orphan:"Orphan",newPage:"New page",newChild:"New sub-notebook",rename:"Rename",delete:"Delete",exportMd:"Export markdown",save:"Save",saved:"Saved",saving:"Saving…",unsaved:"Unsaved",conflict:"Changed elsewhere",conflictBody:"This note changed on disk. Overwriting discards the other version.",overwrite:"Overwrite",reload:"Reload latest",empty:"No notebooks yet",emptyHint:"Pick a workspace on the left, then click “New notebook”.",noPage:"Pick a page to start writing, or create one.",untitled:"Untitled",searchPlaceholder:"Search titles and text…",searchEmpty:"Nothing matched",deleteNotebookConfirm:e=>`Delete notebook “${e}”? It and its pages go to the trash.`,deletePageConfirm:e=>`Delete page “${e}”? It goes to the trash.`,renamePrompt:"New name",loading:"Loading…",retry:"Retry",unavailable:"Notebook service unavailable",unavailableHint:"The host route did not register. Restart dsh web, then reload this page.",imageTooLarge:"Image too large (16MB limit)",uploadFailed:"Image upload failed",chars:e=>`${e} chars`,more:"More",noResults:"No results",notebook:"Notebook",page:"Page",rightTab:"Notebooks",rightTabDesc:"Browse notebooks from every workspace",rightEmptyHint:"Use “New notebook” above to get started.",close:"Close"};function V(){let e=typeof document<"u"&&document.documentElement.lang||"zh-CN";return String(e).toLowerCase().startsWith("zh")?"zh":"en"}function D(e){return(e||V())==="zh"?Tt:Mt}function te(e){if(typeof MutationObserver!="function"||typeof document>"u")return()=>{};let t=new MutationObserver(r=>{for(let n of r)if(n.attributeName==="lang"){e(V());return}});return t.observe(document.documentElement,{attributes:!0,attributeFilter:["lang"]}),()=>t.disconnect()}var he=null,Se=new Set;function ne(e){he=Object.assign({at:Date.now()},e||{});for(let t of Se)try{t(he)}catch{}}function Ie(){let e=he;return he=null,e}function Xe(e){return Se.add(e),()=>Se.delete(e)}var be=require("react");function Lt(e){try{let t=e.get&&e.get("uiSession"),r=t&&(t.current||t.adapter?.current)||null,n=r&&typeof r.getSnapshot=="function"?r.getSnapshot():null;if(n&&typeof n.key=="string")return n.key}catch{}try{let t=e.get&&e.get("sessions"),r=t&&t.list&&t.list.getSnapshot();if(r&&r.byId){let n=Object.values(r.byId).find(a=>(a.retainedBy?.mainView??0)>0);if(n&&n.id)return n.id}}catch{}}function Rt(e,t){if(!t)return null;let r="";try{let n=e.get&&e.get("workspaces"),a=n&&n.list&&n.list.getSnapshot(),i=(a&&a.items||[]).find(l=>l.path===t);i&&(r=i.title||i.displayTitle||"")}catch{}if(!r){let n=String(t).split(/[\\/]/).filter(Boolean);r=n.length?n[n.length-1]:t}return{path:t,title:r}}function Ye(e){let t=Lt(e);if(!t)return null;try{let r=e.get&&e.get("sessions"),n=r&&r.list&&r.list.getSnapshot(),a=n&&n.byId&&n.byId[t];return a?Rt(e,a.cwd):null}catch{return null}}function ye(e){let[t,r]=(0,be.useState)(()=>Ye(e));return(0,be.useEffect)(()=>{let n=()=>r(Ye(e)),a=[],c=(l,h)=>{try{let S=h(l);S&&typeof S.subscribe=="function"&&a.push(S.subscribe(n)||(()=>{}))}catch{}},i=e.get&&e.get("uiSession");try{let l=i&&(i.current||i.adapter?.current)||null;l&&typeof l.subscribe=="function"&&a.push(l.subscribe(n)||(()=>{}))}catch{}try{let l=e.get&&e.get("sessions");c(l,h=>h.list)}catch{}try{let l=e.get&&e.get("workspaces");c(l,h=>h.list)}catch{}return n(),()=>{for(let l of a)try{l()}catch{}}},[e]),t}var s=require("react/jsx-runtime");function $t(e){let t=Array.isArray(e?.notebooks)?e.notebooks:[],r=Array.isArray(e?.pages)?e.pages:[],n=new Map(t.map(i=>[i.id,i])),a=new Map;for(let i of t){let l=i.parentId&&n.has(i.parentId)?i.parentId:null;a.has(l)||a.set(l,[]),a.get(l).push(i)}for(let i of a.values())i.sort((l,h)=>(l.order??0)-(h.order??0)||l.title.localeCompare(h.title));let c=new Map;for(let i of r)c.has(i.notebookId)||c.set(i.notebookId,[]),c.get(i.notebookId).push(i);for(let i of c.values())i.sort((l,h)=>(l.order??0)-(h.order??0)||(h.updatedAt??0)-(l.updatedAt??0));return{byId:n,children:a,pagesOf:c,root:a.get(null)||[],notebookCount:t.length}}function Qe({value:e,onChange:t,onCommit:r,onCancel:n}){let a=(0,g.useRef)(null);return(0,g.useEffect)(()=>{a.current?.focus(),a.current?.select()},[]),(0,s.jsx)("input",{ref:a,className:"n-title-input",style:{height:"22px",fontSize:"13px",fontWeight:500},value:e,onChange:c=>t(c.target.value),onBlur:r,onKeyDown:c=>{c.key==="Enter"?(c.preventDefault(),r()):c.key==="Escape"&&(c.preventDefault(),n())}})}function Ge({ctx:e}){let[t,r]=(0,g.useState)(V());(0,g.useEffect)(()=>te(r),[]);let n=(0,g.useMemo)(()=>D(t),[t]),a=ye(e),[c,i]=(0,g.useState)({notebooks:[],pages:[]}),[l,h]=(0,g.useState)(!0),[S,y]=(0,g.useState)(""),[w,C]=(0,g.useState)(null),[O,k]=(0,g.useState)(()=>new Set),[L,u]=(0,g.useState)(""),[R,B]=(0,g.useState)(null),[I,q]=(0,g.useState)(null),[F,Y]=(0,g.useState)(null),[T,U]=(0,g.useState)(null),[de,pe]=(0,g.useState)(!1),re=(0,g.useRef)(null),f=(0,g.useMemo)(()=>$t(c),[c]),P=(0,g.useMemo)(()=>{if(!w)return null;let o=(c.pages||[]).find(p=>p.id===w);return o?o.notebookId:null},[w,c]),M=(0,g.useCallback)(async()=>{y("");try{let o=await x.tree();return i({notebooks:o.notebooks||[],pages:o.pages||[]}),h(!1),o}catch(o){return h(!1),y(String(o&&o.message||o)),null}},[]);(0,g.useEffect)(()=>{M()},[M]);let Q=(0,g.useCallback)(async o=>{if(!o)return;let p=await M(),d=o.notebookId||null;if(!d&&o.workspacePath)try{let E=await x.findWorkspace(o.workspacePath);d=E?E.id:null}catch{d=null}if(!d)return;if(k(E=>new Set(E).add(d)),o.pageId){C(o.pageId);return}let K=(p&&p.pages||[]).filter(E=>E.notebookId===d);if(K.length>0){C(K[0].id);return}try{let E=await x.createPage({notebookId:d,title:n.untitled});await M(),C(E.id)}catch(E){y(String(E&&E.message||E))}},[M,n]);(0,g.useEffect)(()=>{let o=Ie();return o&&Q(o),Xe(d=>{Ie(),Q(d)})},[Q]),(0,g.useEffect)(()=>{let o=a?.path;if(!o){q(null);return}let p=!1;return x.findWorkspace(o).then(d=>{p||q(d)}).catch(()=>{p||q(null)}),()=>{p=!0}},[a?.path,c]),(0,g.useEffect)(()=>{let o=L.trim();if(!o){B(null);return}let p=!1,d=setTimeout(()=>{x.search(o,30).then(K=>{p||B(K)}).catch(()=>{p||B([])})},200);return()=>{p=!0,clearTimeout(d)}},[L]);let J=(0,g.useCallback)(async o=>{pe(!0);try{return await o()}finally{pe(!1)}},[]),$=(0,g.useCallback)(async()=>{if(!a?.path)return null;if(I)return I;let o=await x.bindWorkspace({workspacePath:a.path,workspaceLabel:a.title,title:a.title});return q(o.notebook),o.notebook},[a,I]),se=(0,g.useCallback)(async o=>{if(!o)return;k(d=>new Set(d).add(o.id));let p=(f.pagesOf.get(o.id)||[])[0];p?C(p.id):await ie(o.id)},[f]),ie=(0,g.useCallback)(async o=>{let p=o||P||I&&I.id;p&&await J(async()=>{try{let d=await x.createPage({notebookId:p,title:n.untitled});k(K=>new Set(K).add(p)),await M(),C(d.id)}catch(d){y(String(d&&d.message||d))}})},[P,I,M,n,J]),lt=(0,g.useCallback)(async(o=null)=>{await J(async()=>{try{let p=await x.createNotebook({parentId:o,title:n.notebook});await M(),o&&k(d=>new Set(d).add(o)),U({kind:"notebook",id:p.id,value:p.title})}catch(p){y(String(p&&p.message||p))}})},[M,n,J]),ct=(0,g.useCallback)(async()=>{await J(async()=>{try{let o=await $();await M(),await se(o)}catch(o){y(String(o&&o.message||o))}})},[$,M,se,J]),Me=(0,g.useCallback)(async()=>{let o=T;if(U(null),!o)return;let p=o.value.trim();if(p)try{if(o.kind==="notebook")await x.updateNotebook(o.id,{title:p});else{let d=await x.readPage(o.id);await x.savePage({id:d.id,title:p,rev:d.rev,baseMtimeMs:d.mtimeMs,baseSize:d.size})}await M()}catch(d){y(String(d&&d.message||d))}},[T,M]),dt=(0,g.useCallback)(async()=>{let o=F;if(Y(null),!!o)try{o.kind==="page"?(await x.deletePage(o.id),w===o.id&&C(null)):await x.deleteNotebook(o.id),await M()}catch(p){y(String(p&&p.message||p))}},[F,w,M]),Le=(0,g.useCallback)(o=>{k(p=>{let d=new Set(p);return d.has(o)?d.delete(o):d.add(o),d})},[]);(0,g.useEffect)(()=>{let o=p=>{let d=p.metaKey||p.ctrlKey;d&&p.key.toLowerCase()==="p"?(p.preventDefault(),re.current?.focus(),re.current?.select?.()):d&&p.shiftKey&&p.key.toLowerCase()==="n"?(p.preventDefault(),ie()):p.key==="Escape"&&document.activeElement===re.current&&u("")};return window.addEventListener("keydown",o),()=>window.removeEventListener("keydown",o)},[ie]);let pt=(o,p)=>(f.pagesOf.get(o)||[]).map(d=>{let K=T&&T.kind==="page"&&T.id===d.id;return(0,s.jsxs)("div",{className:`n-row${w===d.id?" is-active":""}`,style:{paddingLeft:`${8+p*12+16}px`},role:"treeitem","aria-selected":w===d.id?"true":"false",tabIndex:0,onClick:()=>C(d.id),onKeyDown:E=>{(E.key==="Enter"||E.key===" ")&&(E.preventDefault(),C(d.id))},children:[(0,s.jsx)(Ue,{}),K?(0,s.jsx)(Qe,{value:T.value,onChange:E=>U({...T,value:E}),onCommit:Me,onCancel:()=>U(null)}):(0,s.jsx)("span",{className:"n-row-title",children:d.title||n.untitled}),(0,s.jsxs)("span",{className:"n-row-actions",children:[(0,s.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.rename,"aria-label":n.rename,onClick:E=>{E.stopPropagation(),U({kind:"page",id:d.id,value:d.title||""})},children:(0,s.jsx)(ge,{})}),(0,s.jsx)("button",{type:"button",className:"n-btn is-icon is-danger",title:n.delete,"aria-label":n.delete,onClick:E=>{E.stopPropagation(),Y({kind:"page",id:d.id,title:d.title||n.untitled})},children:(0,s.jsx)(Ne,{})})]})]},d.id)}),Re=(o,p)=>{let d=O.has(o.id),K=f.children.get(o.id)||[],E=f.pagesOf.get(o.id)||[],$e=K.length>0||E.length>0,gt=T&&T.kind==="notebook"&&T.id===o.id,Oe=o.workspacePath&&a?.path&&o.workspacePath===a.path;return(0,s.jsxs)("div",{children:[(0,s.jsxs)("div",{className:"n-row is-notebook",style:{paddingLeft:`${8+p*12}px`},role:"treeitem","aria-expanded":d?"true":"false",tabIndex:0,onClick:()=>Le(o.id),onKeyDown:W=>{(W.key==="Enter"||W.key===" ")&&(W.preventDefault(),Le(o.id))},title:o.workspacePath||o.title,children:[(0,s.jsx)("span",{className:`n-twist${$e?"":" is-leaf"}`,"aria-hidden":"true",children:(0,s.jsx)(_e,{open:d})}),(0,s.jsx)(ee,{}),gt?(0,s.jsx)(Qe,{value:T.value,onChange:W=>U({...T,value:W}),onCommit:Me,onCancel:()=>U(null)}):(0,s.jsx)("span",{className:"n-row-title",children:o.title}),Oe&&(0,s.jsx)("span",{className:"n-row-badge",children:n.currentWorkspace}),o.workspacePath&&!Oe&&(0,s.jsx)("span",{className:"n-row-badge",children:n.orphan}),(0,s.jsxs)("span",{className:"n-row-actions",children:[(0,s.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.newPage,"aria-label":n.newPage,onClick:W=>{W.stopPropagation(),ie(o.id)},children:(0,s.jsx)(xe,{})}),(0,s.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.newChild,"aria-label":n.newChild,onClick:W=>{W.stopPropagation(),lt(o.id)},children:(0,s.jsx)(ee,{size:12})}),(0,s.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.rename,"aria-label":n.rename,onClick:W=>{W.stopPropagation(),U({kind:"notebook",id:o.id,value:o.title})},children:(0,s.jsx)(ge,{})}),(0,s.jsx)("button",{type:"button",className:"n-btn is-icon is-danger",title:n.delete,"aria-label":n.delete,onClick:W=>{W.stopPropagation(),Y({kind:"notebook",id:o.id,title:o.title})},children:(0,s.jsx)(Ne,{})})]})]}),d&&(0,s.jsxs)("div",{role:"group",children:[K.map(W=>Re(W,p+1)),pt(o.id,p),!$e&&(0,s.jsx)("div",{className:"n-row",style:{paddingLeft:`${8+(p+1)*12+16}px`,color:"var(--dsw-alias-label-tertiary)"},children:(0,s.jsx)("span",{className:"n-row-title",children:n.noPage})})]})]},o.id)},ut=a?a.title:n.noWorkspace,ft=!!a?.path;return(0,s.jsxs)("div",{className:"n-app",children:[(0,s.jsxs)("aside",{className:"n-side",children:[(0,s.jsxs)("div",{className:"n-wsbar",children:[(0,s.jsx)("span",{className:"n-wsbar-label",children:n.currentWorkspace}),(0,s.jsxs)("span",{className:"n-wsbar-name",title:a?.path||"",children:[(0,s.jsx)(ee,{}),(0,s.jsx)("b",{children:ut})]}),(0,s.jsxs)("span",{className:"n-wsbar-actions",children:[(0,s.jsxs)("button",{type:"button",className:"n-btn",disabled:!ft||de,onClick:()=>I?se(I):ct(),children:[(0,s.jsx)(xe,{}),I?n.openNotebook:n.createNotebook]}),(0,s.jsx)("button",{type:"button",className:"n-btn",disabled:de,title:n.newPage,"aria-label":n.newPage,onClick:()=>ie(),children:(0,s.jsx)(ge,{})})]})]}),(0,s.jsxs)("div",{className:"n-search",children:[(0,s.jsx)(Fe,{}),(0,s.jsx)("input",{ref:re,type:"search",value:L,placeholder:n.searchPlaceholder,"aria-label":n.search,onChange:o=>u(o.target.value)}),L&&(0,s.jsx)("button",{type:"button",className:"n-btn is-icon","aria-label":n.delete,onClick:()=>u(""),children:(0,s.jsx)(le,{size:12})})]}),S&&(0,s.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,s.jsx)("span",{className:"n-banner-text",children:S}),(0,s.jsx)("button",{type:"button",className:"n-btn",onClick:M,children:n.retry})]}),F&&(0,s.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,s.jsx)("span",{className:"n-banner-text",children:F.kind==="notebook"?n.deleteNotebookConfirm(F.title):n.deletePageConfirm(F.title)}),(0,s.jsx)("button",{type:"button",className:"n-btn is-danger",onClick:dt,children:n.delete}),(0,s.jsx)("button",{type:"button",className:"n-btn",onClick:()=>Y(null),children:(0,s.jsx)(le,{size:12})})]}),(0,s.jsxs)("div",{className:"n-tree",role:"tree","aria-label":n.title,children:[l&&(0,s.jsx)("div",{className:"n-tree-empty",children:n.loading}),!l&&R&&(0,s.jsxs)(s.Fragment,{children:[R.length===0&&(0,s.jsx)("div",{className:"n-tree-empty",children:n.noResults}),R.map(o=>(0,s.jsxs)("div",{className:"n-hit",role:"button",tabIndex:0,onClick:()=>{C(o.id),u("")},onKeyDown:p=>{p.key==="Enter"&&(C(o.id),u(""))},children:[(0,s.jsx)("div",{className:"n-hit-title",children:o.title||n.untitled}),o.snippet&&(0,s.jsx)("div",{className:"n-hit-snippet",children:o.snippet})]},o.id))]}),!l&&!R&&f.notebookCount===0&&(0,s.jsxs)("div",{className:"n-tree-empty",children:[(0,s.jsx)("b",{children:n.empty}),(0,s.jsx)("div",{children:n.emptyHint})]}),!l&&!R&&f.root.map(o=>Re(o,0))]})]}),(0,s.jsx)(Ze,{pageId:w,t:n,onChanged:()=>{M()},onGone:()=>{C(null),M()}})]})}var et=require("react"),tt=require("react/jsx-runtime"),we=class extends et.Component{constructor(t){super(t),this.state={error:null}}static getDerivedStateFromError(t){return{error:t}}componentDidCatch(t,r){console.error("[dsh-notes] app crashed:",t&&t.message,`
    `,r&&r.componentStack)}render(){return this.state.error?(0,tt.jsxs)("div",{className:"n-empty",children:["笔记本渲染失败：",String(this.state.error&&this.state.error.message||this.state.error)]}):this.props.children}};var j=require("react");function Pe(e,t){if(!e||typeof e.get!="function")return null;try{let r=e.get("sessions"),n=r&&r.list&&r.list.getSnapshot(),a=n&&n.byId&&n.byId[t],c=a&&a.cwd;return typeof c=="string"&&c?c:null}catch{return null}}function Ot(e,t){try{let n=e&&typeof e.get=="function"?e.get("workspaces"):null,a=n&&n.list&&n.list.getSnapshot(),i=(a&&a.items||[]).find(l=>l.path===t);if(i&&(i.title||i.displayTitle))return i.title||i.displayTitle}catch{}let r=String(t||"").split(/[\\/]/).filter(Boolean);return r.length?r[r.length-1]:String(t||"")}async function ve(e,t){let r=await x.findWorkspace(t);if(r)return{notebook:r,created:!1};let n=Ot(e,t);return{notebook:await x.createNotebook({title:n,workspacePath:t,workspaceLabel:n}),created:!0}}function ke(e){try{let t=e&&typeof e.get=="function"?e.get("layout"):null;if(t&&typeof t.selectPanel=="function"){t.selectPanel("notes");return}console.warn("[dsh-notes] layout 服务不可用，无法切主面板")}catch(t){console.warn("[dsh-notes] selectPanel(notes) 失败：",t&&t.message||t)}}var N=require("react/jsx-runtime");function nt({ctx:e}){let[t,r]=(0,j.useState)(V());(0,j.useEffect)(()=>te(r),[]);let n=(0,j.useMemo)(()=>D(t),[t]),a=ye(e),[c,i]=(0,j.useState)(null),[l,h]=(0,j.useState)(""),[S,y]=(0,j.useState)(!1),w=(0,j.useCallback)(async()=>{y(!0),h("");try{let u=await x.tree();i({notebooks:u.notebooks||[],pages:u.pages||[]})}catch(u){h(String(u&&u.message||u))}finally{y(!1)}},[]);(0,j.useEffect)(()=>{w()},[w]);let C=(0,j.useMemo)(()=>{let u=c&&c.notebooks||[],R=c&&c.pages||[],B=new Map;for(let I of R)B.set(I.notebookId,(B.get(I.notebookId)||0)+1);return u.filter(I=>I.parentId===null||I.parentId===void 0).sort((I,q)=>(I.order||0)-(q.order||0)).map(I=>({...I,pageCount:B.get(I.id)||0}))},[c]),O=u=>{ne({notebookId:u}),ke(e)},k=(0,j.useMemo)(()=>!a||!C.length?null:C.find(u=>u.workspacePath&&u.workspacePath===a.path)||null,[C,a]),L=async()=>{if(!(!a||S)){y(!0),h("");try{if(k)O(k.id);else{let{notebook:u}=await ve(e,a.path);await w(),O(u.id)}}catch(u){h(String(u&&u.message||u))}finally{y(!1)}}};return(0,N.jsxs)("div",{className:"n-right",children:[(0,N.jsxs)("div",{className:"n-right-head",children:[(0,N.jsx)("span",{className:"n-right-title",children:n.label}),(0,N.jsx)("button",{type:"button",className:"n-right-refresh",onClick:w,disabled:S,"aria-label":n.retry,title:n.retry,children:"⟳"})]}),(0,N.jsx)("div",{className:"n-right-ws",children:a?(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)("span",{className:"n-right-ws-name",title:a.path,children:a.title}),(0,N.jsx)("button",{type:"button",className:"n-right-action n-right-ws-btn",onClick:L,disabled:S,children:k?n.openNotebook:n.createNotebook})]}):(0,N.jsx)("span",{className:"n-right-ws-name",children:n.noWorkspace})}),l?(0,N.jsxs)("div",{className:"n-right-empty",children:[(0,N.jsx)("div",{children:n.unavailable}),(0,N.jsx)("div",{className:"n-right-hint",children:l}),(0,N.jsx)("button",{type:"button",className:"n-right-action",onClick:w,children:n.retry})]}):c?C.length===0?(0,N.jsxs)("div",{className:"n-right-empty",children:[(0,N.jsx)("div",{children:n.empty}),(0,N.jsx)("div",{className:"n-right-hint",children:n.rightEmptyHint})]}):(0,N.jsx)("div",{className:"n-right-list",role:"list",children:C.map(u=>(0,N.jsxs)("button",{type:"button",role:"listitem",className:"n-right-row",onClick:()=>O(u.id),title:u.workspacePath||u.title,children:[(0,N.jsxs)("span",{className:"n-right-row-main",children:[(0,N.jsx)("span",{className:"n-right-row-title",children:u.title}),(0,N.jsxs)("span",{className:"n-right-row-meta",children:[u.pageCount," ",n.page,u.workspacePath?"":` · ${n.orphan}`]})]}),(0,N.jsx)("span",{className:"n-right-arrow","aria-hidden":"true",children:"→"})]},u.id))}):(0,N.jsx)("div",{className:"n-right-empty",children:n.loading})]})}var _=require("react");var Ee=require("react/jsx-runtime");function rt({ctx:e,sessionId:t}){let[r,n]=(0,_.useState)(V()),[a,c]=(0,_.useState)(()=>Pe(e,t)),[i,l]=(0,_.useState)(null),[h,S]=(0,_.useState)(!1),y=(0,_.useRef)(!0);(0,_.useEffect)(()=>te(n),[]),(0,_.useEffect)(()=>{if(y.current=!0,!!a)return x.findWorkspace(a).then(O=>{y.current&&l(O!=null)}).catch(()=>{y.current&&l(null)}),()=>{y.current=!1}},[a]),(0,_.useEffect)(()=>{if(a)return;let O=setTimeout(()=>c(Pe(e,t)),300);return()=>clearTimeout(O)},[e,t,a]);let w=i?D(r).openNotebook:D(r).createNotebook;return(0,Ee.jsx)("button",{type:"button",className:"n-rowaction","aria-label":w,title:w,disabled:h||!a,onClick:async O=>{if(O.stopPropagation(),!(h||!a)){S(!0);try{let{notebook:k}=await ve(e,a);l(!0),ne({notebookId:k.id}),ke(e)}catch(k){console.warn("[dsh-notes] 建/开笔记本失败：",k&&k.message)}finally{S(!1)}}},children:(0,Ee.jsx)(ee,{size:14})})}var X=require("react");var ce=require("react/jsx-runtime");function Te(e,t){if(!e||typeof e.get!="function")return null;try{let r=e.get("sessions"),n=r&&r.list&&r.list.getSnapshot(),a=n&&n.byId&&n.byId[t],c=a&&a.cwd;return typeof c=="string"&&c?c:null}catch{return null}}function ot(e,t){try{let n=e&&typeof e.get=="function"?e.get("workspaces"):null,a=n&&n.list&&n.list.getSnapshot(),i=(a&&a.items||[]).find(l=>l.path===t);if(i&&(i.title||i.displayTitle))return i.title||i.displayTitle}catch{}let r=String(t||"").split(/[\\/]/).filter(Boolean);return r.length?r[r.length-1]:String(t||"")}function at(e){let{ctx:t,sessionId:r}=e||{},[n,a]=(0,X.useState)(V()),[c,i]=(0,X.useState)(null),[l,h]=(0,X.useState)(()=>Te(t,r)),[S,y]=(0,X.useState)(!1);(0,X.useEffect)(()=>te(a),[]),(0,X.useEffect)(()=>{if(l)return;let k=null;try{let u=t&&typeof t.get=="function"?t.get("sessions"):null,R=u&&u.list;R&&typeof R.subscribe=="function"&&(k=R.subscribe(()=>{let B=Te(t,r);B&&h(B)}))}catch{}let L=setTimeout(()=>h(Te(t,r)),200);return()=>{clearTimeout(L),typeof k=="function"&&k()}},[t,r,l]),(0,X.useEffect)(()=>{if(!l){i(null);return}let k=!1;return x.findWorkspace(l).then(L=>{k||i(L)}).catch(()=>{k||i(null)}),()=>{k=!0}},[l]);let w=D(n),C=!l||S,O=c?w.openNotebook:w.createNotebook;return(0,ce.jsxs)("button",{type:"button",className:"n-menu-item",role:"menuitem",disabled:C,title:l||w.noWorkspace,onClick:async k=>{if(k.preventDefault(),k.stopPropagation(),!(!l||S)){y(!0);try{if(c)ne({workspacePath:l,notebookId:c.id});else{let L=await x.bindWorkspace({workspacePath:l,workspaceLabel:ot(t,l),title:ot(t,l)});i(L.notebook),ne({workspacePath:l,notebookId:L.notebook.id})}try{t.layout.selectPanel("notes")}catch{}}catch(L){console.warn("[dsh-notes] 会话菜单建笔记本失败:",L)}finally{y(!1)}}},children:[(0,ce.jsx)(ee,{size:14}),(0,ce.jsx)("span",{children:O})]})}var At=`
    .n-app {
      display: flex;
      height: 100%;
      min-height: 0;
      background: var(--dsw-alias-bg-base);
      color: var(--dsw-alias-label-primary);
      font-family: var(--dsw-font-family, system-ui, -apple-system, "Segoe UI", sans-serif);
      font-size: 13px;
    }

    /* ---------- 左侧：工作区条 + 搜索 + 树 ---------- */
    .n-side {
      display: flex;
      flex-direction: column;
      width: 268px;
      min-width: 200px;
      max-width: 40%;
      border-right: 1px solid var(--dsw-alias-border-l2);
      background: var(--dsw-alias-bg-layer-1);
      min-height: 0;
    }

    .n-wsbar {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 10px 10px 8px;
      border-bottom: 1px solid var(--dsw-alias-border-l2);
    }
    .n-wsbar-label {
      font-size: 11px;
      color: var(--dsw-alias-label-tertiary);
      letter-spacing: .02em;
    }
    .n-wsbar-name {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }
    .n-wsbar-name b {
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .n-wsbar-actions { display: flex; gap: 6px; }

    .n-search {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 8px 10px;
      padding: 0 8px;
      height: 28px;
      border: 1px solid var(--dsw-alias-border-l2);
      border-radius: var(--dsw-radius-md, 8px);
      background: var(--dsw-alias-bg-base);
      color: var(--dsw-alias-label-tertiary);
    }
    .n-search:focus-within { border-color: var(--dsw-alias-brand-primary); }
    .n-search input {
      flex: 1;
      min-width: 0;
      border: 0;
      outline: 0;
      background: transparent;
      color: var(--dsw-alias-label-primary);
      font: inherit;
    }

    .n-tree {
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding: 2px 6px 12px;
    }
    .n-tree-empty {
      padding: 24px 14px;
      color: var(--dsw-alias-label-tertiary);
      line-height: 1.7;
    }
    .n-tree-empty b { color: var(--dsw-alias-label-secondary); font-weight: 600; }

    .n-row {
      display: flex;
      align-items: center;
      gap: 4px;
      height: 28px;
      padding: 0 4px;
      border-radius: var(--dsw-radius-sm, 6px);
      cursor: pointer;
      user-select: none;
      color: var(--dsw-alias-label-secondary);
      min-width: 0;
    }
    .n-row:hover { background: var(--dsw-alias-interactive-bg-hover); }
    .n-row.is-active {
      background: var(--dsw-alias-interactive-bg-active);
      color: var(--dsw-alias-label-primary);
    }
    .n-row.is-notebook { color: var(--dsw-alias-label-primary); font-weight: 550; }
    .n-row-title {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .n-row-badge {
      font-size: 10px;
      padding: 1px 5px;
      border-radius: 999px;
      background: var(--dsw-alias-bg-layer-3);
      color: var(--dsw-alias-label-tertiary);
      font-weight: 500;
    }
    .n-row-actions {
      display: none;
      align-items: center;
      gap: 2px;
    }
    .n-row:hover .n-row-actions,
    .n-row:focus-within .n-row-actions { display: flex; }
    .n-twist {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      color: var(--dsw-alias-label-tertiary);
      flex: none;
    }
    .n-twist.is-leaf { visibility: hidden; }
    .n-indent { flex: none; width: 12px; }

    .n-hit {
      display: block;
      padding: 6px 8px;
      border-radius: var(--dsw-radius-sm, 6px);
      cursor: pointer;
      min-width: 0;
    }
    .n-hit:hover { background: var(--dsw-alias-interactive-bg-hover); }
    .n-hit-title {
      font-weight: 550;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .n-hit-snippet {
      color: var(--dsw-alias-label-tertiary);
      font-size: 12px;
      margin-top: 2px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    /* ---------- 右侧：编辑器 ---------- */
    .n-main {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    .n-topbar {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 12px;
      border-bottom: 1px solid var(--dsw-alias-border-l2);
      flex: none;
    }
    .n-title-input {
      flex: 1;
      min-width: 0;
      border: 0;
      outline: 0;
      background: transparent;
      color: var(--dsw-alias-label-primary);
      font: inherit;
      font-size: 14px;
      font-weight: 600;
    }
    .n-save-state {
      font-size: 11px;
      color: var(--dsw-alias-label-tertiary);
      white-space: nowrap;
    }
    .n-save-state.is-error { color: var(--dsw-alias-label-error); }

    .n-toolbar {
      display: flex;
      align-items: center;
      gap: 2px;
      padding: 4px 8px;
      border-bottom: 1px solid var(--dsw-alias-border-l2);
      flex: none;
      flex-wrap: wrap;
    }
    .n-toolbar-sep {
      width: 1px;
      height: 16px;
      background: var(--dsw-alias-border-l2);
      margin: 0 4px;
    }

    .n-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      height: 24px;
      padding: 0 8px;
      border: 1px solid transparent;
      border-radius: var(--dsw-radius-sm, 6px);
      background: transparent;
      color: var(--dsw-alias-label-secondary);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
    }
    .n-btn:hover:not(:disabled) {
      background: var(--dsw-alias-interactive-bg-hover);
      color: var(--dsw-alias-label-primary);
    }
    .n-btn:disabled { opacity: .45; cursor: default; }
    .n-btn.is-icon { width: 26px; padding: 0; }
    .n-btn.is-on {
      background: var(--dsw-alias-interactive-bg-active);
      color: var(--dsw-alias-label-primary);
    }
    .n-btn.is-primary {
      background: var(--dsw-alias-button-primary-fill);
      color: var(--dsw-alias-label-primary-foreground);
      border-color: transparent;
    }
    .n-btn.is-primary:hover:not(:disabled) { background: var(--dsw-alias-button-primary-hover); }
    .n-btn.is-danger:hover:not(:disabled) {
      background: var(--dsw-alias-interactive-bg-hover-danger);
      color: var(--dsw-alias-label-error);
    }
    /* 会话 "…" 菜单里的行（宿主菜单里插入的一行） */
    .n-menu-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      height: 28px;
      padding: 0 10px;
      border: 0;
      border-radius: var(--dsw-radius-sm, 6px);
      background: transparent;
      color: var(--dsw-alias-label-primary);
      font: inherit;
      font-size: 13px;
      text-align: left;
      cursor: pointer;
      white-space: nowrap;
    }
    .n-menu-item:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
    .n-menu-item:disabled { opacity: .45; cursor: default; }
    .n-menu-item:focus-visible {
      outline: var(--dsw-focus-ring-width, 2px) solid var(--dsw-focus-ring-color, var(--dsw-alias-brand-primary));
      outline-offset: -1px;
    }

    .n-btn:focus-visible, .n-row:focus-visible, .n-hit:focus-visible {
      outline: var(--dsw-focus-ring-width, 2px) solid var(--dsw-focus-ring-color, var(--dsw-alias-brand-primary));
      outline-offset: 1px;
    }

    .n-editor-scroll {
      flex: 1;
      min-height: 0;
      overflow: auto;
    }
    .n-editor {
      max-width: 760px;
      margin: 0 auto;
      padding: 20px 24px 120px;
    }
    .n-empty {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--dsw-alias-label-tertiary);
      padding: 40px;
      text-align: center;
      line-height: 1.7;
    }
    .n-banner {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 10px 12px 0;
      padding: 8px 10px;
      border: 1px solid var(--dsw-alias-state-warn-primary);
      border-radius: var(--dsw-radius-md, 8px);
      background: var(--dsw-alias-state-warn-tertiary);
      color: var(--dsw-alias-state-warn-label);
      font-size: 12px;
    }
    .n-banner-text { flex: 1; min-width: 0; }

    /* ---------- 编辑器骨架屏 ---------- */
    .n-editor-skeleton {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 8px 0;
    }
    .n-skel-line {
      height: 12px;
      border-radius: 6px;
      background: var(--dsw-alias-bg-layer-3);
      animation: n-skel-pulse 1.4s ease-in-out infinite;
    }
    .n-skel-hint {
      margin-top: 6px;
      font-size: 12px;
      color: var(--dsw-alias-label-tertiary);
    }
    @keyframes n-skel-pulse {
      0%, 100% { opacity: .55; }
      50% { opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
      .n-skel-line { animation: none; }
    }

    /* ---------- BlockNote 外壳 ---------- */
    .n-blocknote {
      min-height: 320px;
    }
    .n-blocknote .bn-container {
      background: transparent;
    }
    .n-blocknote .bn-editor {
      min-height: 320px;
    }

    /* ---------- 笔记本浮层（shell.overlay） ---------- */
    .n-overlay {
      position: fixed;
      top: 56px;
      right: 16px;
      bottom: 16px;
      width: min(960px, 92vw);
      z-index: 2147482500;
      background: var(--dsw-alias-bg-base);
      color: var(--dsw-alias-label-primary);
      border: 1px solid var(--dsw-alias-border-l3);
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .n-overlay-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-bottom: 1px solid var(--dsw-alias-border-l2);
      background: var(--dsw-alias-bg-layer-1);
    }
    .n-overlay-title {
      flex: 1;
      font-weight: 600;
      font-size: 13px;
    }
    .n-overlay-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border: 0;
      border-radius: 6px;
      background: transparent;
      color: var(--dsw-alias-label-secondary);
      cursor: pointer;
    }
    .n-overlay-close:hover {
      background: var(--dsw-alias-interactive-bg-hover);
      color: var(--dsw-alias-label-primary);
    }
    .n-overlay-body {
      flex: 1;
      min-height: 0;
      display: flex;
    }
    .n-overlay-body > * {
      flex: 1;
      min-width: 0;
    }

    /* ---------- 左侧会话行：笔记本按钮 ---------- */
    .n-rowaction {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border: 0;
      border-radius: 4px;
      background: transparent;
      color: var(--dsw-alias-label-tertiary);
      cursor: pointer;
      padding: 0;
    }
    .n-rowaction:hover {
      color: var(--dsw-alias-label-primary);
      background: var(--dsw-alias-interactive-bg-hover);
    }
    .n-rowaction:disabled {
      opacity: 0.4;
      cursor: default;
    }

    /* ---------- 右侧栏：全部笔记本 ---------- */
    .n-right {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      color: var(--dsw-alias-label-primary);
      font-size: 13px;
    }
    .n-right-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-bottom: 1px solid var(--dsw-alias-border-l2);
    }
    .n-right-title {
      flex: 1;
      font-weight: 600;
      font-size: 12px;
      color: var(--dsw-alias-label-secondary);
    }
    .n-right-refresh {
      border: 0;
      background: transparent;
      color: var(--dsw-alias-label-secondary);
      cursor: pointer;
      font-size: 14px;
      padding: 2px 4px;
      border-radius: 4px;
    }
    .n-right-refresh:hover {
      background: var(--dsw-alias-interactive-bg-hover);
      color: var(--dsw-alias-label-primary);
    }
    .n-right-ws {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-bottom: 1px solid var(--dsw-alias-border-l2);
    }
    .n-right-ws-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
      color: var(--dsw-alias-label-secondary);
    }
    .n-right-ws-btn {
      margin-top: 0;
      flex: none;
      padding: 3px 8px;
      font-size: 12px;
    }
    .n-right-list {
      overflow: auto;
      padding: 6px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .n-right-row {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      text-align: left;
      border: 0;
      background: transparent;
      color: inherit;
      padding: 7px 8px;
      border-radius: 6px;
      cursor: pointer;
      font: inherit;
    }
    .n-right-row:hover {
      background: var(--dsw-alias-interactive-bg-hover);
    }
    .n-right-row-main {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
      gap: 1px;
    }
    .n-right-row-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .n-right-row-meta {
      font-size: 11px;
      color: var(--dsw-alias-label-tertiary);
    }
    .n-right-arrow {
      color: var(--dsw-alias-label-tertiary);
      flex: none;
    }
    .n-right-empty {
      padding: 24px 16px;
      text-align: center;
      color: var(--dsw-alias-label-secondary);
    }
    .n-right-hint {
      margin-top: 6px;
      font-size: 12px;
      color: var(--dsw-alias-label-tertiary);
      line-height: 1.5;
    }
    .n-right-action {
      margin-top: 10px;
      border: 1px solid var(--dsw-alias-border-l3);
      background: var(--dsw-alias-bg-layer-1);
      color: inherit;
      border-radius: 6px;
      padding: 5px 10px;
      cursor: pointer;
      font: inherit;
    }
    `,st=!1;function it(){if(st||typeof document>"u")return;st=!0;let e="dsh-notes-styles";if(document.getElementById(e))return;let t=document.createElement("style");t.id=e,t.textContent=At,document.head.append(t)}var ae=require("react/jsx-runtime"),jt=["slots"];function Ht(e){it(),je({react:Wt,"react/jsx-runtime":zt,"react-dom":Bt,"react-dom/client":Dt}),e.slots.inject("sidebar.panellist",()=>e.slots.register({name:"sidebar.panellist",id:"notes",order:40,label:()=>D().panelLabel},Ke)),e.slots.inject("main",()=>e.slots.register({name:"main",key:"notes"},()=>(0,ae.jsx)(we,{children:(0,ae.jsx)(Ge,{ctx:e})}))),e.slots.inject("sidebar.workspaces.session.menu.item",()=>e.slots.register({name:"sidebar.workspaces.session.menu.item",id:"notes",order:300},t=>(0,ae.jsx)(at,{ctx:e,sessionId:t&&t.sessionId}))),e.slots.inject("sidebar.workspaces.session.row.action",()=>e.slots.register({name:"sidebar.workspaces.session.row.action",id:"notes",order:100},t=>(0,ae.jsx)(rt,{ctx:e,sessionId:t&&t.sessionId}))),e.inject(["slots","sidebarRightTabs"],t=>{let r=t.sidebarRightTabs,n=t.slots;r&&typeof r.register=="function"&&e.effect(()=>r.register({id:"dsh-notes",kind:"notes",title:()=>D().rightTab,guide:[{id:"all",order:20,title:()=>D().label,description:()=>D().rightTabDesc}]}),"dsh-notes: right tab type"),n&&typeof n.inject=="function"&&e.effect(()=>n.inject("sidebar.right.pane.tab",()=>n.register({name:"sidebar.right.pane.tab",key:"dsh-notes"},a=>(0,ae.jsx)(nt,{ctx:e,...a}))),"dsh-notes: right tab body")})}

    return module.exports
  }
})
