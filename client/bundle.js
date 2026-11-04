/* 由 tools/build.mjs 从 src/client/index.js 生成 —— 请勿手改。
 * 重新生成：npm run build
 */
window.__ModuleLoader__.load({
  id: "@tom2012/dsh-notes",
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
    var ot=Object.create;var de=Object.defineProperty;var st=Object.getOwnPropertyDescriptor;var it=Object.getOwnPropertyNames;var lt=Object.getPrototypeOf,ct=Object.prototype.hasOwnProperty;var dt=(e,t)=>{for(var a in t)de(e,a,{get:t[a],enumerable:!0})},Ee=(e,t,a,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of it(t))!ct.call(e,o)&&o!==a&&de(e,o,{get:()=>t[o],enumerable:!(n=st(t,o))||n.enumerable});return e};var pe=(e,t,a)=>(a=e!=null?ot(lt(e)):{},Ee(t||!e||!e.__esModule?de(a,"default",{value:e,enumerable:!0}):a,e)),pt=e=>Ee(de({},"__esModule",{value:!0}),e);var Rt={};dt(Rt,{apply:()=>Tt,inject:()=>Mt});module.exports=pt(Rt);var St=pe(require("react")),It=pe(require("react/jsx-runtime")),Pt=pe(require("react-dom")),Et=pe(require("react-dom/client"));var f=require("react");var A="/-/notes";function ut(e){return e===404?"接口不存在（宿主插件可能未加载）":e===403?"没有权限（宿主鉴权拒绝了请求）":e===409?"内容已在别处修改":e===413?"内容过大":e===503?"宿主服务不可用，请重启 dsh web":e>=500?"宿主内部错误":`HTTP ${e}`}async function z(e){let t=null;try{t=await e.json()}catch{t=null}if(!e.ok||t&&t.ok===!1){let a=new Error(t&&t.error||ut(e.status));throw a.status=e.status,t&&t.current!==void 0&&(a.current=t.current),a}return t||{}}function X(e){let t=[];for(let[a,n]of Object.entries(e||{}))n==null||n===""||t.push(`${encodeURIComponent(a)}=${encodeURIComponent(String(n))}`);return t.length?`?${t.join("&")}`:""}var N={base:A,async status(){return z(await fetch(`${A}/status`,{credentials:"same-origin"}))},async tree(){return z(await fetch(`${A}/tree`,{credentials:"same-origin"}))},async readPage(e){return(await z(await fetch(`${A}/page${X({id:e})}`,{credentials:"same-origin"}))).page},async savePage({id:e,title:t,blocks:a,rev:n,baseMtimeMs:o,baseSize:p}){let i={title:t,rev:n,baseMtimeMs:o,baseSize:p};return Array.isArray(a)&&(i.blocks=a),z(await fetch(`${A}/page${X({id:e})}`,{method:"PUT",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}))},async createPage({notebookId:e,title:t,blocks:a,markdown:n}){let o={notebookId:e,title:t};return Array.isArray(a)&&(o.blocks=a),typeof n=="string"&&(o.markdown=n),(await z(await fetch(`${A}/page`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}))).page},async deletePage(e){return z(await fetch(`${A}/page${X({id:e})}`,{method:"DELETE",credentials:"same-origin"}))},async createNotebook({parentId:e=null,title:t,workspacePath:a=null,workspaceLabel:n=null}){return(await z(await fetch(`${A}/notebook`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({parentId:e,title:t,workspacePath:a,workspaceLabel:n})}))).notebook},async updateNotebook(e,t){return(await z(await fetch(`${A}/notebook${X({id:e})}`,{method:"PATCH",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(t||{})}))).notebook},async deleteNotebook(e){return z(await fetch(`${A}/notebook${X({id:e})}`,{method:"DELETE",credentials:"same-origin"}))},async findWorkspace(e){return(await z(await fetch(`${A}/workspace${X({path:e})}`,{credentials:"same-origin"}))).notebook},async bindWorkspace({workspacePath:e,title:t,workspaceLabel:a}){return z(await fetch(`${A}/workspace`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({workspacePath:e,title:t,workspaceLabel:a})}))},async search(e,t=30){return(await z(await fetch(`${A}/search${X({q:e,limit:t})}`,{credentials:"same-origin"}))).results||[]},async uploadAsset(e){let t=(e.name.split(".").pop()||"").toLowerCase(),a=await fetch(`${A}/asset`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":e.type||"application/octet-stream","x-notes-ext":t},body:e});return z(a)},exportUrl(e){return`${A}/export${X({id:e})}`}};var h=require("react");var Me="/-/notes/client",$e={},ee=null;function Le(e){Object.assign($e,e||{})}function Te(){return e=>{let t=$e[e];if(t!==void 0)return t;throw new Error(`dsh-notes: 编辑器模块请求了未注册的依赖 ${e}`)}}function Oe(){return ee||(ee=new Promise((e,t)=>{if(typeof document>"u"){t(new Error("dsh-notes: 没有 document，无法加载编辑器"));return}let a="dsh-notes-editor-css";if(!document.getElementById(a)){let i=document.createElement("link");i.id=a,i.rel="stylesheet",i.href=`${Me}/editor.css`,document.head.append(i)}let n="__DSH_NOTES_EDITOR_FACTORY__",o=window[n];if(typeof o=="function"){try{e(o(Te()))}catch(i){t(Re(i))}return}let p=document.createElement("script");p.src=`${Me}/editor.js`,p.async=!0,p.onload=()=>{let i=window[n];if(typeof i!="function"){t(new Error("dsh-notes: 编辑器模块加载后没有注册工厂"));return}try{e(i(Te()))}catch(l){t(Re(l))}},p.onerror=()=>t(new Error("dsh-notes: 编辑器模块下载失败（/-/notes/client/editor.js）")),document.head.append(p)}),ee.catch(()=>{ee=null}),ee)}function Re(e){return e instanceof Error?e:new Error(String(e))}var m=require("react/jsx-runtime"),B={fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"};function V(e,t){return(0,m.jsx)("svg",{viewBox:"0 0 24 24",width:e,height:e,"aria-hidden":"true",focusable:"false",fill:"none",children:t})}function te({size:e=16}){return V(e,(0,m.jsx)(m.Fragment,{children:(0,m.jsx)("path",{d:"M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-6-3.5-6 3.5V5A1.5 1.5 0 0 1 6 3.5Z",...B})}))}function Ae({size:e=16}){return V(e,(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("path",{d:"M7 3.5h7.2L18.5 7.8V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z",...B}),(0,m.jsx)("path",{d:"M13.8 3.8V8h4.2",...B})]}))}function be({size:e=14}){return V(e,(0,m.jsx)("path",{d:"M12 5.5v13M5.5 12h13",...B}))}function Be({size:e=12,open:t=!1}){return(0,m.jsx)("svg",{viewBox:"0 0 24 24",width:e,height:e,"aria-hidden":"true",focusable:"false",fill:"none",style:{transform:t?"rotate(90deg)":"none",transition:"transform 120ms ease"},children:(0,m.jsx)("path",{d:"M9 5.5 15.5 12 9 18.5",...B})})}function De({size:e=14}){return V(e,(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("circle",{cx:"11",cy:"11",r:"5.75",...B}),(0,m.jsx)("path",{d:"M15.4 15.4 19 19",...B})]}))}function ye({size:e=14}){return V(e,(0,m.jsx)(m.Fragment,{children:(0,m.jsx)("path",{d:"M4.5 7h15M10 4.5h4M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12",...B})}))}function ue({size:e=14}){return V(e,(0,m.jsx)(m.Fragment,{children:(0,m.jsx)("path",{d:"M4.5 19.5h4L19 9a2 2 0 0 0 0-2.8l-1.2-1.2A2 2 0 0 0 15 5L4.5 15.5v4Z",...B})}))}function oe({size:e=14}){return V(e,(0,m.jsx)("path",{d:"M6 6l12 12M18 6 6 18",...B}))}function ze({size:e=14}){return V(e,(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("path",{d:"M12 3.5v11M8 10.5 12 14.5 16 10.5",...B}),(0,m.jsx)("path",{d:"M5 17v2a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-2",...B})]}))}function We({size:e=14}){return V(e,(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("path",{d:"M6 3.5h9.2L19 7.3V18a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 18V6a2.5 2.5 0 0 1 1-2Z",...B}),(0,m.jsx)("path",{d:"M8.5 3.5v5h6M8.5 20.5v-6h7v6",...B})]}))}var fe=require("react");function we(){return typeof document>"u"||!document.body?"light":document.body.hasAttribute("data-ds-dark-theme")?"dark":"light"}function je(){let[e,t]=(0,fe.useState)(we);return(0,fe.useEffect)(()=>{if(typeof MutationObserver!="function"||typeof document>"u"||!document.body)return;let a=new MutationObserver(()=>t(we()));return a.observe(document.body,{attributes:!0,attributeFilter:["data-ds-dark-theme","class"]}),t(we()),()=>a.disconnect()},[]),e}var g=require("react/jsx-runtime"),ft=800,gt=16*1024*1024;function mt(e){if(typeof e!="string"||!e.startsWith("asset://"))return e;let t=e.slice(8),a=t.lastIndexOf("."),n=a===-1?t:t.slice(0,a),o=a===-1?"png":t.slice(a+1);return`/-/notes/asset?sha=${encodeURIComponent(n)}&ext=${encodeURIComponent(o)}`}function Ue({pageId:e,t,onChanged:a,onGone:n}){let[o,p]=(0,h.useState)(null),[i,l]=(0,h.useState)("idle"),[b,M]=(0,h.useState)("");return(0,h.useEffect)(()=>{if(!e){p(null),l("idle");return}let y=!1;return l("loading"),M(""),N.readPage(e).then(k=>{y||(p(k),l("ready"))}).catch(k=>{y||(M(String(k&&k.message||k)),l("error"),k&&k.status===404&&typeof n=="function"&&n())}),()=>{y=!0}},[e,n]),e?i==="loading"||i==="idle"?(0,g.jsx)("div",{className:"n-empty",children:t.loading}):i==="error"?(0,g.jsx)("div",{className:"n-empty",children:b}):o?(0,g.jsx)(bt,{page:o,t,onSaved:a},o.id):(0,g.jsx)("div",{className:"n-empty",children:t.loading}):(0,g.jsx)("div",{className:"n-empty",children:t.noPage})}function ht({t:e}){return(0,g.jsxs)("div",{className:"n-editor-skeleton",role:"status","aria-live":"polite",children:[(0,g.jsx)("div",{className:"n-skel-line",style:{width:"38%",height:"18px"}}),(0,g.jsx)("div",{className:"n-skel-line",style:{width:"92%"}}),(0,g.jsx)("div",{className:"n-skel-line",style:{width:"86%"}}),(0,g.jsx)("div",{className:"n-skel-line",style:{width:"70%"}}),(0,g.jsx)("div",{className:"n-skel-hint",children:e.loading})]})}function bt({page:e,t,onSaved:a}){let[n,o]=(0,h.useState)(null),[p,i]=(0,h.useState)(""),[l,b]=(0,h.useState)(e.title&&e.title!==t.untitled?e.title:""),[M,y]=(0,h.useState)("saved"),[k,T]=(0,h.useState)(null),[x,w]=(0,h.useState)(""),I=(0,h.useRef)({...e}),v=(0,h.useRef)(!1),$=(0,h.useRef)(null),H=(0,h.useRef)(!1),D=(0,h.useRef)(null),Q=(0,h.useRef)(l),K=(0,h.useRef)(t),q=(0,h.useRef)(a);Q.current=l,K.current=t,q.current=a,(0,h.useEffect)(()=>{let u=!1;return Oe().then(C=>{u||o(C)}).catch(C=>{u||i(String(C&&C.message||C))}),()=>{u=!0}},[]);let P=(0,h.useCallback)(async({force:u=!1,rev:C}={})=>{let E=D.current;if(!E||H.current||!v.current&&!u)return;let Z=I.current,F;try{F=JSON.parse(JSON.stringify(E.document))}catch(L){w(String(L&&L.message||L));return}H.current=!0,y("saving");try{let L=await N.savePage({id:Z.id,title:Q.current.trim()||K.current.untitled,blocks:F,rev:C===void 0?Z.rev:C,baseMtimeMs:Z.mtimeMs,baseSize:Z.size});if(I.current={...L.page},v.current=!1,y("saved"),T(null),L.conflictFile){let re=String(L.conflictFile).split(/[\\/]/).pop();w(`已保存；外部改动留档为 ${re}`)}typeof q.current=="function"&&q.current(L.page)}catch(L){L&&L.status===409?(T(L.current||null),y("error")):(y("error"),w(String(L&&L.message||L)))}finally{H.current=!1}},[]),j=(0,h.useCallback)(()=>{$.current&&clearTimeout($.current),$.current=setTimeout(()=>{$.current=null,P()},ft)},[P]);(0,h.useEffect)(()=>()=>{$.current&&(clearTimeout($.current),$.current=null),v.current&&P({force:!0}).catch(()=>{})},[P]),(0,h.useEffect)(()=>{let u=C=>{(C.metaKey||C.ctrlKey)&&!C.altKey&&String(C.key).toLowerCase()==="s"&&(C.preventDefault(),P({force:!0}))};return window.addEventListener("keydown",u,!0),()=>window.removeEventListener("keydown",u,!0)},[P]);let le=(0,h.useCallback)(async u=>{if(u&&u.size>gt)throw new Error(K.current.imageTooLarge);let C=await N.uploadAsset(u);return`asset://${C.sha}.${C.ext}`},[]),ce=(0,h.useCallback)(async u=>mt(u),[]),G=(0,h.useMemo)(()=>({initialContent:Array.isArray(e.blocks)&&e.blocks.length>0?e.blocks:void 0,uploadFile:le,resolveFileUrl:ce}),[e.id]);return(0,g.jsxs)("div",{className:"n-main",children:[(0,g.jsxs)("div",{className:"n-topbar",children:[(0,g.jsx)("input",{className:"n-title-input",value:l,placeholder:t.untitled,"aria-label":t.title,onChange:u=>{b(u.target.value),v.current=!0,y("dirty"),j()},onBlur:()=>P()}),(0,g.jsx)("span",{className:`n-save-state${M==="error"?" is-error":""}`,role:"status","aria-live":"polite",children:M==="saving"?t.saving:M==="dirty"?t.unsaved:M==="error"?t.conflict:t.saved}),(0,g.jsx)("a",{className:"n-btn is-icon",href:N.exportUrl(e.id),download:!0,title:t.exportMd,"aria-label":t.exportMd,children:(0,g.jsx)(ze,{})}),(0,g.jsx)("button",{type:"button",className:"n-btn is-icon",title:t.save,"aria-label":t.save,onClick:()=>P({force:!0}),children:(0,g.jsx)(We,{})})]}),k&&(0,g.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,g.jsxs)("span",{className:"n-banner-text",children:[(0,g.jsx)("b",{children:t.conflict})," — ",t.conflictBody]}),(0,g.jsx)("button",{type:"button",className:"n-btn",onClick:()=>{let u=k.rev;T(null),v.current=!0,P({force:!0,rev:u})},children:t.overwrite}),(0,g.jsx)("button",{type:"button",className:"n-btn",onClick:async()=>{T(null);try{let u=await N.readPage(I.current.id);I.current={...u},b(u.title===t.untitled?"":u.title);let C=D.current;C&&Array.isArray(u.blocks)&&C.replaceBlocks(C.document,u.blocks),v.current=!1,y("saved")}catch(u){w(String(u&&u.message||u))}},children:t.reload})]}),x&&(0,g.jsxs)("div",{className:"n-banner",role:"status",children:[(0,g.jsx)("span",{className:"n-banner-text",children:x}),(0,g.jsx)("button",{type:"button",className:"n-btn is-icon","aria-label":t.close,onClick:()=>w(""),children:(0,g.jsx)(oe,{})})]}),(0,g.jsx)("div",{className:"n-editor-scroll",children:(0,g.jsxs)("div",{className:"n-editor",children:[p&&(0,g.jsx)("div",{className:"n-empty",children:p}),!n&&!p&&(0,g.jsx)(ht,{t}),n&&(0,g.jsx)(yt,{runtime:n,options:G,t,onReady:u=>{D.current=u},onChange:()=>{v.current=!0,y(u=>u==="saving"?u:"dirty"),j()}})]})})]})}function yt({runtime:e,options:t,t:a,onReady:n,onChange:o}){let{useCreateBlockNote:p,BlockNoteView:i}=e,l=je(),b=p(t);return(0,h.useEffect)(()=>{b&&n(b)},[b,n]),b?(0,g.jsx)("div",{className:"n-blocknote",children:(0,g.jsx)(i,{editor:b,theme:l,onChange:o})}):null}var wt={label:"全部笔记本",title:"全部笔记本",currentWorkspace:"当前工作区",noWorkspace:"未选择工作区",createNotebook:"新建笔记本",openNotebook:"打开笔记本",orphan:"游离",newPage:"新建页面",newChild:"新建子笔记本",rename:"重命名",delete:"删除",exportMd:"导出 Markdown",save:"保存",saved:"已保存",saving:"保存中…",unsaved:"未保存",conflict:"他处已修改",conflictBody:"这份笔记在别处被改过。覆盖会丢掉对方的改动。",overwrite:"覆盖",reload:"载入最新",empty:"还没有笔记本",emptyHint:"在左侧选中一个工作区，点「新建笔记本」开始。",noPage:"选一个页面开始编辑，或者新建一页。",untitled:"无标题",searchPlaceholder:"搜索标题与正文…",searchEmpty:"没有命中",deleteNotebookConfirm:e=>`删除笔记本「${e}」？它和里面的页面都会进回收站。`,deletePageConfirm:e=>`删除页面「${e}」？会进回收站。`,renamePrompt:"新名字",loading:"载入中…",retry:"重试",unavailable:"笔记本服务不可用",unavailableHint:"宿主路由没有注册成功，请重启 dsh web 后刷新页面。",imageTooLarge:"图片太大（上限 16MB）",uploadFailed:"图片上传失败",chars:e=>`${e} 字`,more:"更多",noResults:"没有结果",notebook:"笔记本",page:"页面",rightTab:"笔记本",rightTabDesc:"浏览全部工作区的笔记本"},vt={label:"All notebooks",title:"All notebooks",currentWorkspace:"Current workspace",noWorkspace:"No workspace selected",createNotebook:"New notebook",openNotebook:"Open notebook",orphan:"Orphan",newPage:"New page",newChild:"New sub-notebook",rename:"Rename",delete:"Delete",exportMd:"Export markdown",save:"Save",saved:"Saved",saving:"Saving…",unsaved:"Unsaved",conflict:"Changed elsewhere",conflictBody:"This note changed on disk. Overwriting discards the other version.",overwrite:"Overwrite",reload:"Reload latest",empty:"No notebooks yet",emptyHint:"Pick a workspace on the left, then click “New notebook”.",noPage:"Pick a page to start writing, or create one.",untitled:"Untitled",searchPlaceholder:"Search titles and text…",searchEmpty:"Nothing matched",deleteNotebookConfirm:e=>`Delete notebook “${e}”? It and its pages go to the trash.`,deletePageConfirm:e=>`Delete page “${e}”? It goes to the trash.`,renamePrompt:"New name",loading:"Loading…",retry:"Retry",unavailable:"Notebook service unavailable",unavailableHint:"The host route did not register. Restart dsh web, then reload this page.",imageTooLarge:"Image too large (16MB limit)",uploadFailed:"Image upload failed",chars:e=>`${e} chars`,more:"More",noResults:"No results",notebook:"Notebook",page:"Page",rightTab:"Notebooks",rightTabDesc:"Browse notebooks from every workspace"};function Y(){let e=typeof document<"u"&&document.documentElement.lang||"zh-CN";return String(e).toLowerCase().startsWith("zh")?"zh":"en"}function _(e){return(e||Y())==="zh"?wt:vt}function ne(e){if(typeof MutationObserver!="function"||typeof document>"u")return()=>{};let t=new MutationObserver(a=>{for(let n of a)if(n.attributeName==="lang"){e(Y());return}});return t.observe(document.documentElement,{attributes:!0,attributeFilter:["lang"]}),()=>t.disconnect()}var ge=null,ve=new Set;function se(e){ge=Object.assign({at:Date.now()},e||{});for(let t of ve)try{t(ge)}catch{}}function ke(){let e=ge;return ge=null,e}function He(e){return ve.add(e),()=>ve.delete(e)}var me=require("react");function kt(e){try{let t=e.get&&e.get("uiSession"),a=t&&(t.current||t.adapter?.current)||null,n=a&&typeof a.getSnapshot=="function"?a.getSnapshot():null;if(n&&typeof n.key=="string")return n.key}catch{}try{let t=e.get&&e.get("sessions"),a=t&&t.list&&t.list.getSnapshot();if(a&&a.byId){let n=Object.values(a.byId).find(o=>(o.retainedBy?.mainView??0)>0);if(n&&n.id)return n.id}}catch{}}function xt(e,t){if(!t)return null;let a="";try{let n=e.get&&e.get("workspaces"),o=n&&n.list&&n.list.getSnapshot(),i=(o&&o.items||[]).find(l=>l.path===t);i&&(a=i.title||i.displayTitle||"")}catch{}if(!a){let n=String(t).split(/[\\/]/).filter(Boolean);a=n.length?n[n.length-1]:t}return{path:t,title:a}}function Ke(e){let t=kt(e);if(!t)return null;try{let a=e.get&&e.get("sessions"),n=a&&a.list&&a.list.getSnapshot(),o=n&&n.byId&&n.byId[t];return o?xt(e,o.cwd):null}catch{return null}}function _e(e){let[t,a]=(0,me.useState)(()=>Ke(e));return(0,me.useEffect)(()=>{let n=()=>a(Ke(e)),o=[],p=(l,b)=>{try{let M=b(l);M&&typeof M.subscribe=="function"&&o.push(M.subscribe(n)||(()=>{}))}catch{}},i=e.get&&e.get("uiSession");try{let l=i&&(i.current||i.adapter?.current)||null;l&&typeof l.subscribe=="function"&&o.push(l.subscribe(n)||(()=>{}))}catch{}try{let l=e.get&&e.get("sessions");p(l,b=>b.list)}catch{}try{let l=e.get&&e.get("workspaces");p(l,b=>b.list)}catch{}return n(),()=>{for(let l of o)try{l()}catch{}}},[e]),t}var s=require("react/jsx-runtime");function Nt(e){let t=Array.isArray(e?.notebooks)?e.notebooks:[],a=Array.isArray(e?.pages)?e.pages:[],n=new Map(t.map(i=>[i.id,i])),o=new Map;for(let i of t){let l=i.parentId&&n.has(i.parentId)?i.parentId:null;o.has(l)||o.set(l,[]),o.get(l).push(i)}for(let i of o.values())i.sort((l,b)=>(l.order??0)-(b.order??0)||l.title.localeCompare(b.title));let p=new Map;for(let i of a)p.has(i.notebookId)||p.set(i.notebookId,[]),p.get(i.notebookId).push(i);for(let i of p.values())i.sort((l,b)=>(l.order??0)-(b.order??0)||(b.updatedAt??0)-(l.updatedAt??0));return{byId:n,children:o,pagesOf:p,root:o.get(null)||[],notebookCount:t.length}}function Fe({value:e,onChange:t,onCommit:a,onCancel:n}){let o=(0,f.useRef)(null);return(0,f.useEffect)(()=>{o.current?.focus(),o.current?.select()},[]),(0,s.jsx)("input",{ref:o,className:"n-title-input",style:{height:"22px",fontSize:"13px",fontWeight:500},value:e,onChange:p=>t(p.target.value),onBlur:a,onKeyDown:p=>{p.key==="Enter"?(p.preventDefault(),a()):p.key==="Escape"&&(p.preventDefault(),n())}})}function Ve({ctx:e}){let[t,a]=(0,f.useState)(Y());(0,f.useEffect)(()=>ne(a),[]);let n=(0,f.useMemo)(()=>_(t),[t]),o=_e(e),[p,i]=(0,f.useState)({notebooks:[],pages:[]}),[l,b]=(0,f.useState)(!0),[M,y]=(0,f.useState)(""),[k,T]=(0,f.useState)(null),[x,w]=(0,f.useState)(()=>new Set),[I,v]=(0,f.useState)(""),[$,H]=(0,f.useState)(null),[D,Q]=(0,f.useState)(null),[K,q]=(0,f.useState)(null),[P,j]=(0,f.useState)(null),[le,ce]=(0,f.useState)(!1),G=(0,f.useRef)(null),u=(0,f.useMemo)(()=>Nt(p),[p]),C=(0,f.useMemo)(()=>{if(!k)return null;let r=(p.pages||[]).find(d=>d.id===k);return r?r.notebookId:null},[k,p]),E=(0,f.useCallback)(async()=>{y("");try{let r=await N.tree();return i({notebooks:r.notebooks||[],pages:r.pages||[]}),b(!1),r}catch(r){return b(!1),y(String(r&&r.message||r)),null}},[]);(0,f.useEffect)(()=>{E()},[E]);let Z=(0,f.useCallback)(async r=>{if(!r)return;let d=await E(),c=r.notebookId||null;if(!c&&r.workspacePath)try{let S=await N.findWorkspace(r.workspacePath);c=S?S.id:null}catch{c=null}if(!c)return;if(w(S=>new Set(S).add(c)),r.pageId){T(r.pageId);return}let U=(d&&d.pages||[]).filter(S=>S.notebookId===c);if(U.length>0){T(U[0].id);return}try{let S=await N.createPage({notebookId:c,title:n.untitled});await E(),T(S.id)}catch(S){y(String(S&&S.message||S))}},[E,n]);(0,f.useEffect)(()=>{let r=ke();return r&&Z(r),He(c=>{ke(),Z(c)})},[Z]),(0,f.useEffect)(()=>{let r=o?.path;if(!r){Q(null);return}let d=!1;return N.findWorkspace(r).then(c=>{d||Q(c)}).catch(()=>{d||Q(null)}),()=>{d=!0}},[o?.path,p]),(0,f.useEffect)(()=>{let r=I.trim();if(!r){H(null);return}let d=!1,c=setTimeout(()=>{N.search(r,30).then(U=>{d||H(U)}).catch(()=>{d||H([])})},200);return()=>{d=!0,clearTimeout(c)}},[I]);let F=(0,f.useCallback)(async r=>{ce(!0);try{return await r()}finally{ce(!1)}},[]),L=(0,f.useCallback)(async()=>{if(!o?.path)return null;if(D)return D;let r=await N.bindWorkspace({workspacePath:o.path,workspaceLabel:o.title,title:o.title});return Q(r.notebook),r.notebook},[o,D]),re=(0,f.useCallback)(async r=>{if(!r)return;w(c=>new Set(c).add(r.id));let d=(u.pagesOf.get(r.id)||[])[0];d?T(d.id):await ae(r.id)},[u]),ae=(0,f.useCallback)(async r=>{let d=r||C||D&&D.id;d&&await F(async()=>{try{let c=await N.createPage({notebookId:d,title:n.untitled});w(U=>new Set(U).add(d)),await E(),T(c.id)}catch(c){y(String(c&&c.message||c))}})},[C,D,E,n,F]),Qe=(0,f.useCallback)(async(r=null)=>{await F(async()=>{try{let d=await N.createNotebook({parentId:r,title:n.notebook});await E(),r&&w(c=>new Set(c).add(r)),j({kind:"notebook",id:d.id,value:d.title})}catch(d){y(String(d&&d.message||d))}})},[E,n,F]),Ge=(0,f.useCallback)(async()=>{await F(async()=>{try{let r=await L();await E(),await re(r)}catch(r){y(String(r&&r.message||r))}})},[L,E,re,F]),Ne=(0,f.useCallback)(async()=>{let r=P;if(j(null),!r)return;let d=r.value.trim();if(d)try{if(r.kind==="notebook")await N.updateNotebook(r.id,{title:d});else{let c=await N.readPage(r.id);await N.savePage({id:c.id,title:d,rev:c.rev,baseMtimeMs:c.mtimeMs,baseSize:c.size})}await E()}catch(c){y(String(c&&c.message||c))}},[P,E]),et=(0,f.useCallback)(async()=>{let r=K;if(q(null),!!r)try{r.kind==="page"?(await N.deletePage(r.id),k===r.id&&T(null)):await N.deleteNotebook(r.id),await E()}catch(d){y(String(d&&d.message||d))}},[K,k,E]),Ce=(0,f.useCallback)(r=>{w(d=>{let c=new Set(d);return c.has(r)?c.delete(r):c.add(r),c})},[]);(0,f.useEffect)(()=>{let r=d=>{let c=d.metaKey||d.ctrlKey;c&&d.key.toLowerCase()==="p"?(d.preventDefault(),G.current?.focus(),G.current?.select?.()):c&&d.shiftKey&&d.key.toLowerCase()==="n"?(d.preventDefault(),ae()):d.key==="Escape"&&document.activeElement===G.current&&v("")};return window.addEventListener("keydown",r),()=>window.removeEventListener("keydown",r)},[ae]);let tt=(r,d)=>(u.pagesOf.get(r)||[]).map(c=>{let U=P&&P.kind==="page"&&P.id===c.id;return(0,s.jsxs)("div",{className:`n-row${k===c.id?" is-active":""}`,style:{paddingLeft:`${8+d*12+16}px`},role:"treeitem","aria-selected":k===c.id?"true":"false",tabIndex:0,onClick:()=>T(c.id),onKeyDown:S=>{(S.key==="Enter"||S.key===" ")&&(S.preventDefault(),T(c.id))},children:[(0,s.jsx)(Ae,{}),U?(0,s.jsx)(Fe,{value:P.value,onChange:S=>j({...P,value:S}),onCommit:Ne,onCancel:()=>j(null)}):(0,s.jsx)("span",{className:"n-row-title",children:c.title||n.untitled}),(0,s.jsxs)("span",{className:"n-row-actions",children:[(0,s.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.rename,"aria-label":n.rename,onClick:S=>{S.stopPropagation(),j({kind:"page",id:c.id,value:c.title||""})},children:(0,s.jsx)(ue,{})}),(0,s.jsx)("button",{type:"button",className:"n-btn is-icon is-danger",title:n.delete,"aria-label":n.delete,onClick:S=>{S.stopPropagation(),q({kind:"page",id:c.id,title:c.title||n.untitled})},children:(0,s.jsx)(ye,{})})]})]},c.id)}),Se=(r,d)=>{let c=x.has(r.id),U=u.children.get(r.id)||[],S=u.pagesOf.get(r.id)||[],Ie=U.length>0||S.length>0,at=P&&P.kind==="notebook"&&P.id===r.id,Pe=r.workspacePath&&o?.path&&r.workspacePath===o.path;return(0,s.jsxs)("div",{children:[(0,s.jsxs)("div",{className:"n-row is-notebook",style:{paddingLeft:`${8+d*12}px`},role:"treeitem","aria-expanded":c?"true":"false",tabIndex:0,onClick:()=>Ce(r.id),onKeyDown:O=>{(O.key==="Enter"||O.key===" ")&&(O.preventDefault(),Ce(r.id))},title:r.workspacePath||r.title,children:[(0,s.jsx)("span",{className:`n-twist${Ie?"":" is-leaf"}`,"aria-hidden":"true",children:(0,s.jsx)(Be,{open:c})}),(0,s.jsx)(te,{}),at?(0,s.jsx)(Fe,{value:P.value,onChange:O=>j({...P,value:O}),onCommit:Ne,onCancel:()=>j(null)}):(0,s.jsx)("span",{className:"n-row-title",children:r.title}),Pe&&(0,s.jsx)("span",{className:"n-row-badge",children:n.currentWorkspace}),r.workspacePath&&!Pe&&(0,s.jsx)("span",{className:"n-row-badge",children:n.orphan}),(0,s.jsxs)("span",{className:"n-row-actions",children:[(0,s.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.newPage,"aria-label":n.newPage,onClick:O=>{O.stopPropagation(),ae(r.id)},children:(0,s.jsx)(be,{})}),(0,s.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.newChild,"aria-label":n.newChild,onClick:O=>{O.stopPropagation(),Qe(r.id)},children:(0,s.jsx)(te,{size:12})}),(0,s.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.rename,"aria-label":n.rename,onClick:O=>{O.stopPropagation(),j({kind:"notebook",id:r.id,value:r.title})},children:(0,s.jsx)(ue,{})}),(0,s.jsx)("button",{type:"button",className:"n-btn is-icon is-danger",title:n.delete,"aria-label":n.delete,onClick:O=>{O.stopPropagation(),q({kind:"notebook",id:r.id,title:r.title})},children:(0,s.jsx)(ye,{})})]})]}),c&&(0,s.jsxs)("div",{role:"group",children:[U.map(O=>Se(O,d+1)),tt(r.id,d),!Ie&&(0,s.jsx)("div",{className:"n-row",style:{paddingLeft:`${8+(d+1)*12+16}px`,color:"var(--dsw-alias-label-tertiary)"},children:(0,s.jsx)("span",{className:"n-row-title",children:n.noPage})})]})]},r.id)},nt=o?o.title:n.noWorkspace,rt=!!o?.path;return(0,s.jsxs)("div",{className:"n-app",children:[(0,s.jsxs)("aside",{className:"n-side",children:[(0,s.jsxs)("div",{className:"n-wsbar",children:[(0,s.jsx)("span",{className:"n-wsbar-label",children:n.currentWorkspace}),(0,s.jsxs)("span",{className:"n-wsbar-name",title:o?.path||"",children:[(0,s.jsx)(te,{}),(0,s.jsx)("b",{children:nt})]}),(0,s.jsxs)("span",{className:"n-wsbar-actions",children:[(0,s.jsxs)("button",{type:"button",className:"n-btn",disabled:!rt||le,onClick:()=>D?re(D):Ge(),children:[(0,s.jsx)(be,{}),D?n.openNotebook:n.createNotebook]}),(0,s.jsx)("button",{type:"button",className:"n-btn",disabled:le,title:n.newPage,"aria-label":n.newPage,onClick:()=>ae(),children:(0,s.jsx)(ue,{})})]})]}),(0,s.jsxs)("div",{className:"n-search",children:[(0,s.jsx)(De,{}),(0,s.jsx)("input",{ref:G,type:"search",value:I,placeholder:n.searchPlaceholder,"aria-label":n.search,onChange:r=>v(r.target.value)}),I&&(0,s.jsx)("button",{type:"button",className:"n-btn is-icon","aria-label":n.delete,onClick:()=>v(""),children:(0,s.jsx)(oe,{size:12})})]}),M&&(0,s.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,s.jsx)("span",{className:"n-banner-text",children:M}),(0,s.jsx)("button",{type:"button",className:"n-btn",onClick:E,children:n.retry})]}),K&&(0,s.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,s.jsx)("span",{className:"n-banner-text",children:K.kind==="notebook"?n.deleteNotebookConfirm(K.title):n.deletePageConfirm(K.title)}),(0,s.jsx)("button",{type:"button",className:"n-btn is-danger",onClick:et,children:n.delete}),(0,s.jsx)("button",{type:"button",className:"n-btn",onClick:()=>q(null),children:(0,s.jsx)(oe,{size:12})})]}),(0,s.jsxs)("div",{className:"n-tree",role:"tree","aria-label":n.title,children:[l&&(0,s.jsx)("div",{className:"n-tree-empty",children:n.loading}),!l&&$&&(0,s.jsxs)(s.Fragment,{children:[$.length===0&&(0,s.jsx)("div",{className:"n-tree-empty",children:n.noResults}),$.map(r=>(0,s.jsxs)("div",{className:"n-hit",role:"button",tabIndex:0,onClick:()=>{T(r.id),v("")},onKeyDown:d=>{d.key==="Enter"&&(T(r.id),v(""))},children:[(0,s.jsx)("div",{className:"n-hit-title",children:r.title||n.untitled}),r.snippet&&(0,s.jsx)("div",{className:"n-hit-snippet",children:r.snippet})]},r.id))]}),!l&&!$&&u.notebookCount===0&&(0,s.jsxs)("div",{className:"n-tree-empty",children:[(0,s.jsx)("b",{children:n.empty}),(0,s.jsx)("div",{children:n.emptyHint})]}),!l&&!$&&u.root.map(r=>Se(r,0))]})]}),(0,s.jsx)(Ue,{pageId:k,t:n,onChanged:()=>{E()},onGone:()=>{T(null),E()}})]})}var W=require("react");var R=require("react/jsx-runtime");function Je({ctx:e}){let[t,a]=(0,W.useState)(Y());(0,W.useEffect)(()=>ne(a),[]);let n=(0,W.useMemo)(()=>_(t),[t]),[o,p]=(0,W.useState)(null),[i,l]=(0,W.useState)(""),[b,M]=(0,W.useState)(!1),y=(0,W.useCallback)(async()=>{M(!0),l("");try{let x=await N.tree();p({notebooks:x.notebooks||[],pages:x.pages||[]})}catch(x){l(String(x&&x.message||x))}finally{M(!1)}},[]);(0,W.useEffect)(()=>{y()},[y]);let k=(0,W.useMemo)(()=>{let x=o&&o.notebooks||[],w=o&&o.pages||[],I=new Map;for(let v of w)I.set(v.notebookId,(I.get(v.notebookId)||0)+1);return x.filter(v=>v.parentId===null||v.parentId===void 0).sort((v,$)=>(v.order||0)-($.order||0)).map(v=>({...v,pageCount:I.get(v.id)||0}))},[o]),T=x=>{se({notebookId:x});try{let w=e.get&&e.get("layout");w&&typeof w.selectPanel=="function"&&w.selectPanel("notes")}catch{}};return(0,R.jsxs)("div",{className:"n-right",children:[(0,R.jsxs)("div",{className:"n-right-head",children:[(0,R.jsx)("span",{className:"n-right-title",children:n.label}),(0,R.jsx)("button",{type:"button",className:"n-right-refresh",onClick:y,disabled:b,"aria-label":n.retry,title:n.retry,children:"⟳"})]}),i?(0,R.jsxs)("div",{className:"n-right-empty",children:[(0,R.jsx)("div",{children:n.unavailable}),(0,R.jsx)("div",{className:"n-right-hint",children:i}),(0,R.jsx)("button",{type:"button",className:"n-right-action",onClick:y,children:n.retry})]}):o?k.length===0?(0,R.jsxs)("div",{className:"n-right-empty",children:[(0,R.jsx)("div",{children:n.empty}),(0,R.jsx)("div",{className:"n-right-hint",children:n.emptyHint})]}):(0,R.jsx)("div",{className:"n-right-list",role:"list",children:k.map(x=>(0,R.jsxs)("button",{type:"button",role:"listitem",className:"n-right-row",onClick:()=>T(x.id),title:x.workspacePath||x.title,children:[(0,R.jsxs)("span",{className:"n-right-row-main",children:[(0,R.jsx)("span",{className:"n-right-row-title",children:x.title}),(0,R.jsxs)("span",{className:"n-right-row-meta",children:[x.pageCount," ",n.page,x.workspacePath?"":` · ${n.orphan}`]})]}),(0,R.jsx)("span",{className:"n-right-arrow","aria-hidden":"true",children:"→"})]},x.id))}):(0,R.jsx)("div",{className:"n-right-empty",children:n.loading})]})}var J=require("react");var ie=require("react/jsx-runtime");function xe(e,t){if(!e||typeof e.get!="function")return null;try{let a=e.get("sessions"),n=a&&a.list&&a.list.getSnapshot(),o=n&&n.byId&&n.byId[t],p=o&&o.cwd;return typeof p=="string"&&p?p:null}catch{return null}}function qe(e,t){try{let n=e&&typeof e.get=="function"?e.get("workspaces"):null,o=n&&n.list&&n.list.getSnapshot(),i=(o&&o.items||[]).find(l=>l.path===t);if(i&&(i.title||i.displayTitle))return i.title||i.displayTitle}catch{}let a=String(t||"").split(/[\\/]/).filter(Boolean);return a.length?a[a.length-1]:String(t||"")}function Ze(e){let{ctx:t,sessionId:a}=e||{},[n,o]=(0,J.useState)(Y()),[p,i]=(0,J.useState)(null),[l,b]=(0,J.useState)(()=>xe(t,a)),[M,y]=(0,J.useState)(!1);(0,J.useEffect)(()=>ne(o),[]),(0,J.useEffect)(()=>{if(l)return;let w=null;try{let v=t&&typeof t.get=="function"?t.get("sessions"):null,$=v&&v.list;$&&typeof $.subscribe=="function"&&(w=$.subscribe(()=>{let H=xe(t,a);H&&b(H)}))}catch{}let I=setTimeout(()=>b(xe(t,a)),200);return()=>{clearTimeout(I),typeof w=="function"&&w()}},[t,a,l]),(0,J.useEffect)(()=>{if(!l){i(null);return}let w=!1;return N.findWorkspace(l).then(I=>{w||i(I)}).catch(()=>{w||i(null)}),()=>{w=!0}},[l]);let k=_(n),T=!l||M,x=p?k.openNotebook:k.createNotebook;return(0,ie.jsxs)("button",{type:"button",className:"n-menu-item",role:"menuitem",disabled:T,title:l||k.noWorkspace,onClick:async w=>{if(w.preventDefault(),w.stopPropagation(),!(!l||M)){y(!0);try{if(p)se({workspacePath:l,notebookId:p.id});else{let I=await N.bindWorkspace({workspacePath:l,workspaceLabel:qe(t,l),title:qe(t,l)});i(I.notebook),se({workspacePath:l,notebookId:I.notebook.id})}try{t.layout.selectPanel("notes")}catch{}}catch(I){console.warn("[dsh-notes] 会话菜单建笔记本失败:",I)}finally{y(!1)}}},children:[(0,ie.jsx)(te,{size:14}),(0,ie.jsx)("span",{children:x})]})}var Ct=`
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
    `,Xe=!1;function Ye(){if(Xe||typeof document>"u")return;Xe=!0;let e="dsh-notes-styles";if(document.getElementById(e))return;let t=document.createElement("style");t.id=e,t.textContent=Ct,document.head.append(t)}var he=require("react/jsx-runtime"),Mt=["slots"];function Tt(e){Ye(),Le({react:St,"react/jsx-runtime":It,"react-dom":Pt,"react-dom/client":Et}),e.slots.inject("main",()=>e.slots.register({name:"main",key:"notes"},()=>(0,he.jsx)(Ve,{ctx:e}))),e.slots.inject("sidebar.workspaces.session.menu.item",()=>e.slots.register({name:"sidebar.workspaces.session.menu.item",id:"notes",order:300},t=>(0,he.jsx)(Ze,{ctx:e,sessionId:t&&t.sessionId}))),e.inject(["slots","sidebarRightTabs"],t=>{let a=t.sidebarRightTabs,n=t.slots;a&&typeof a.register=="function"&&e.effect(()=>a.register({id:"dsh-notes",kind:"notes",title:()=>_().rightTab,guide:[{id:"all",order:20,title:()=>_().label,description:()=>_().rightTabDesc}]}),"dsh-notes: right tab type"),n&&typeof n.inject=="function"&&e.effect(()=>n.inject("sidebar.right.pane.tab",()=>n.register({name:"sidebar.right.pane.tab",key:"dsh-notes"},o=>(0,he.jsx)(Je,{ctx:e,...o}))),"dsh-notes: right tab body")})}

    return module.exports
  }
})
