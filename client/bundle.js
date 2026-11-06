/* 由 tools/build.mjs 从 src/client/index.js 生成 —— 请勿手改。
 * 重新生成：npm run build
 */
window.__ModuleLoader__.load({
  id: "@tom2012/dsh-notes",
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
    var st=Object.create;var ce=Object.defineProperty;var lt=Object.getOwnPropertyDescriptor;var ct=Object.getOwnPropertyNames;var dt=Object.getPrototypeOf,pt=Object.prototype.hasOwnProperty;var ut=(e,t)=>{for(var a in t)ce(e,a,{get:t[a],enumerable:!0})},Te=(e,t,a,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let d of ct(t))!pt.call(e,d)&&d!==a&&ce(e,d,{get:()=>t[d],enumerable:!(i=lt(t,d))||i.enumerable});return e};var de=(e,t,a)=>(a=e!=null?st(dt(e)):{},Te(t||!e||!e.__esModule?ce(a,"default",{value:e,enumerable:!0}):a,e)),ft=e=>Te(ce({},"__esModule",{value:!0}),e);var Lt={};ut(Lt,{apply:()=>$t,inject:()=>Rt});module.exports=ft(Lt);var Et=de(require("react")),It=de(require("react/jsx-runtime")),Tt=de(require("react-dom")),Mt=de(require("react-dom/client"));var u=require("react");var M="/-/notes";function ht(e){return e===404?"接口不存在（宿主插件可能未加载）":e===403?"没有权限（宿主鉴权拒绝了请求）":e===409?"内容已在别处修改":e===413?"内容过大":e===503?"宿主服务不可用，请重启 dsh web":e>=500?"宿主内部错误":`HTTP ${e}`}async function z(e){let t=null;try{t=await e.json()}catch{t=null}if(!e.ok||t&&t.ok===!1){let a=new Error(t&&t.error||ht(e.status));throw a.status=e.status,t&&t.current!==void 0&&(a.current=t.current),a}return t||{}}function K(e){let t=[];for(let[a,i]of Object.entries(e||{}))i==null||i===""||t.push(`${encodeURIComponent(a)}=${encodeURIComponent(String(i))}`);return t.length?`?${t.join("&")}`:""}var N={base:M,async status(){return z(await fetch(`${M}/status`,{credentials:"same-origin"}))},async tree(){return z(await fetch(`${M}/tree`,{credentials:"same-origin"}))},async readPage(e){return(await z(await fetch(`${M}/page${K({id:e})}`,{credentials:"same-origin"}))).page},async savePage({id:e,title:t,blocks:a,rev:i,baseMtimeMs:d,baseSize:o}){let l={title:t,rev:i,baseMtimeMs:d,baseSize:o};return Array.isArray(a)&&(l.blocks=a),z(await fetch(`${M}/page${K({id:e})}`,{method:"PUT",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)}))},async createPage({notebookId:e,title:t,blocks:a,markdown:i}){let d={notebookId:e,title:t};return Array.isArray(a)&&(d.blocks=a),typeof i=="string"&&(d.markdown=i),(await z(await fetch(`${M}/page`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}))).page},async deletePage(e){return z(await fetch(`${M}/page${K({id:e})}`,{method:"DELETE",credentials:"same-origin"}))},async createNotebook({parentId:e=null,title:t,workspacePath:a=null,workspaceLabel:i=null}){return(await z(await fetch(`${M}/notebook`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({parentId:e,title:t,workspacePath:a,workspaceLabel:i})}))).notebook},async updateNotebook(e,t){return(await z(await fetch(`${M}/notebook${K({id:e})}`,{method:"PATCH",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(t||{})}))).notebook},async deleteNotebook(e){return z(await fetch(`${M}/notebook${K({id:e})}`,{method:"DELETE",credentials:"same-origin"}))},async findWorkspace(e){return(await z(await fetch(`${M}/workspace${K({path:e})}`,{credentials:"same-origin"}))).notebook},async bindWorkspace({workspacePath:e,title:t,workspaceLabel:a}){return z(await fetch(`${M}/workspace`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({workspacePath:e,title:t,workspaceLabel:a})}))},async search(e,t=30){return(await z(await fetch(`${M}/search${K({q:e,limit:t})}`,{credentials:"same-origin"}))).results||[]},async uploadAsset(e){let t=(e.name.split(".").pop()||"").toLowerCase(),a=await fetch(`${M}/asset`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":e.type||"application/octet-stream","x-notes-ext":t},body:e});return z(a)},exportUrl(e){return`${M}/export${K({id:e})}`}};var g=require("react");var Me="/-/notes/client",Le={},ee=null;function Ae(e){Object.assign(Le,e||{})}function Re(){return e=>{let t=Le[e];if(t!==void 0)return t;throw new Error(`dsh-notes: 编辑器模块请求了未注册的依赖 ${e}`)}}function Oe(){return ee||(ee=new Promise((e,t)=>{if(typeof document>"u"){t(new Error("dsh-notes: 没有 document，无法加载编辑器"));return}let a="dsh-notes-editor-css";if(!document.getElementById(a)){let l=document.createElement("link");l.id=a,l.rel="stylesheet",l.href=`${Me}/editor.css`,document.head.append(l)}let i="__DSH_NOTES_EDITOR_FACTORY__",d=window[i];if(typeof d=="function"){try{e(d(Re()))}catch(l){t($e(l))}return}let o=document.createElement("script");o.src=`${Me}/editor.js`,o.async=!0,o.onload=()=>{let l=window[i];if(typeof l!="function"){t(new Error("dsh-notes: 编辑器模块加载后没有注册工厂"));return}try{e(l(Re()))}catch(p){t($e(p))}},o.onerror=()=>t(new Error("dsh-notes: 编辑器模块下载失败（/-/notes/client/editor.js）")),document.head.append(o)}),ee.catch(()=>{ee=null}),ee)}function $e(e){return e instanceof Error?e:new Error(String(e))}var h=require("react/jsx-runtime"),E={fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"};function U(e,t){return(0,h.jsx)("svg",{viewBox:"0 0 24 24",width:e,height:e,"aria-hidden":"true",focusable:"false",fill:"none",children:t})}function re({size:e=16}){return U(e,(0,h.jsx)(h.Fragment,{children:(0,h.jsx)("path",{d:"M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-6-3.5-6 3.5V5A1.5 1.5 0 0 1 6 3.5Z",...E})}))}function De({size:e=16}){return U(e,(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("path",{d:"M7 3.5h7.2L18.5 7.8V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z",...E}),(0,h.jsx)("path",{d:"M13.8 3.8V8h4.2",...E})]}))}function ze(){return(0,h.jsxs)("svg",{viewBox:"0 0 24 24",width:"20",height:"20","aria-hidden":"true",focusable:"false",fill:"none",children:[(0,h.jsx)("path",{d:"M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-6-3.5-6 3.5V5A1.5 1.5 0 0 1 6 3.5Z",...E}),(0,h.jsx)("path",{d:"M9.5 9h5M9.5 12.5h3",...E})]})}function we({size:e=14}){return U(e,(0,h.jsx)("path",{d:"M12 5.5v13M5.5 12h13",...E}))}function Be({size:e=12,open:t=!1}){return(0,h.jsx)("svg",{viewBox:"0 0 24 24",width:e,height:e,"aria-hidden":"true",focusable:"false",fill:"none",style:{transform:t?"rotate(90deg)":"none",transition:"transform 120ms ease"},children:(0,h.jsx)("path",{d:"M9 5.5 15.5 12 9 18.5",...E})})}function We({size:e=14}){return U(e,(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("circle",{cx:"11",cy:"11",r:"5.75",...E}),(0,h.jsx)("path",{d:"M15.4 15.4 19 19",...E})]}))}function ye({size:e=14}){return U(e,(0,h.jsx)(h.Fragment,{children:(0,h.jsx)("path",{d:"M4.5 7h15M10 4.5h4M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12",...E})}))}function ae({size:e=14}){return U(e,(0,h.jsx)(h.Fragment,{children:(0,h.jsx)("path",{d:"M4.5 19.5h4L19 9a2 2 0 0 0 0-2.8l-1.2-1.2A2 2 0 0 0 15 5L4.5 15.5v4Z",...E})}))}function oe({size:e=14}){return U(e,(0,h.jsx)("path",{d:"M6 6l12 12M18 6 6 18",...E}))}function _e({size:e=14}){return U(e,(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("path",{d:"M12 3.5v11M8 10.5 12 14.5 16 10.5",...E}),(0,h.jsx)("path",{d:"M5 17v2a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-2",...E})]}))}function He({size:e=14}){return U(e,(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("path",{d:"M6 3.5h9.2L19 7.3V18a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 18V6a2.5 2.5 0 0 1 1-2Z",...E}),(0,h.jsx)("path",{d:"M8.5 3.5v5h6M8.5 20.5v-6h7v6",...E})]}))}var pe=require("react");function ve(){return typeof document>"u"||!document.body?"light":document.body.hasAttribute("data-ds-dark-theme")?"dark":"light"}function Ue(){let[e,t]=(0,pe.useState)(ve);return(0,pe.useEffect)(()=>{if(typeof MutationObserver!="function"||typeof document>"u"||!document.body)return;let a=new MutationObserver(()=>t(ve()));return a.observe(document.body,{attributes:!0,attributeFilter:["data-ds-dark-theme","class"]}),t(ve()),()=>a.disconnect()},[]),e}var f=require("react/jsx-runtime"),gt=800,mt=16*1024*1024;function bt(e){if(typeof e!="string"||!e.startsWith("asset://"))return e;let t=e.slice(8),a=t.lastIndexOf("."),i=a===-1?t:t.slice(0,a),d=a===-1?"png":t.slice(a+1);return`/-/notes/asset?sha=${encodeURIComponent(i)}&ext=${encodeURIComponent(d)}`}function xe({pageId:e,t,onChanged:a,onGone:i}){let[d,o]=(0,g.useState)(null),[l,p]=(0,g.useState)("idle"),[w,P]=(0,g.useState)(""),I=(0,g.useRef)(i);return I.current=i,(0,g.useEffect)(()=>{if(!e){o(null),p("idle");return}let B=!1;return p("loading"),P(""),N.readPage(e).then(C=>{B||(o(C),p("ready"))}).catch(C=>{B||(P(String(C&&C.message||C)),p("error"),C&&C.status===404&&typeof I.current=="function"&&I.current())}),()=>{B=!0}},[e]),e?l==="loading"||l==="idle"?(0,f.jsx)("div",{className:"n-empty",children:t.loading}):l==="error"?(0,f.jsx)("div",{className:"n-empty",children:w}):d?(0,f.jsx)(yt,{page:d,t,onSaved:a},d.id):(0,f.jsx)("div",{className:"n-empty",children:t.loading}):(0,f.jsx)("div",{className:"n-empty",children:t.noPage})}function wt({t:e}){return(0,f.jsxs)("div",{className:"n-editor-skeleton",role:"status","aria-live":"polite",children:[(0,f.jsx)("div",{className:"n-skel-line",style:{width:"38%",height:"18px"}}),(0,f.jsx)("div",{className:"n-skel-line",style:{width:"92%"}}),(0,f.jsx)("div",{className:"n-skel-line",style:{width:"86%"}}),(0,f.jsx)("div",{className:"n-skel-line",style:{width:"70%"}}),(0,f.jsx)("div",{className:"n-skel-hint",children:e.loading})]})}function yt({page:e,t,onSaved:a}){let[i,d]=(0,g.useState)(null),[o,l]=(0,g.useState)(""),[p,w]=(0,g.useState)(e.title&&e.title!==t.untitled?e.title:""),[P,I]=(0,g.useState)("saved"),[B,C]=(0,g.useState)(null),[R,S]=(0,g.useState)(""),G=(0,g.useRef)({...e}),$=(0,g.useRef)(!1),W=(0,g.useRef)(0),H=(0,g.useRef)(!1),A=(0,g.useRef)(null),V=(0,g.useRef)(!1),y=(0,g.useRef)(null),J=(0,g.useRef)(p),_=(0,g.useRef)(t),j=(0,g.useRef)(a);J.current=p,_.current=t,j.current=a,(0,g.useEffect)(()=>{let m=!1;return Oe().then(b=>{m||d(b)}).catch(b=>{m||l(String(b&&b.message||b))}),()=>{m=!0}},[]);let x=(0,g.useCallback)(async({force:m=!1,rev:b}={})=>{let se=y.current;if(!se)return;if(V.current){H.current=!0;return}if(!$.current&&!m)return;let ne=W.current,v=G.current,Q;try{Q=JSON.parse(JSON.stringify(se.document))}catch(k){S(String(k&&k.message||k));return}V.current=!0,I("saving");try{let k=await N.savePage({id:v.id,title:J.current.trim()||_.current.untitled,blocks:Q,rev:b===void 0?v.rev:b,baseMtimeMs:v.mtimeMs,baseSize:v.size});if(G.current={...k.page},W.current===ne?($.current=!1,I("saved")):I("dirty"),C(null),k.conflictFile){let le=String(k.conflictFile).split(/[\\/]/).pop();S(`已保存；外部改动留档为 ${le}`)}typeof j.current=="function"&&j.current(k.page)}catch(k){k&&k.status===409?(C(k.current||null),I("error")):(I("error"),S(String(k&&k.message||k)))}finally{V.current=!1,(H.current||$.current&&W.current!==ne)&&(H.current=!1,q.current())}},[]),O=(0,g.useCallback)(()=>{A.current&&clearTimeout(A.current),A.current=setTimeout(()=>{A.current=null,x()},gt)},[x]),q=(0,g.useRef)(O);q.current=O,(0,g.useEffect)(()=>()=>{A.current&&(clearTimeout(A.current),A.current=null),$.current&&x({force:!0}).catch(()=>{})},[x]),(0,g.useEffect)(()=>{let m=b=>{(b.metaKey||b.ctrlKey)&&!b.altKey&&String(b.key).toLowerCase()==="s"&&(b.preventDefault(),x({force:!0}))};return window.addEventListener("keydown",m,!0),()=>window.removeEventListener("keydown",m,!0)},[x]);let ie=(0,g.useCallback)(async m=>{if(m&&m.size>mt)throw new Error(_.current.imageTooLarge);let b=await N.uploadAsset(m);return`asset://${b.sha}.${b.ext}`},[]),X=(0,g.useCallback)(async m=>bt(m),[]),Y=(0,g.useMemo)(()=>({initialContent:Array.isArray(e.blocks)&&e.blocks.length>0?e.blocks:void 0,uploadFile:ie,resolveFileUrl:X}),[e.id]);return(0,f.jsxs)("div",{className:"n-main",children:[(0,f.jsxs)("div",{className:"n-topbar",children:[(0,f.jsx)("input",{className:"n-title-input",value:p,placeholder:t.untitled,"aria-label":t.title,onChange:m=>{w(m.target.value),$.current=!0,W.current+=1,I("dirty"),O()},onBlur:()=>x()}),(0,f.jsx)("span",{className:`n-save-state${P==="error"?" is-error":""}`,role:"status","aria-live":"polite",children:P==="saving"?t.saving:P==="dirty"?t.unsaved:P==="error"?t.conflict:t.saved}),(0,f.jsx)("a",{className:"n-btn is-icon",href:N.exportUrl(e.id),download:!0,title:t.exportMd,"aria-label":t.exportMd,children:(0,f.jsx)(_e,{})}),(0,f.jsx)("button",{type:"button",className:"n-btn is-icon",title:t.save,"aria-label":t.save,onClick:()=>x({force:!0}),children:(0,f.jsx)(He,{})})]}),B&&(0,f.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,f.jsxs)("span",{className:"n-banner-text",children:[(0,f.jsx)("b",{children:t.conflict})," — ",t.conflictBody]}),(0,f.jsx)("button",{type:"button",className:"n-btn",onClick:()=>{let m=B.rev;C(null),$.current=!0,W.current+=1,x({force:!0,rev:m})},children:t.overwrite}),(0,f.jsx)("button",{type:"button",className:"n-btn",onClick:async()=>{C(null);try{let m=await N.readPage(G.current.id);G.current={...m},w(m.title===t.untitled?"":m.title);let b=y.current;b&&Array.isArray(m.blocks)&&b.replaceBlocks(b.document,m.blocks),$.current=!1,I("saved")}catch(m){S(String(m&&m.message||m))}},children:t.reload})]}),R&&(0,f.jsxs)("div",{className:"n-banner",role:"status",children:[(0,f.jsx)("span",{className:"n-banner-text",children:R}),(0,f.jsx)("button",{type:"button",className:"n-btn is-icon","aria-label":t.close,onClick:()=>S(""),children:(0,f.jsx)(oe,{})})]}),(0,f.jsx)("div",{className:"n-editor-scroll",children:(0,f.jsxs)("div",{className:"n-editor",children:[o&&(0,f.jsx)("div",{className:"n-empty",children:o}),!i&&!o&&(0,f.jsx)(wt,{t}),i&&(0,f.jsx)(vt,{runtime:i,options:Y,t,onReady:m=>{y.current=m},onChange:()=>{$.current=!0,W.current+=1,I(m=>m==="saving"?m:"dirty"),O()}})]})})]})}function vt({runtime:e,options:t,t:a,onReady:i,onChange:d}){let{useCreateBlockNote:o,BlockNoteView:l}=e,p=Ue(),w=o(t);return(0,g.useEffect)(()=>{w&&i(w)},[w,i]),w?(0,f.jsx)("div",{className:"n-blocknote",children:(0,f.jsx)(l,{editor:w,theme:p,onChange:d})}):null}var xt={label:"全部笔记本",panelLabel:"笔记本",title:"全部笔记本",currentWorkspace:"当前工作区",noWorkspace:"未选择工作区",createNotebook:"新建笔记本",openNotebook:"打开笔记本",orphan:"游离",newPage:"新建页面",newChild:"新建子笔记本",rename:"重命名",delete:"删除",exportMd:"导出 Markdown",save:"保存",saved:"已保存",saving:"保存中…",unsaved:"未保存",conflict:"他处已修改",conflictBody:"这份笔记在别处被改过。覆盖会丢掉对方的改动。",overwrite:"覆盖",reload:"载入最新",empty:"还没有笔记本",emptyHint:"在左侧选中一个工作区，点「新建笔记本」开始。",noPage:"选一个页面开始编辑，或者新建一页。",untitled:"无标题",search:"搜索",clearSearch:"清空搜索",pages:"页面",emptyPageTitle:"这个笔记本还没有页面",emptyPageHint:"点「新建页面」开始写。",searchPlaceholder:"搜索标题与正文…",searchEmpty:"没有命中",deleteNotebookConfirm:e=>`删除笔记本「${e}」？它和里面的页面都会进回收站。`,deletePageConfirm:e=>`删除页面「${e}」？会进回收站。`,renamePrompt:"新名字",loading:"载入中…",retry:"重试",unavailable:"笔记本服务不可用",unavailableHint:"宿主路由没有注册成功，请重启 dsh web 后刷新页面。",imageTooLarge:"图片太大（上限 16MB）",uploadFailed:"图片上传失败",chars:e=>`${e} 字`,more:"更多",noResults:"没有结果",notebook:"笔记本",page:"页面",rightTab:"笔记本",rightTabDesc:"当前工作区的笔记本，直接开在右侧栏",rightEmptyHint:"点上面的「新建笔记本」开始。",close:"关闭"},kt={label:"All notebooks",panelLabel:"Notebook",title:"All notebooks",currentWorkspace:"Current workspace",noWorkspace:"No workspace selected",createNotebook:"New notebook",openNotebook:"Open notebook",orphan:"Orphan",newPage:"New page",newChild:"New sub-notebook",rename:"Rename",delete:"Delete",exportMd:"Export markdown",save:"Save",saved:"Saved",saving:"Saving…",unsaved:"Unsaved",conflict:"Changed elsewhere",conflictBody:"This note changed on disk. Overwriting discards the other version.",overwrite:"Overwrite",reload:"Reload latest",empty:"No notebooks yet",emptyHint:"Pick a workspace on the left, then click “New notebook”.",noPage:"Pick a page to start writing, or create one.",untitled:"Untitled",search:"Search",clearSearch:"Clear search",pages:"Pages",emptyPageTitle:"No pages yet",emptyPageHint:"Click New page to start writing.",searchPlaceholder:"Search titles and text…",searchEmpty:"Nothing matched",deleteNotebookConfirm:e=>`Delete notebook “${e}”? It and its pages go to the trash.`,deletePageConfirm:e=>`Delete page “${e}”? It goes to the trash.`,renamePrompt:"New name",loading:"Loading…",retry:"Retry",unavailable:"Notebook service unavailable",unavailableHint:"The host route did not register. Restart dsh web, then reload this page.",imageTooLarge:"Image too large (16MB limit)",uploadFailed:"Image upload failed",chars:e=>`${e} chars`,more:"More",noResults:"No results",notebook:"Notebook",page:"Page",rightTab:"Notebooks",rightTabDesc:"Notebook of the current workspace, opened in the right sidebar",rightEmptyHint:"Use “New notebook” above to get started.",close:"Close"};function ue(){let e=typeof document<"u"&&document.documentElement.lang||"zh-CN";return String(e).toLowerCase().startsWith("zh")?"zh":"en"}function F(e){return(e||ue())==="zh"?xt:kt}function je(e){if(typeof MutationObserver!="function"||typeof document>"u")return()=>{};let t=new MutationObserver(a=>{for(let i of a)if(i.attributeName==="lang"){e(ue());return}});return t.observe(document.documentElement,{attributes:!0,attributeFilter:["lang"]}),()=>t.disconnect()}function Ke(e,t){if(!e||!t)return!1;let a=ke(String(e)),i=ke(String(t));return a===i||a===`/private${i}`||i===`/private${a}`}function Ne(e){if(!e)return"";let t=ke(String(e));return t.startsWith("/private/")?t.slice(8):t}function ke(e){return e.length>1&&e.endsWith("/")?e.slice(0,-1):e}var fe=require("react");function Nt(e){try{let t=e.get&&e.get("uiSession"),a=t&&(t.current||t.adapter?.current)||null,i=a&&typeof a.getSnapshot=="function"?a.getSnapshot():null;if(i&&typeof i.key=="string")return i.key}catch{}try{let t=e.get&&e.get("sessions"),a=t&&t.list&&t.list.getSnapshot();if(a&&a.byId){let i=Object.values(a.byId).find(d=>(d.retainedBy?.mainView??0)>0);if(i&&i.id)return i.id}}catch{}}function Ct(e,t){if(!t)return null;let a="";try{let i=e.get&&e.get("workspaces"),d=i&&i.list&&i.list.getSnapshot(),l=(d&&d.items||[]).find(p=>p.path===t);l&&(a=l.title||l.displayTitle||"")}catch{}if(!a){let i=String(t).split(/[\\/]/).filter(Boolean);a=i.length?i[i.length-1]:t}return{path:t,title:a}}function Fe(e){let t=Nt(e);if(!t)return null;try{let a=e.get&&e.get("sessions"),i=a&&a.list&&a.list.getSnapshot(),d=i&&i.byId&&i.byId[t];return d?Ct(e,d.cwd):null}catch{return null}}function Ve(e){let[t,a]=(0,fe.useState)(()=>Fe(e));return(0,fe.useEffect)(()=>{let i=()=>a(Fe(e)),d=[],o=(p,w)=>{try{let P=w(p);P&&typeof P.subscribe=="function"&&d.push(P.subscribe(i)||(()=>{}))}catch{}},l=e.get&&e.get("uiSession");try{let p=l&&(l.current||l.adapter?.current)||null;p&&typeof p.subscribe=="function"&&d.push(p.subscribe(i)||(()=>{}))}catch{}try{let p=e.get&&e.get("sessions");o(p,w=>w.list)}catch{}try{let p=e.get&&e.get("workspaces");o(p,w=>w.list)}catch{}return i(),()=>{for(let p of d)try{p()}catch{}}},[e]),t}var r=require("react/jsx-runtime");function St(e){let t=Array.isArray(e?.notebooks)?e.notebooks:[],a=Array.isArray(e?.pages)?e.pages:[],i=new Map(t.map(l=>[l.id,l])),d=new Map;for(let l of t){let p=l.parentId&&i.has(l.parentId)?l.parentId:null;d.has(p)||d.set(p,[]),d.get(p).push(l)}for(let l of d.values())l.sort((p,w)=>(p.order??0)-(w.order??0)||p.title.localeCompare(w.title));let o=new Map;for(let l of a)o.has(l.notebookId)||o.set(l.notebookId,[]),o.get(l.notebookId).push(l);for(let l of o.values())l.sort((p,w)=>(p.order??0)-(w.order??0)||(w.updatedAt??0)-(p.updatedAt??0));return{byId:i,children:d,pagesOf:o,root:d.get(null)||[],notebookCount:t.length}}function Je({value:e,onChange:t,onCommit:a,onCancel:i}){let d=(0,u.useRef)(null);return(0,u.useEffect)(()=>{d.current?.focus(),d.current?.select()},[]),(0,r.jsx)("input",{ref:d,className:"n-title-input",style:{height:"22px",fontSize:"13px",fontWeight:500},value:e,onChange:o=>t(o.target.value),onBlur:a,onKeyDown:o=>{o.key==="Enter"?(o.preventDefault(),a()):o.key==="Escape"&&(o.preventDefault(),i())}})}function he({ctx:e,autoCreate:t=!0,compact:a=!1}){let[i,d]=(0,u.useState)(ue());(0,u.useEffect)(()=>je(d),[]);let o=(0,u.useMemo)(()=>F(i),[i]),l=Ve(e),[p,w]=(0,u.useState)({notebooks:[],pages:[]}),[P,I]=(0,u.useState)(!0),[B,C]=(0,u.useState)(""),[R,S]=(0,u.useState)(null),[G,$]=(0,u.useState)(()=>new Set),[W,H]=(0,u.useState)(""),[A,V]=(0,u.useState)(null),[y,J]=(0,u.useState)(null),[_,j]=(0,u.useState)(null),[x,O]=(0,u.useState)(null),[q,ie]=(0,u.useState)(!1),X=(0,u.useRef)(null),Y=(0,u.useRef)(!0);(0,u.useEffect)(()=>(Y.current=!0,()=>{Y.current=!1}),[]);let m=l?.path||"";(0,u.useEffect)(()=>{S(null),Q.current=!1},[m]);let b=(0,u.useMemo)(()=>St(p),[p]),se=(0,u.useMemo)(()=>{let n=new Set;try{let s=e&&typeof e.get=="function"?e.get("workspaces"):null,c=s&&s.list&&s.list.getSnapshot();for(let L of c&&c.items||[])L.path&&n.add(Ne(L.path))}catch{}return n},[e,p]);(0,u.useEffect)(()=>{if(!a)return;let n=(p.pages||[]).filter(s=>y&&s.notebookId===y.id);S(s=>n.some(c=>c.id===s)?s:n[0]?.id||null)},[a,y,p]);let ne=(0,u.useMemo)(()=>{if(!R)return null;let n=(p.pages||[]).find(s=>s.id===R);return n?n.notebookId:null},[R,p]),v=(0,u.useCallback)(async()=>{C("");try{let n=await N.tree();return w({notebooks:n.notebooks||[],pages:n.pages||[]}),I(!1),n}catch(n){return I(!1),C(String(n&&n.message||n)),null}},[]);(0,u.useEffect)(()=>{v()},[v]);let Q=(0,u.useRef)(!1);(0,u.useEffect)(()=>{P||Q.current||!l||!l.path||t&&(Q.current=!0,(async()=>{try{if(await N.findWorkspace(l.path))return;let s=await N.createNotebook({title:l.title,workspacePath:l.path,workspaceLabel:l.title}),c=await N.createPage({notebookId:s.id,title:F().untitled});if(!Y.current)return;let L=await N.tree();if(!Y.current)return;w({notebooks:L.notebooks||[],pages:L.pages||[]}),$(D=>new Set(D).add(s.id)),S(c.id)}catch{}})())},[P,l&&l.path,t]),(0,u.useEffect)(()=>{let n=l?.path;if(!n){J(null);return}let s=!1;return N.findWorkspace(n).then(c=>{s||J(c)}).catch(()=>{s||J(null)}),()=>{s=!0}},[l?.path,p]),(0,u.useEffect)(()=>{let n=W.trim();if(!n){V(null);return}let s=!1,c=setTimeout(()=>{N.search(n,30).then(L=>{s||V(L)}).catch(()=>{s||V([])})},200);return()=>{s=!0,clearTimeout(c)}},[W]);let k=(0,u.useCallback)(async n=>{ie(!0);try{return await n()}finally{ie(!1)}},[]),le=(0,u.useCallback)(async()=>{if(!l?.path)return null;if(y)return y;let n=await N.bindWorkspace({workspacePath:l.path,workspaceLabel:l.title,title:l.title});return J(n.notebook),n.notebook},[l,y]),be=(0,u.useCallback)(async n=>{if(!n)return;$(c=>new Set(c).add(n.id));let s=(b.pagesOf.get(n.id)||[])[0];s?S(s.id):await Z(n.id)},[b]),Z=(0,u.useCallback)(async n=>{let s=n||ne||y&&y.id;s&&await k(async()=>{try{let c=await N.createPage({notebookId:s,title:o.untitled});$(L=>new Set(L).add(s)),await v(),S(c.id)}catch(c){C(String(c&&c.message||c))}})},[ne,y,v,o,k]),Qe=(0,u.useCallback)(async(n=null)=>{await k(async()=>{try{let s=await N.createNotebook({parentId:n,title:o.notebook});await v(),n&&$(c=>new Set(c).add(n)),O({kind:"notebook",id:s.id,value:s.title})}catch(s){C(String(s&&s.message||s))}})},[v,o,k]),et=(0,u.useCallback)(async()=>{await k(async()=>{try{let n=await le();await v(),await be(n)}catch(n){C(String(n&&n.message||n))}})},[le,v,be,k]),Ce=(0,u.useCallback)(async()=>{let n=x;if(O(null),!n)return;let s=n.value.trim();if(s)try{if(n.kind==="notebook")await N.updateNotebook(n.id,{title:s});else{let c=await N.readPage(n.id);await N.savePage({id:c.id,title:s,rev:c.rev,baseMtimeMs:c.mtimeMs,baseSize:c.size})}await v()}catch(c){C(String(c&&c.message||c))}},[x,v]),tt=(0,u.useCallback)(async()=>{let n=_;if(j(null),!!n)try{n.kind==="page"?(await N.deletePage(n.id),R===n.id&&S(null)):await N.deleteNotebook(n.id),await v()}catch(s){C(String(s&&s.message||s))}},[_,R,v]),Se=(0,u.useCallback)(n=>{$(s=>{let c=new Set(s);return c.has(n)?c.delete(n):c.add(n),c})},[]);(0,u.useEffect)(()=>{let n=s=>{let c=s.metaKey||s.ctrlKey;c&&s.key.toLowerCase()==="p"?(s.preventDefault(),X.current?.focus(),X.current?.select?.()):c&&s.shiftKey&&s.key.toLowerCase()==="n"?(s.preventDefault(),Z()):s.key==="Escape"&&document.activeElement===X.current&&H("")};return window.addEventListener("keydown",n),()=>window.removeEventListener("keydown",n)},[Z]);let nt=(n,s)=>(b.pagesOf.get(n)||[]).map(c=>{let L=x&&x.kind==="page"&&x.id===c.id;return(0,r.jsxs)("div",{className:`n-row${R===c.id?" is-active":""}`,style:{paddingLeft:`${8+s*12+16}px`},role:"treeitem","aria-selected":R===c.id?"true":"false",tabIndex:0,onClick:()=>S(c.id),onKeyDown:D=>{(D.key==="Enter"||D.key===" ")&&(D.preventDefault(),S(c.id))},children:[(0,r.jsx)(De,{}),L?(0,r.jsx)(Je,{value:x.value,onChange:D=>O({...x,value:D}),onCommit:Ce,onCancel:()=>O(null)}):(0,r.jsx)("span",{className:"n-row-title",children:c.title||o.untitled}),(0,r.jsxs)("span",{className:"n-row-actions",children:[(0,r.jsx)("button",{type:"button",className:"n-btn is-icon",title:o.rename,"aria-label":o.rename,onClick:D=>{D.stopPropagation(),O({kind:"page",id:c.id,value:c.title||""})},children:(0,r.jsx)(ae,{})}),(0,r.jsx)("button",{type:"button",className:"n-btn is-icon is-danger",title:o.delete,"aria-label":o.delete,onClick:D=>{D.stopPropagation(),j({kind:"page",id:c.id,title:c.title||o.untitled})},children:(0,r.jsx)(ye,{})})]})]},c.id)}),Pe=(n,s)=>{let c=G.has(n.id),L=b.children.get(n.id)||[],D=b.pagesOf.get(n.id)||[],Ie=L.length>0||D.length>0,at=x&&x.kind==="notebook"&&x.id===n.id,ot=n.workspacePath&&l?.path&&Ke(n.workspacePath,l.path),it=!n.workspacePath||se.has(Ne(n.workspacePath));return(0,r.jsxs)("div",{children:[(0,r.jsxs)("div",{className:"n-row is-notebook",style:{paddingLeft:`${8+s*12}px`},role:"treeitem","aria-expanded":c?"true":"false",tabIndex:0,onClick:()=>Se(n.id),onKeyDown:T=>{(T.key==="Enter"||T.key===" ")&&(T.preventDefault(),Se(n.id))},title:n.workspacePath||n.title,children:[(0,r.jsx)("span",{className:`n-twist${Ie?"":" is-leaf"}`,"aria-hidden":"true",children:(0,r.jsx)(Be,{open:c})}),(0,r.jsx)(re,{}),at?(0,r.jsx)(Je,{value:x.value,onChange:T=>O({...x,value:T}),onCommit:Ce,onCancel:()=>O(null)}):(0,r.jsx)("span",{className:"n-row-title",children:n.title}),ot&&(0,r.jsx)("span",{className:"n-row-badge",children:o.currentWorkspace}),n.workspacePath&&!it&&(0,r.jsx)("span",{className:"n-row-badge",children:o.orphan}),(0,r.jsxs)("span",{className:"n-row-actions",children:[(0,r.jsx)("button",{type:"button",className:"n-btn is-icon",title:o.newPage,"aria-label":o.newPage,onClick:T=>{T.stopPropagation(),Z(n.id)},children:(0,r.jsx)(we,{})}),(0,r.jsx)("button",{type:"button",className:"n-btn is-icon",title:o.newChild,"aria-label":o.newChild,onClick:T=>{T.stopPropagation(),Qe(n.id)},children:(0,r.jsx)(re,{size:12})}),(0,r.jsx)("button",{type:"button",className:"n-btn is-icon",title:o.rename,"aria-label":o.rename,onClick:T=>{T.stopPropagation(),O({kind:"notebook",id:n.id,value:n.title})},children:(0,r.jsx)(ae,{})}),(0,r.jsx)("button",{type:"button",className:"n-btn is-icon is-danger",title:o.delete,"aria-label":o.delete,onClick:T=>{T.stopPropagation(),j({kind:"notebook",id:n.id,title:n.title})},children:(0,r.jsx)(ye,{})})]})]}),c&&(0,r.jsxs)("div",{role:"group",children:[L.map(T=>Pe(T,s+1)),nt(n.id,s),!Ie&&(0,r.jsx)("div",{className:"n-row",style:{paddingLeft:`${8+(s+1)*12+16}px`,color:"var(--dsw-alias-label-tertiary)"},children:(0,r.jsx)("span",{className:"n-row-title",children:o.noPage})})]})]},n.id)},Ee=l?l.title:o.noWorkspace,rt=!!l?.path;if(a){let n=(p.pages||[]).filter(s=>y&&s.notebookId===y.id);return(0,r.jsxs)("div",{className:"n-app is-compact",children:[(0,r.jsxs)("div",{className:"n-compact-bar",children:[(0,r.jsxs)("span",{className:"n-wsbar-name",title:l?.path||"",children:[(0,r.jsx)(re,{}),(0,r.jsx)("b",{children:Ee})]}),(0,r.jsxs)("span",{className:"n-wsbar-actions",children:[(0,r.jsxs)("button",{type:"button",className:"n-btn",disabled:!rt||q,onClick:()=>y?be(y):et(),children:[(0,r.jsx)(we,{}),y?o.openNotebook:o.createNotebook]}),(0,r.jsx)("button",{type:"button",className:"n-btn",disabled:q||!y,title:o.newPage,"aria-label":o.newPage,onClick:()=>y&&Z(y.id),children:(0,r.jsx)(ae,{})})]})]}),B&&(0,r.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,r.jsx)("span",{className:"n-banner-text",children:B}),(0,r.jsx)("button",{type:"button",className:"n-btn",onClick:v,children:o.retry})]}),n.length>0&&(0,r.jsxs)("select",{className:"n-compact-pages","aria-label":o.pages,value:R||"",onChange:s=>S(s.target.value||null),children:[(0,r.jsx)("option",{value:"",children:o.pages}),n.map(s=>(0,r.jsx)("option",{value:s.id,children:s.title||o.untitled},s.id))]}),R?(0,r.jsx)(xe,{pageId:R,t:o,onChanged:()=>v(),onGone:()=>{S(null),v()}}):(0,r.jsxs)("div",{className:"n-empty is-compact",children:[(0,r.jsx)("b",{children:o.emptyPageTitle}),(0,r.jsx)("div",{children:o.emptyPageHint}),(0,r.jsx)("button",{type:"button",className:"n-btn",disabled:q||!y,onClick:()=>y&&Z(y.id),children:o.newPage})]})]})}return(0,r.jsxs)("div",{className:"n-app",children:[(0,r.jsxs)("aside",{className:"n-side",children:[(0,r.jsxs)("div",{className:"n-wsbar",children:[(0,r.jsx)("span",{className:"n-wsbar-label",children:o.currentWorkspace}),(0,r.jsxs)("span",{className:"n-wsbar-name",title:l?.path||"",children:[(0,r.jsx)(re,{}),(0,r.jsx)("b",{children:Ee})]}),(0,r.jsx)("span",{className:"n-wsbar-actions",children:(0,r.jsx)("button",{type:"button",className:"n-btn is-icon",disabled:q,title:o.newPage,"aria-label":o.newPage,onClick:()=>Z(),children:(0,r.jsx)(ae,{})})})]}),(0,r.jsxs)("div",{className:"n-search",children:[(0,r.jsx)(We,{}),(0,r.jsx)("input",{ref:X,type:"search",value:W,placeholder:o.searchPlaceholder,"aria-label":o.search,onChange:n=>H(n.target.value)}),W&&(0,r.jsx)("button",{type:"button",className:"n-btn is-icon","aria-label":o.clearSearch,onClick:()=>H(""),children:(0,r.jsx)(oe,{size:12})})]}),B&&(0,r.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,r.jsx)("span",{className:"n-banner-text",children:B}),(0,r.jsx)("button",{type:"button",className:"n-btn",onClick:v,children:o.retry})]}),_&&(0,r.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,r.jsx)("span",{className:"n-banner-text",children:_.kind==="notebook"?o.deleteNotebookConfirm(_.title):o.deletePageConfirm(_.title)}),(0,r.jsx)("button",{type:"button",className:"n-btn is-danger",onClick:tt,children:o.delete}),(0,r.jsx)("button",{type:"button",className:"n-btn",onClick:()=>j(null),children:(0,r.jsx)(oe,{size:12})})]}),(0,r.jsxs)("div",{className:"n-tree",role:"tree","aria-label":o.title,children:[P&&(0,r.jsx)("div",{className:"n-tree-empty",children:o.loading}),!P&&A&&(0,r.jsxs)(r.Fragment,{children:[A.length===0&&(0,r.jsx)("div",{className:"n-tree-empty",children:o.noResults}),A.map(n=>(0,r.jsxs)("div",{className:"n-hit",role:"button",tabIndex:0,onClick:()=>{S(n.id),H("")},onKeyDown:s=>{s.key==="Enter"&&(S(n.id),H(""))},children:[(0,r.jsx)("div",{className:"n-hit-title",children:n.title||o.untitled}),n.snippet&&(0,r.jsx)("div",{className:"n-hit-snippet",children:n.snippet})]},n.id))]}),!P&&!A&&b.notebookCount===0&&(0,r.jsxs)("div",{className:"n-tree-empty",children:[(0,r.jsx)("b",{children:o.empty}),(0,r.jsx)("div",{children:o.emptyHint})]}),!P&&!A&&b.root.map(n=>Pe(n,0))]})]}),(0,r.jsx)(xe,{pageId:R,t:o,onChanged:()=>{v()},onGone:()=>{S(null),v()}})]})}var qe=require("react"),Ze=require("react/jsx-runtime"),te=class extends qe.Component{constructor(t){super(t),this.state={error:null}}static getDerivedStateFromError(t){return{error:t}}componentDidCatch(t,a){console.error("[dsh-notes] app crashed:",t&&t.message,`
    `,a&&a.componentStack)}render(){return this.state.error?(0,Ze.jsxs)("div",{className:"n-empty",children:["笔记本渲染失败：",String(this.state.error&&this.state.error.message||this.state.error)]}):this.props.children}};var ge=require("react/jsx-runtime");function Ge({ctx:e}){return(0,ge.jsx)("div",{className:"n-right-host",children:(0,ge.jsx)(te,{children:(0,ge.jsx)(he,{ctx:e,compact:!0,autoCreate:!0})})})}var Pt=`
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

    /* ---------- 右侧栏：工作区笔记本（compact） ---------- */
    .n-right-host {
      height: 100%;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    .n-app.is-compact {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      height: 100%;
    }
    .n-compact-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-bottom: 1px solid var(--dsw-alias-border-l2);
      flex: none;
      flex-wrap: wrap;
    }
    .n-compact-bar .n-wsbar-name {
      flex: 1;
      min-width: 0;
    }
    .n-compact-pages {
      margin: 8px 10px 0;
      flex: none;
      max-width: calc(100% - 20px);
      border: 1px solid var(--dsw-alias-border-l2);
      border-radius: 6px;
      background: var(--dsw-alias-bg-base);
      color: var(--dsw-alias-label-primary);
      padding: 4px 6px;
      font: inherit;
      font-size: 12px;
    }
    .n-app.is-compact .n-main {
      flex: 1;
      min-height: 0;
    }
    .n-app.is-compact .n-editor {
      padding: 12px 14px 80px;
    }
    .n-empty.is-compact {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 24px 16px;
      text-align: center;
    }
    `,Xe=!1;function Ye(){if(Xe||typeof document>"u")return;Xe=!0;let e="dsh-notes-styles";if(document.getElementById(e))return;let t=document.createElement("style");t.id=e,t.textContent=Pt,document.head.append(t)}var me=require("react/jsx-runtime"),Rt=["slots"];function $t(e){console.info("[dsh-notes] build","2026-11-06T10:14:48.668Z"),Ye(),Ae({react:Et,"react/jsx-runtime":It,"react-dom":Tt,"react-dom/client":Mt}),e.slots.inject("sidebar.panellist",()=>e.slots.register({name:"sidebar.panellist",id:"notes",order:40,label:()=>F().label},ze)),e.slots.inject("main",()=>e.slots.register({name:"main",key:"notes"},()=>(0,me.jsx)(te,{children:(0,me.jsx)(he,{ctx:e,autoCreate:!1})}))),e.inject(["slots","sidebarRightTabs"],t=>{let a=t.sidebarRightTabs,i=t.slots;a&&typeof a.register=="function"&&e.effect(()=>a.register({id:"dsh-notes",kind:"notes",title:()=>F().rightTab,guide:[{id:"workspace",order:20,title:()=>F().rightTab,description:()=>F().rightTabDesc}]}),"dsh-notes: right tab type"),i&&typeof i.inject=="function"&&e.effect(()=>i.inject("sidebar.right.pane.tab",()=>i.register({name:"sidebar.right.pane.tab",key:"dsh-notes"},d=>(0,me.jsx)(Ge,{ctx:e,...d}))),"dsh-notes: right tab body")})}

    return module.exports
  }
})
