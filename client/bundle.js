/* 由 tools/build.mjs 从 src/client/index.js 生成 —— 请勿手改。
 * 重新生成：npm run build
 */
window.__ModuleLoader__.load({
  id: "@tom2012/dsh-notes",
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
    var pt=Object.create;var ie=Object.defineProperty;var ut=Object.getOwnPropertyDescriptor;var ft=Object.getOwnPropertyNames;var gt=Object.getPrototypeOf,ht=Object.prototype.hasOwnProperty;var bt=(e,t)=>{for(var o in t)ie(e,o,{get:t[o],enumerable:!0})},Me=(e,t,o,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let d of ft(t))!ht.call(e,d)&&d!==o&&ie(e,d,{get:()=>t[d],enumerable:!(i=ut(t,d))||i.enumerable});return e};var se=(e,t,o)=>(o=e!=null?pt(gt(e)):{},Me(t||!e||!e.__esModule?ie(o,"default",{value:e,enumerable:!0}):o,e)),mt=e=>Me(ie({},"__esModule",{value:!0}),e);var zt={};bt(zt,{apply:()=>Dt,inject:()=>At});module.exports=mt(zt);var $t=se(require("react")),Rt=se(require("react/jsx-runtime")),Lt=se(require("react-dom")),Ot=se(require("react-dom/client"));var p=require("react");var $="/-/notes";function wt(e){return e===404?"接口不存在（宿主插件可能未加载）":e===403?"没有权限（宿主鉴权拒绝了请求）":e===409?"内容已在别处修改":e===413?"内容过大":e===503?"宿主服务不可用，请重启 dsh web":e>=500?"宿主内部错误":`HTTP ${e}`}async function z(e){let t=null;try{t=await e.json()}catch{t=null}if(!e.ok||t&&t.ok===!1){let o=new Error(t&&t.error||wt(e.status));throw o.status=e.status,t&&t.current!==void 0&&(o.current=t.current),o}return t||{}}function F(e){let t=[];for(let[o,i]of Object.entries(e||{}))i==null||i===""||t.push(`${encodeURIComponent(o)}=${encodeURIComponent(String(i))}`);return t.length?`?${t.join("&")}`:""}var v={base:$,async status(){return z(await fetch(`${$}/status`,{credentials:"same-origin"}))},async tree(){return z(await fetch(`${$}/tree`,{credentials:"same-origin"}))},async readPage(e){return(await z(await fetch(`${$}/page${F({id:e})}`,{credentials:"same-origin"}))).page},async savePage({id:e,title:t,blocks:o,rev:i,baseMtimeMs:d,baseSize:a}){let l={title:t,rev:i,baseMtimeMs:d,baseSize:a};return Array.isArray(o)&&(l.blocks=o),z(await fetch(`${$}/page${F({id:e})}`,{method:"PUT",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)}))},async createPage({notebookId:e,title:t,blocks:o,markdown:i}){let d={notebookId:e,title:t};return Array.isArray(o)&&(d.blocks=o),typeof i=="string"&&(d.markdown=i),(await z(await fetch(`${$}/page`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}))).page},async deletePage(e){return z(await fetch(`${$}/page${F({id:e})}`,{method:"DELETE",credentials:"same-origin"}))},async createNotebook({parentId:e=null,title:t,workspacePath:o=null,workspaceLabel:i=null}){return(await z(await fetch(`${$}/notebook`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({parentId:e,title:t,workspacePath:o,workspaceLabel:i})}))).notebook},async updateNotebook(e,t){return(await z(await fetch(`${$}/notebook${F({id:e})}`,{method:"PATCH",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(t||{})}))).notebook},async deleteNotebook(e){return z(await fetch(`${$}/notebook${F({id:e})}`,{method:"DELETE",credentials:"same-origin"}))},async findWorkspace(e){return(await z(await fetch(`${$}/workspace${F({path:e})}`,{credentials:"same-origin"}))).notebook},async bindWorkspace({workspacePath:e,title:t,workspaceLabel:o}){return z(await fetch(`${$}/workspace`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({workspacePath:e,title:t,workspaceLabel:o})}))},async search(e,t=30){return(await z(await fetch(`${$}/search${F({q:e,limit:t})}`,{credentials:"same-origin"}))).results||[]},async uploadAsset(e){let t=(e.name.split(".").pop()||"").toLowerCase(),o=await fetch(`${$}/asset`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":e.type||"application/octet-stream","x-notes-ext":t},body:e});return z(o)},exportUrl(e){return`${$}/export${F({id:e})}`}};var b=require("react");var $e="/-/notes/client",Oe={},ee=null;function Ae(e){Object.assign(Oe,e||{})}function Re(){return e=>{let t=Oe[e];if(t!==void 0)return t;throw new Error(`dsh-notes: 编辑器模块请求了未注册的依赖 ${e}`)}}function De(){return ee||(ee=new Promise((e,t)=>{if(typeof document>"u"){t(new Error("dsh-notes: 没有 document，无法加载编辑器"));return}let o="dsh-notes-editor-css";if(!document.getElementById(o)){let l=document.createElement("link");l.id=o,l.rel="stylesheet",l.href=`${$e}/editor.css`,document.head.append(l)}let i="__DSH_NOTES_EDITOR_FACTORY__",d=window[i];if(typeof d=="function"){try{e(d(Re()))}catch(l){t(Le(l))}return}let a=document.createElement("script");a.src=`${$e}/editor.js`,a.async=!0,a.onload=()=>{let l=window[i];if(typeof l!="function"){t(new Error("dsh-notes: 编辑器模块加载后没有注册工厂"));return}try{e(l(Re()))}catch(u){t(Le(u))}},a.onerror=()=>t(new Error("dsh-notes: 编辑器模块下载失败（/-/notes/client/editor.js）")),document.head.append(a)}),ee.catch(()=>{ee=null}),ee)}function Le(e){return e instanceof Error?e:new Error(String(e))}var h=require("react/jsx-runtime"),E={fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"};function U(e,t){return(0,h.jsx)("svg",{viewBox:"0 0 24 24",width:e,height:e,"aria-hidden":"true",focusable:"false",fill:"none",children:t})}function ne({size:e=16}){return U(e,(0,h.jsx)(h.Fragment,{children:(0,h.jsx)("path",{d:"M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-6-3.5-6 3.5V5A1.5 1.5 0 0 1 6 3.5Z",...E})}))}function ze({size:e=16}){return U(e,(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("path",{d:"M7 3.5h7.2L18.5 7.8V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z",...E}),(0,h.jsx)("path",{d:"M13.8 3.8V8h4.2",...E})]}))}function Be(){return(0,h.jsxs)("svg",{viewBox:"0 0 24 24",width:"20",height:"20","aria-hidden":"true",focusable:"false",fill:"none",children:[(0,h.jsx)("path",{d:"M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-6-3.5-6 3.5V5A1.5 1.5 0 0 1 6 3.5Z",...E}),(0,h.jsx)("path",{d:"M9.5 9h5M9.5 12.5h3",...E})]})}function be({size:e=14}){return U(e,(0,h.jsx)("path",{d:"M12 5.5v13M5.5 12h13",...E}))}function We({size:e=12,open:t=!1}){return(0,h.jsx)("svg",{viewBox:"0 0 24 24",width:e,height:e,"aria-hidden":"true",focusable:"false",fill:"none",style:{transform:t?"rotate(90deg)":"none",transition:"transform 120ms ease"},children:(0,h.jsx)("path",{d:"M9 5.5 15.5 12 9 18.5",...E})})}function _e({size:e=14}){return U(e,(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("circle",{cx:"11",cy:"11",r:"5.75",...E}),(0,h.jsx)("path",{d:"M15.4 15.4 19 19",...E})]}))}function me({size:e=14}){return U(e,(0,h.jsx)(h.Fragment,{children:(0,h.jsx)("path",{d:"M4.5 7h15M10 4.5h4M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12",...E})}))}function re({size:e=14}){return U(e,(0,h.jsx)(h.Fragment,{children:(0,h.jsx)("path",{d:"M4.5 19.5h4L19 9a2 2 0 0 0 0-2.8l-1.2-1.2A2 2 0 0 0 15 5L4.5 15.5v4Z",...E})}))}function ae({size:e=14}){return U(e,(0,h.jsx)("path",{d:"M6 6l12 12M18 6 6 18",...E}))}function je({size:e=14}){return U(e,(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("path",{d:"M12 3.5v11M8 10.5 12 14.5 16 10.5",...E}),(0,h.jsx)("path",{d:"M5 17v2a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-2",...E})]}))}function He({size:e=14}){return U(e,(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("path",{d:"M6 3.5h9.2L19 7.3V18a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 18V6a2.5 2.5 0 0 1 1-2Z",...E}),(0,h.jsx)("path",{d:"M8.5 3.5v5h6M8.5 20.5v-6h7v6",...E})]}))}var le=require("react");function we(){return typeof document>"u"||!document.body?"light":document.body.hasAttribute("data-ds-dark-theme")?"dark":"light"}function Ue(){let[e,t]=(0,le.useState)(we);return(0,le.useEffect)(()=>{if(typeof MutationObserver!="function"||typeof document>"u"||!document.body)return;let o=new MutationObserver(()=>t(we()));return o.observe(document.body,{attributes:!0,attributeFilter:["data-ds-dark-theme","class"]}),t(we()),()=>o.disconnect()},[]),e}var f=require("react/jsx-runtime"),yt=800,vt=16*1024*1024;function xt(e){if(typeof e!="string"||!e.startsWith("asset://"))return e;let t=e.slice(8),o=t.lastIndexOf("."),i=o===-1?t:t.slice(0,o),d=o===-1?"png":t.slice(o+1);return`/-/notes/asset?sha=${encodeURIComponent(i)}&ext=${encodeURIComponent(d)}`}function ye({pageId:e,t,onChanged:o,onGone:i}){let[d,a]=(0,b.useState)(null),[l,u]=(0,b.useState)("idle"),[y,N]=(0,b.useState)("");return(0,b.useEffect)(()=>{if(!e){a(null),u("idle");return}let R=!1;return u("loading"),N(""),v.readPage(e).then(T=>{R||(a(T),u("ready"))}).catch(T=>{R||(N(String(T&&T.message||T)),u("error"),T&&T.status===404&&typeof i=="function"&&i())}),()=>{R=!0}},[e,i]),e?l==="loading"||l==="idle"?(0,f.jsx)("div",{className:"n-empty",children:t.loading}):l==="error"?(0,f.jsx)("div",{className:"n-empty",children:y}):d?(0,f.jsx)(Nt,{page:d,t,onSaved:o},d.id):(0,f.jsx)("div",{className:"n-empty",children:t.loading}):(0,f.jsx)("div",{className:"n-empty",children:t.noPage})}function kt({t:e}){return(0,f.jsxs)("div",{className:"n-editor-skeleton",role:"status","aria-live":"polite",children:[(0,f.jsx)("div",{className:"n-skel-line",style:{width:"38%",height:"18px"}}),(0,f.jsx)("div",{className:"n-skel-line",style:{width:"92%"}}),(0,f.jsx)("div",{className:"n-skel-line",style:{width:"86%"}}),(0,f.jsx)("div",{className:"n-skel-line",style:{width:"70%"}}),(0,f.jsx)("div",{className:"n-skel-hint",children:e.loading})]})}function Nt({page:e,t,onSaved:o}){let[i,d]=(0,b.useState)(null),[a,l]=(0,b.useState)(""),[u,y]=(0,b.useState)(e.title&&e.title!==t.untitled?e.title:""),[N,R]=(0,b.useState)("saved"),[T,D]=(0,b.useState)(null),[L,k]=(0,b.useState)(""),X=(0,b.useRef)({...e}),O=(0,b.useRef)(!1),B=(0,b.useRef)(null),j=(0,b.useRef)(!1),H=(0,b.useRef)(null),Y=(0,b.useRef)(u),S=(0,b.useRef)(t),K=(0,b.useRef)(o);Y.current=u,S.current=t,K.current=o,(0,b.useEffect)(()=>{let g=!1;return De().then(m=>{g||d(m)}).catch(m=>{g||l(String(m&&m.message||m))}),()=>{g=!0}},[]);let I=(0,b.useCallback)(async({force:g=!1,rev:m}={})=>{let Z=H.current;if(!Z||j.current||!O.current&&!g)return;let W=X.current,oe;try{oe=JSON.parse(JSON.stringify(Z.document))}catch(C){k(String(C&&C.message||C));return}j.current=!0,R("saving");try{let C=await v.savePage({id:W.id,title:Y.current.trim()||S.current.untitled,blocks:oe,rev:m===void 0?W.rev:m,baseMtimeMs:W.mtimeMs,baseSize:W.size});if(X.current={...C.page},O.current=!1,R("saved"),D(null),C.conflictFile){let x=String(C.conflictFile).split(/[\\/]/).pop();k(`已保存；外部改动留档为 ${x}`)}typeof K.current=="function"&&K.current(C.page)}catch(C){C&&C.status===409?(D(C.current||null),R("error")):(R("error"),k(String(C&&C.message||C)))}finally{j.current=!1}},[]),J=(0,b.useCallback)(()=>{B.current&&clearTimeout(B.current),B.current=setTimeout(()=>{B.current=null,I()},yt)},[I]);(0,b.useEffect)(()=>()=>{B.current&&(clearTimeout(B.current),B.current=null),O.current&&I({force:!0}).catch(()=>{})},[I]),(0,b.useEffect)(()=>{let g=m=>{(m.metaKey||m.ctrlKey)&&!m.altKey&&String(m.key).toLowerCase()==="s"&&(m.preventDefault(),I({force:!0}))};return window.addEventListener("keydown",g,!0),()=>window.removeEventListener("keydown",g,!0)},[I]);let A=(0,b.useCallback)(async g=>{if(g&&g.size>vt)throw new Error(S.current.imageTooLarge);let m=await v.uploadAsset(g);return`asset://${m.sha}.${m.ext}`},[]),_=(0,b.useCallback)(async g=>xt(g),[]),G=(0,b.useMemo)(()=>({initialContent:Array.isArray(e.blocks)&&e.blocks.length>0?e.blocks:void 0,uploadFile:A,resolveFileUrl:_}),[e.id]);return(0,f.jsxs)("div",{className:"n-main",children:[(0,f.jsxs)("div",{className:"n-topbar",children:[(0,f.jsx)("input",{className:"n-title-input",value:u,placeholder:t.untitled,"aria-label":t.title,onChange:g=>{y(g.target.value),O.current=!0,R("dirty"),J()},onBlur:()=>I()}),(0,f.jsx)("span",{className:`n-save-state${N==="error"?" is-error":""}`,role:"status","aria-live":"polite",children:N==="saving"?t.saving:N==="dirty"?t.unsaved:N==="error"?t.conflict:t.saved}),(0,f.jsx)("a",{className:"n-btn is-icon",href:v.exportUrl(e.id),download:!0,title:t.exportMd,"aria-label":t.exportMd,children:(0,f.jsx)(je,{})}),(0,f.jsx)("button",{type:"button",className:"n-btn is-icon",title:t.save,"aria-label":t.save,onClick:()=>I({force:!0}),children:(0,f.jsx)(He,{})})]}),T&&(0,f.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,f.jsxs)("span",{className:"n-banner-text",children:[(0,f.jsx)("b",{children:t.conflict})," — ",t.conflictBody]}),(0,f.jsx)("button",{type:"button",className:"n-btn",onClick:()=>{let g=T.rev;D(null),O.current=!0,I({force:!0,rev:g})},children:t.overwrite}),(0,f.jsx)("button",{type:"button",className:"n-btn",onClick:async()=>{D(null);try{let g=await v.readPage(X.current.id);X.current={...g},y(g.title===t.untitled?"":g.title);let m=H.current;m&&Array.isArray(g.blocks)&&m.replaceBlocks(m.document,g.blocks),O.current=!1,R("saved")}catch(g){k(String(g&&g.message||g))}},children:t.reload})]}),L&&(0,f.jsxs)("div",{className:"n-banner",role:"status",children:[(0,f.jsx)("span",{className:"n-banner-text",children:L}),(0,f.jsx)("button",{type:"button",className:"n-btn is-icon","aria-label":t.close,onClick:()=>k(""),children:(0,f.jsx)(ae,{})})]}),(0,f.jsx)("div",{className:"n-editor-scroll",children:(0,f.jsxs)("div",{className:"n-editor",children:[a&&(0,f.jsx)("div",{className:"n-empty",children:a}),!i&&!a&&(0,f.jsx)(kt,{t}),i&&(0,f.jsx)(Ct,{runtime:i,options:G,t,onReady:g=>{H.current=g},onChange:()=>{O.current=!0,R(g=>g==="saving"?g:"dirty"),J()}})]})})]})}function Ct({runtime:e,options:t,t:o,onReady:i,onChange:d}){let{useCreateBlockNote:a,BlockNoteView:l}=e,u=Ue(),y=a(t);return(0,b.useEffect)(()=>{y&&i(y)},[y,i]),y?(0,f.jsx)("div",{className:"n-blocknote",children:(0,f.jsx)(l,{editor:y,theme:u,onChange:d})}):null}var St={label:"全部笔记本",panelLabel:"笔记本",title:"全部笔记本",currentWorkspace:"当前工作区",noWorkspace:"未选择工作区",createNotebook:"新建笔记本",openNotebook:"打开笔记本",orphan:"游离",newPage:"新建页面",newChild:"新建子笔记本",rename:"重命名",delete:"删除",exportMd:"导出 Markdown",save:"保存",saved:"已保存",saving:"保存中…",unsaved:"未保存",conflict:"他处已修改",conflictBody:"这份笔记在别处被改过。覆盖会丢掉对方的改动。",overwrite:"覆盖",reload:"载入最新",empty:"还没有笔记本",emptyHint:"在左侧选中一个工作区，点「新建笔记本」开始。",noPage:"选一个页面开始编辑，或者新建一页。",untitled:"无标题",search:"搜索",pages:"页面",emptyPageTitle:"这个笔记本还没有页面",emptyPageHint:"点「新建页面」开始写。",searchPlaceholder:"搜索标题与正文…",searchEmpty:"没有命中",deleteNotebookConfirm:e=>`删除笔记本「${e}」？它和里面的页面都会进回收站。`,deletePageConfirm:e=>`删除页面「${e}」？会进回收站。`,renamePrompt:"新名字",loading:"载入中…",retry:"重试",unavailable:"笔记本服务不可用",unavailableHint:"宿主路由没有注册成功，请重启 dsh web 后刷新页面。",imageTooLarge:"图片太大（上限 16MB）",uploadFailed:"图片上传失败",chars:e=>`${e} 字`,more:"更多",noResults:"没有结果",notebook:"笔记本",page:"页面",rightTab:"笔记本",rightTabDesc:"当前工作区的笔记本，直接开在右侧栏",rightEmptyHint:"点上面的「新建笔记本」开始。",close:"关闭"},Pt={label:"All notebooks",panelLabel:"Notebook",title:"All notebooks",currentWorkspace:"Current workspace",noWorkspace:"No workspace selected",createNotebook:"New notebook",openNotebook:"Open notebook",orphan:"Orphan",newPage:"New page",newChild:"New sub-notebook",rename:"Rename",delete:"Delete",exportMd:"Export markdown",save:"Save",saved:"Saved",saving:"Saving…",unsaved:"Unsaved",conflict:"Changed elsewhere",conflictBody:"This note changed on disk. Overwriting discards the other version.",overwrite:"Overwrite",reload:"Reload latest",empty:"No notebooks yet",emptyHint:"Pick a workspace on the left, then click “New notebook”.",noPage:"Pick a page to start writing, or create one.",untitled:"Untitled",search:"Search",pages:"Pages",emptyPageTitle:"No pages yet",emptyPageHint:"Click New page to start writing.",searchPlaceholder:"Search titles and text…",searchEmpty:"Nothing matched",deleteNotebookConfirm:e=>`Delete notebook “${e}”? It and its pages go to the trash.`,deletePageConfirm:e=>`Delete page “${e}”? It goes to the trash.`,renamePrompt:"New name",loading:"Loading…",retry:"Retry",unavailable:"Notebook service unavailable",unavailableHint:"The host route did not register. Restart dsh web, then reload this page.",imageTooLarge:"Image too large (16MB limit)",uploadFailed:"Image upload failed",chars:e=>`${e} chars`,more:"More",noResults:"No results",notebook:"Notebook",page:"Page",rightTab:"Notebooks",rightTabDesc:"Notebook of the current workspace, opened in the right sidebar",rightEmptyHint:"Use “New notebook” above to get started.",close:"Close"};function ce(){let e=typeof document<"u"&&document.documentElement.lang||"zh-CN";return String(e).toLowerCase().startsWith("zh")?"zh":"en"}function V(e){return(e||ce())==="zh"?St:Pt}function Ke(e){if(typeof MutationObserver!="function"||typeof document>"u")return()=>{};let t=new MutationObserver(o=>{for(let i of o)if(i.attributeName==="lang"){e(ce());return}});return t.observe(document.documentElement,{attributes:!0,attributeFilter:["lang"]}),()=>t.disconnect()}var Fe=null,Ve=new Set;function ve(){let e=Fe;return Fe=null,e}function Je(e){return Ve.add(e),()=>Ve.delete(e)}function Ze(e,t){if(!e||!t)return!1;let o=xe(String(e)),i=xe(String(t));return o===i||o===`/private${i}`||i===`/private${o}`}function ke(e){if(!e)return"";let t=xe(String(e));return t.startsWith("/private/")?t.slice(8):t}function xe(e){return e.length>1&&e.endsWith("/")?e.slice(0,-1):e}var de=require("react");function It(e){try{let t=e.get&&e.get("uiSession"),o=t&&(t.current||t.adapter?.current)||null,i=o&&typeof o.getSnapshot=="function"?o.getSnapshot():null;if(i&&typeof i.key=="string")return i.key}catch{}try{let t=e.get&&e.get("sessions"),o=t&&t.list&&t.list.getSnapshot();if(o&&o.byId){let i=Object.values(o.byId).find(d=>(d.retainedBy?.mainView??0)>0);if(i&&i.id)return i.id}}catch{}}function Et(e,t){if(!t)return null;let o="";try{let i=e.get&&e.get("workspaces"),d=i&&i.list&&i.list.getSnapshot(),l=(d&&d.items||[]).find(u=>u.path===t);l&&(o=l.title||l.displayTitle||"")}catch{}if(!o){let i=String(t).split(/[\\/]/).filter(Boolean);o=i.length?i[i.length-1]:t}return{path:t,title:o}}function qe(e){let t=It(e);if(!t)return null;try{let o=e.get&&e.get("sessions"),i=o&&o.list&&o.list.getSnapshot(),d=i&&i.byId&&i.byId[t];return d?Et(e,d.cwd):null}catch{return null}}function Xe(e){let[t,o]=(0,de.useState)(()=>qe(e));return(0,de.useEffect)(()=>{let i=()=>o(qe(e)),d=[],a=(u,y)=>{try{let N=y(u);N&&typeof N.subscribe=="function"&&d.push(N.subscribe(i)||(()=>{}))}catch{}},l=e.get&&e.get("uiSession");try{let u=l&&(l.current||l.adapter?.current)||null;u&&typeof u.subscribe=="function"&&d.push(u.subscribe(i)||(()=>{}))}catch{}try{let u=e.get&&e.get("sessions");a(u,y=>y.list)}catch{}try{let u=e.get&&e.get("workspaces");a(u,y=>y.list)}catch{}return i(),()=>{for(let u of d)try{u()}catch{}}},[e]),t}var r=require("react/jsx-runtime");function Tt(e){let t=Array.isArray(e?.notebooks)?e.notebooks:[],o=Array.isArray(e?.pages)?e.pages:[],i=new Map(t.map(l=>[l.id,l])),d=new Map;for(let l of t){let u=l.parentId&&i.has(l.parentId)?l.parentId:null;d.has(u)||d.set(u,[]),d.get(u).push(l)}for(let l of d.values())l.sort((u,y)=>(u.order??0)-(y.order??0)||u.title.localeCompare(y.title));let a=new Map;for(let l of o)a.has(l.notebookId)||a.set(l.notebookId,[]),a.get(l.notebookId).push(l);for(let l of a.values())l.sort((u,y)=>(u.order??0)-(y.order??0)||(y.updatedAt??0)-(u.updatedAt??0));return{byId:i,children:d,pagesOf:a,root:d.get(null)||[],notebookCount:t.length}}function Ye({value:e,onChange:t,onCommit:o,onCancel:i}){let d=(0,p.useRef)(null);return(0,p.useEffect)(()=>{d.current?.focus(),d.current?.select()},[]),(0,r.jsx)("input",{ref:d,className:"n-title-input",style:{height:"22px",fontSize:"13px",fontWeight:500},value:e,onChange:a=>t(a.target.value),onBlur:o,onKeyDown:a=>{a.key==="Enter"?(a.preventDefault(),o()):a.key==="Escape"&&(a.preventDefault(),i())}})}function pe({ctx:e,autoCreate:t=!0,compact:o=!1}){let[i,d]=(0,p.useState)(ce());(0,p.useEffect)(()=>Ke(d),[]);let a=(0,p.useMemo)(()=>V(i),[i]),l=Xe(e),[u,y]=(0,p.useState)({notebooks:[],pages:[]}),[N,R]=(0,p.useState)(!0),[T,D]=(0,p.useState)(""),[L,k]=(0,p.useState)(null),[X,O]=(0,p.useState)(()=>new Set),[B,j]=(0,p.useState)(""),[H,Y]=(0,p.useState)(null),[S,K]=(0,p.useState)(null),[I,J]=(0,p.useState)(null),[A,_]=(0,p.useState)(null),[G,g]=(0,p.useState)(!1),m=(0,p.useRef)(null),Z=(0,p.useRef)(!0);(0,p.useEffect)(()=>(Z.current=!0,()=>{Z.current=!1}),[]);let W=(0,p.useMemo)(()=>Tt(u),[u]),oe=(0,p.useMemo)(()=>{let n=new Set;try{let s=e&&typeof e.get=="function"?e.get("workspaces"):null,c=s&&s.list&&s.list.getSnapshot();for(let P of c&&c.items||[])P.path&&n.add(ke(P.path))}catch{}return n},[e,u]),C=(0,p.useMemo)(()=>{if(!L)return null;let n=(u.pages||[]).find(s=>s.id===L);return n?n.notebookId:null},[L,u]),x=(0,p.useCallback)(async()=>{D("");try{let n=await v.tree();return y({notebooks:n.notebooks||[],pages:n.pages||[]}),R(!1),n}catch(n){return R(!1),D(String(n&&n.message||n)),null}},[]);(0,p.useEffect)(()=>{x()},[x]);let Ne=(0,p.useRef)(!1);(0,p.useEffect)(()=>{N||Ne.current||!l||!l.path||t&&(Ne.current=!0,(async()=>{try{if(await v.findWorkspace(l.path))return;let s=await v.createNotebook({title:l.title,workspacePath:l.path,workspaceLabel:l.title}),c=await v.createPage({notebookId:s.id,title:V().untitled});if(!Z.current)return;let P=await v.tree();if(!Z.current)return;y({notebooks:P.notebooks||[],pages:P.pages||[]}),O(w=>new Set(w).add(s.id)),k(c.id)}catch{}})())},[N,l&&l.path,t]);let ge=(0,p.useCallback)(async n=>{if(!n)return;let s=await x(),c=n.notebookId||null;if(!c&&n.workspacePath)try{let w=await v.findWorkspace(n.workspacePath);c=w?w.id:null}catch{c=null}if(!c)return;if(O(w=>new Set(w).add(c)),n.pageId){k(n.pageId);return}let P=(s&&s.pages||[]).filter(w=>w.notebookId===c);if(P.length>0){k(P[0].id);return}try{let w=await v.createPage({notebookId:c,title:a.untitled});await x(),k(w.id)}catch(w){D(String(w&&w.message||w))}},[x,a]);(0,p.useEffect)(()=>{let n=ve();return n&&ge(n),Je(c=>{ve(),ge(c)})},[ge]),(0,p.useEffect)(()=>{let n=l?.path;if(!n){K(null);return}let s=!1;return v.findWorkspace(n).then(c=>{s||K(c)}).catch(()=>{s||K(null)}),()=>{s=!0}},[l?.path,u]),(0,p.useEffect)(()=>{let n=B.trim();if(!n){Y(null);return}let s=!1,c=setTimeout(()=>{v.search(n,30).then(P=>{s||Y(P)}).catch(()=>{s||Y([])})},200);return()=>{s=!0,clearTimeout(c)}},[B]);let Q=(0,p.useCallback)(async n=>{g(!0);try{return await n()}finally{g(!1)}},[]),Ce=(0,p.useCallback)(async()=>{if(!l?.path)return null;if(S)return S;let n=await v.bindWorkspace({workspacePath:l.path,workspaceLabel:l.title,title:l.title});return K(n.notebook),n.notebook},[l,S]),he=(0,p.useCallback)(async n=>{if(!n)return;O(c=>new Set(c).add(n.id));let s=(W.pagesOf.get(n.id)||[])[0];s?k(s.id):await q(n.id)},[W]),q=(0,p.useCallback)(async n=>{let s=n||C||S&&S.id;s&&await Q(async()=>{try{let c=await v.createPage({notebookId:s,title:a.untitled});O(P=>new Set(P).add(s)),await x(),k(c.id)}catch(c){D(String(c&&c.message||c))}})},[C,S,x,a,Q]),rt=(0,p.useCallback)(async(n=null)=>{await Q(async()=>{try{let s=await v.createNotebook({parentId:n,title:a.notebook});await x(),n&&O(c=>new Set(c).add(n)),_({kind:"notebook",id:s.id,value:s.title})}catch(s){D(String(s&&s.message||s))}})},[x,a,Q]),at=(0,p.useCallback)(async()=>{await Q(async()=>{try{let n=await Ce();await x(),await he(n)}catch(n){D(String(n&&n.message||n))}})},[Ce,x,he,Q]),Se=(0,p.useCallback)(async()=>{let n=A;if(_(null),!n)return;let s=n.value.trim();if(s)try{if(n.kind==="notebook")await v.updateNotebook(n.id,{title:s});else{let c=await v.readPage(n.id);await v.savePage({id:c.id,title:s,rev:c.rev,baseMtimeMs:c.mtimeMs,baseSize:c.size})}await x()}catch(c){D(String(c&&c.message||c))}},[A,x]),ot=(0,p.useCallback)(async()=>{let n=I;if(J(null),!!n)try{n.kind==="page"?(await v.deletePage(n.id),L===n.id&&k(null)):await v.deleteNotebook(n.id),await x()}catch(s){D(String(s&&s.message||s))}},[I,L,x]),Pe=(0,p.useCallback)(n=>{O(s=>{let c=new Set(s);return c.has(n)?c.delete(n):c.add(n),c})},[]);(0,p.useEffect)(()=>{let n=s=>{let c=s.metaKey||s.ctrlKey;c&&s.key.toLowerCase()==="p"?(s.preventDefault(),m.current?.focus(),m.current?.select?.()):c&&s.shiftKey&&s.key.toLowerCase()==="n"?(s.preventDefault(),q()):s.key==="Escape"&&document.activeElement===m.current&&j("")};return window.addEventListener("keydown",n),()=>window.removeEventListener("keydown",n)},[q]);let it=(n,s)=>(W.pagesOf.get(n)||[]).map(c=>{let P=A&&A.kind==="page"&&A.id===c.id;return(0,r.jsxs)("div",{className:`n-row${L===c.id?" is-active":""}`,style:{paddingLeft:`${8+s*12+16}px`},role:"treeitem","aria-selected":L===c.id?"true":"false",tabIndex:0,onClick:()=>k(c.id),onKeyDown:w=>{(w.key==="Enter"||w.key===" ")&&(w.preventDefault(),k(c.id))},children:[(0,r.jsx)(ze,{}),P?(0,r.jsx)(Ye,{value:A.value,onChange:w=>_({...A,value:w}),onCommit:Se,onCancel:()=>_(null)}):(0,r.jsx)("span",{className:"n-row-title",children:c.title||a.untitled}),(0,r.jsxs)("span",{className:"n-row-actions",children:[(0,r.jsx)("button",{type:"button",className:"n-btn is-icon",title:a.rename,"aria-label":a.rename,onClick:w=>{w.stopPropagation(),_({kind:"page",id:c.id,value:c.title||""})},children:(0,r.jsx)(re,{})}),(0,r.jsx)("button",{type:"button",className:"n-btn is-icon is-danger",title:a.delete,"aria-label":a.delete,onClick:w=>{w.stopPropagation(),J({kind:"page",id:c.id,title:c.title||a.untitled})},children:(0,r.jsx)(me,{})})]})]},c.id)}),Ie=(n,s)=>{let c=X.has(n.id),P=W.children.get(n.id)||[],w=W.pagesOf.get(n.id)||[],Te=P.length>0||w.length>0,lt=A&&A.kind==="notebook"&&A.id===n.id,ct=n.workspacePath&&l?.path&&Ze(n.workspacePath,l.path),dt=!n.workspacePath||oe.has(ke(n.workspacePath));return(0,r.jsxs)("div",{children:[(0,r.jsxs)("div",{className:"n-row is-notebook",style:{paddingLeft:`${8+s*12}px`},role:"treeitem","aria-expanded":c?"true":"false",tabIndex:0,onClick:()=>Pe(n.id),onKeyDown:M=>{(M.key==="Enter"||M.key===" ")&&(M.preventDefault(),Pe(n.id))},title:n.workspacePath||n.title,children:[(0,r.jsx)("span",{className:`n-twist${Te?"":" is-leaf"}`,"aria-hidden":"true",children:(0,r.jsx)(We,{open:c})}),(0,r.jsx)(ne,{}),lt?(0,r.jsx)(Ye,{value:A.value,onChange:M=>_({...A,value:M}),onCommit:Se,onCancel:()=>_(null)}):(0,r.jsx)("span",{className:"n-row-title",children:n.title}),ct&&(0,r.jsx)("span",{className:"n-row-badge",children:a.currentWorkspace}),n.workspacePath&&!dt&&(0,r.jsx)("span",{className:"n-row-badge",children:a.orphan}),(0,r.jsxs)("span",{className:"n-row-actions",children:[(0,r.jsx)("button",{type:"button",className:"n-btn is-icon",title:a.newPage,"aria-label":a.newPage,onClick:M=>{M.stopPropagation(),q(n.id)},children:(0,r.jsx)(be,{})}),(0,r.jsx)("button",{type:"button",className:"n-btn is-icon",title:a.newChild,"aria-label":a.newChild,onClick:M=>{M.stopPropagation(),rt(n.id)},children:(0,r.jsx)(ne,{size:12})}),(0,r.jsx)("button",{type:"button",className:"n-btn is-icon",title:a.rename,"aria-label":a.rename,onClick:M=>{M.stopPropagation(),_({kind:"notebook",id:n.id,value:n.title})},children:(0,r.jsx)(re,{})}),(0,r.jsx)("button",{type:"button",className:"n-btn is-icon is-danger",title:a.delete,"aria-label":a.delete,onClick:M=>{M.stopPropagation(),J({kind:"notebook",id:n.id,title:n.title})},children:(0,r.jsx)(me,{})})]})]}),c&&(0,r.jsxs)("div",{role:"group",children:[P.map(M=>Ie(M,s+1)),it(n.id,s),!Te&&(0,r.jsx)("div",{className:"n-row",style:{paddingLeft:`${8+(s+1)*12+16}px`,color:"var(--dsw-alias-label-tertiary)"},children:(0,r.jsx)("span",{className:"n-row-title",children:a.noPage})})]})]},n.id)},Ee=l?l.title:a.noWorkspace,st=!!l?.path;if(o){let n=(u.pages||[]).filter(s=>S&&s.notebookId===S.id);return(0,r.jsxs)("div",{className:"n-app is-compact",children:[(0,r.jsxs)("div",{className:"n-compact-bar",children:[(0,r.jsxs)("span",{className:"n-wsbar-name",title:l?.path||"",children:[(0,r.jsx)(ne,{}),(0,r.jsx)("b",{children:Ee})]}),(0,r.jsxs)("span",{className:"n-wsbar-actions",children:[(0,r.jsxs)("button",{type:"button",className:"n-btn",disabled:!st||G,onClick:()=>S?he(S):at(),children:[(0,r.jsx)(be,{}),S?a.openNotebook:a.createNotebook]}),(0,r.jsx)("button",{type:"button",className:"n-btn",disabled:G||!S,title:a.newPage,"aria-label":a.newPage,onClick:()=>q(),children:(0,r.jsx)(re,{})})]})]}),T&&(0,r.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,r.jsx)("span",{className:"n-banner-text",children:T}),(0,r.jsx)("button",{type:"button",className:"n-btn",onClick:x,children:a.retry})]}),n.length>0&&(0,r.jsxs)("select",{className:"n-compact-pages","aria-label":a.pages,value:L||"",onChange:s=>k(s.target.value||null),children:[(0,r.jsx)("option",{value:"",children:a.pages}),n.map(s=>(0,r.jsx)("option",{value:s.id,children:s.title||a.untitled},s.id))]}),L?(0,r.jsx)(ye,{pageId:L,t:a,onChanged:()=>x(),onGone:()=>{k(null),x()}}):(0,r.jsxs)("div",{className:"n-empty is-compact",children:[(0,r.jsx)("b",{children:a.emptyPageTitle}),(0,r.jsx)("div",{children:a.emptyPageHint}),(0,r.jsx)("button",{type:"button",className:"n-btn",disabled:G||!S,onClick:()=>q(),children:a.newPage})]})]})}return(0,r.jsxs)("div",{className:"n-app",children:[(0,r.jsxs)("aside",{className:"n-side",children:[(0,r.jsxs)("div",{className:"n-wsbar",children:[(0,r.jsx)("span",{className:"n-wsbar-label",children:a.currentWorkspace}),(0,r.jsxs)("span",{className:"n-wsbar-name",title:l?.path||"",children:[(0,r.jsx)(ne,{}),(0,r.jsx)("b",{children:Ee})]}),(0,r.jsx)("span",{className:"n-wsbar-actions",children:(0,r.jsx)("button",{type:"button",className:"n-btn is-icon",disabled:G,title:a.newPage,"aria-label":a.newPage,onClick:()=>q(),children:(0,r.jsx)(re,{})})})]}),(0,r.jsxs)("div",{className:"n-search",children:[(0,r.jsx)(_e,{}),(0,r.jsx)("input",{ref:m,type:"search",value:B,placeholder:a.searchPlaceholder,"aria-label":a.search,onChange:n=>j(n.target.value)}),B&&(0,r.jsx)("button",{type:"button",className:"n-btn is-icon","aria-label":a.delete,onClick:()=>j(""),children:(0,r.jsx)(ae,{size:12})})]}),T&&(0,r.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,r.jsx)("span",{className:"n-banner-text",children:T}),(0,r.jsx)("button",{type:"button",className:"n-btn",onClick:x,children:a.retry})]}),I&&(0,r.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,r.jsx)("span",{className:"n-banner-text",children:I.kind==="notebook"?a.deleteNotebookConfirm(I.title):a.deletePageConfirm(I.title)}),(0,r.jsx)("button",{type:"button",className:"n-btn is-danger",onClick:ot,children:a.delete}),(0,r.jsx)("button",{type:"button",className:"n-btn",onClick:()=>J(null),children:(0,r.jsx)(ae,{size:12})})]}),(0,r.jsxs)("div",{className:"n-tree",role:"tree","aria-label":a.title,children:[N&&(0,r.jsx)("div",{className:"n-tree-empty",children:a.loading}),!N&&H&&(0,r.jsxs)(r.Fragment,{children:[H.length===0&&(0,r.jsx)("div",{className:"n-tree-empty",children:a.noResults}),H.map(n=>(0,r.jsxs)("div",{className:"n-hit",role:"button",tabIndex:0,onClick:()=>{k(n.id),j("")},onKeyDown:s=>{s.key==="Enter"&&(k(n.id),j(""))},children:[(0,r.jsx)("div",{className:"n-hit-title",children:n.title||a.untitled}),n.snippet&&(0,r.jsx)("div",{className:"n-hit-snippet",children:n.snippet})]},n.id))]}),!N&&!H&&W.notebookCount===0&&(0,r.jsxs)("div",{className:"n-tree-empty",children:[(0,r.jsx)("b",{children:a.empty}),(0,r.jsx)("div",{children:a.emptyHint})]}),!N&&!H&&W.root.map(n=>Ie(n,0))]})]}),(0,r.jsx)(ye,{pageId:L,t:a,onChanged:()=>{x()},onGone:()=>{k(null),x()}})]})}var Ge=require("react"),Qe=require("react/jsx-runtime"),te=class extends Ge.Component{constructor(t){super(t),this.state={error:null}}static getDerivedStateFromError(t){return{error:t}}componentDidCatch(t,o){console.error("[dsh-notes] app crashed:",t&&t.message,`
    `,o&&o.componentStack)}render(){return this.state.error?(0,Qe.jsxs)("div",{className:"n-empty",children:["笔记本渲染失败：",String(this.state.error&&this.state.error.message||this.state.error)]}):this.props.children}};var ue=require("react/jsx-runtime");function et({ctx:e}){return(0,ue.jsx)("div",{className:"n-right-host",children:(0,ue.jsx)(te,{children:(0,ue.jsx)(pe,{ctx:e,compact:!0,autoCreate:!0})})})}var Mt=`
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
    `,tt=!1;function nt(){if(tt||typeof document>"u")return;tt=!0;let e="dsh-notes-styles";if(document.getElementById(e))return;let t=document.createElement("style");t.id=e,t.textContent=Mt,document.head.append(t)}var fe=require("react/jsx-runtime"),At=["slots"];function Dt(e){console.info("[dsh-notes] build","2026-11-04T15:41:49.620Z"),nt(),Ae({react:$t,"react/jsx-runtime":Rt,"react-dom":Lt,"react-dom/client":Ot}),e.slots.inject("sidebar.panellist",()=>e.slots.register({name:"sidebar.panellist",id:"notes",order:40,label:()=>V().label},Be)),e.slots.inject("main",()=>e.slots.register({name:"main",key:"notes"},()=>(0,fe.jsx)(te,{children:(0,fe.jsx)(pe,{ctx:e,autoCreate:!1})}))),e.inject(["slots","sidebarRightTabs"],t=>{let o=t.sidebarRightTabs,i=t.slots;o&&typeof o.register=="function"&&e.effect(()=>o.register({id:"dsh-notes",kind:"notes",title:()=>V().rightTab,guide:[{id:"workspace",order:20,title:()=>V().rightTab,description:()=>V().rightTabDesc}]}),"dsh-notes: right tab type"),i&&typeof i.inject=="function"&&e.effect(()=>i.inject("sidebar.right.pane.tab",()=>i.register({name:"sidebar.right.pane.tab",key:"dsh-notes"},d=>(0,fe.jsx)(et,{ctx:e,...d}))),"dsh-notes: right tab body")})}

    return module.exports
  }
})
