/* 由 tools/build.mjs 从 src/client/index.js 生成 —— 请勿手改。
 * 重新生成：npm run build
 */
window.__ModuleLoader__.load({
  id: "@tom2012/dsh-notes",
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
    var Mt=Object.create;var ge=Object.defineProperty;var Lt=Object.getOwnPropertyDescriptor;var Ot=Object.getOwnPropertyNames;var Rt=Object.getPrototypeOf,$t=Object.prototype.hasOwnProperty;var At=(e,t)=>{for(var a in t)ge(e,a,{get:t[a],enumerable:!0})},Fe=(e,t,a,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of Ot(t))!$t.call(e,r)&&r!==a&&ge(e,r,{get:()=>t[r],enumerable:!(n=Lt(t,r))||n.enumerable});return e};var ye=(e,t,a)=>(a=e!=null?Mt(Rt(e)):{},Fe(t||!e||!e.__esModule?ge(a,"default",{value:e,enumerable:!0}):a,e)),Wt=e=>Fe(ge({},"__esModule",{value:!0}),e);var nn={};At(nn,{apply:()=>tn,inject:()=>en,suppressAutoCreate:()=>ne});module.exports=Wt(nn);var Xt=ye(require("react")),Yt=ye(require("react/jsx-runtime")),Qt=ye(require("react-dom")),Gt=ye(require("react-dom/client"));var u=require("react");var z="/-/notes";function Dt(e){return e===404?"接口不存在（宿主插件可能未加载）":e===403?"没有权限（宿主鉴权拒绝了请求）":e===409?"内容已在别处修改":e===413?"内容过大":e===503?"宿主服务不可用，请重启 dsh web":e>=500?"宿主内部错误":`HTTP ${e}`}async function j(e){let t=null;try{t=await e.json()}catch{t=null}if(!e.ok||t&&t.ok===!1){let a=new Error(t&&t.error||Dt(e.status));throw a.status=e.status,t&&t.current!==void 0&&(a.current=t.current),a}return t||{}}function Y(e){let t=[];for(let[a,n]of Object.entries(e||{}))n==null||n===""||t.push(`${encodeURIComponent(a)}=${encodeURIComponent(String(n))}`);return t.length?`?${t.join("&")}`:""}var y={base:z,async status(){return j(await fetch(`${z}/status`,{credentials:"same-origin"}))},async tree(){return j(await fetch(`${z}/tree`,{credentials:"same-origin"}))},async readPage(e){return(await j(await fetch(`${z}/page${Y({id:e})}`,{credentials:"same-origin"}))).page},async savePage({id:e,title:t,blocks:a,rev:n,baseMtimeMs:r,baseSize:s}){let i={title:t,rev:n,baseMtimeMs:r,baseSize:s};return Array.isArray(a)&&(i.blocks=a),j(await fetch(`${z}/page${Y({id:e})}`,{method:"PUT",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}))},async createPage({notebookId:e,title:t,blocks:a,markdown:n}){let r={notebookId:e,title:t};return Array.isArray(a)&&(r.blocks=a),typeof n=="string"&&(r.markdown=n),(await j(await fetch(`${z}/page`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}))).page},async deletePage(e){return j(await fetch(`${z}/page${Y({id:e})}`,{method:"DELETE",credentials:"same-origin"}))},async createNotebook({parentId:e=null,title:t,workspacePath:a=null,workspaceLabel:n=null}){return(await j(await fetch(`${z}/notebook`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({parentId:e,title:t,workspacePath:a,workspaceLabel:n})}))).notebook},async updateNotebook(e,t){return(await j(await fetch(`${z}/notebook${Y({id:e})}`,{method:"PATCH",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(t||{})}))).notebook},async deleteNotebook(e){return j(await fetch(`${z}/notebook${Y({id:e})}`,{method:"DELETE",credentials:"same-origin"}))},async findWorkspace(e){return(await j(await fetch(`${z}/workspace${Y({path:e})}`,{credentials:"same-origin"}))).notebook},async bindWorkspace({workspacePath:e,title:t,workspaceLabel:a}){return j(await fetch(`${z}/workspace`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({workspacePath:e,title:t,workspaceLabel:a})}))},async search(e,t=30){return(await j(await fetch(`${z}/search${Y({q:e,limit:t})}`,{credentials:"same-origin"}))).results||[]},async uploadAsset(e){let t=(e.name.split(".").pop()||"").toLowerCase(),a=await fetch(`${z}/asset`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":e.type||"application/octet-stream","x-notes-ext":t},body:e});return j(a)},exportUrl(e){return`${z}/export${Y({id:e})}`}};var x=require("react");var Ve="/-/notes/client",Ze={},se=null;function Xe(e){Object.assign(Ze,e||{})}function qe(){return e=>{let t=Ze[e];if(t!==void 0)return t;throw new Error(`dsh-notes: 编辑器模块请求了未注册的依赖 ${e}`)}}function Ye(){return se||(se=new Promise((e,t)=>{if(typeof document>"u"){t(new Error("dsh-notes: 没有 document，无法加载编辑器"));return}let a="dsh-notes-editor-css";if(!document.getElementById(a)){let i=document.createElement("link");i.id=a,i.rel="stylesheet",i.href=`${Ve}/editor.css`,document.head.append(i)}let n="__DSH_NOTES_EDITOR_FACTORY__",r=window[n];if(typeof r=="function"){try{e(r(qe()))}catch(i){t(Je(i))}return}let s=document.createElement("script");s.src=`${Ve}/editor.js`,s.async=!0,s.onload=()=>{let i=window[n];if(typeof i!="function"){t(new Error("dsh-notes: 编辑器模块加载后没有注册工厂"));return}try{e(i(qe()))}catch(l){t(Je(l))}},s.onerror=()=>t(new Error("dsh-notes: 编辑器模块下载失败（/-/notes/client/editor.js）")),document.head.append(s)}),se.catch(()=>{se=null}),se)}function Je(e){return e instanceof Error?e:new Error(String(e))}var g=require("react/jsx-runtime"),W={fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"};function J(e,t){return(0,g.jsx)("svg",{viewBox:"0 0 24 24",width:e,height:e,"aria-hidden":"true",focusable:"false",fill:"none",children:t})}function Q({size:e=16}){return J(e,(0,g.jsx)(g.Fragment,{children:(0,g.jsx)("path",{d:"M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-6-3.5-6 3.5V5A1.5 1.5 0 0 1 6 3.5Z",...W})}))}function Qe({size:e=16}){return J(e,(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("path",{d:"M7 3.5h7.2L18.5 7.8V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z",...W}),(0,g.jsx)("path",{d:"M13.8 3.8V8h4.2",...W})]}))}function Ge(){return(0,g.jsxs)("svg",{viewBox:"0 0 24 24",width:"20",height:"20","aria-hidden":"true",focusable:"false",fill:"none",children:[(0,g.jsx)("path",{d:"M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-6-3.5-6 3.5V5A1.5 1.5 0 0 1 6 3.5Z",...W}),(0,g.jsx)("path",{d:"M9.5 9h5M9.5 12.5h3",...W})]})}function Me({size:e=14}){return J(e,(0,g.jsx)("path",{d:"M12 5.5v13M5.5 12h13",...W}))}function et({size:e=12,open:t=!1}){return(0,g.jsx)("svg",{viewBox:"0 0 24 24",width:e,height:e,"aria-hidden":"true",focusable:"false",fill:"none",style:{transform:t?"rotate(90deg)":"none",transition:"transform 120ms ease"},children:(0,g.jsx)("path",{d:"M9 5.5 15.5 12 9 18.5",...W})})}function tt({size:e=14}){return J(e,(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("circle",{cx:"11",cy:"11",r:"5.75",...W}),(0,g.jsx)("path",{d:"M15.4 15.4 19 19",...W})]}))}function Le({size:e=14}){return J(e,(0,g.jsx)(g.Fragment,{children:(0,g.jsx)("path",{d:"M4.5 7h15M10 4.5h4M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12",...W})}))}function we({size:e=14}){return J(e,(0,g.jsx)(g.Fragment,{children:(0,g.jsx)("path",{d:"M4.5 19.5h4L19 9a2 2 0 0 0 0-2.8l-1.2-1.2A2 2 0 0 0 15 5L4.5 15.5v4Z",...W})}))}function pe({size:e=14}){return J(e,(0,g.jsx)("path",{d:"M6 6l12 12M18 6 6 18",...W}))}function nt({size:e=14}){return J(e,(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("path",{d:"M12 3.5v11M8 10.5 12 14.5 16 10.5",...W}),(0,g.jsx)("path",{d:"M5 17v2a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-2",...W})]}))}function rt({size:e=14}){return J(e,(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)("path",{d:"M6 3.5h9.2L19 7.3V18a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 18V6a2.5 2.5 0 0 1 1-2Z",...W}),(0,g.jsx)("path",{d:"M8.5 3.5v5h6M8.5 20.5v-6h7v6",...W})]}))}var ve=require("react");function Oe(){return typeof document>"u"||!document.body?"light":document.body.hasAttribute("data-ds-dark-theme")?"dark":"light"}function ot(){let[e,t]=(0,ve.useState)(Oe);return(0,ve.useEffect)(()=>{if(typeof MutationObserver!="function"||typeof document>"u"||!document.body)return;let a=new MutationObserver(()=>t(Oe()));return a.observe(document.body,{attributes:!0,attributeFilter:["data-ds-dark-theme","class"]}),t(Oe()),()=>a.disconnect()},[]),e}var b=require("react/jsx-runtime"),Bt=800,zt=16*1024*1024;function _t(e){if(typeof e!="string"||!e.startsWith("asset://"))return e;let t=e.slice(8),a=t.lastIndexOf("."),n=a===-1?t:t.slice(0,a),r=a===-1?"png":t.slice(a+1);return`/-/notes/asset?sha=${encodeURIComponent(n)}&ext=${encodeURIComponent(r)}`}function at({pageId:e,t,onChanged:a,onGone:n}){let[r,s]=(0,x.useState)(null),[i,l]=(0,x.useState)("idle"),[h,C]=(0,x.useState)("");return(0,x.useEffect)(()=>{if(!e){s(null),l("idle");return}let w=!1;return l("loading"),C(""),y.readPage(e).then(v=>{w||(s(v),l("ready"))}).catch(v=>{w||(C(String(v&&v.message||v)),l("error"),v&&v.status===404&&typeof n=="function"&&n())}),()=>{w=!0}},[e,n]),e?i==="loading"||i==="idle"?(0,b.jsx)("div",{className:"n-empty",children:t.loading}):i==="error"?(0,b.jsx)("div",{className:"n-empty",children:h}):r?(0,b.jsx)(jt,{page:r,t,onSaved:a},r.id):(0,b.jsx)("div",{className:"n-empty",children:t.loading}):(0,b.jsx)("div",{className:"n-empty",children:t.noPage})}function Ut({t:e}){return(0,b.jsxs)("div",{className:"n-editor-skeleton",role:"status","aria-live":"polite",children:[(0,b.jsx)("div",{className:"n-skel-line",style:{width:"38%",height:"18px"}}),(0,b.jsx)("div",{className:"n-skel-line",style:{width:"92%"}}),(0,b.jsx)("div",{className:"n-skel-line",style:{width:"86%"}}),(0,b.jsx)("div",{className:"n-skel-line",style:{width:"70%"}}),(0,b.jsx)("div",{className:"n-skel-hint",children:e.loading})]})}function jt({page:e,t,onSaved:a}){let[n,r]=(0,x.useState)(null),[s,i]=(0,x.useState)(""),[l,h]=(0,x.useState)(e.title&&e.title!==t.untitled?e.title:""),[C,w]=(0,x.useState)("saved"),[v,I]=(0,x.useState)(null),[$,k]=(0,x.useState)(""),L=(0,x.useRef)({...e}),f=(0,x.useRef)(!1),O=(0,x.useRef)(null),U=(0,x.useRef)(!1),P=(0,x.useRef)(null),q=(0,x.useRef)(l),F=(0,x.useRef)(t),X=(0,x.useRef)(a);q.current=l,F.current=t,X.current=a,(0,x.useEffect)(()=>{let m=!1;return Ye().then(N=>{m||r(N)}).catch(N=>{m||i(String(N&&N.message||N))}),()=>{m=!0}},[]);let T=(0,x.useCallback)(async({force:m=!1,rev:N}={})=>{let be=P.current;if(!be||U.current||!f.current&&!m)return;let ee=L.current,M;try{M=JSON.parse(JSON.stringify(be.document))}catch(R){k(String(R&&R.message||R));return}U.current=!0,w("saving");try{let R=await y.savePage({id:ee.id,title:q.current.trim()||F.current.untitled,blocks:M,rev:N===void 0?ee.rev:N,baseMtimeMs:ee.mtimeMs,baseSize:ee.size});if(L.current={...R.page},f.current=!1,w("saved"),I(null),R.conflictFile){let ce=String(R.conflictFile).split(/[\\/]/).pop();k(`已保存；外部改动留档为 ${ce}`)}typeof X.current=="function"&&X.current(R.page)}catch(R){R&&R.status===409?(I(R.current||null),w("error")):(w("error"),k(String(R&&R.message||R)))}finally{U.current=!1}},[]),H=(0,x.useCallback)(()=>{O.current&&clearTimeout(O.current),O.current=setTimeout(()=>{O.current=null,T()},Bt)},[T]);(0,x.useEffect)(()=>()=>{O.current&&(clearTimeout(O.current),O.current=null),f.current&&T({force:!0}).catch(()=>{})},[T]),(0,x.useEffect)(()=>{let m=N=>{(N.metaKey||N.ctrlKey)&&!N.altKey&&String(N.key).toLowerCase()==="s"&&(N.preventDefault(),T({force:!0}))};return window.addEventListener("keydown",m,!0),()=>window.removeEventListener("keydown",m,!0)},[T]);let he=(0,x.useCallback)(async m=>{if(m&&m.size>zt)throw new Error(F.current.imageTooLarge);let N=await y.uploadAsset(m);return`asset://${N.sha}.${N.ext}`},[]),me=(0,x.useCallback)(async m=>_t(m),[]),oe=(0,x.useMemo)(()=>({initialContent:Array.isArray(e.blocks)&&e.blocks.length>0?e.blocks:void 0,uploadFile:he,resolveFileUrl:me}),[e.id]);return(0,b.jsxs)("div",{className:"n-main",children:[(0,b.jsxs)("div",{className:"n-topbar",children:[(0,b.jsx)("input",{className:"n-title-input",value:l,placeholder:t.untitled,"aria-label":t.title,onChange:m=>{h(m.target.value),f.current=!0,w("dirty"),H()},onBlur:()=>T()}),(0,b.jsx)("span",{className:`n-save-state${C==="error"?" is-error":""}`,role:"status","aria-live":"polite",children:C==="saving"?t.saving:C==="dirty"?t.unsaved:C==="error"?t.conflict:t.saved}),(0,b.jsx)("a",{className:"n-btn is-icon",href:y.exportUrl(e.id),download:!0,title:t.exportMd,"aria-label":t.exportMd,children:(0,b.jsx)(nt,{})}),(0,b.jsx)("button",{type:"button",className:"n-btn is-icon",title:t.save,"aria-label":t.save,onClick:()=>T({force:!0}),children:(0,b.jsx)(rt,{})})]}),v&&(0,b.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,b.jsxs)("span",{className:"n-banner-text",children:[(0,b.jsx)("b",{children:t.conflict})," — ",t.conflictBody]}),(0,b.jsx)("button",{type:"button",className:"n-btn",onClick:()=>{let m=v.rev;I(null),f.current=!0,T({force:!0,rev:m})},children:t.overwrite}),(0,b.jsx)("button",{type:"button",className:"n-btn",onClick:async()=>{I(null);try{let m=await y.readPage(L.current.id);L.current={...m},h(m.title===t.untitled?"":m.title);let N=P.current;N&&Array.isArray(m.blocks)&&N.replaceBlocks(N.document,m.blocks),f.current=!1,w("saved")}catch(m){k(String(m&&m.message||m))}},children:t.reload})]}),$&&(0,b.jsxs)("div",{className:"n-banner",role:"status",children:[(0,b.jsx)("span",{className:"n-banner-text",children:$}),(0,b.jsx)("button",{type:"button",className:"n-btn is-icon","aria-label":t.close,onClick:()=>k(""),children:(0,b.jsx)(pe,{})})]}),(0,b.jsx)("div",{className:"n-editor-scroll",children:(0,b.jsxs)("div",{className:"n-editor",children:[s&&(0,b.jsx)("div",{className:"n-empty",children:s}),!n&&!s&&(0,b.jsx)(Ut,{t}),n&&(0,b.jsx)(Ht,{runtime:n,options:oe,t,onReady:m=>{P.current=m},onChange:()=>{f.current=!0,w(m=>m==="saving"?m:"dirty"),H()}})]})})]})}function Ht({runtime:e,options:t,t:a,onReady:n,onChange:r}){let{useCreateBlockNote:s,BlockNoteView:i}=e,l=ot(),h=s(t);return(0,x.useEffect)(()=>{h&&n(h)},[h,n]),h?(0,b.jsx)("div",{className:"n-blocknote",children:(0,b.jsx)(i,{editor:h,theme:l,onChange:r})}):null}var Kt={label:"全部笔记本",panelLabel:"笔记本",title:"全部笔记本",currentWorkspace:"当前工作区",noWorkspace:"未选择工作区",createNotebook:"新建笔记本",openNotebook:"打开笔记本",orphan:"游离",newPage:"新建页面",newChild:"新建子笔记本",rename:"重命名",delete:"删除",exportMd:"导出 Markdown",save:"保存",saved:"已保存",saving:"保存中…",unsaved:"未保存",conflict:"他处已修改",conflictBody:"这份笔记在别处被改过。覆盖会丢掉对方的改动。",overwrite:"覆盖",reload:"载入最新",empty:"还没有笔记本",emptyHint:"在左侧选中一个工作区，点「新建笔记本」开始。",noPage:"选一个页面开始编辑，或者新建一页。",untitled:"无标题",search:"搜索",searchPlaceholder:"搜索标题与正文…",searchEmpty:"没有命中",deleteNotebookConfirm:e=>`删除笔记本「${e}」？它和里面的页面都会进回收站。`,deletePageConfirm:e=>`删除页面「${e}」？会进回收站。`,renamePrompt:"新名字",loading:"载入中…",retry:"重试",unavailable:"笔记本服务不可用",unavailableHint:"宿主路由没有注册成功，请重启 dsh web 后刷新页面。",imageTooLarge:"图片太大（上限 16MB）",uploadFailed:"图片上传失败",chars:e=>`${e} 字`,more:"更多",noResults:"没有结果",notebook:"笔记本",page:"页面",rightTab:"笔记本",rightTabDesc:"浏览全部工作区的笔记本",rightEmptyHint:"点上面的「新建笔记本」开始。",close:"关闭"},Ft={label:"All notebooks",panelLabel:"Notebook",title:"All notebooks",currentWorkspace:"Current workspace",noWorkspace:"No workspace selected",createNotebook:"New notebook",openNotebook:"Open notebook",orphan:"Orphan",newPage:"New page",newChild:"New sub-notebook",rename:"Rename",delete:"Delete",exportMd:"Export markdown",save:"Save",saved:"Saved",saving:"Saving…",unsaved:"Unsaved",conflict:"Changed elsewhere",conflictBody:"This note changed on disk. Overwriting discards the other version.",overwrite:"Overwrite",reload:"Reload latest",empty:"No notebooks yet",emptyHint:"Pick a workspace on the left, then click “New notebook”.",noPage:"Pick a page to start writing, or create one.",untitled:"Untitled",search:"Search",searchPlaceholder:"Search titles and text…",searchEmpty:"Nothing matched",deleteNotebookConfirm:e=>`Delete notebook “${e}”? It and its pages go to the trash.`,deletePageConfirm:e=>`Delete page “${e}”? It goes to the trash.`,renamePrompt:"New name",loading:"Loading…",retry:"Retry",unavailable:"Notebook service unavailable",unavailableHint:"The host route did not register. Restart dsh web, then reload this page.",imageTooLarge:"Image too large (16MB limit)",uploadFailed:"Image upload failed",chars:e=>`${e} chars`,more:"More",noResults:"No results",notebook:"Notebook",page:"Page",rightTab:"Notebooks",rightTabDesc:"Browse notebooks from every workspace",rightEmptyHint:"Use “New notebook” above to get started.",close:"Close"};function V(){let e=typeof document<"u"&&document.documentElement.lang||"zh-CN";return String(e).toLowerCase().startsWith("zh")?"zh":"en"}function D(e){return(e||V())==="zh"?Kt:Ft}function G(e){if(typeof MutationObserver!="function"||typeof document>"u")return()=>{};let t=new MutationObserver(a=>{for(let n of a)if(n.attributeName==="lang"){e(V());return}});return t.observe(document.documentElement,{attributes:!0,attributeFilter:["lang"]}),()=>t.disconnect()}var ke=null,Re=new Set;function te(e){ke=Object.assign({at:Date.now()},e||{});for(let t of Re)try{t(ke)}catch{}}function $e(){let e=ke;return ke=null,e}function st(e){return Re.add(e),()=>Re.delete(e)}var Ae=0;function ne(e=15e3){Ae=Date.now()+e}function it(){let e=Date.now()<Ae;return Ae=0,e}var xe={cwd:null,title:"",hasNotebook:!1,ready:!1},We=new Set,lt=null;function ct(){return xe}function ie(e){xe={...xe,...e};for(let t of We)try{t(xe)}catch{}}function De(e){lt=e}function Be(){return lt}function dt(e){return We.add(e),()=>We.delete(e)}var Se=require("react");function Vt(e){try{let t=e.get&&e.get("uiSession"),a=t&&(t.current||t.adapter?.current)||null,n=a&&typeof a.getSnapshot=="function"?a.getSnapshot():null;if(n&&typeof n.key=="string")return n.key}catch{}try{let t=e.get&&e.get("sessions"),a=t&&t.list&&t.list.getSnapshot();if(a&&a.byId){let n=Object.values(a.byId).find(r=>(r.retainedBy?.mainView??0)>0);if(n&&n.id)return n.id}}catch{}}function qt(e,t){if(!t)return null;let a="";try{let n=e.get&&e.get("workspaces"),r=n&&n.list&&n.list.getSnapshot(),i=(r&&r.items||[]).find(l=>l.path===t);i&&(a=i.title||i.displayTitle||"")}catch{}if(!a){let n=String(t).split(/[\\/]/).filter(Boolean);a=n.length?n[n.length-1]:t}return{path:t,title:a}}function Ne(e){let t=Vt(e);if(!t)return null;try{let a=e.get&&e.get("sessions"),n=a&&a.list&&a.list.getSnapshot(),r=n&&n.byId&&n.byId[t];return r?qt(e,r.cwd):null}catch{return null}}function Ce(e){let[t,a]=(0,Se.useState)(()=>Ne(e));return(0,Se.useEffect)(()=>{let n=()=>a(Ne(e)),r=[],s=(l,h)=>{try{let C=h(l);C&&typeof C.subscribe=="function"&&r.push(C.subscribe(n)||(()=>{}))}catch{}},i=e.get&&e.get("uiSession");try{let l=i&&(i.current||i.adapter?.current)||null;l&&typeof l.subscribe=="function"&&r.push(l.subscribe(n)||(()=>{}))}catch{}try{let l=e.get&&e.get("sessions");s(l,h=>h.list)}catch{}try{let l=e.get&&e.get("workspaces");s(l,h=>h.list)}catch{}return n(),()=>{for(let l of r)try{l()}catch{}}},[e]),t}function pt(e,t){let a=[],n=()=>{try{t()}catch{}},r=(s,i)=>{try{s&&typeof s.subscribe=="function"&&a.push(s.subscribe(n)||(()=>{}))}catch{}};try{let s=e.get&&e.get("uiSession"),i=s&&(s.current||s.adapter?.current)||null;i&&typeof i.subscribe=="function"&&a.push(i.subscribe(n)||(()=>{}))}catch{}try{let s=e.get&&e.get("sessions");r(s&&s.list)}catch{}try{let s=e.get&&e.get("workspaces");r(s&&s.list)}catch{}return()=>{for(let s of a)try{s()}catch{}}}var c=require("react/jsx-runtime");function Jt(e){let t=Array.isArray(e?.notebooks)?e.notebooks:[],a=Array.isArray(e?.pages)?e.pages:[],n=new Map(t.map(i=>[i.id,i])),r=new Map;for(let i of t){let l=i.parentId&&n.has(i.parentId)?i.parentId:null;r.has(l)||r.set(l,[]),r.get(l).push(i)}for(let i of r.values())i.sort((l,h)=>(l.order??0)-(h.order??0)||l.title.localeCompare(h.title));let s=new Map;for(let i of a)s.has(i.notebookId)||s.set(i.notebookId,[]),s.get(i.notebookId).push(i);for(let i of s.values())i.sort((l,h)=>(l.order??0)-(h.order??0)||(h.updatedAt??0)-(l.updatedAt??0));return{byId:n,children:r,pagesOf:s,root:r.get(null)||[],notebookCount:t.length}}function ut({value:e,onChange:t,onCommit:a,onCancel:n}){let r=(0,u.useRef)(null);return(0,u.useEffect)(()=>{r.current?.focus(),r.current?.select()},[]),(0,c.jsx)("input",{ref:r,className:"n-title-input",style:{height:"22px",fontSize:"13px",fontWeight:500},value:e,onChange:s=>t(s.target.value),onBlur:a,onKeyDown:s=>{s.key==="Enter"?(s.preventDefault(),a()):s.key==="Escape"&&(s.preventDefault(),n())}})}function ft({ctx:e}){let[t,a]=(0,u.useState)(V());(0,u.useEffect)(()=>G(a),[]);let n=(0,u.useMemo)(()=>D(t),[t]),r=Ce(e),[s,i]=(0,u.useState)({notebooks:[],pages:[]}),[l,h]=(0,u.useState)(!0),[C,w]=(0,u.useState)(""),[v,I]=(0,u.useState)(null),[$,k]=(0,u.useState)(()=>new Set),[L,f]=(0,u.useState)(""),[O,U]=(0,u.useState)(null),[P,q]=(0,u.useState)(null),[F,X]=(0,u.useState)(null),[T,H]=(0,u.useState)(null),[he,me]=(0,u.useState)(!1),oe=(0,u.useRef)(null),m=(0,u.useRef)(!0);(0,u.useEffect)(()=>(m.current=!0,De("app"),()=>{m.current=!1,De(null)}),[]);let N=(0,u.useMemo)(()=>Jt(s),[s]);(0,u.useEffect)(()=>{if(l||!r||!r.path)return;let o=(s.notebooks||[]).some(d=>d.workspacePath===r.path);ie({cwd:r.path,title:r.title,hasNotebook:o,ready:!0})},[l,s,r]);let be=(0,u.useMemo)(()=>{let o=new Set;try{let d=e&&typeof e.get=="function"?e.get("workspaces"):null,p=d&&d.list&&d.list.getSnapshot();for(let A of p&&p.items||[])A.path&&o.add(A.path)}catch{}return o},[e,s]),ee=(0,u.useMemo)(()=>{if(!v)return null;let o=(s.pages||[]).find(d=>d.id===v);return o?o.notebookId:null},[v,s]),M=(0,u.useCallback)(async()=>{w("");try{let o=await y.tree();return i({notebooks:o.notebooks||[],pages:o.pages||[]}),h(!1),o}catch(o){return h(!1),w(String(o&&o.message||o)),null}},[]);(0,u.useEffect)(()=>{M()},[M]);let R=(0,u.useRef)(!1);(0,u.useEffect)(()=>{l||R.current||!r||!r.path||it()||(R.current=!0,(async()=>{try{if(await y.findWorkspace(r.path))return;let d=await y.createNotebook({title:r.title,workspacePath:r.path,workspaceLabel:r.title});if(!m.current)return;let p=await y.tree();if(!m.current)return;i({notebooks:p.notebooks||[],pages:p.pages||[]}),k(A=>new Set(A).add(d.id)),ie({cwd:r.path,title:r.title,hasNotebook:!0,ready:!0})}catch{}})())},[l,r&&r.path]);let ce=(0,u.useCallback)(async o=>{if(!o)return;let d=await M(),p=o.notebookId||null;if(!p&&o.workspacePath)try{let E=await y.findWorkspace(o.workspacePath);p=E?E.id:null}catch{p=null}if(!p)return;if(k(E=>new Set(E).add(p)),o.pageId){I(o.pageId);return}let A=(d&&d.pages||[]).filter(E=>E.notebookId===p);if(A.length>0){I(A[0].id);return}try{let E=await y.createPage({notebookId:p,title:n.untitled});await M(),I(E.id)}catch(E){w(String(E&&E.message||E))}},[M,n]);(0,u.useEffect)(()=>{let o=$e();return o&&ce(o),st(p=>{$e(),ce(p)})},[ce]),(0,u.useEffect)(()=>{let o=r?.path;if(!o){q(null);return}let d=!1;return y.findWorkspace(o).then(p=>{d||q(p)}).catch(()=>{d||q(null)}),()=>{d=!0}},[r?.path,s]),(0,u.useEffect)(()=>{let o=L.trim();if(!o){U(null);return}let d=!1,p=setTimeout(()=>{y.search(o,30).then(A=>{d||U(A)}).catch(()=>{d||U([])})},200);return()=>{d=!0,clearTimeout(p)}},[L]);let ae=(0,u.useCallback)(async o=>{me(!0);try{return await o()}finally{me(!1)}},[]),_e=(0,u.useCallback)(async()=>{if(!r?.path)return null;if(P)return P;let o=await y.bindWorkspace({workspacePath:r.path,workspaceLabel:r.title,title:r.title});return q(o.notebook),o.notebook},[r,P]),Te=(0,u.useCallback)(async o=>{if(!o)return;k(p=>new Set(p).add(o.id));let d=(N.pagesOf.get(o.id)||[])[0];d?I(d.id):await de(o.id)},[N]),de=(0,u.useCallback)(async o=>{let d=o||ee||P&&P.id;d&&await ae(async()=>{try{let p=await y.createPage({notebookId:d,title:n.untitled});k(A=>new Set(A).add(d)),await M(),I(p.id)}catch(p){w(String(p&&p.message||p))}})},[ee,P,M,n,ae]),kt=(0,u.useCallback)(async(o=null)=>{await ae(async()=>{try{let d=await y.createNotebook({parentId:o,title:n.notebook});await M(),o&&k(p=>new Set(p).add(o)),H({kind:"notebook",id:d.id,value:d.title})}catch(d){w(String(d&&d.message||d))}})},[M,n,ae]),xt=(0,u.useCallback)(async()=>{await ae(async()=>{try{let o=await _e();await M(),await Te(o)}catch(o){w(String(o&&o.message||o))}})},[_e,M,Te,ae]),Ue=(0,u.useCallback)(async()=>{let o=T;if(H(null),!o)return;let d=o.value.trim();if(d)try{if(o.kind==="notebook")await y.updateNotebook(o.id,{title:d});else{let p=await y.readPage(o.id);await y.savePage({id:p.id,title:d,rev:p.rev,baseMtimeMs:p.mtimeMs,baseSize:p.size})}await M()}catch(p){w(String(p&&p.message||p))}},[T,M]),Nt=(0,u.useCallback)(async()=>{let o=F;if(X(null),!!o)try{o.kind==="page"?(await y.deletePage(o.id),v===o.id&&I(null)):await y.deleteNotebook(o.id),await M()}catch(d){w(String(d&&d.message||d))}},[F,v,M]),je=(0,u.useCallback)(o=>{k(d=>{let p=new Set(d);return p.has(o)?p.delete(o):p.add(o),p})},[]);(0,u.useEffect)(()=>{let o=d=>{let p=d.metaKey||d.ctrlKey;p&&d.key.toLowerCase()==="p"?(d.preventDefault(),oe.current?.focus(),oe.current?.select?.()):p&&d.shiftKey&&d.key.toLowerCase()==="n"?(d.preventDefault(),de()):d.key==="Escape"&&document.activeElement===oe.current&&f("")};return window.addEventListener("keydown",o),()=>window.removeEventListener("keydown",o)},[de]);let St=(o,d)=>(N.pagesOf.get(o)||[]).map(p=>{let A=T&&T.kind==="page"&&T.id===p.id;return(0,c.jsxs)("div",{className:`n-row${v===p.id?" is-active":""}`,style:{paddingLeft:`${8+d*12+16}px`},role:"treeitem","aria-selected":v===p.id?"true":"false",tabIndex:0,onClick:()=>I(p.id),onKeyDown:E=>{(E.key==="Enter"||E.key===" ")&&(E.preventDefault(),I(p.id))},children:[(0,c.jsx)(Qe,{}),A?(0,c.jsx)(ut,{value:T.value,onChange:E=>H({...T,value:E}),onCommit:Ue,onCancel:()=>H(null)}):(0,c.jsx)("span",{className:"n-row-title",children:p.title||n.untitled}),(0,c.jsxs)("span",{className:"n-row-actions",children:[(0,c.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.rename,"aria-label":n.rename,onClick:E=>{E.stopPropagation(),H({kind:"page",id:p.id,value:p.title||""})},children:(0,c.jsx)(we,{})}),(0,c.jsx)("button",{type:"button",className:"n-btn is-icon is-danger",title:n.delete,"aria-label":n.delete,onClick:E=>{E.stopPropagation(),X({kind:"page",id:p.id,title:p.title||n.untitled})},children:(0,c.jsx)(Le,{})})]})]},p.id)}),He=(o,d)=>{let p=$.has(o.id),A=N.children.get(o.id)||[],E=N.pagesOf.get(o.id)||[],Ke=A.length>0||E.length>0,Pt=T&&T.kind==="notebook"&&T.id===o.id,Et=o.workspacePath&&r?.path&&o.workspacePath===r.path,Tt=!o.workspacePath||be.has(o.workspacePath);return(0,c.jsxs)("div",{children:[(0,c.jsxs)("div",{className:"n-row is-notebook",style:{paddingLeft:`${8+d*12}px`},role:"treeitem","aria-expanded":p?"true":"false",tabIndex:0,onClick:()=>je(o.id),onKeyDown:B=>{(B.key==="Enter"||B.key===" ")&&(B.preventDefault(),je(o.id))},title:o.workspacePath||o.title,children:[(0,c.jsx)("span",{className:`n-twist${Ke?"":" is-leaf"}`,"aria-hidden":"true",children:(0,c.jsx)(et,{open:p})}),(0,c.jsx)(Q,{}),Pt?(0,c.jsx)(ut,{value:T.value,onChange:B=>H({...T,value:B}),onCommit:Ue,onCancel:()=>H(null)}):(0,c.jsx)("span",{className:"n-row-title",children:o.title}),Et&&(0,c.jsx)("span",{className:"n-row-badge",children:n.currentWorkspace}),o.workspacePath&&!Tt&&(0,c.jsx)("span",{className:"n-row-badge",children:n.orphan}),(0,c.jsxs)("span",{className:"n-row-actions",children:[(0,c.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.newPage,"aria-label":n.newPage,onClick:B=>{B.stopPropagation(),de(o.id)},children:(0,c.jsx)(Me,{})}),(0,c.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.newChild,"aria-label":n.newChild,onClick:B=>{B.stopPropagation(),kt(o.id)},children:(0,c.jsx)(Q,{size:12})}),(0,c.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.rename,"aria-label":n.rename,onClick:B=>{B.stopPropagation(),H({kind:"notebook",id:o.id,value:o.title})},children:(0,c.jsx)(we,{})}),(0,c.jsx)("button",{type:"button",className:"n-btn is-icon is-danger",title:n.delete,"aria-label":n.delete,onClick:B=>{B.stopPropagation(),X({kind:"notebook",id:o.id,title:o.title})},children:(0,c.jsx)(Le,{})})]})]}),p&&(0,c.jsxs)("div",{role:"group",children:[A.map(B=>He(B,d+1)),St(o.id,d),!Ke&&(0,c.jsx)("div",{className:"n-row",style:{paddingLeft:`${8+(d+1)*12+16}px`,color:"var(--dsw-alias-label-tertiary)"},children:(0,c.jsx)("span",{className:"n-row-title",children:n.noPage})})]})]},o.id)},Ct=r?r.title:n.noWorkspace,It=!!r?.path;return(0,c.jsxs)("div",{className:"n-app",children:[(0,c.jsxs)("aside",{className:"n-side",children:[(0,c.jsxs)("div",{className:"n-wsbar",children:[(0,c.jsx)("span",{className:"n-wsbar-label",children:n.currentWorkspace}),(0,c.jsxs)("span",{className:"n-wsbar-name",title:r?.path||"",children:[(0,c.jsx)(Q,{}),(0,c.jsx)("b",{children:Ct})]}),(0,c.jsxs)("span",{className:"n-wsbar-actions",children:[(0,c.jsxs)("button",{type:"button",className:"n-btn",disabled:!It||he,onClick:()=>P?Te(P):xt(),children:[(0,c.jsx)(Me,{}),P?n.openNotebook:n.createNotebook]}),(0,c.jsx)("button",{type:"button",className:"n-btn",disabled:he,title:n.newPage,"aria-label":n.newPage,onClick:()=>de(),children:(0,c.jsx)(we,{})})]})]}),(0,c.jsxs)("div",{className:"n-search",children:[(0,c.jsx)(tt,{}),(0,c.jsx)("input",{ref:oe,type:"search",value:L,placeholder:n.searchPlaceholder,"aria-label":n.search,onChange:o=>f(o.target.value)}),L&&(0,c.jsx)("button",{type:"button",className:"n-btn is-icon","aria-label":n.delete,onClick:()=>f(""),children:(0,c.jsx)(pe,{size:12})})]}),C&&(0,c.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,c.jsx)("span",{className:"n-banner-text",children:C}),(0,c.jsx)("button",{type:"button",className:"n-btn",onClick:M,children:n.retry})]}),F&&(0,c.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,c.jsx)("span",{className:"n-banner-text",children:F.kind==="notebook"?n.deleteNotebookConfirm(F.title):n.deletePageConfirm(F.title)}),(0,c.jsx)("button",{type:"button",className:"n-btn is-danger",onClick:Nt,children:n.delete}),(0,c.jsx)("button",{type:"button",className:"n-btn",onClick:()=>X(null),children:(0,c.jsx)(pe,{size:12})})]}),(0,c.jsxs)("div",{className:"n-tree",role:"tree","aria-label":n.title,children:[l&&(0,c.jsx)("div",{className:"n-tree-empty",children:n.loading}),!l&&O&&(0,c.jsxs)(c.Fragment,{children:[O.length===0&&(0,c.jsx)("div",{className:"n-tree-empty",children:n.noResults}),O.map(o=>(0,c.jsxs)("div",{className:"n-hit",role:"button",tabIndex:0,onClick:()=>{I(o.id),f("")},onKeyDown:d=>{d.key==="Enter"&&(I(o.id),f(""))},children:[(0,c.jsx)("div",{className:"n-hit-title",children:o.title||n.untitled}),o.snippet&&(0,c.jsx)("div",{className:"n-hit-snippet",children:o.snippet})]},o.id))]}),!l&&!O&&N.notebookCount===0&&(0,c.jsxs)("div",{className:"n-tree-empty",children:[(0,c.jsx)("b",{children:n.empty}),(0,c.jsx)("div",{children:n.emptyHint})]}),!l&&!O&&N.root.map(o=>He(o,0))]})]}),(0,c.jsx)(at,{pageId:v,t:n,onChanged:()=>{M()},onGone:()=>{I(null),M()}})]})}var ht=require("react"),mt=require("react/jsx-runtime"),Ie=class extends ht.Component{constructor(t){super(t),this.state={error:null}}static getDerivedStateFromError(t){return{error:t}}componentDidCatch(t,a){console.error("[dsh-notes] app crashed:",t&&t.message,`
    `,a&&a.componentStack)}render(){return this.state.error?(0,mt.jsxs)("div",{className:"n-empty",children:["笔记本渲染失败：",String(this.state.error&&this.state.error.message||this.state.error)]}):this.props.children}};var _=require("react");function re(e,t){if(!e||typeof e.get!="function")return null;try{let a=e.get("sessions"),n=a&&a.list&&a.list.getSnapshot(),r=n&&n.byId&&n.byId[t],s=r&&r.cwd;return typeof s=="string"&&s?s:null}catch{return null}}function Pe(e,t){try{let n=e&&typeof e.get=="function"?e.get("workspaces"):null,r=n&&n.list&&n.list.getSnapshot(),i=(r&&r.items||[]).find(l=>l.path===t);if(i&&(i.title||i.displayTitle))return i.title||i.displayTitle}catch{}let a=String(t||"").split(/[\\/]/).filter(Boolean);return a.length?a[a.length-1]:String(t||"")}async function Ee(e,t){let a=await y.findWorkspace(t);if(a)return{notebook:a,created:!1};let n=Pe(e,t);return{notebook:await y.createNotebook({title:n,workspacePath:t,workspaceLabel:n}),created:!0}}function ue(e){try{let t=e&&typeof e.get=="function"?e.get("layout"):null;if(t&&typeof t.selectPanel=="function"){t.selectPanel("notes");return}console.warn("[dsh-notes] layout 服务不可用，无法切主面板")}catch(t){console.warn("[dsh-notes] selectPanel(notes) 失败：",t&&t.message||t)}}var S=require("react/jsx-runtime");function bt({ctx:e}){let[t,a]=(0,_.useState)(V());(0,_.useEffect)(()=>G(a),[]);let n=(0,_.useMemo)(()=>D(t),[t]),r=Ce(e),[s,i]=(0,_.useState)(null),[l,h]=(0,_.useState)(""),[C,w]=(0,_.useState)(!1),v=(0,_.useCallback)(async()=>{w(!0),h("");try{let f=await y.tree();i({notebooks:f.notebooks||[],pages:f.pages||[]})}catch(f){h(String(f&&f.message||f))}finally{w(!1)}},[]);(0,_.useEffect)(()=>{v()},[v]),(0,_.useEffect)(()=>{ne(),ue(e)},[]);let I=(0,_.useMemo)(()=>{let f=s&&s.notebooks||[],O=s&&s.pages||[],U=new Map;for(let P of O)U.set(P.notebookId,(U.get(P.notebookId)||0)+1);return f.filter(P=>P.parentId===null||P.parentId===void 0).sort((P,q)=>(P.order||0)-(q.order||0)).map(P=>({...P,pageCount:U.get(P.id)||0}))},[s]),$=f=>{ne(),te({notebookId:f}),ue(e)},k=(0,_.useMemo)(()=>!r||!I.length?null:I.find(f=>f.workspacePath&&f.workspacePath===r.path)||null,[I,r]),L=async()=>{if(!(!r||C)){w(!0),h("");try{if(k)$(k.id);else{let{notebook:f}=await Ee(e,r.path);await v(),$(f.id)}}catch(f){h(String(f&&f.message||f))}finally{w(!1)}}};return(0,S.jsxs)("div",{className:"n-right",children:[(0,S.jsxs)("div",{className:"n-right-head",children:[(0,S.jsx)("span",{className:"n-right-title",children:n.label}),(0,S.jsx)("button",{type:"button",className:"n-right-refresh",onClick:v,disabled:C,"aria-label":n.retry,title:n.retry,children:"⟳"})]}),(0,S.jsx)("div",{className:"n-right-ws",children:r?(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)("span",{className:"n-right-ws-name",title:r.path,children:r.title}),(0,S.jsx)("button",{type:"button",className:"n-right-action n-right-ws-btn",onClick:L,disabled:C,children:k?n.openNotebook:n.createNotebook})]}):(0,S.jsx)("span",{className:"n-right-ws-name",children:n.noWorkspace})}),l?(0,S.jsxs)("div",{className:"n-right-empty",children:[(0,S.jsx)("div",{children:n.unavailable}),(0,S.jsx)("div",{className:"n-right-hint",children:l}),(0,S.jsx)("button",{type:"button",className:"n-right-action",onClick:v,children:n.retry})]}):s?I.length===0?(0,S.jsxs)("div",{className:"n-right-empty",children:[(0,S.jsx)("div",{children:n.empty}),(0,S.jsx)("div",{className:"n-right-hint",children:n.rightEmptyHint})]}):(0,S.jsx)("div",{className:"n-right-list",role:"list",children:I.map(f=>(0,S.jsxs)("button",{type:"button",role:"listitem",className:"n-right-row",onClick:()=>$(f.id),title:f.workspacePath||f.title,children:[(0,S.jsxs)("span",{className:"n-right-row-main",children:[(0,S.jsx)("span",{className:"n-right-row-title",children:f.title}),(0,S.jsxs)("span",{className:"n-right-row-meta",children:[f.pageCount," ",n.page]})]}),(0,S.jsx)("span",{className:"n-right-arrow","aria-hidden":"true",children:"→"})]},f.id))}):(0,S.jsx)("div",{className:"n-right-empty",children:n.loading})]})}var K=require("react");var ze=require("react/jsx-runtime");function gt({ctx:e,sessionId:t}){let[a,n]=(0,K.useState)(V()),[r,s]=(0,K.useState)(()=>re(e,t)),[i,l]=(0,K.useState)(null),[h,C]=(0,K.useState)(!1),w=(0,K.useRef)(!0);(0,K.useEffect)(()=>G(n),[]),(0,K.useEffect)(()=>{if(w.current=!0,!!r)return y.findWorkspace(r).then($=>{w.current&&l($!=null)}).catch(()=>{w.current&&l(null)}),()=>{w.current=!1}},[r]),(0,K.useEffect)(()=>{if(r)return;let $=setTimeout(()=>s(re(e,t)),300);return()=>clearTimeout($)},[e,t,r]);let v=i?D(a).openNotebook:D(a).createNotebook;return(0,ze.jsx)("button",{type:"button",className:"n-rowaction","aria-label":v,title:v,disabled:h||!r,onClick:async $=>{if($.stopPropagation(),!(h||!r)){C(!0);try{let{notebook:k}=await Ee(e,r);l(!0),te({notebookId:k.id}),ue(e)}catch(k){console.warn("[dsh-notes] 建/开笔记本失败：",k&&k.message)}finally{C(!1)}}},children:(0,ze.jsx)(Q,{size:14})})}var Z=require("react");var fe=require("react/jsx-runtime");function yt(e){let{ctx:t,sessionId:a}=e||{},[n,r]=(0,Z.useState)(V()),[s,i]=(0,Z.useState)(null),[l,h]=(0,Z.useState)(()=>re(t,a)),[C,w]=(0,Z.useState)(!1);(0,Z.useEffect)(()=>G(r),[]),(0,Z.useEffect)(()=>{if(l)return;let k=null;try{let f=t&&typeof t.get=="function"?t.get("sessions"):null,O=f&&f.list;O&&typeof O.subscribe=="function"&&(k=O.subscribe(()=>{let U=re(t,a);U&&h(U)}))}catch{}let L=setTimeout(()=>h(re(t,a)),200);return()=>{clearTimeout(L),typeof k=="function"&&k()}},[t,a,l]),(0,Z.useEffect)(()=>{if(!l){i(null);return}let k=!1;return y.findWorkspace(l).then(L=>{k||i(L)}).catch(()=>{k||i(null)}),()=>{k=!0}},[l]);let v=D(n),I=!l||C,$=s?v.openNotebook:v.createNotebook;return(0,fe.jsxs)("button",{type:"button",className:"n-menu-item",role:"menuitem",disabled:I,title:l||v.noWorkspace,onClick:async k=>{if(k.preventDefault(),k.stopPropagation(),!(!l||C)){w(!0);try{if(s)te({workspacePath:l,notebookId:s.id});else{let L=await y.bindWorkspace({workspacePath:l,workspaceLabel:Pe(t,l),title:Pe(t,l)});i(L.notebook),te({workspacePath:l,notebookId:L.notebook.id})}try{t.layout.selectPanel("notes")}catch{}}catch(L){console.warn("[dsh-notes] 会话菜单建笔记本失败:",L)}finally{w(!1)}}},children:[(0,fe.jsx)(Q,{size:14}),(0,fe.jsx)("span",{children:$})]})}var Zt=`
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
    `,wt=!1;function vt(){if(wt||typeof document>"u")return;wt=!0;let e="dsh-notes-styles";if(document.getElementById(e))return;let t=document.createElement("style");t.id=e,t.textContent=Zt,document.head.append(t)}var le=require("react/jsx-runtime"),en=["slots"];function tn(e){console.info("[dsh-notes] build","2026-11-04T13:19:32.240Z"),vt(),Xe({react:Xt,"react/jsx-runtime":Yt,"react-dom":Qt,"react-dom/client":Gt});let t=!1,a=async()=>{if(Be()==="app")return;let s=Ne(e);if(!s){ie({cwd:null,title:"",hasNotebook:!1,ready:!0});return}let i=!1;try{i=!!await y.findWorkspace(s.path)}catch{i=!1}t||ie({cwd:s.path,title:s.title,hasNotebook:i,ready:!0})},n=pt(e,a);a();let r=setInterval(()=>{Be()!=="app"&&a()},3e3);e.effect(()=>()=>{t=!0,clearInterval(r),n()},"dsh-notes: entry state watcher"),e.slots.inject("sidebar.panellist",()=>{let s=null,i=()=>{s&&(s(),s=null);let h=ct(),C=h.ready?h.hasNotebook?D().openNotebook:D().createNotebook:D().panelLabel;s=e.slots.register({name:"sidebar.panellist",id:"notes",order:40,label:()=>C},Ge)},l=dt(i);return i(),()=>{l(),s&&s()}}),e.slots.inject("main",()=>e.slots.register({name:"main",key:"notes"},()=>(0,le.jsx)(Ie,{children:(0,le.jsx)(ft,{ctx:e})}))),e.slots.inject("sidebar.workspaces.session.menu.item",()=>e.slots.register({name:"sidebar.workspaces.session.menu.item",id:"notes",order:300},s=>(0,le.jsx)(yt,{ctx:e,sessionId:s&&s.sessionId}))),e.slots.inject("sidebar.workspaces.session.row.action",()=>e.slots.register({name:"sidebar.workspaces.session.row.action",id:"notes",order:100},s=>(0,le.jsx)(gt,{ctx:e,sessionId:s&&s.sessionId}))),e.inject(["slots","sidebarRightTabs"],s=>{let i=s.sidebarRightTabs,l=s.slots;i&&typeof i.register=="function"&&e.effect(()=>i.register({id:"dsh-notes",kind:"notes",title:()=>D().rightTab,guide:[{id:"all",order:20,title:()=>(ne(),D().label),description:()=>D().rightTabDesc}]}),"dsh-notes: right tab type"),l&&typeof l.inject=="function"&&e.effect(()=>l.inject("sidebar.right.pane.tab",()=>l.register({name:"sidebar.right.pane.tab",key:"dsh-notes"},h=>(0,le.jsx)(bt,{ctx:e,...h}))),"dsh-notes: right tab body")})}

    return module.exports
  }
})
