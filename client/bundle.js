/* 由 tools/build.mjs 从 src/client/index.js 生成 —— 请勿手改。
 * 重新生成：npm run build
 */
window.__ModuleLoader__.load({
  id: "@tom2012/dsh-notes",
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
    var Pt=Object.create;var be=Object.defineProperty;var It=Object.getOwnPropertyDescriptor;var Et=Object.getOwnPropertyNames;var Tt=Object.getPrototypeOf,Mt=Object.prototype.hasOwnProperty;var Lt=(e,t)=>{for(var a in t)be(e,a,{get:t[a],enumerable:!0})},je=(e,t,a,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Et(t))!Mt.call(e,o)&&o!==a&&be(e,o,{get:()=>t[o],enumerable:!(n=It(t,o))||n.enumerable});return e};var ge=(e,t,a)=>(a=e!=null?Pt(Tt(e)):{},je(t||!e||!e.__esModule?be(a,"default",{value:e,enumerable:!0}):a,e)),Ot=e=>je(be({},"__esModule",{value:!0}),e);var Qt={};Lt(Qt,{apply:()=>Yt,inject:()=>Xt,suppressAutoCreate:()=>de});module.exports=Ot(Qt);var Vt=ge(require("react")),qt=ge(require("react/jsx-runtime")),Jt=ge(require("react-dom")),Zt=ge(require("react-dom/client"));var f=require("react");var z="/-/notes";function Rt(e){return e===404?"接口不存在（宿主插件可能未加载）":e===403?"没有权限（宿主鉴权拒绝了请求）":e===409?"内容已在别处修改":e===413?"内容过大":e===503?"宿主服务不可用，请重启 dsh web":e>=500?"宿主内部错误":`HTTP ${e}`}async function j(e){let t=null;try{t=await e.json()}catch{t=null}if(!e.ok||t&&t.ok===!1){let a=new Error(t&&t.error||Rt(e.status));throw a.status=e.status,t&&t.current!==void 0&&(a.current=t.current),a}return t||{}}function Q(e){let t=[];for(let[a,n]of Object.entries(e||{}))n==null||n===""||t.push(`${encodeURIComponent(a)}=${encodeURIComponent(String(n))}`);return t.length?`?${t.join("&")}`:""}var y={base:z,async status(){return j(await fetch(`${z}/status`,{credentials:"same-origin"}))},async tree(){return j(await fetch(`${z}/tree`,{credentials:"same-origin"}))},async readPage(e){return(await j(await fetch(`${z}/page${Q({id:e})}`,{credentials:"same-origin"}))).page},async savePage({id:e,title:t,blocks:a,rev:n,baseMtimeMs:o,baseSize:s}){let i={title:t,rev:n,baseMtimeMs:o,baseSize:s};return Array.isArray(a)&&(i.blocks=a),j(await fetch(`${z}/page${Q({id:e})}`,{method:"PUT",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}))},async createPage({notebookId:e,title:t,blocks:a,markdown:n}){let o={notebookId:e,title:t};return Array.isArray(a)&&(o.blocks=a),typeof n=="string"&&(o.markdown=n),(await j(await fetch(`${z}/page`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}))).page},async deletePage(e){return j(await fetch(`${z}/page${Q({id:e})}`,{method:"DELETE",credentials:"same-origin"}))},async createNotebook({parentId:e=null,title:t,workspacePath:a=null,workspaceLabel:n=null}){return(await j(await fetch(`${z}/notebook`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({parentId:e,title:t,workspacePath:a,workspaceLabel:n})}))).notebook},async updateNotebook(e,t){return(await j(await fetch(`${z}/notebook${Q({id:e})}`,{method:"PATCH",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(t||{})}))).notebook},async deleteNotebook(e){return j(await fetch(`${z}/notebook${Q({id:e})}`,{method:"DELETE",credentials:"same-origin"}))},async findWorkspace(e){return(await j(await fetch(`${z}/workspace${Q({path:e})}`,{credentials:"same-origin"}))).notebook},async bindWorkspace({workspacePath:e,title:t,workspaceLabel:a}){return j(await fetch(`${z}/workspace`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({workspacePath:e,title:t,workspaceLabel:a})}))},async search(e,t=30){return(await j(await fetch(`${z}/search${Q({q:e,limit:t})}`,{credentials:"same-origin"}))).results||[]},async uploadAsset(e){let t=(e.name.split(".").pop()||"").toLowerCase(),a=await fetch(`${z}/asset`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":e.type||"application/octet-stream","x-notes-ext":t},body:e});return j(a)},exportUrl(e){return`${z}/export${Q({id:e})}`}};var x=require("react");var He="/-/notes/client",Ve={},oe=null;function qe(e){Object.assign(Ve,e||{})}function Ke(){return e=>{let t=Ve[e];if(t!==void 0)return t;throw new Error(`dsh-notes: 编辑器模块请求了未注册的依赖 ${e}`)}}function Je(){return oe||(oe=new Promise((e,t)=>{if(typeof document>"u"){t(new Error("dsh-notes: 没有 document，无法加载编辑器"));return}let a="dsh-notes-editor-css";if(!document.getElementById(a)){let i=document.createElement("link");i.id=a,i.rel="stylesheet",i.href=`${He}/editor.css`,document.head.append(i)}let n="__DSH_NOTES_EDITOR_FACTORY__",o=window[n];if(typeof o=="function"){try{e(o(Ke()))}catch(i){t(Fe(i))}return}let s=document.createElement("script");s.src=`${He}/editor.js`,s.async=!0,s.onload=()=>{let i=window[n];if(typeof i!="function"){t(new Error("dsh-notes: 编辑器模块加载后没有注册工厂"));return}try{e(i(Ke()))}catch(l){t(Fe(l))}},s.onerror=()=>t(new Error("dsh-notes: 编辑器模块下载失败（/-/notes/client/editor.js）")),document.head.append(s)}),oe.catch(()=>{oe=null}),oe)}function Fe(e){return e instanceof Error?e:new Error(String(e))}var g=require("react/jsx-runtime"),A={fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"};function J(e,t){return(0,g.jsx)("svg",{viewBox:"0 0 24 24",width:e,height:e,"aria-hidden":"true",focusable:"false",fill:"none",children:t})}function G({size:e=16}){return J(e,(0,g.jsx)(g.Fragment,{children:(0,g.jsx)("path",{d:"M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-6-3.5-6 3.5V5A1.5 1.5 0 0 1 6 3.5Z",...A})}))}function Ze({size:e=16}){return J(e,(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("path",{d:"M7 3.5h7.2L18.5 7.8V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z",...A}),(0,g.jsx)("path",{d:"M13.8 3.8V8h4.2",...A})]}))}function Xe(){return(0,g.jsxs)("svg",{viewBox:"0 0 24 24",width:"20",height:"20","aria-hidden":"true",focusable:"false",fill:"none",children:[(0,g.jsx)("path",{d:"M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-6-3.5-6 3.5V5A1.5 1.5 0 0 1 6 3.5Z",...A}),(0,g.jsx)("path",{d:"M9.5 9h5M9.5 12.5h3",...A})]})}function Te({size:e=14}){return J(e,(0,g.jsx)("path",{d:"M12 5.5v13M5.5 12h13",...A}))}function Ye({size:e=12,open:t=!1}){return(0,g.jsx)("svg",{viewBox:"0 0 24 24",width:e,height:e,"aria-hidden":"true",focusable:"false",fill:"none",style:{transform:t?"rotate(90deg)":"none",transition:"transform 120ms ease"},children:(0,g.jsx)("path",{d:"M9 5.5 15.5 12 9 18.5",...A})})}function Qe({size:e=14}){return J(e,(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("circle",{cx:"11",cy:"11",r:"5.75",...A}),(0,g.jsx)("path",{d:"M15.4 15.4 19 19",...A})]}))}function Me({size:e=14}){return J(e,(0,g.jsx)(g.Fragment,{children:(0,g.jsx)("path",{d:"M4.5 7h15M10 4.5h4M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12",...A})}))}function ye({size:e=14}){return J(e,(0,g.jsx)(g.Fragment,{children:(0,g.jsx)("path",{d:"M4.5 19.5h4L19 9a2 2 0 0 0 0-2.8l-1.2-1.2A2 2 0 0 0 15 5L4.5 15.5v4Z",...A})}))}function ce({size:e=14}){return J(e,(0,g.jsx)("path",{d:"M6 6l12 12M18 6 6 18",...A}))}function Ge({size:e=14}){return J(e,(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("path",{d:"M12 3.5v11M8 10.5 12 14.5 16 10.5",...A}),(0,g.jsx)("path",{d:"M5 17v2a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-2",...A})]}))}function et({size:e=14}){return J(e,(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("path",{d:"M6 3.5h9.2L19 7.3V18a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 18V6a2.5 2.5 0 0 1 1-2Z",...A}),(0,g.jsx)("path",{d:"M8.5 3.5v5h6M8.5 20.5v-6h7v6",...A})]}))}var we=require("react");function Le(){return typeof document>"u"||!document.body?"light":document.body.hasAttribute("data-ds-dark-theme")?"dark":"light"}function tt(){let[e,t]=(0,we.useState)(Le);return(0,we.useEffect)(()=>{if(typeof MutationObserver!="function"||typeof document>"u"||!document.body)return;let a=new MutationObserver(()=>t(Le()));return a.observe(document.body,{attributes:!0,attributeFilter:["data-ds-dark-theme","class"]}),t(Le()),()=>a.disconnect()},[]),e}var b=require("react/jsx-runtime"),$t=800,Wt=16*1024*1024;function At(e){if(typeof e!="string"||!e.startsWith("asset://"))return e;let t=e.slice(8),a=t.lastIndexOf("."),n=a===-1?t:t.slice(0,a),o=a===-1?"png":t.slice(a+1);return`/-/notes/asset?sha=${encodeURIComponent(n)}&ext=${encodeURIComponent(o)}`}function nt({pageId:e,t,onChanged:a,onGone:n}){let[o,s]=(0,x.useState)(null),[i,l]=(0,x.useState)("idle"),[h,S]=(0,x.useState)("");return(0,x.useEffect)(()=>{if(!e){s(null),l("idle");return}let w=!1;return l("loading"),S(""),y.readPage(e).then(v=>{w||(s(v),l("ready"))}).catch(v=>{w||(S(String(v&&v.message||v)),l("error"),v&&v.status===404&&typeof n=="function"&&n())}),()=>{w=!0}},[e,n]),e?i==="loading"||i==="idle"?(0,b.jsx)("div",{className:"n-empty",children:t.loading}):i==="error"?(0,b.jsx)("div",{className:"n-empty",children:h}):o?(0,b.jsx)(Dt,{page:o,t,onSaved:a},o.id):(0,b.jsx)("div",{className:"n-empty",children:t.loading}):(0,b.jsx)("div",{className:"n-empty",children:t.noPage})}function Bt({t:e}){return(0,b.jsxs)("div",{className:"n-editor-skeleton",role:"status","aria-live":"polite",children:[(0,b.jsx)("div",{className:"n-skel-line",style:{width:"38%",height:"18px"}}),(0,b.jsx)("div",{className:"n-skel-line",style:{width:"92%"}}),(0,b.jsx)("div",{className:"n-skel-line",style:{width:"86%"}}),(0,b.jsx)("div",{className:"n-skel-line",style:{width:"70%"}}),(0,b.jsx)("div",{className:"n-skel-hint",children:e.loading})]})}function Dt({page:e,t,onSaved:a}){let[n,o]=(0,x.useState)(null),[s,i]=(0,x.useState)(""),[l,h]=(0,x.useState)(e.title&&e.title!==t.untitled?e.title:""),[S,w]=(0,x.useState)("saved"),[v,P]=(0,x.useState)(null),[$,k]=(0,x.useState)(""),L=(0,x.useRef)({...e}),u=(0,x.useRef)(!1),O=(0,x.useRef)(null),U=(0,x.useRef)(!1),C=(0,x.useRef)(null),q=(0,x.useRef)(l),F=(0,x.useRef)(t),X=(0,x.useRef)(a);q.current=l,F.current=t,X.current=a,(0,x.useEffect)(()=>{let m=!1;return Je().then(T=>{m||o(T)}).catch(T=>{m||i(String(T&&T.message||T))}),()=>{m=!0}},[]);let M=(0,x.useCallback)(async({force:m=!1,rev:T}={})=>{let se=C.current;if(!se||U.current||!u.current&&!m)return;let I=L.current,ie;try{ie=JSON.parse(JSON.stringify(se.document))}catch(R){k(String(R&&R.message||R));return}U.current=!0,w("saving");try{let R=await y.savePage({id:I.id,title:q.current.trim()||F.current.untitled,blocks:ie,rev:T===void 0?I.rev:T,baseMtimeMs:I.mtimeMs,baseSize:I.size});if(L.current={...R.page},u.current=!1,w("saved"),P(null),R.conflictFile){let Y=String(R.conflictFile).split(/[\\/]/).pop();k(`已保存；外部改动留档为 ${Y}`)}typeof X.current=="function"&&X.current(R.page)}catch(R){R&&R.status===409?(P(R.current||null),w("error")):(w("error"),k(String(R&&R.message||R)))}finally{U.current=!1}},[]),H=(0,x.useCallback)(()=>{O.current&&clearTimeout(O.current),O.current=setTimeout(()=>{O.current=null,M()},$t)},[M]);(0,x.useEffect)(()=>()=>{O.current&&(clearTimeout(O.current),O.current=null),u.current&&M({force:!0}).catch(()=>{})},[M]),(0,x.useEffect)(()=>{let m=T=>{(T.metaKey||T.ctrlKey)&&!T.altKey&&String(T.key).toLowerCase()==="s"&&(T.preventDefault(),M({force:!0}))};return window.addEventListener("keydown",m,!0),()=>window.removeEventListener("keydown",m,!0)},[M]);let he=(0,x.useCallback)(async m=>{if(m&&m.size>Wt)throw new Error(F.current.imageTooLarge);let T=await y.uploadAsset(m);return`asset://${T.sha}.${T.ext}`},[]),me=(0,x.useCallback)(async m=>At(m),[]),re=(0,x.useMemo)(()=>({initialContent:Array.isArray(e.blocks)&&e.blocks.length>0?e.blocks:void 0,uploadFile:he,resolveFileUrl:me}),[e.id]);return(0,b.jsxs)("div",{className:"n-main",children:[(0,b.jsxs)("div",{className:"n-topbar",children:[(0,b.jsx)("input",{className:"n-title-input",value:l,placeholder:t.untitled,"aria-label":t.title,onChange:m=>{h(m.target.value),u.current=!0,w("dirty"),H()},onBlur:()=>M()}),(0,b.jsx)("span",{className:`n-save-state${S==="error"?" is-error":""}`,role:"status","aria-live":"polite",children:S==="saving"?t.saving:S==="dirty"?t.unsaved:S==="error"?t.conflict:t.saved}),(0,b.jsx)("a",{className:"n-btn is-icon",href:y.exportUrl(e.id),download:!0,title:t.exportMd,"aria-label":t.exportMd,children:(0,b.jsx)(Ge,{})}),(0,b.jsx)("button",{type:"button",className:"n-btn is-icon",title:t.save,"aria-label":t.save,onClick:()=>M({force:!0}),children:(0,b.jsx)(et,{})})]}),v&&(0,b.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,b.jsxs)("span",{className:"n-banner-text",children:[(0,b.jsx)("b",{children:t.conflict})," — ",t.conflictBody]}),(0,b.jsx)("button",{type:"button",className:"n-btn",onClick:()=>{let m=v.rev;P(null),u.current=!0,M({force:!0,rev:m})},children:t.overwrite}),(0,b.jsx)("button",{type:"button",className:"n-btn",onClick:async()=>{P(null);try{let m=await y.readPage(L.current.id);L.current={...m},h(m.title===t.untitled?"":m.title);let T=C.current;T&&Array.isArray(m.blocks)&&T.replaceBlocks(T.document,m.blocks),u.current=!1,w("saved")}catch(m){k(String(m&&m.message||m))}},children:t.reload})]}),$&&(0,b.jsxs)("div",{className:"n-banner",role:"status",children:[(0,b.jsx)("span",{className:"n-banner-text",children:$}),(0,b.jsx)("button",{type:"button",className:"n-btn is-icon","aria-label":t.close,onClick:()=>k(""),children:(0,b.jsx)(ce,{})})]}),(0,b.jsx)("div",{className:"n-editor-scroll",children:(0,b.jsxs)("div",{className:"n-editor",children:[s&&(0,b.jsx)("div",{className:"n-empty",children:s}),!n&&!s&&(0,b.jsx)(Bt,{t}),n&&(0,b.jsx)(zt,{runtime:n,options:re,t,onReady:m=>{C.current=m},onChange:()=>{u.current=!0,w(m=>m==="saving"?m:"dirty"),H()}})]})})]})}function zt({runtime:e,options:t,t:a,onReady:n,onChange:o}){let{useCreateBlockNote:s,BlockNoteView:i}=e,l=tt(),h=s(t);return(0,x.useEffect)(()=>{h&&n(h)},[h,n]),h?(0,b.jsx)("div",{className:"n-blocknote",children:(0,b.jsx)(i,{editor:h,theme:l,onChange:o})}):null}var _t={label:"全部笔记本",panelLabel:"笔记本",title:"全部笔记本",currentWorkspace:"当前工作区",noWorkspace:"未选择工作区",createNotebook:"新建笔记本",openNotebook:"打开笔记本",orphan:"游离",newPage:"新建页面",newChild:"新建子笔记本",rename:"重命名",delete:"删除",exportMd:"导出 Markdown",save:"保存",saved:"已保存",saving:"保存中…",unsaved:"未保存",conflict:"他处已修改",conflictBody:"这份笔记在别处被改过。覆盖会丢掉对方的改动。",overwrite:"覆盖",reload:"载入最新",empty:"还没有笔记本",emptyHint:"在左侧选中一个工作区，点「新建笔记本」开始。",noPage:"选一个页面开始编辑，或者新建一页。",untitled:"无标题",search:"搜索",searchPlaceholder:"搜索标题与正文…",searchEmpty:"没有命中",deleteNotebookConfirm:e=>`删除笔记本「${e}」？它和里面的页面都会进回收站。`,deletePageConfirm:e=>`删除页面「${e}」？会进回收站。`,renamePrompt:"新名字",loading:"载入中…",retry:"重试",unavailable:"笔记本服务不可用",unavailableHint:"宿主路由没有注册成功，请重启 dsh web 后刷新页面。",imageTooLarge:"图片太大（上限 16MB）",uploadFailed:"图片上传失败",chars:e=>`${e} 字`,more:"更多",noResults:"没有结果",notebook:"笔记本",page:"页面",rightTab:"笔记本",rightTabDesc:"浏览全部工作区的笔记本",rightEmptyHint:"点上面的「新建笔记本」开始。",close:"关闭"},Ut={label:"All notebooks",panelLabel:"Notebook",title:"All notebooks",currentWorkspace:"Current workspace",noWorkspace:"No workspace selected",createNotebook:"New notebook",openNotebook:"Open notebook",orphan:"Orphan",newPage:"New page",newChild:"New sub-notebook",rename:"Rename",delete:"Delete",exportMd:"Export markdown",save:"Save",saved:"Saved",saving:"Saving…",unsaved:"Unsaved",conflict:"Changed elsewhere",conflictBody:"This note changed on disk. Overwriting discards the other version.",overwrite:"Overwrite",reload:"Reload latest",empty:"No notebooks yet",emptyHint:"Pick a workspace on the left, then click “New notebook”.",noPage:"Pick a page to start writing, or create one.",untitled:"Untitled",search:"Search",searchPlaceholder:"Search titles and text…",searchEmpty:"Nothing matched",deleteNotebookConfirm:e=>`Delete notebook “${e}”? It and its pages go to the trash.`,deletePageConfirm:e=>`Delete page “${e}”? It goes to the trash.`,renamePrompt:"New name",loading:"Loading…",retry:"Retry",unavailable:"Notebook service unavailable",unavailableHint:"The host route did not register. Restart dsh web, then reload this page.",imageTooLarge:"Image too large (16MB limit)",uploadFailed:"Image upload failed",chars:e=>`${e} chars`,more:"More",noResults:"No results",notebook:"Notebook",page:"Page",rightTab:"Notebooks",rightTabDesc:"Browse notebooks from every workspace",rightEmptyHint:"Use “New notebook” above to get started.",close:"Close"};function V(){let e=typeof document<"u"&&document.documentElement.lang||"zh-CN";return String(e).toLowerCase().startsWith("zh")?"zh":"en"}function B(e){return(e||V())==="zh"?_t:Ut}function ee(e){if(typeof MutationObserver!="function"||typeof document>"u")return()=>{};let t=new MutationObserver(a=>{for(let n of a)if(n.attributeName==="lang"){e(V());return}});return t.observe(document.documentElement,{attributes:!0,attributeFilter:["lang"]}),()=>t.disconnect()}var ve=null,Oe=new Set;function te(e){ve=Object.assign({at:Date.now()},e||{});for(let t of Oe)try{t(ve)}catch{}}function Re(){let e=ve;return ve=null,e}function rt(e){return Oe.add(e),()=>Oe.delete(e)}var $e=!1;function de(){$e=!0}function ot(){let e=$e;return $e=!1,e}var ke={cwd:null,title:"",hasNotebook:!1,ready:!1},We=new Set;function at(){return ke}function pe(e){ke={...ke,...e};for(let t of We)try{t(ke)}catch{}}function st(e){return We.add(e),()=>We.delete(e)}var Ne=require("react");function jt(e){try{let t=e.get&&e.get("uiSession"),a=t&&(t.current||t.adapter?.current)||null,n=a&&typeof a.getSnapshot=="function"?a.getSnapshot():null;if(n&&typeof n.key=="string")return n.key}catch{}try{let t=e.get&&e.get("sessions"),a=t&&t.list&&t.list.getSnapshot();if(a&&a.byId){let n=Object.values(a.byId).find(o=>(o.retainedBy?.mainView??0)>0);if(n&&n.id)return n.id}}catch{}}function Ht(e,t){if(!t)return null;let a="";try{let n=e.get&&e.get("workspaces"),o=n&&n.list&&n.list.getSnapshot(),i=(o&&o.items||[]).find(l=>l.path===t);i&&(a=i.title||i.displayTitle||"")}catch{}if(!a){let n=String(t).split(/[\\/]/).filter(Boolean);a=n.length?n[n.length-1]:t}return{path:t,title:a}}function xe(e){let t=jt(e);if(!t)return null;try{let a=e.get&&e.get("sessions"),n=a&&a.list&&a.list.getSnapshot(),o=n&&n.byId&&n.byId[t];return o?Ht(e,o.cwd):null}catch{return null}}function Se(e){let[t,a]=(0,Ne.useState)(()=>xe(e));return(0,Ne.useEffect)(()=>{let n=()=>a(xe(e)),o=[],s=(l,h)=>{try{let S=h(l);S&&typeof S.subscribe=="function"&&o.push(S.subscribe(n)||(()=>{}))}catch{}},i=e.get&&e.get("uiSession");try{let l=i&&(i.current||i.adapter?.current)||null;l&&typeof l.subscribe=="function"&&o.push(l.subscribe(n)||(()=>{}))}catch{}try{let l=e.get&&e.get("sessions");s(l,h=>h.list)}catch{}try{let l=e.get&&e.get("workspaces");s(l,h=>h.list)}catch{}return n(),()=>{for(let l of o)try{l()}catch{}}},[e]),t}function it(e,t){let a=[],n=()=>{try{t()}catch{}},o=(s,i)=>{try{s&&typeof s.subscribe=="function"&&a.push(s.subscribe(n)||(()=>{}))}catch{}};try{let s=e.get&&e.get("uiSession"),i=s&&(s.current||s.adapter?.current)||null;i&&typeof i.subscribe=="function"&&a.push(i.subscribe(n)||(()=>{}))}catch{}try{let s=e.get&&e.get("sessions");o(s&&s.list)}catch{}try{let s=e.get&&e.get("workspaces");o(s&&s.list)}catch{}return()=>{for(let s of a)try{s()}catch{}}}var c=require("react/jsx-runtime");function Kt(e){let t=Array.isArray(e?.notebooks)?e.notebooks:[],a=Array.isArray(e?.pages)?e.pages:[],n=new Map(t.map(i=>[i.id,i])),o=new Map;for(let i of t){let l=i.parentId&&n.has(i.parentId)?i.parentId:null;o.has(l)||o.set(l,[]),o.get(l).push(i)}for(let i of o.values())i.sort((l,h)=>(l.order??0)-(h.order??0)||l.title.localeCompare(h.title));let s=new Map;for(let i of a)s.has(i.notebookId)||s.set(i.notebookId,[]),s.get(i.notebookId).push(i);for(let i of s.values())i.sort((l,h)=>(l.order??0)-(h.order??0)||(h.updatedAt??0)-(l.updatedAt??0));return{byId:n,children:o,pagesOf:s,root:o.get(null)||[],notebookCount:t.length}}function lt({value:e,onChange:t,onCommit:a,onCancel:n}){let o=(0,f.useRef)(null);return(0,f.useEffect)(()=>{o.current?.focus(),o.current?.select()},[]),(0,c.jsx)("input",{ref:o,className:"n-title-input",style:{height:"22px",fontSize:"13px",fontWeight:500},value:e,onChange:s=>t(s.target.value),onBlur:a,onKeyDown:s=>{s.key==="Enter"?(s.preventDefault(),a()):s.key==="Escape"&&(s.preventDefault(),n())}})}function ct({ctx:e}){let[t,a]=(0,f.useState)(V());(0,f.useEffect)(()=>ee(a),[]);let n=(0,f.useMemo)(()=>B(t),[t]),o=Se(e),[s,i]=(0,f.useState)({notebooks:[],pages:[]}),[l,h]=(0,f.useState)(!0),[S,w]=(0,f.useState)(""),[v,P]=(0,f.useState)(null),[$,k]=(0,f.useState)(()=>new Set),[L,u]=(0,f.useState)(""),[O,U]=(0,f.useState)(null),[C,q]=(0,f.useState)(null),[F,X]=(0,f.useState)(null),[M,H]=(0,f.useState)(null),[he,me]=(0,f.useState)(!1),re=(0,f.useRef)(null),m=(0,f.useMemo)(()=>Kt(s),[s]);(0,f.useEffect)(()=>{if(l||!o||!o.path)return;let r=(s.notebooks||[]).some(d=>d.workspacePath===o.path);pe({cwd:o.path,title:o.title,hasNotebook:r,ready:!0})},[l,s,o]);let T=(0,f.useMemo)(()=>{let r=new Set;try{let d=e&&typeof e.get=="function"?e.get("workspaces"):null,p=d&&d.list&&d.list.getSnapshot();for(let W of p&&p.items||[])W.path&&r.add(W.path)}catch{}return r},[e,s]),se=(0,f.useMemo)(()=>{if(!v)return null;let r=(s.pages||[]).find(d=>d.id===v);return r?r.notebookId:null},[v,s]),I=(0,f.useCallback)(async()=>{w("");try{let r=await y.tree();return i({notebooks:r.notebooks||[],pages:r.pages||[]}),h(!1),r}catch(r){return h(!1),w(String(r&&r.message||r)),null}},[]);(0,f.useEffect)(()=>{I()},[I]);let ie=(0,f.useRef)(!1);(0,f.useEffect)(()=>{if(l||ie.current||!o||!o.path||C||ot())return;ie.current=!0;let r=!0;return(async()=>{try{if(await y.findWorkspace(o.path))return;let p=await y.createNotebook({title:o.title,workspacePath:o.path,workspaceLabel:o.title});if(!r)return;await I(),k(W=>new Set(W).add(p.id))}catch{}})(),()=>{r=!1}},[l,o,C,I]);let R=(0,f.useCallback)(async r=>{if(!r)return;let d=await I(),p=r.notebookId||null;if(!p&&r.workspacePath)try{let E=await y.findWorkspace(r.workspacePath);p=E?E.id:null}catch{p=null}if(!p)return;if(k(E=>new Set(E).add(p)),r.pageId){P(r.pageId);return}let W=(d&&d.pages||[]).filter(E=>E.notebookId===p);if(W.length>0){P(W[0].id);return}try{let E=await y.createPage({notebookId:p,title:n.untitled});await I(),P(E.id)}catch(E){w(String(E&&E.message||E))}},[I,n]);(0,f.useEffect)(()=>{let r=Re();return r&&R(r),rt(p=>{Re(),R(p)})},[R]),(0,f.useEffect)(()=>{let r=o?.path;if(!r){q(null);return}let d=!1;return y.findWorkspace(r).then(p=>{d||q(p)}).catch(()=>{d||q(null)}),()=>{d=!0}},[o?.path,s]),(0,f.useEffect)(()=>{let r=L.trim();if(!r){U(null);return}let d=!1,p=setTimeout(()=>{y.search(r,30).then(W=>{d||U(W)}).catch(()=>{d||U([])})},200);return()=>{d=!0,clearTimeout(p)}},[L]);let Y=(0,f.useCallback)(async r=>{me(!0);try{return await r()}finally{me(!1)}},[]),Be=(0,f.useCallback)(async()=>{if(!o?.path)return null;if(C)return C;let r=await y.bindWorkspace({workspacePath:o.path,workspaceLabel:o.title,title:o.title});return q(r.notebook),r.notebook},[o,C]),Ee=(0,f.useCallback)(async r=>{if(!r)return;k(p=>new Set(p).add(r.id));let d=(m.pagesOf.get(r.id)||[])[0];d?P(d.id):await le(r.id)},[m]),le=(0,f.useCallback)(async r=>{let d=r||se||C&&C.id;d&&await Y(async()=>{try{let p=await y.createPage({notebookId:d,title:n.untitled});k(W=>new Set(W).add(d)),await I(),P(p.id)}catch(p){w(String(p&&p.message||p))}})},[se,C,I,n,Y]),gt=(0,f.useCallback)(async(r=null)=>{await Y(async()=>{try{let d=await y.createNotebook({parentId:r,title:n.notebook});await I(),r&&k(p=>new Set(p).add(r)),H({kind:"notebook",id:d.id,value:d.title})}catch(d){w(String(d&&d.message||d))}})},[I,n,Y]),yt=(0,f.useCallback)(async()=>{await Y(async()=>{try{let r=await Be();await I(),await Ee(r)}catch(r){w(String(r&&r.message||r))}})},[Be,I,Ee,Y]),De=(0,f.useCallback)(async()=>{let r=M;if(H(null),!r)return;let d=r.value.trim();if(d)try{if(r.kind==="notebook")await y.updateNotebook(r.id,{title:d});else{let p=await y.readPage(r.id);await y.savePage({id:p.id,title:d,rev:p.rev,baseMtimeMs:p.mtimeMs,baseSize:p.size})}await I()}catch(p){w(String(p&&p.message||p))}},[M,I]),wt=(0,f.useCallback)(async()=>{let r=F;if(X(null),!!r)try{r.kind==="page"?(await y.deletePage(r.id),v===r.id&&P(null)):await y.deleteNotebook(r.id),await I()}catch(d){w(String(d&&d.message||d))}},[F,v,I]),ze=(0,f.useCallback)(r=>{k(d=>{let p=new Set(d);return p.has(r)?p.delete(r):p.add(r),p})},[]);(0,f.useEffect)(()=>{let r=d=>{let p=d.metaKey||d.ctrlKey;p&&d.key.toLowerCase()==="p"?(d.preventDefault(),re.current?.focus(),re.current?.select?.()):p&&d.shiftKey&&d.key.toLowerCase()==="n"?(d.preventDefault(),le()):d.key==="Escape"&&document.activeElement===re.current&&u("")};return window.addEventListener("keydown",r),()=>window.removeEventListener("keydown",r)},[le]);let vt=(r,d)=>(m.pagesOf.get(r)||[]).map(p=>{let W=M&&M.kind==="page"&&M.id===p.id;return(0,c.jsxs)("div",{className:`n-row${v===p.id?" is-active":""}`,style:{paddingLeft:`${8+d*12+16}px`},role:"treeitem","aria-selected":v===p.id?"true":"false",tabIndex:0,onClick:()=>P(p.id),onKeyDown:E=>{(E.key==="Enter"||E.key===" ")&&(E.preventDefault(),P(p.id))},children:[(0,c.jsx)(Ze,{}),W?(0,c.jsx)(lt,{value:M.value,onChange:E=>H({...M,value:E}),onCommit:De,onCancel:()=>H(null)}):(0,c.jsx)("span",{className:"n-row-title",children:p.title||n.untitled}),(0,c.jsxs)("span",{className:"n-row-actions",children:[(0,c.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.rename,"aria-label":n.rename,onClick:E=>{E.stopPropagation(),H({kind:"page",id:p.id,value:p.title||""})},children:(0,c.jsx)(ye,{})}),(0,c.jsx)("button",{type:"button",className:"n-btn is-icon is-danger",title:n.delete,"aria-label":n.delete,onClick:E=>{E.stopPropagation(),X({kind:"page",id:p.id,title:p.title||n.untitled})},children:(0,c.jsx)(Me,{})})]})]},p.id)}),_e=(r,d)=>{let p=$.has(r.id),W=m.children.get(r.id)||[],E=m.pagesOf.get(r.id)||[],Ue=W.length>0||E.length>0,Nt=M&&M.kind==="notebook"&&M.id===r.id,St=r.workspacePath&&o?.path&&r.workspacePath===o.path,Ct=!r.workspacePath||T.has(r.workspacePath);return(0,c.jsxs)("div",{children:[(0,c.jsxs)("div",{className:"n-row is-notebook",style:{paddingLeft:`${8+d*12}px`},role:"treeitem","aria-expanded":p?"true":"false",tabIndex:0,onClick:()=>ze(r.id),onKeyDown:D=>{(D.key==="Enter"||D.key===" ")&&(D.preventDefault(),ze(r.id))},title:r.workspacePath||r.title,children:[(0,c.jsx)("span",{className:`n-twist${Ue?"":" is-leaf"}`,"aria-hidden":"true",children:(0,c.jsx)(Ye,{open:p})}),(0,c.jsx)(G,{}),Nt?(0,c.jsx)(lt,{value:M.value,onChange:D=>H({...M,value:D}),onCommit:De,onCancel:()=>H(null)}):(0,c.jsx)("span",{className:"n-row-title",children:r.title}),St&&(0,c.jsx)("span",{className:"n-row-badge",children:n.currentWorkspace}),r.workspacePath&&!Ct&&(0,c.jsx)("span",{className:"n-row-badge",children:n.orphan}),(0,c.jsxs)("span",{className:"n-row-actions",children:[(0,c.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.newPage,"aria-label":n.newPage,onClick:D=>{D.stopPropagation(),le(r.id)},children:(0,c.jsx)(Te,{})}),(0,c.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.newChild,"aria-label":n.newChild,onClick:D=>{D.stopPropagation(),gt(r.id)},children:(0,c.jsx)(G,{size:12})}),(0,c.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.rename,"aria-label":n.rename,onClick:D=>{D.stopPropagation(),H({kind:"notebook",id:r.id,value:r.title})},children:(0,c.jsx)(ye,{})}),(0,c.jsx)("button",{type:"button",className:"n-btn is-icon is-danger",title:n.delete,"aria-label":n.delete,onClick:D=>{D.stopPropagation(),X({kind:"notebook",id:r.id,title:r.title})},children:(0,c.jsx)(Me,{})})]})]}),p&&(0,c.jsxs)("div",{role:"group",children:[W.map(D=>_e(D,d+1)),vt(r.id,d),!Ue&&(0,c.jsx)("div",{className:"n-row",style:{paddingLeft:`${8+(d+1)*12+16}px`,color:"var(--dsw-alias-label-tertiary)"},children:(0,c.jsx)("span",{className:"n-row-title",children:n.noPage})})]})]},r.id)},kt=o?o.title:n.noWorkspace,xt=!!o?.path;return(0,c.jsxs)("div",{className:"n-app",children:[(0,c.jsxs)("aside",{className:"n-side",children:[(0,c.jsxs)("div",{className:"n-wsbar",children:[(0,c.jsx)("span",{className:"n-wsbar-label",children:n.currentWorkspace}),(0,c.jsxs)("span",{className:"n-wsbar-name",title:o?.path||"",children:[(0,c.jsx)(G,{}),(0,c.jsx)("b",{children:kt})]}),(0,c.jsxs)("span",{className:"n-wsbar-actions",children:[(0,c.jsxs)("button",{type:"button",className:"n-btn",disabled:!xt||he,onClick:()=>C?Ee(C):yt(),children:[(0,c.jsx)(Te,{}),C?n.openNotebook:n.createNotebook]}),(0,c.jsx)("button",{type:"button",className:"n-btn",disabled:he,title:n.newPage,"aria-label":n.newPage,onClick:()=>le(),children:(0,c.jsx)(ye,{})})]})]}),(0,c.jsxs)("div",{className:"n-search",children:[(0,c.jsx)(Qe,{}),(0,c.jsx)("input",{ref:re,type:"search",value:L,placeholder:n.searchPlaceholder,"aria-label":n.search,onChange:r=>u(r.target.value)}),L&&(0,c.jsx)("button",{type:"button",className:"n-btn is-icon","aria-label":n.delete,onClick:()=>u(""),children:(0,c.jsx)(ce,{size:12})})]}),S&&(0,c.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,c.jsx)("span",{className:"n-banner-text",children:S}),(0,c.jsx)("button",{type:"button",className:"n-btn",onClick:I,children:n.retry})]}),F&&(0,c.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,c.jsx)("span",{className:"n-banner-text",children:F.kind==="notebook"?n.deleteNotebookConfirm(F.title):n.deletePageConfirm(F.title)}),(0,c.jsx)("button",{type:"button",className:"n-btn is-danger",onClick:wt,children:n.delete}),(0,c.jsx)("button",{type:"button",className:"n-btn",onClick:()=>X(null),children:(0,c.jsx)(ce,{size:12})})]}),(0,c.jsxs)("div",{className:"n-tree",role:"tree","aria-label":n.title,children:[l&&(0,c.jsx)("div",{className:"n-tree-empty",children:n.loading}),!l&&O&&(0,c.jsxs)(c.Fragment,{children:[O.length===0&&(0,c.jsx)("div",{className:"n-tree-empty",children:n.noResults}),O.map(r=>(0,c.jsxs)("div",{className:"n-hit",role:"button",tabIndex:0,onClick:()=>{P(r.id),u("")},onKeyDown:d=>{d.key==="Enter"&&(P(r.id),u(""))},children:[(0,c.jsx)("div",{className:"n-hit-title",children:r.title||n.untitled}),r.snippet&&(0,c.jsx)("div",{className:"n-hit-snippet",children:r.snippet})]},r.id))]}),!l&&!O&&m.notebookCount===0&&(0,c.jsxs)("div",{className:"n-tree-empty",children:[(0,c.jsx)("b",{children:n.empty}),(0,c.jsx)("div",{children:n.emptyHint})]}),!l&&!O&&m.root.map(r=>_e(r,0))]})]}),(0,c.jsx)(nt,{pageId:v,t:n,onChanged:()=>{I()},onGone:()=>{P(null),I()}})]})}var dt=require("react"),pt=require("react/jsx-runtime"),Ce=class extends dt.Component{constructor(t){super(t),this.state={error:null}}static getDerivedStateFromError(t){return{error:t}}componentDidCatch(t,a){console.error("[dsh-notes] app crashed:",t&&t.message,`
    `,a&&a.componentStack)}render(){return this.state.error?(0,pt.jsxs)("div",{className:"n-empty",children:["笔记本渲染失败：",String(this.state.error&&this.state.error.message||this.state.error)]}):this.props.children}};var _=require("react");function ne(e,t){if(!e||typeof e.get!="function")return null;try{let a=e.get("sessions"),n=a&&a.list&&a.list.getSnapshot(),o=n&&n.byId&&n.byId[t],s=o&&o.cwd;return typeof s=="string"&&s?s:null}catch{return null}}function Pe(e,t){try{let n=e&&typeof e.get=="function"?e.get("workspaces"):null,o=n&&n.list&&n.list.getSnapshot(),i=(o&&o.items||[]).find(l=>l.path===t);if(i&&(i.title||i.displayTitle))return i.title||i.displayTitle}catch{}let a=String(t||"").split(/[\\/]/).filter(Boolean);return a.length?a[a.length-1]:String(t||"")}async function Ie(e,t){let a=await y.findWorkspace(t);if(a)return{notebook:a,created:!1};let n=Pe(e,t);return{notebook:await y.createNotebook({title:n,workspacePath:t,workspaceLabel:n}),created:!0}}function ue(e){try{let t=e&&typeof e.get=="function"?e.get("layout"):null;if(t&&typeof t.selectPanel=="function"){t.selectPanel("notes");return}console.warn("[dsh-notes] layout 服务不可用，无法切主面板")}catch(t){console.warn("[dsh-notes] selectPanel(notes) 失败：",t&&t.message||t)}}var N=require("react/jsx-runtime");function ut({ctx:e}){let[t,a]=(0,_.useState)(V());(0,_.useEffect)(()=>ee(a),[]);let n=(0,_.useMemo)(()=>B(t),[t]),o=Se(e),[s,i]=(0,_.useState)(null),[l,h]=(0,_.useState)(""),[S,w]=(0,_.useState)(!1),v=(0,_.useCallback)(async()=>{w(!0),h("");try{let u=await y.tree();i({notebooks:u.notebooks||[],pages:u.pages||[]})}catch(u){h(String(u&&u.message||u))}finally{w(!1)}},[]);(0,_.useEffect)(()=>{v()},[v]),(0,_.useEffect)(()=>{de(),ue(e)},[]);let P=(0,_.useMemo)(()=>{let u=s&&s.notebooks||[],O=s&&s.pages||[],U=new Map;for(let C of O)U.set(C.notebookId,(U.get(C.notebookId)||0)+1);return u.filter(C=>C.parentId===null||C.parentId===void 0).sort((C,q)=>(C.order||0)-(q.order||0)).map(C=>({...C,pageCount:U.get(C.id)||0}))},[s]),$=u=>{de(),te({notebookId:u}),ue(e)},k=(0,_.useMemo)(()=>!o||!P.length?null:P.find(u=>u.workspacePath&&u.workspacePath===o.path)||null,[P,o]),L=async()=>{if(!(!o||S)){w(!0),h("");try{if(k)$(k.id);else{let{notebook:u}=await Ie(e,o.path);await v(),$(u.id)}}catch(u){h(String(u&&u.message||u))}finally{w(!1)}}};return(0,N.jsxs)("div",{className:"n-right",children:[(0,N.jsxs)("div",{className:"n-right-head",children:[(0,N.jsx)("span",{className:"n-right-title",children:n.label}),(0,N.jsx)("button",{type:"button",className:"n-right-refresh",onClick:v,disabled:S,"aria-label":n.retry,title:n.retry,children:"⟳"})]}),(0,N.jsx)("div",{className:"n-right-ws",children:o?(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)("span",{className:"n-right-ws-name",title:o.path,children:o.title}),(0,N.jsx)("button",{type:"button",className:"n-right-action n-right-ws-btn",onClick:L,disabled:S,children:k?n.openNotebook:n.createNotebook})]}):(0,N.jsx)("span",{className:"n-right-ws-name",children:n.noWorkspace})}),l?(0,N.jsxs)("div",{className:"n-right-empty",children:[(0,N.jsx)("div",{children:n.unavailable}),(0,N.jsx)("div",{className:"n-right-hint",children:l}),(0,N.jsx)("button",{type:"button",className:"n-right-action",onClick:v,children:n.retry})]}):s?P.length===0?(0,N.jsxs)("div",{className:"n-right-empty",children:[(0,N.jsx)("div",{children:n.empty}),(0,N.jsx)("div",{className:"n-right-hint",children:n.rightEmptyHint})]}):(0,N.jsx)("div",{className:"n-right-list",role:"list",children:P.map(u=>(0,N.jsxs)("button",{type:"button",role:"listitem",className:"n-right-row",onClick:()=>$(u.id),title:u.workspacePath||u.title,children:[(0,N.jsxs)("span",{className:"n-right-row-main",children:[(0,N.jsx)("span",{className:"n-right-row-title",children:u.title}),(0,N.jsxs)("span",{className:"n-right-row-meta",children:[u.pageCount," ",n.page,u.workspacePath?"":` · ${n.orphan}`]})]}),(0,N.jsx)("span",{className:"n-right-arrow","aria-hidden":"true",children:"→"})]},u.id))}):(0,N.jsx)("div",{className:"n-right-empty",children:n.loading})]})}var K=require("react");var Ae=require("react/jsx-runtime");function ft({ctx:e,sessionId:t}){let[a,n]=(0,K.useState)(V()),[o,s]=(0,K.useState)(()=>ne(e,t)),[i,l]=(0,K.useState)(null),[h,S]=(0,K.useState)(!1),w=(0,K.useRef)(!0);(0,K.useEffect)(()=>ee(n),[]),(0,K.useEffect)(()=>{if(w.current=!0,!!o)return y.findWorkspace(o).then($=>{w.current&&l($!=null)}).catch(()=>{w.current&&l(null)}),()=>{w.current=!1}},[o]),(0,K.useEffect)(()=>{if(o)return;let $=setTimeout(()=>s(ne(e,t)),300);return()=>clearTimeout($)},[e,t,o]);let v=i?B(a).openNotebook:B(a).createNotebook;return(0,Ae.jsx)("button",{type:"button",className:"n-rowaction","aria-label":v,title:v,disabled:h||!o,onClick:async $=>{if($.stopPropagation(),!(h||!o)){S(!0);try{let{notebook:k}=await Ie(e,o);l(!0),te({notebookId:k.id}),ue(e)}catch(k){console.warn("[dsh-notes] 建/开笔记本失败：",k&&k.message)}finally{S(!1)}}},children:(0,Ae.jsx)(G,{size:14})})}var Z=require("react");var fe=require("react/jsx-runtime");function ht(e){let{ctx:t,sessionId:a}=e||{},[n,o]=(0,Z.useState)(V()),[s,i]=(0,Z.useState)(null),[l,h]=(0,Z.useState)(()=>ne(t,a)),[S,w]=(0,Z.useState)(!1);(0,Z.useEffect)(()=>ee(o),[]),(0,Z.useEffect)(()=>{if(l)return;let k=null;try{let u=t&&typeof t.get=="function"?t.get("sessions"):null,O=u&&u.list;O&&typeof O.subscribe=="function"&&(k=O.subscribe(()=>{let U=ne(t,a);U&&h(U)}))}catch{}let L=setTimeout(()=>h(ne(t,a)),200);return()=>{clearTimeout(L),typeof k=="function"&&k()}},[t,a,l]),(0,Z.useEffect)(()=>{if(!l){i(null);return}let k=!1;return y.findWorkspace(l).then(L=>{k||i(L)}).catch(()=>{k||i(null)}),()=>{k=!0}},[l]);let v=B(n),P=!l||S,$=s?v.openNotebook:v.createNotebook;return(0,fe.jsxs)("button",{type:"button",className:"n-menu-item",role:"menuitem",disabled:P,title:l||v.noWorkspace,onClick:async k=>{if(k.preventDefault(),k.stopPropagation(),!(!l||S)){w(!0);try{if(s)te({workspacePath:l,notebookId:s.id});else{let L=await y.bindWorkspace({workspacePath:l,workspaceLabel:Pe(t,l),title:Pe(t,l)});i(L.notebook),te({workspacePath:l,notebookId:L.notebook.id})}try{t.layout.selectPanel("notes")}catch{}}catch(L){console.warn("[dsh-notes] 会话菜单建笔记本失败:",L)}finally{w(!1)}}},children:[(0,fe.jsx)(G,{size:14}),(0,fe.jsx)("span",{children:$})]})}var Ft=`
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
    `,mt=!1;function bt(){if(mt||typeof document>"u")return;mt=!0;let e="dsh-notes-styles";if(document.getElementById(e))return;let t=document.createElement("style");t.id=e,t.textContent=Ft,document.head.append(t)}var ae=require("react/jsx-runtime"),Xt=["slots"];function Yt(e){console.info("[dsh-notes] build",typeof __NOTES_BUILD__=="string"?__NOTES_BUILD__:"dev"),bt(),qe({react:Vt,"react/jsx-runtime":qt,"react-dom":Jt,"react-dom/client":Zt});let t=!1,a=async()=>{let s=xe(e);if(!s){pe({cwd:null,title:"",hasNotebook:!1,ready:!0});return}let i=!1;try{i=!!await y.findWorkspace(s.path)}catch{i=!1}t||pe({cwd:s.path,title:s.title,hasNotebook:i,ready:!0})},n=it(e,a);a();let o=setInterval(()=>{(typeof document>"u"||document.visibilityState==="visible")&&a()},5e3);e.effect(()=>()=>{t=!0,clearInterval(o),n()},"dsh-notes: entry state watcher"),e.slots.inject("sidebar.panellist",()=>{let s=null,i=()=>{s&&(s(),s=null);let h=at(),S=h.ready?h.hasNotebook?B().openNotebook:B().createNotebook:B().panelLabel;s=e.slots.register({name:"sidebar.panellist",id:"notes",order:40,label:()=>S},Xe)},l=st(i);return i(),()=>{l(),s&&s()}}),e.slots.inject("main",()=>e.slots.register({name:"main",key:"notes"},()=>(0,ae.jsx)(Ce,{children:(0,ae.jsx)(ct,{ctx:e})}))),e.slots.inject("sidebar.workspaces.session.menu.item",()=>e.slots.register({name:"sidebar.workspaces.session.menu.item",id:"notes",order:300},s=>(0,ae.jsx)(ht,{ctx:e,sessionId:s&&s.sessionId}))),e.slots.inject("sidebar.workspaces.session.row.action",()=>e.slots.register({name:"sidebar.workspaces.session.row.action",id:"notes",order:100},s=>(0,ae.jsx)(ft,{ctx:e,sessionId:s&&s.sessionId}))),e.inject(["slots","sidebarRightTabs"],s=>{let i=s.sidebarRightTabs,l=s.slots;i&&typeof i.register=="function"&&e.effect(()=>i.register({id:"dsh-notes",kind:"notes",title:()=>B().rightTab,guide:[{id:"all",order:20,title:()=>B().label,description:()=>B().rightTabDesc}]}),"dsh-notes: right tab type"),l&&typeof l.inject=="function"&&e.effect(()=>l.inject("sidebar.right.pane.tab",()=>l.register({name:"sidebar.right.pane.tab",key:"dsh-notes"},h=>(0,ae.jsx)(ut,{ctx:e,...h}))),"dsh-notes: right tab body")})}

    return module.exports
  }
})
