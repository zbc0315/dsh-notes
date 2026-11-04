/* 由 tools/build.mjs 从 src/client/index.js 生成 —— 请勿手改。
 * 重新生成：npm run build
 */
window.__ModuleLoader__.load({
  id: "@tom2012/dsh-notes",
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
    var Lt=Object.create;var ye=Object.defineProperty;var Ot=Object.getOwnPropertyDescriptor;var Rt=Object.getOwnPropertyNames;var $t=Object.getPrototypeOf,Wt=Object.prototype.hasOwnProperty;var At=(e,t)=>{for(var o in t)ye(e,o,{get:t[o],enumerable:!0})},Je=(e,t,o,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of Rt(t))!Wt.call(e,n)&&n!==o&&ye(e,n,{get:()=>t[n],enumerable:!(s=Ot(t,n))||s.enumerable});return e};var we=(e,t,o)=>(o=e!=null?Lt($t(e)):{},Je(t||!e||!e.__esModule?ye(o,"default",{value:e,enumerable:!0}):o,e)),Bt=e=>Je(ye({},"__esModule",{value:!0}),e);var rn={};At(rn,{apply:()=>nn,inject:()=>tn});module.exports=Bt(rn);var Yt=we(require("react")),Qt=we(require("react/jsx-runtime")),Gt=we(require("react-dom")),en=we(require("react-dom/client"));var f=require("react");var z="/-/notes";function Dt(e){return e===404?"接口不存在（宿主插件可能未加载）":e===403?"没有权限（宿主鉴权拒绝了请求）":e===409?"内容已在别处修改":e===413?"内容过大":e===503?"宿主服务不可用，请重启 dsh web":e>=500?"宿主内部错误":`HTTP ${e}`}async function K(e){let t=null;try{t=await e.json()}catch{t=null}if(!e.ok||t&&t.ok===!1){let o=new Error(t&&t.error||Dt(e.status));throw o.status=e.status,t&&t.current!==void 0&&(o.current=t.current),o}return t||{}}function Q(e){let t=[];for(let[o,s]of Object.entries(e||{}))s==null||s===""||t.push(`${encodeURIComponent(o)}=${encodeURIComponent(String(s))}`);return t.length?`?${t.join("&")}`:""}var y={base:z,async status(){return K(await fetch(`${z}/status`,{credentials:"same-origin"}))},async tree(){return K(await fetch(`${z}/tree`,{credentials:"same-origin"}))},async readPage(e){return(await K(await fetch(`${z}/page${Q({id:e})}`,{credentials:"same-origin"}))).page},async savePage({id:e,title:t,blocks:o,rev:s,baseMtimeMs:n,baseSize:r}){let i={title:t,rev:s,baseMtimeMs:n,baseSize:r};return Array.isArray(o)&&(i.blocks=o),K(await fetch(`${z}/page${Q({id:e})}`,{method:"PUT",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}))},async createPage({notebookId:e,title:t,blocks:o,markdown:s}){let n={notebookId:e,title:t};return Array.isArray(o)&&(n.blocks=o),typeof s=="string"&&(n.markdown=s),(await K(await fetch(`${z}/page`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}))).page},async deletePage(e){return K(await fetch(`${z}/page${Q({id:e})}`,{method:"DELETE",credentials:"same-origin"}))},async createNotebook({parentId:e=null,title:t,workspacePath:o=null,workspaceLabel:s=null}){return(await K(await fetch(`${z}/notebook`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({parentId:e,title:t,workspacePath:o,workspaceLabel:s})}))).notebook},async updateNotebook(e,t){return(await K(await fetch(`${z}/notebook${Q({id:e})}`,{method:"PATCH",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(t||{})}))).notebook},async deleteNotebook(e){return K(await fetch(`${z}/notebook${Q({id:e})}`,{method:"DELETE",credentials:"same-origin"}))},async findWorkspace(e){return(await K(await fetch(`${z}/workspace${Q({path:e})}`,{credentials:"same-origin"}))).notebook},async bindWorkspace({workspacePath:e,title:t,workspaceLabel:o}){return K(await fetch(`${z}/workspace`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({workspacePath:e,title:t,workspaceLabel:o})}))},async search(e,t=30){return(await K(await fetch(`${z}/search${Q({q:e,limit:t})}`,{credentials:"same-origin"}))).results||[]},async uploadAsset(e){let t=(e.name.split(".").pop()||"").toLowerCase(),o=await fetch(`${z}/asset`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":e.type||"application/octet-stream","x-notes-ext":t},body:e});return K(o)},exportUrl(e){return`${z}/export${Q({id:e})}`}};var k=require("react");var Ze="/-/notes/client",Qe={},se=null;function Ge(e){Object.assign(Qe,e||{})}function Xe(){return e=>{let t=Qe[e];if(t!==void 0)return t;throw new Error(`dsh-notes: 编辑器模块请求了未注册的依赖 ${e}`)}}function et(){return se||(se=new Promise((e,t)=>{if(typeof document>"u"){t(new Error("dsh-notes: 没有 document，无法加载编辑器"));return}let o="dsh-notes-editor-css";if(!document.getElementById(o)){let i=document.createElement("link");i.id=o,i.rel="stylesheet",i.href=`${Ze}/editor.css`,document.head.append(i)}let s="__DSH_NOTES_EDITOR_FACTORY__",n=window[s];if(typeof n=="function"){try{e(n(Xe()))}catch(i){t(Ye(i))}return}let r=document.createElement("script");r.src=`${Ze}/editor.js`,r.async=!0,r.onload=()=>{let i=window[s];if(typeof i!="function"){t(new Error("dsh-notes: 编辑器模块加载后没有注册工厂"));return}try{e(i(Xe()))}catch(c){t(Ye(c))}},r.onerror=()=>t(new Error("dsh-notes: 编辑器模块下载失败（/-/notes/client/editor.js）")),document.head.append(r)}),se.catch(()=>{se=null}),se)}function Ye(e){return e instanceof Error?e:new Error(String(e))}var b=require("react/jsx-runtime"),W={fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"};function Z(e,t){return(0,b.jsx)("svg",{viewBox:"0 0 24 24",width:e,height:e,"aria-hidden":"true",focusable:"false",fill:"none",children:t})}function G({size:e=16}){return Z(e,(0,b.jsx)(b.Fragment,{children:(0,b.jsx)("path",{d:"M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-6-3.5-6 3.5V5A1.5 1.5 0 0 1 6 3.5Z",...W})}))}function tt({size:e=16}){return Z(e,(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("path",{d:"M7 3.5h7.2L18.5 7.8V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z",...W}),(0,b.jsx)("path",{d:"M13.8 3.8V8h4.2",...W})]}))}function nt(){return(0,b.jsxs)("svg",{viewBox:"0 0 24 24",width:"20",height:"20","aria-hidden":"true",focusable:"false",fill:"none",children:[(0,b.jsx)("path",{d:"M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-6-3.5-6 3.5V5A1.5 1.5 0 0 1 6 3.5Z",...W}),(0,b.jsx)("path",{d:"M9.5 9h5M9.5 12.5h3",...W})]})}function Le({size:e=14}){return Z(e,(0,b.jsx)("path",{d:"M12 5.5v13M5.5 12h13",...W}))}function rt({size:e=12,open:t=!1}){return(0,b.jsx)("svg",{viewBox:"0 0 24 24",width:e,height:e,"aria-hidden":"true",focusable:"false",fill:"none",style:{transform:t?"rotate(90deg)":"none",transition:"transform 120ms ease"},children:(0,b.jsx)("path",{d:"M9 5.5 15.5 12 9 18.5",...W})})}function ot({size:e=14}){return Z(e,(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("circle",{cx:"11",cy:"11",r:"5.75",...W}),(0,b.jsx)("path",{d:"M15.4 15.4 19 19",...W})]}))}function Oe({size:e=14}){return Z(e,(0,b.jsx)(b.Fragment,{children:(0,b.jsx)("path",{d:"M4.5 7h15M10 4.5h4M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12",...W})}))}function ve({size:e=14}){return Z(e,(0,b.jsx)(b.Fragment,{children:(0,b.jsx)("path",{d:"M4.5 19.5h4L19 9a2 2 0 0 0 0-2.8l-1.2-1.2A2 2 0 0 0 15 5L4.5 15.5v4Z",...W})}))}function de({size:e=14}){return Z(e,(0,b.jsx)("path",{d:"M6 6l12 12M18 6 6 18",...W}))}function at({size:e=14}){return Z(e,(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("path",{d:"M12 3.5v11M8 10.5 12 14.5 16 10.5",...W}),(0,b.jsx)("path",{d:"M5 17v2a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-2",...W})]}))}function st({size:e=14}){return Z(e,(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("path",{d:"M6 3.5h9.2L19 7.3V18a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 18V6a2.5 2.5 0 0 1 1-2Z",...W}),(0,b.jsx)("path",{d:"M8.5 3.5v5h6M8.5 20.5v-6h7v6",...W})]}))}var ke=require("react");function Re(){return typeof document>"u"||!document.body?"light":document.body.hasAttribute("data-ds-dark-theme")?"dark":"light"}function it(){let[e,t]=(0,ke.useState)(Re);return(0,ke.useEffect)(()=>{if(typeof MutationObserver!="function"||typeof document>"u"||!document.body)return;let o=new MutationObserver(()=>t(Re()));return o.observe(document.body,{attributes:!0,attributeFilter:["data-ds-dark-theme","class"]}),t(Re()),()=>o.disconnect()},[]),e}var g=require("react/jsx-runtime"),zt=800,_t=16*1024*1024;function Ut(e){if(typeof e!="string"||!e.startsWith("asset://"))return e;let t=e.slice(8),o=t.lastIndexOf("."),s=o===-1?t:t.slice(0,o),n=o===-1?"png":t.slice(o+1);return`/-/notes/asset?sha=${encodeURIComponent(s)}&ext=${encodeURIComponent(n)}`}function lt({pageId:e,t,onChanged:o,onGone:s}){let[n,r]=(0,k.useState)(null),[i,c]=(0,k.useState)("idle"),[u,P]=(0,k.useState)("");return(0,k.useEffect)(()=>{if(!e){r(null),c("idle");return}let x=!1;return c("loading"),P(""),y.readPage(e).then(v=>{x||(r(v),c("ready"))}).catch(v=>{x||(P(String(v&&v.message||v)),c("error"),v&&v.status===404&&typeof s=="function"&&s())}),()=>{x=!0}},[e,s]),e?i==="loading"||i==="idle"?(0,g.jsx)("div",{className:"n-empty",children:t.loading}):i==="error"?(0,g.jsx)("div",{className:"n-empty",children:u}):n?(0,g.jsx)(Kt,{page:n,t,onSaved:o},n.id):(0,g.jsx)("div",{className:"n-empty",children:t.loading}):(0,g.jsx)("div",{className:"n-empty",children:t.noPage})}function jt({t:e}){return(0,g.jsxs)("div",{className:"n-editor-skeleton",role:"status","aria-live":"polite",children:[(0,g.jsx)("div",{className:"n-skel-line",style:{width:"38%",height:"18px"}}),(0,g.jsx)("div",{className:"n-skel-line",style:{width:"92%"}}),(0,g.jsx)("div",{className:"n-skel-line",style:{width:"86%"}}),(0,g.jsx)("div",{className:"n-skel-line",style:{width:"70%"}}),(0,g.jsx)("div",{className:"n-skel-hint",children:e.loading})]})}function Kt({page:e,t,onSaved:o}){let[s,n]=(0,k.useState)(null),[r,i]=(0,k.useState)(""),[c,u]=(0,k.useState)(e.title&&e.title!==t.untitled?e.title:""),[P,x]=(0,k.useState)("saved"),[v,T]=(0,k.useState)(null),[N,S]=(0,k.useState)(""),M=(0,k.useRef)({...e}),h=(0,k.useRef)(!1),L=(0,k.useRef)(null),R=(0,k.useRef)(!1),O=(0,k.useRef)(null),U=(0,k.useRef)(c),Y=(0,k.useRef)(t),F=(0,k.useRef)(o);U.current=c,Y.current=t,F.current=o,(0,k.useEffect)(()=>{let m=!1;return et().then(I=>{m||n(I)}).catch(I=>{m||i(String(I&&I.message||I))}),()=>{m=!0}},[]);let j=(0,k.useCallback)(async({force:m=!1,rev:I}={})=>{let q=O.current;if(!q||R.current||!h.current&&!m)return;let oe=M.current,le;try{le=JSON.parse(JSON.stringify(q.document))}catch(w){S(String(w&&w.message||w));return}R.current=!0,x("saving");try{let w=await y.savePage({id:oe.id,title:U.current.trim()||Y.current.untitled,blocks:le,rev:I===void 0?oe.rev:I,baseMtimeMs:oe.mtimeMs,baseSize:oe.size});if(M.current={...w.page},h.current=!1,x("saved"),T(null),w.conflictFile){let be=String(w.conflictFile).split(/[\\/]/).pop();S(`已保存；外部改动留档为 ${be}`)}typeof F.current=="function"&&F.current(w.page)}catch(w){w&&w.status===409?(T(w.current||null),x("error")):(x("error"),S(String(w&&w.message||w)))}finally{R.current=!1}},[]),B=(0,k.useCallback)(()=>{L.current&&clearTimeout(L.current),L.current=setTimeout(()=>{L.current=null,j()},zt)},[j]);(0,k.useEffect)(()=>()=>{L.current&&(clearTimeout(L.current),L.current=null),h.current&&j({force:!0}).catch(()=>{})},[j]),(0,k.useEffect)(()=>{let m=I=>{(I.metaKey||I.ctrlKey)&&!I.altKey&&String(I.key).toLowerCase()==="s"&&(I.preventDefault(),j({force:!0}))};return window.addEventListener("keydown",m,!0),()=>window.removeEventListener("keydown",m,!0)},[j]);let V=(0,k.useCallback)(async m=>{if(m&&m.size>_t)throw new Error(Y.current.imageTooLarge);let I=await y.uploadAsset(m);return`asset://${I.sha}.${I.ext}`},[]),me=(0,k.useCallback)(async m=>Ut(m),[]),ge=(0,k.useMemo)(()=>({initialContent:Array.isArray(e.blocks)&&e.blocks.length>0?e.blocks:void 0,uploadFile:V,resolveFileUrl:me}),[e.id]);return(0,g.jsxs)("div",{className:"n-main",children:[(0,g.jsxs)("div",{className:"n-topbar",children:[(0,g.jsx)("input",{className:"n-title-input",value:c,placeholder:t.untitled,"aria-label":t.title,onChange:m=>{u(m.target.value),h.current=!0,x("dirty"),B()},onBlur:()=>j()}),(0,g.jsx)("span",{className:`n-save-state${P==="error"?" is-error":""}`,role:"status","aria-live":"polite",children:P==="saving"?t.saving:P==="dirty"?t.unsaved:P==="error"?t.conflict:t.saved}),(0,g.jsx)("a",{className:"n-btn is-icon",href:y.exportUrl(e.id),download:!0,title:t.exportMd,"aria-label":t.exportMd,children:(0,g.jsx)(at,{})}),(0,g.jsx)("button",{type:"button",className:"n-btn is-icon",title:t.save,"aria-label":t.save,onClick:()=>j({force:!0}),children:(0,g.jsx)(st,{})})]}),v&&(0,g.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,g.jsxs)("span",{className:"n-banner-text",children:[(0,g.jsx)("b",{children:t.conflict})," — ",t.conflictBody]}),(0,g.jsx)("button",{type:"button",className:"n-btn",onClick:()=>{let m=v.rev;T(null),h.current=!0,j({force:!0,rev:m})},children:t.overwrite}),(0,g.jsx)("button",{type:"button",className:"n-btn",onClick:async()=>{T(null);try{let m=await y.readPage(M.current.id);M.current={...m},u(m.title===t.untitled?"":m.title);let I=O.current;I&&Array.isArray(m.blocks)&&I.replaceBlocks(I.document,m.blocks),h.current=!1,x("saved")}catch(m){S(String(m&&m.message||m))}},children:t.reload})]}),N&&(0,g.jsxs)("div",{className:"n-banner",role:"status",children:[(0,g.jsx)("span",{className:"n-banner-text",children:N}),(0,g.jsx)("button",{type:"button",className:"n-btn is-icon","aria-label":t.close,onClick:()=>S(""),children:(0,g.jsx)(de,{})})]}),(0,g.jsx)("div",{className:"n-editor-scroll",children:(0,g.jsxs)("div",{className:"n-editor",children:[r&&(0,g.jsx)("div",{className:"n-empty",children:r}),!s&&!r&&(0,g.jsx)(jt,{t}),s&&(0,g.jsx)(Ht,{runtime:s,options:ge,t,onReady:m=>{O.current=m},onChange:()=>{h.current=!0,x(m=>m==="saving"?m:"dirty"),B()}})]})})]})}function Ht({runtime:e,options:t,t:o,onReady:s,onChange:n}){let{useCreateBlockNote:r,BlockNoteView:i}=e,c=it(),u=r(t);return(0,k.useEffect)(()=>{u&&s(u)},[u,s]),u?(0,g.jsx)("div",{className:"n-blocknote",children:(0,g.jsx)(i,{editor:u,theme:c,onChange:n})}):null}var Ft={label:"全部笔记本",panelLabel:"笔记本",title:"全部笔记本",currentWorkspace:"当前工作区",noWorkspace:"未选择工作区",createNotebook:"新建笔记本",openNotebook:"打开笔记本",orphan:"游离",newPage:"新建页面",newChild:"新建子笔记本",rename:"重命名",delete:"删除",exportMd:"导出 Markdown",save:"保存",saved:"已保存",saving:"保存中…",unsaved:"未保存",conflict:"他处已修改",conflictBody:"这份笔记在别处被改过。覆盖会丢掉对方的改动。",overwrite:"覆盖",reload:"载入最新",empty:"还没有笔记本",emptyHint:"在左侧选中一个工作区，点「新建笔记本」开始。",noPage:"选一个页面开始编辑，或者新建一页。",untitled:"无标题",search:"搜索",searchPlaceholder:"搜索标题与正文…",searchEmpty:"没有命中",deleteNotebookConfirm:e=>`删除笔记本「${e}」？它和里面的页面都会进回收站。`,deletePageConfirm:e=>`删除页面「${e}」？会进回收站。`,renamePrompt:"新名字",loading:"载入中…",retry:"重试",unavailable:"笔记本服务不可用",unavailableHint:"宿主路由没有注册成功，请重启 dsh web 后刷新页面。",imageTooLarge:"图片太大（上限 16MB）",uploadFailed:"图片上传失败",chars:e=>`${e} 字`,more:"更多",noResults:"没有结果",notebook:"笔记本",page:"页面",rightTab:"笔记本",rightTabDesc:"浏览全部工作区的笔记本",rightEmptyHint:"点上面的「新建笔记本」开始。",close:"关闭"},Vt={label:"All notebooks",panelLabel:"Notebook",title:"All notebooks",currentWorkspace:"Current workspace",noWorkspace:"No workspace selected",createNotebook:"New notebook",openNotebook:"Open notebook",orphan:"Orphan",newPage:"New page",newChild:"New sub-notebook",rename:"Rename",delete:"Delete",exportMd:"Export markdown",save:"Save",saved:"Saved",saving:"Saving…",unsaved:"Unsaved",conflict:"Changed elsewhere",conflictBody:"This note changed on disk. Overwriting discards the other version.",overwrite:"Overwrite",reload:"Reload latest",empty:"No notebooks yet",emptyHint:"Pick a workspace on the left, then click “New notebook”.",noPage:"Pick a page to start writing, or create one.",untitled:"Untitled",search:"Search",searchPlaceholder:"Search titles and text…",searchEmpty:"Nothing matched",deleteNotebookConfirm:e=>`Delete notebook “${e}”? It and its pages go to the trash.`,deletePageConfirm:e=>`Delete page “${e}”? It goes to the trash.`,renamePrompt:"New name",loading:"Loading…",retry:"Retry",unavailable:"Notebook service unavailable",unavailableHint:"The host route did not register. Restart dsh web, then reload this page.",imageTooLarge:"Image too large (16MB limit)",uploadFailed:"Image upload failed",chars:e=>`${e} chars`,more:"More",noResults:"No results",notebook:"Notebook",page:"Page",rightTab:"Notebooks",rightTabDesc:"Browse notebooks from every workspace",rightEmptyHint:"Use “New notebook” above to get started.",close:"Close"};function J(){let e=typeof document<"u"&&document.documentElement.lang||"zh-CN";return String(e).toLowerCase().startsWith("zh")?"zh":"en"}function A(e){return(e||J())==="zh"?Ft:Vt}function ee(e){if(typeof MutationObserver!="function"||typeof document>"u")return()=>{};let t=new MutationObserver(o=>{for(let s of o)if(s.attributeName==="lang"){e(J());return}});return t.observe(document.documentElement,{attributes:!0,attributeFilter:["lang"]}),()=>t.disconnect()}var xe=null,$e=new Set;function ne(e){xe=Object.assign({at:Date.now()},e||{});for(let t of $e)try{t(xe)}catch{}}function We(){let e=xe;return xe=null,e}function ct(e){return $e.add(e),()=>$e.delete(e)}var Ne={cwd:null,title:"",hasNotebook:!1,ready:!1},Ae=new Set,dt=null;function pt(){return Ne}function ie(e){Ne={...Ne,...e};for(let t of Ae)try{t(Ne)}catch{}}function Be(e){dt=e}function De(){return dt}function ut(e){return Ae.add(e),()=>Ae.delete(e)}function pe(e,t){if(!e||!t)return!1;let o=ze(String(e)),s=ze(String(t));return o===s||o===`/private${s}`||s===`/private${o}`}function _e(e){if(!e)return"";let t=ze(String(e));return t.startsWith("/private/")?t.slice(8):t}function ze(e){return e.length>1&&e.endsWith("/")?e.slice(0,-1):e}var Ce=require("react");function qt(e){try{let t=e.get&&e.get("uiSession"),o=t&&(t.current||t.adapter?.current)||null,s=o&&typeof o.getSnapshot=="function"?o.getSnapshot():null;if(s&&typeof s.key=="string")return s.key}catch{}try{let t=e.get&&e.get("sessions"),o=t&&t.list&&t.list.getSnapshot();if(o&&o.byId){let s=Object.values(o.byId).find(n=>(n.retainedBy?.mainView??0)>0);if(s&&s.id)return s.id}}catch{}}function Jt(e,t){if(!t)return null;let o="";try{let s=e.get&&e.get("workspaces"),n=s&&s.list&&s.list.getSnapshot(),i=(n&&n.items||[]).find(c=>c.path===t);i&&(o=i.title||i.displayTitle||"")}catch{}if(!o){let s=String(t).split(/[\\/]/).filter(Boolean);o=s.length?s[s.length-1]:t}return{path:t,title:o}}function Se(e){let t=qt(e);if(!t)return null;try{let o=e.get&&e.get("sessions"),s=o&&o.list&&o.list.getSnapshot(),n=s&&s.byId&&s.byId[t];return n?Jt(e,n.cwd):null}catch{return null}}function Pe(e){let[t,o]=(0,Ce.useState)(()=>Se(e));return(0,Ce.useEffect)(()=>{let s=()=>o(Se(e)),n=[],r=(c,u)=>{try{let P=u(c);P&&typeof P.subscribe=="function"&&n.push(P.subscribe(s)||(()=>{}))}catch{}},i=e.get&&e.get("uiSession");try{let c=i&&(i.current||i.adapter?.current)||null;c&&typeof c.subscribe=="function"&&n.push(c.subscribe(s)||(()=>{}))}catch{}try{let c=e.get&&e.get("sessions");r(c,u=>u.list)}catch{}try{let c=e.get&&e.get("workspaces");r(c,u=>u.list)}catch{}return s(),()=>{for(let c of n)try{c()}catch{}}},[e]),t}function ft(e,t){let o=[],s=()=>{try{t()}catch{}},n=(r,i)=>{try{r&&typeof r.subscribe=="function"&&o.push(r.subscribe(s)||(()=>{}))}catch{}};try{let r=e.get&&e.get("uiSession"),i=r&&(r.current||r.adapter?.current)||null;i&&typeof i.subscribe=="function"&&o.push(i.subscribe(s)||(()=>{}))}catch{}try{let r=e.get&&e.get("sessions");n(r&&r.list)}catch{}try{let r=e.get&&e.get("workspaces");n(r&&r.list)}catch{}return()=>{for(let r of o)try{r()}catch{}}}var l=require("react/jsx-runtime");function Zt(e){let t=Array.isArray(e?.notebooks)?e.notebooks:[],o=Array.isArray(e?.pages)?e.pages:[],s=new Map(t.map(i=>[i.id,i])),n=new Map;for(let i of t){let c=i.parentId&&s.has(i.parentId)?i.parentId:null;n.has(c)||n.set(c,[]),n.get(c).push(i)}for(let i of n.values())i.sort((c,u)=>(c.order??0)-(u.order??0)||c.title.localeCompare(u.title));let r=new Map;for(let i of o)r.has(i.notebookId)||r.set(i.notebookId,[]),r.get(i.notebookId).push(i);for(let i of r.values())i.sort((c,u)=>(c.order??0)-(u.order??0)||(u.updatedAt??0)-(c.updatedAt??0));return{byId:s,children:n,pagesOf:r,root:n.get(null)||[],notebookCount:t.length}}function ht({value:e,onChange:t,onCommit:o,onCancel:s}){let n=(0,f.useRef)(null);return(0,f.useEffect)(()=>{n.current?.focus(),n.current?.select()},[]),(0,l.jsx)("input",{ref:n,className:"n-title-input",style:{height:"22px",fontSize:"13px",fontWeight:500},value:e,onChange:r=>t(r.target.value),onBlur:o,onKeyDown:r=>{r.key==="Enter"?(r.preventDefault(),o()):r.key==="Escape"&&(r.preventDefault(),s())}})}function Ue({ctx:e,autoCreate:t=!0}){let[o,s]=(0,f.useState)(J());(0,f.useEffect)(()=>ee(s),[]);let n=(0,f.useMemo)(()=>A(o),[o]),r=Pe(e),[i,c]=(0,f.useState)({notebooks:[],pages:[]}),[u,P]=(0,f.useState)(!0),[x,v]=(0,f.useState)(""),[T,N]=(0,f.useState)(null),[S,M]=(0,f.useState)(()=>new Set),[h,L]=(0,f.useState)(""),[R,O]=(0,f.useState)(null),[U,Y]=(0,f.useState)(null),[F,j]=(0,f.useState)(null),[B,V]=(0,f.useState)(null),[me,ge]=(0,f.useState)(!1),m=(0,f.useRef)(null),I=(0,f.useRef)(!0);(0,f.useEffect)(()=>(I.current=!0,Be("app"),()=>{I.current=!1,Be(null)}),[]);let q=(0,f.useMemo)(()=>Zt(i),[i]);(0,f.useEffect)(()=>{if(u||!r||!r.path)return;let a=(i.notebooks||[]).some(d=>pe(d.workspacePath,r.path));ie({cwd:r.path,title:r.title,hasNotebook:a,ready:!0})},[u,i,r]);let oe=(0,f.useMemo)(()=>{let a=new Set;try{let d=e&&typeof e.get=="function"?e.get("workspaces"):null,p=d&&d.list&&d.list.getSnapshot();for(let $ of p&&p.items||[])$.path&&a.add(_e($.path))}catch{}return a},[e,i]),le=(0,f.useMemo)(()=>{if(!T)return null;let a=(i.pages||[]).find(d=>d.id===T);return a?a.notebookId:null},[T,i]),w=(0,f.useCallback)(async()=>{v("");try{let a=await y.tree();return c({notebooks:a.notebooks||[],pages:a.pages||[]}),P(!1),a}catch(a){return P(!1),v(String(a&&a.message||a)),null}},[]);(0,f.useEffect)(()=>{w()},[w]);let be=(0,f.useRef)(!1);(0,f.useEffect)(()=>{u||be.current||!r||!r.path||t&&(be.current=!0,(async()=>{try{if(await y.findWorkspace(r.path))return;let d=await y.createNotebook({title:r.title,workspacePath:r.path,workspaceLabel:r.title});if(!I.current)return;let p=await y.tree();if(!I.current)return;c({notebooks:p.notebooks||[],pages:p.pages||[]}),M($=>new Set($).add(d.id)),ie({cwd:r.path,title:r.title,hasNotebook:!0,ready:!0})}catch{}})())},[u,r&&r.path,t]);let Te=(0,f.useCallback)(async a=>{if(!a)return;let d=await w(),p=a.notebookId||null;if(!p&&a.workspacePath)try{let E=await y.findWorkspace(a.workspacePath);p=E?E.id:null}catch{p=null}if(!p)return;if(M(E=>new Set(E).add(p)),a.pageId){N(a.pageId);return}let $=(d&&d.pages||[]).filter(E=>E.notebookId===p);if($.length>0){N($[0].id);return}try{let E=await y.createPage({notebookId:p,title:n.untitled});await w(),N(E.id)}catch(E){v(String(E&&E.message||E))}},[w,n]);(0,f.useEffect)(()=>{let a=We();return a&&Te(a),ct(p=>{We(),Te(p)})},[Te]),(0,f.useEffect)(()=>{let a=r?.path;if(!a){Y(null);return}let d=!1;return y.findWorkspace(a).then(p=>{d||Y(p)}).catch(()=>{d||Y(null)}),()=>{d=!0}},[r?.path,i]),(0,f.useEffect)(()=>{let a=h.trim();if(!a){O(null);return}let d=!1,p=setTimeout(()=>{y.search(a,30).then($=>{d||O($)}).catch(()=>{d||O([])})},200);return()=>{d=!0,clearTimeout(p)}},[h]);let ae=(0,f.useCallback)(async a=>{ge(!0);try{return await a()}finally{ge(!1)}},[]),Ke=(0,f.useCallback)(async()=>{if(!r?.path)return null;if(U)return U;let a=await y.bindWorkspace({workspacePath:r.path,workspaceLabel:r.title,title:r.title});return Y(a.notebook),a.notebook},[r,U]),Me=(0,f.useCallback)(async a=>{if(!a)return;M(p=>new Set(p).add(a.id));let d=(q.pagesOf.get(a.id)||[])[0];d?N(d.id):await ce(a.id)},[q]),ce=(0,f.useCallback)(async a=>{let d=a||le||U&&U.id;d&&await ae(async()=>{try{let p=await y.createPage({notebookId:d,title:n.untitled});M($=>new Set($).add(d)),await w(),N(p.id)}catch(p){v(String(p&&p.message||p))}})},[le,U,w,n,ae]),xt=(0,f.useCallback)(async(a=null)=>{await ae(async()=>{try{let d=await y.createNotebook({parentId:a,title:n.notebook});await w(),a&&M(p=>new Set(p).add(a)),V({kind:"notebook",id:d.id,value:d.title})}catch(d){v(String(d&&d.message||d))}})},[w,n,ae]),Nt=(0,f.useCallback)(async()=>{await ae(async()=>{try{let a=await Ke();await w(),await Me(a)}catch(a){v(String(a&&a.message||a))}})},[Ke,w,Me,ae]),He=(0,f.useCallback)(async()=>{let a=B;if(V(null),!a)return;let d=a.value.trim();if(d)try{if(a.kind==="notebook")await y.updateNotebook(a.id,{title:d});else{let p=await y.readPage(a.id);await y.savePage({id:p.id,title:d,rev:p.rev,baseMtimeMs:p.mtimeMs,baseSize:p.size})}await w()}catch(p){v(String(p&&p.message||p))}},[B,w]),St=(0,f.useCallback)(async()=>{let a=F;if(j(null),!!a)try{a.kind==="page"?(await y.deletePage(a.id),T===a.id&&N(null)):await y.deleteNotebook(a.id),await w()}catch(d){v(String(d&&d.message||d))}},[F,T,w]),Fe=(0,f.useCallback)(a=>{M(d=>{let p=new Set(d);return p.has(a)?p.delete(a):p.add(a),p})},[]);(0,f.useEffect)(()=>{let a=d=>{let p=d.metaKey||d.ctrlKey;p&&d.key.toLowerCase()==="p"?(d.preventDefault(),m.current?.focus(),m.current?.select?.()):p&&d.shiftKey&&d.key.toLowerCase()==="n"?(d.preventDefault(),ce()):d.key==="Escape"&&document.activeElement===m.current&&L("")};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[ce]);let Ct=(a,d)=>(q.pagesOf.get(a)||[]).map(p=>{let $=B&&B.kind==="page"&&B.id===p.id;return(0,l.jsxs)("div",{className:`n-row${T===p.id?" is-active":""}`,style:{paddingLeft:`${8+d*12+16}px`},role:"treeitem","aria-selected":T===p.id?"true":"false",tabIndex:0,onClick:()=>N(p.id),onKeyDown:E=>{(E.key==="Enter"||E.key===" ")&&(E.preventDefault(),N(p.id))},children:[(0,l.jsx)(tt,{}),$?(0,l.jsx)(ht,{value:B.value,onChange:E=>V({...B,value:E}),onCommit:He,onCancel:()=>V(null)}):(0,l.jsx)("span",{className:"n-row-title",children:p.title||n.untitled}),(0,l.jsxs)("span",{className:"n-row-actions",children:[(0,l.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.rename,"aria-label":n.rename,onClick:E=>{E.stopPropagation(),V({kind:"page",id:p.id,value:p.title||""})},children:(0,l.jsx)(ve,{})}),(0,l.jsx)("button",{type:"button",className:"n-btn is-icon is-danger",title:n.delete,"aria-label":n.delete,onClick:E=>{E.stopPropagation(),j({kind:"page",id:p.id,title:p.title||n.untitled})},children:(0,l.jsx)(Oe,{})})]})]},p.id)}),Ve=(a,d)=>{let p=S.has(a.id),$=q.children.get(a.id)||[],E=q.pagesOf.get(a.id)||[],qe=$.length>0||E.length>0,Et=B&&B.kind==="notebook"&&B.id===a.id,Tt=a.workspacePath&&r?.path&&pe(a.workspacePath,r.path),Mt=!a.workspacePath||oe.has(_e(a.workspacePath));return(0,l.jsxs)("div",{children:[(0,l.jsxs)("div",{className:"n-row is-notebook",style:{paddingLeft:`${8+d*12}px`},role:"treeitem","aria-expanded":p?"true":"false",tabIndex:0,onClick:()=>Fe(a.id),onKeyDown:D=>{(D.key==="Enter"||D.key===" ")&&(D.preventDefault(),Fe(a.id))},title:a.workspacePath||a.title,children:[(0,l.jsx)("span",{className:`n-twist${qe?"":" is-leaf"}`,"aria-hidden":"true",children:(0,l.jsx)(rt,{open:p})}),(0,l.jsx)(G,{}),Et?(0,l.jsx)(ht,{value:B.value,onChange:D=>V({...B,value:D}),onCommit:He,onCancel:()=>V(null)}):(0,l.jsx)("span",{className:"n-row-title",children:a.title}),Tt&&(0,l.jsx)("span",{className:"n-row-badge",children:n.currentWorkspace}),a.workspacePath&&!Mt&&(0,l.jsx)("span",{className:"n-row-badge",children:n.orphan}),(0,l.jsxs)("span",{className:"n-row-actions",children:[(0,l.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.newPage,"aria-label":n.newPage,onClick:D=>{D.stopPropagation(),ce(a.id)},children:(0,l.jsx)(Le,{})}),(0,l.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.newChild,"aria-label":n.newChild,onClick:D=>{D.stopPropagation(),xt(a.id)},children:(0,l.jsx)(G,{size:12})}),(0,l.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.rename,"aria-label":n.rename,onClick:D=>{D.stopPropagation(),V({kind:"notebook",id:a.id,value:a.title})},children:(0,l.jsx)(ve,{})}),(0,l.jsx)("button",{type:"button",className:"n-btn is-icon is-danger",title:n.delete,"aria-label":n.delete,onClick:D=>{D.stopPropagation(),j({kind:"notebook",id:a.id,title:a.title})},children:(0,l.jsx)(Oe,{})})]})]}),p&&(0,l.jsxs)("div",{role:"group",children:[$.map(D=>Ve(D,d+1)),Ct(a.id,d),!qe&&(0,l.jsx)("div",{className:"n-row",style:{paddingLeft:`${8+(d+1)*12+16}px`,color:"var(--dsw-alias-label-tertiary)"},children:(0,l.jsx)("span",{className:"n-row-title",children:n.noPage})})]})]},a.id)},Pt=r?r.title:n.noWorkspace,It=!!r?.path;return(0,l.jsxs)("div",{className:"n-app",children:[(0,l.jsxs)("aside",{className:"n-side",children:[(0,l.jsxs)("div",{className:"n-wsbar",children:[(0,l.jsx)("span",{className:"n-wsbar-label",children:n.currentWorkspace}),(0,l.jsxs)("span",{className:"n-wsbar-name",title:r?.path||"",children:[(0,l.jsx)(G,{}),(0,l.jsx)("b",{children:Pt})]}),(0,l.jsxs)("span",{className:"n-wsbar-actions",children:[(0,l.jsxs)("button",{type:"button",className:"n-btn",disabled:!It||me,onClick:()=>U?Me(U):Nt(),children:[(0,l.jsx)(Le,{}),U?n.openNotebook:n.createNotebook]}),(0,l.jsx)("button",{type:"button",className:"n-btn",disabled:me,title:n.newPage,"aria-label":n.newPage,onClick:()=>ce(),children:(0,l.jsx)(ve,{})})]})]}),(0,l.jsxs)("div",{className:"n-search",children:[(0,l.jsx)(ot,{}),(0,l.jsx)("input",{ref:m,type:"search",value:h,placeholder:n.searchPlaceholder,"aria-label":n.search,onChange:a=>L(a.target.value)}),h&&(0,l.jsx)("button",{type:"button",className:"n-btn is-icon","aria-label":n.delete,onClick:()=>L(""),children:(0,l.jsx)(de,{size:12})})]}),x&&(0,l.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,l.jsx)("span",{className:"n-banner-text",children:x}),(0,l.jsx)("button",{type:"button",className:"n-btn",onClick:w,children:n.retry})]}),F&&(0,l.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,l.jsx)("span",{className:"n-banner-text",children:F.kind==="notebook"?n.deleteNotebookConfirm(F.title):n.deletePageConfirm(F.title)}),(0,l.jsx)("button",{type:"button",className:"n-btn is-danger",onClick:St,children:n.delete}),(0,l.jsx)("button",{type:"button",className:"n-btn",onClick:()=>j(null),children:(0,l.jsx)(de,{size:12})})]}),(0,l.jsxs)("div",{className:"n-tree",role:"tree","aria-label":n.title,children:[u&&(0,l.jsx)("div",{className:"n-tree-empty",children:n.loading}),!u&&R&&(0,l.jsxs)(l.Fragment,{children:[R.length===0&&(0,l.jsx)("div",{className:"n-tree-empty",children:n.noResults}),R.map(a=>(0,l.jsxs)("div",{className:"n-hit",role:"button",tabIndex:0,onClick:()=>{N(a.id),L("")},onKeyDown:d=>{d.key==="Enter"&&(N(a.id),L(""))},children:[(0,l.jsx)("div",{className:"n-hit-title",children:a.title||n.untitled}),a.snippet&&(0,l.jsx)("div",{className:"n-hit-snippet",children:a.snippet})]},a.id))]}),!u&&!R&&q.notebookCount===0&&(0,l.jsxs)("div",{className:"n-tree-empty",children:[(0,l.jsx)("b",{children:n.empty}),(0,l.jsx)("div",{children:n.emptyHint})]}),!u&&!R&&q.root.map(a=>Ve(a,0))]})]}),(0,l.jsx)(lt,{pageId:T,t:n,onChanged:()=>{w()},onGone:()=>{N(null),w()}})]})}var mt=require("react"),gt=require("react/jsx-runtime"),ue=class extends mt.Component{constructor(t){super(t),this.state={error:null}}static getDerivedStateFromError(t){return{error:t}}componentDidCatch(t,o){console.error("[dsh-notes] app crashed:",t&&t.message,`
    `,o&&o.componentStack)}render(){return this.state.error?(0,gt.jsxs)("div",{className:"n-empty",children:["笔记本渲染失败：",String(this.state.error&&this.state.error.message||this.state.error)]}):this.props.children}};var _=require("react");function re(e,t){if(!e||typeof e.get!="function")return null;try{let o=e.get("sessions"),s=o&&o.list&&o.list.getSnapshot(),n=s&&s.byId&&s.byId[t],r=n&&n.cwd;return typeof r=="string"&&r?r:null}catch{return null}}function Ie(e,t){try{let s=e&&typeof e.get=="function"?e.get("workspaces"):null,n=s&&s.list&&s.list.getSnapshot(),i=(n&&n.items||[]).find(c=>c.path===t);if(i&&(i.title||i.displayTitle))return i.title||i.displayTitle}catch{}let o=String(t||"").split(/[\\/]/).filter(Boolean);return o.length?o[o.length-1]:String(t||"")}async function Ee(e,t){let o=await y.findWorkspace(t);if(o)return{notebook:o,created:!1};let s=Ie(e,t);return{notebook:await y.createNotebook({title:s,workspacePath:t,workspaceLabel:s}),created:!0}}function fe(e,t="notes"){try{let o=e&&typeof e.get=="function"?e.get("layout"):null;if(o&&typeof o.selectPanel=="function"){o.selectPanel(t);return}console.warn("[dsh-notes] layout 服务不可用，无法切主面板")}catch(o){console.warn("[dsh-notes] selectPanel(notes) 失败：",o&&o.message||o)}}var C=require("react/jsx-runtime");function bt({ctx:e}){let[t,o]=(0,_.useState)(J());(0,_.useEffect)(()=>ee(o),[]);let s=(0,_.useMemo)(()=>A(t),[t]),n=Pe(e),[r,i]=(0,_.useState)(null),[c,u]=(0,_.useState)(""),[P,x]=(0,_.useState)(!1),v=(0,_.useCallback)(async()=>{x(!0),u("");try{let h=await y.tree();i({notebooks:h.notebooks||[],pages:h.pages||[]})}catch(h){u(String(h&&h.message||h))}finally{x(!1)}},[]);(0,_.useEffect)(()=>{v()},[v]),(0,_.useEffect)(()=>{fe(e,"notes-all")},[]);let T=(0,_.useMemo)(()=>{let h=r&&r.notebooks||[],L=r&&r.pages||[],R=new Map;for(let O of L)R.set(O.notebookId,(R.get(O.notebookId)||0)+1);return h.filter(O=>O.parentId===null||O.parentId===void 0).sort((O,U)=>(O.order||0)-(U.order||0)).map(O=>({...O,pageCount:R.get(O.id)||0}))},[r]),N=h=>{ne({notebookId:h}),fe(e,"notes-all")},S=(0,_.useMemo)(()=>!n||!T.length?null:T.find(h=>pe(h.workspacePath,n.path))||null,[T,n]),M=async()=>{if(!(!n||P)){x(!0),u("");try{if(S)N(S.id);else{let{notebook:h}=await Ee(e,n.path);await v(),N(h.id)}}catch(h){u(String(h&&h.message||h))}finally{x(!1)}}};return(0,C.jsxs)("div",{className:"n-right",children:[(0,C.jsxs)("div",{className:"n-right-head",children:[(0,C.jsx)("span",{className:"n-right-title",children:s.label}),(0,C.jsx)("button",{type:"button",className:"n-right-refresh",onClick:v,disabled:P,"aria-label":s.retry,title:s.retry,children:"⟳"})]}),(0,C.jsx)("div",{className:"n-right-ws",children:n?(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)("span",{className:"n-right-ws-name",title:n.path,children:n.title}),(0,C.jsx)("button",{type:"button",className:"n-right-action n-right-ws-btn",onClick:M,disabled:P,children:S?s.openNotebook:s.createNotebook})]}):(0,C.jsx)("span",{className:"n-right-ws-name",children:s.noWorkspace})}),c?(0,C.jsxs)("div",{className:"n-right-empty",children:[(0,C.jsx)("div",{children:s.unavailable}),(0,C.jsx)("div",{className:"n-right-hint",children:c}),(0,C.jsx)("button",{type:"button",className:"n-right-action",onClick:v,children:s.retry})]}):r?T.length===0?(0,C.jsxs)("div",{className:"n-right-empty",children:[(0,C.jsx)("div",{children:s.empty}),(0,C.jsx)("div",{className:"n-right-hint",children:s.rightEmptyHint})]}):(0,C.jsx)("div",{className:"n-right-list",role:"list",children:T.map(h=>(0,C.jsxs)("button",{type:"button",role:"listitem",className:"n-right-row",onClick:()=>N(h.id),title:h.workspacePath||h.title,children:[(0,C.jsxs)("span",{className:"n-right-row-main",children:[(0,C.jsx)("span",{className:"n-right-row-title",children:h.title}),(0,C.jsxs)("span",{className:"n-right-row-meta",children:[h.pageCount," ",s.page]})]}),(0,C.jsx)("span",{className:"n-right-arrow","aria-hidden":"true",children:"→"})]},h.id))}):(0,C.jsx)("div",{className:"n-right-empty",children:s.loading})]})}var H=require("react");var je=require("react/jsx-runtime");function yt({ctx:e,sessionId:t}){let[o,s]=(0,H.useState)(J()),[n,r]=(0,H.useState)(()=>re(e,t)),[i,c]=(0,H.useState)(null),[u,P]=(0,H.useState)(!1),x=(0,H.useRef)(!0);(0,H.useEffect)(()=>ee(s),[]),(0,H.useEffect)(()=>{if(x.current=!0,!!n)return y.findWorkspace(n).then(N=>{x.current&&c(N!=null)}).catch(()=>{x.current&&c(null)}),()=>{x.current=!1}},[n]),(0,H.useEffect)(()=>{if(n)return;let N=setTimeout(()=>r(re(e,t)),300);return()=>clearTimeout(N)},[e,t,n]);let v=i?A(o).openNotebook:A(o).createNotebook;return(0,je.jsx)("button",{type:"button",className:"n-rowaction","aria-label":v,title:v,disabled:u||!n,onClick:async N=>{if(N.stopPropagation(),!(u||!n)){P(!0);try{let{notebook:S}=await Ee(e,n);c(!0),ne({notebookId:S.id}),fe(e)}catch(S){console.warn("[dsh-notes] 建/开笔记本失败：",S&&S.message)}finally{P(!1)}}},children:(0,je.jsx)(G,{size:14})})}var X=require("react");var he=require("react/jsx-runtime");function wt(e){let{ctx:t,sessionId:o}=e||{},[s,n]=(0,X.useState)(J()),[r,i]=(0,X.useState)(null),[c,u]=(0,X.useState)(()=>re(t,o)),[P,x]=(0,X.useState)(!1);(0,X.useEffect)(()=>ee(n),[]),(0,X.useEffect)(()=>{if(c)return;let S=null;try{let h=t&&typeof t.get=="function"?t.get("sessions"):null,L=h&&h.list;L&&typeof L.subscribe=="function"&&(S=L.subscribe(()=>{let R=re(t,o);R&&u(R)}))}catch{}let M=setTimeout(()=>u(re(t,o)),200);return()=>{clearTimeout(M),typeof S=="function"&&S()}},[t,o,c]),(0,X.useEffect)(()=>{if(!c){i(null);return}let S=!1;return y.findWorkspace(c).then(M=>{S||i(M)}).catch(()=>{S||i(null)}),()=>{S=!0}},[c]);let v=A(s),T=!c||P,N=r?v.openNotebook:v.createNotebook;return(0,he.jsxs)("button",{type:"button",className:"n-menu-item",role:"menuitem",disabled:T,title:c||v.noWorkspace,onClick:async S=>{if(S.preventDefault(),S.stopPropagation(),!(!c||P)){x(!0);try{if(r)ne({workspacePath:c,notebookId:r.id});else{let M=await y.bindWorkspace({workspacePath:c,workspaceLabel:Ie(t,c),title:Ie(t,c)});i(M.notebook),ne({workspacePath:c,notebookId:M.notebook.id})}try{t.layout.selectPanel("notes")}catch{}}catch(M){console.warn("[dsh-notes] 会话菜单建笔记本失败:",M)}finally{x(!1)}}},children:[(0,he.jsx)(G,{size:14}),(0,he.jsx)("span",{children:N})]})}var Xt=`
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
    `,vt=!1;function kt(){if(vt||typeof document>"u")return;vt=!0;let e="dsh-notes-styles";if(document.getElementById(e))return;let t=document.createElement("style");t.id=e,t.textContent=Xt,document.head.append(t)}var te=require("react/jsx-runtime"),tn=["slots"];function nn(e){console.info("[dsh-notes] build","2026-11-04T15:06:28.029Z"),kt(),Ge({react:Yt,"react/jsx-runtime":Qt,"react-dom":Gt,"react-dom/client":en});let t=!1,o=async()=>{if(De()==="app")return;let r=Se(e);if(!r){ie({cwd:null,title:"",hasNotebook:!1,ready:!0});return}let i=!1;try{i=!!await y.findWorkspace(r.path)}catch{i=!1}t||ie({cwd:r.path,title:r.title,hasNotebook:i,ready:!0})},s=ft(e,o);o();let n=setInterval(()=>{De()!=="app"&&o()},3e3);e.effect(()=>()=>{t=!0,clearInterval(n),s()},"dsh-notes: entry state watcher"),e.slots.inject("sidebar.panellist",()=>{let r=null,i=()=>{r&&(r(),r=null);let u=pt(),P=u.ready?u.hasNotebook?A().openNotebook:A().createNotebook:A().panelLabel;r=e.slots.register({name:"sidebar.panellist",id:"notes",order:40,label:()=>P},nt)},c=ut(i);return i(),()=>{c(),r&&r()}}),e.slots.inject("main",()=>{e.slots.register({name:"main",key:"notes"},()=>(0,te.jsx)(ue,{children:(0,te.jsx)(Ue,{ctx:e,autoCreate:!0})})),e.slots.register({name:"main",key:"notes-all"},()=>(0,te.jsx)(ue,{children:(0,te.jsx)(Ue,{ctx:e,autoCreate:!1})}))}),e.slots.inject("sidebar.workspaces.session.menu.item",()=>e.slots.register({name:"sidebar.workspaces.session.menu.item",id:"notes",order:300},r=>(0,te.jsx)(wt,{ctx:e,sessionId:r&&r.sessionId}))),e.slots.inject("sidebar.workspaces.session.row.action",()=>e.slots.register({name:"sidebar.workspaces.session.row.action",id:"notes",order:100},r=>(0,te.jsx)(yt,{ctx:e,sessionId:r&&r.sessionId}))),e.inject(["slots","sidebarRightTabs"],r=>{let i=r.sidebarRightTabs,c=r.slots;i&&typeof i.register=="function"&&e.effect(()=>i.register({id:"dsh-notes",kind:"notes",title:()=>A().rightTab,guide:[{id:"all",order:20,title:()=>A().label,description:()=>A().rightTabDesc}]}),"dsh-notes: right tab type"),c&&typeof c.inject=="function"&&e.effect(()=>c.inject("sidebar.right.pane.tab",()=>c.register({name:"sidebar.right.pane.tab",key:"dsh-notes"},u=>(0,te.jsx)(bt,{ctx:e,...u}))),"dsh-notes: right tab body")})}

    return module.exports
  }
})
