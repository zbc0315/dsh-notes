/* 由 tools/build.mjs 从 src/client/index.js 生成 —— 请勿手改。
 * 重新生成：npm run build
 */
window.__ModuleLoader__.load({
  id: "@tom2012/dsh-notes",
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
    var ot=Object.create;var ae=Object.defineProperty;var rt=Object.getOwnPropertyDescriptor;var at=Object.getOwnPropertyNames;var st=Object.getPrototypeOf,it=Object.prototype.hasOwnProperty;var lt=(e,t)=>{for(var r in t)ae(e,r,{get:t[r],enumerable:!0})},Ie=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of at(t))!it.call(e,s)&&s!==r&&ae(e,s,{get:()=>t[s],enumerable:!(n=rt(t,s))||n.enumerable});return e};var se=(e,t,r)=>(r=e!=null?ot(st(e)):{},Ie(t||!e||!e.__esModule?ae(r,"default",{value:e,enumerable:!0}):r,e)),ct=e=>Ie(ae({},"__esModule",{value:!0}),e);var Mt={};lt(Mt,{apply:()=>Et,inject:()=>Pt});module.exports=ct(Mt);var Nt=se(require("react")),St=se(require("react/jsx-runtime")),Ct=se(require("react-dom")),It=se(require("react-dom/client"));var f=require("react");var O="/-/notes";function dt(e){return e===404?"接口不存在（宿主插件可能未加载）":e===403?"没有权限（宿主鉴权拒绝了请求）":e===409?"内容已在别处修改":e===413?"内容过大":e===503?"宿主服务不可用，请重启 dsh web":e>=500?"宿主内部错误":`HTTP ${e}`}async function B(e){let t=null;try{t=await e.json()}catch{t=null}if(!e.ok||t&&t.ok===!1){let r=new Error(t&&t.error||dt(e.status));throw r.status=e.status,t&&t.current!==void 0&&(r.current=t.current),r}return t||{}}function V(e){let t=[];for(let[r,n]of Object.entries(e||{}))n==null||n===""||t.push(`${encodeURIComponent(r)}=${encodeURIComponent(String(n))}`);return t.length?`?${t.join("&")}`:""}var x={base:O,async status(){return B(await fetch(`${O}/status`,{credentials:"same-origin"}))},async tree(){return B(await fetch(`${O}/tree`,{credentials:"same-origin"}))},async readPage(e){return(await B(await fetch(`${O}/page${V({id:e})}`,{credentials:"same-origin"}))).page},async savePage({id:e,title:t,blocks:r,rev:n,baseMtimeMs:s,baseSize:u}){let i={title:t,rev:n,baseMtimeMs:s,baseSize:u};return Array.isArray(r)&&(i.blocks=r),B(await fetch(`${O}/page${V({id:e})}`,{method:"PUT",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}))},async createPage({notebookId:e,title:t,blocks:r,markdown:n}){let s={notebookId:e,title:t};return Array.isArray(r)&&(s.blocks=r),typeof n=="string"&&(s.markdown=n),(await B(await fetch(`${O}/page`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)}))).page},async deletePage(e){return B(await fetch(`${O}/page${V({id:e})}`,{method:"DELETE",credentials:"same-origin"}))},async createNotebook({parentId:e=null,title:t,workspacePath:r=null,workspaceLabel:n=null}){return(await B(await fetch(`${O}/notebook`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({parentId:e,title:t,workspacePath:r,workspaceLabel:n})}))).notebook},async updateNotebook(e,t){return(await B(await fetch(`${O}/notebook${V({id:e})}`,{method:"PATCH",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(t||{})}))).notebook},async deleteNotebook(e){return B(await fetch(`${O}/notebook${V({id:e})}`,{method:"DELETE",credentials:"same-origin"}))},async findWorkspace(e){return(await B(await fetch(`${O}/workspace${V({path:e})}`,{credentials:"same-origin"}))).notebook},async bindWorkspace({workspacePath:e,title:t,workspaceLabel:r}){return B(await fetch(`${O}/workspace`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({workspacePath:e,title:t,workspaceLabel:r})}))},async search(e,t=30){return(await B(await fetch(`${O}/search${V({q:e,limit:t})}`,{credentials:"same-origin"}))).results||[]},async uploadAsset(e){let t=(e.name.split(".").pop()||"").toLowerCase(),r=await fetch(`${O}/asset`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":e.type||"application/octet-stream","x-notes-ext":t},body:e});return B(r)},exportUrl(e){return`${O}/export${V({id:e})}`}};var h=require("react");var Pe="/-/notes/client",Te={},X=null;function Le(e){Object.assign(Te,e||{})}function Ee(){return e=>{let t=Te[e];if(t!==void 0)return t;throw new Error(`dsh-notes: 编辑器模块请求了未注册的依赖 ${e}`)}}function $e(){return X||(X=new Promise((e,t)=>{if(typeof document>"u"){t(new Error("dsh-notes: 没有 document，无法加载编辑器"));return}let r="dsh-notes-editor-css";if(!document.getElementById(r)){let i=document.createElement("link");i.id=r,i.rel="stylesheet",i.href=`${Pe}/editor.css`,document.head.append(i)}let n="__DSH_NOTES_EDITOR_FACTORY__",s=window[n];if(typeof s=="function"){try{e(s(Ee()))}catch(i){t(Me(i))}return}let u=document.createElement("script");u.src=`${Pe}/editor.js`,u.async=!0,u.onload=()=>{let i=window[n];if(typeof i!="function"){t(new Error("dsh-notes: 编辑器模块加载后没有注册工厂"));return}try{e(i(Ee()))}catch(l){t(Me(l))}},u.onerror=()=>t(new Error("dsh-notes: 编辑器模块下载失败（/-/notes/client/editor.js）")),document.head.append(u)}),X.catch(()=>{X=null}),X)}function Me(e){return e instanceof Error?e:new Error(String(e))}var b=require("react/jsx-runtime"),$={fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"};function j(e,t){return(0,b.jsx)("svg",{viewBox:"0 0 24 24",width:e,height:e,"aria-hidden":"true",focusable:"false",fill:"none",children:t})}function Q({size:e=16}){return j(e,(0,b.jsx)(b.Fragment,{children:(0,b.jsx)("path",{d:"M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-6-3.5-6 3.5V5A1.5 1.5 0 0 1 6 3.5Z",...$})}))}function Re({size:e=16}){return j(e,(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("path",{d:"M7 3.5h7.2L18.5 7.8V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z",...$}),(0,b.jsx)("path",{d:"M13.8 3.8V8h4.2",...$})]}))}function Oe(){return(0,b.jsxs)("svg",{viewBox:"0 0 24 24",width:"20",height:"20","aria-hidden":"true",focusable:"false",fill:"none",children:[(0,b.jsx)("path",{d:"M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-6-3.5-6 3.5V5A1.5 1.5 0 0 1 6 3.5Z",...$}),(0,b.jsx)("path",{d:"M9.5 9h5M9.5 12.5h3",...$})]})}function fe({size:e=14}){return j(e,(0,b.jsx)("path",{d:"M12 5.5v13M5.5 12h13",...$}))}function Ae({size:e=12,open:t=!1}){return(0,b.jsx)("svg",{viewBox:"0 0 24 24",width:e,height:e,"aria-hidden":"true",focusable:"false",fill:"none",style:{transform:t?"rotate(90deg)":"none",transition:"transform 120ms ease"},children:(0,b.jsx)("path",{d:"M9 5.5 15.5 12 9 18.5",...$})})}function Be({size:e=14}){return j(e,(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("circle",{cx:"11",cy:"11",r:"5.75",...$}),(0,b.jsx)("path",{d:"M15.4 15.4 19 19",...$})]}))}function me({size:e=14}){return j(e,(0,b.jsx)(b.Fragment,{children:(0,b.jsx)("path",{d:"M4.5 7h15M10 4.5h4M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12",...$})}))}function ie({size:e=14}){return j(e,(0,b.jsx)(b.Fragment,{children:(0,b.jsx)("path",{d:"M4.5 19.5h4L19 9a2 2 0 0 0 0-2.8l-1.2-1.2A2 2 0 0 0 15 5L4.5 15.5v4Z",...$})}))}function te({size:e=14}){return j(e,(0,b.jsx)("path",{d:"M6 6l12 12M18 6 6 18",...$}))}function We({size:e=14}){return j(e,(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("path",{d:"M12 3.5v11M8 10.5 12 14.5 16 10.5",...$}),(0,b.jsx)("path",{d:"M5 17v2a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-2",...$})]}))}function De({size:e=14}){return j(e,(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("path",{d:"M6 3.5h9.2L19 7.3V18a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 18V6a2.5 2.5 0 0 1 1-2Z",...$}),(0,b.jsx)("path",{d:"M8.5 3.5v5h6M8.5 20.5v-6h7v6",...$})]}))}var le=require("react");function be(){return typeof document>"u"||!document.body?"light":document.body.hasAttribute("data-ds-dark-theme")?"dark":"light"}function ze(){let[e,t]=(0,le.useState)(be);return(0,le.useEffect)(()=>{if(typeof MutationObserver!="function"||typeof document>"u"||!document.body)return;let r=new MutationObserver(()=>t(be()));return r.observe(document.body,{attributes:!0,attributeFilter:["data-ds-dark-theme","class"]}),t(be()),()=>r.disconnect()},[]),e}var m=require("react/jsx-runtime"),ut=800,pt=16*1024*1024;function ft(e){if(typeof e!="string"||!e.startsWith("asset://"))return e;let t=e.slice(8),r=t.lastIndexOf("."),n=r===-1?t:t.slice(0,r),s=r===-1?"png":t.slice(r+1);return`/-/notes/asset?sha=${encodeURIComponent(n)}&ext=${encodeURIComponent(s)}`}function He({pageId:e,t,onChanged:r,onGone:n}){let[s,u]=(0,h.useState)(null),[i,l]=(0,h.useState)("idle"),[g,M]=(0,h.useState)("");return(0,h.useEffect)(()=>{if(!e){u(null),l("idle");return}let v=!1;return l("loading"),M(""),x.readPage(e).then(k=>{v||(u(k),l("ready"))}).catch(k=>{v||(M(String(k&&k.message||k)),l("error"),k&&k.status===404&&typeof n=="function"&&n())}),()=>{v=!0}},[e,n]),e?i==="loading"||i==="idle"?(0,m.jsx)("div",{className:"n-empty",children:t.loading}):i==="error"?(0,m.jsx)("div",{className:"n-empty",children:g}):s?(0,m.jsx)(bt,{page:s,t,onSaved:r},s.id):(0,m.jsx)("div",{className:"n-empty",children:t.loading}):(0,m.jsx)("div",{className:"n-empty",children:t.noPage})}function mt({t:e}){return(0,m.jsxs)("div",{className:"n-editor-skeleton",role:"status","aria-live":"polite",children:[(0,m.jsx)("div",{className:"n-skel-line",style:{width:"38%",height:"18px"}}),(0,m.jsx)("div",{className:"n-skel-line",style:{width:"92%"}}),(0,m.jsx)("div",{className:"n-skel-line",style:{width:"86%"}}),(0,m.jsx)("div",{className:"n-skel-line",style:{width:"70%"}}),(0,m.jsx)("div",{className:"n-skel-hint",children:e.loading})]})}function bt({page:e,t,onSaved:r}){let[n,s]=(0,h.useState)(null),[u,i]=(0,h.useState)(""),[l,g]=(0,h.useState)(e.title&&e.title!==t.untitled?e.title:""),[M,v]=(0,h.useState)("saved"),[k,I]=(0,h.useState)(null),[J,N]=(0,h.useState)(""),P=(0,h.useRef)({...e}),L=(0,h.useRef)(!1),T=(0,h.useRef)(null),z=(0,h.useRef)(!1),A=(0,h.useRef)(null),q=(0,h.useRef)(l),H=(0,h.useRef)(t),_=(0,h.useRef)(r);q.current=l,H.current=t,_.current=r,(0,h.useEffect)(()=>{let p=!1;return $e().then(y=>{p||s(y)}).catch(y=>{p||i(String(y&&y.message||y))}),()=>{p=!0}},[]);let S=(0,h.useCallback)(async({force:p=!1,rev:y}={})=>{let C=A.current;if(!C||z.current||!L.current&&!p)return;let F=P.current,U;try{U=JSON.parse(JSON.stringify(C.document))}catch(E){N(String(E&&E.message||E));return}z.current=!0,v("saving");try{let E=await x.savePage({id:F.id,title:q.current.trim()||H.current.untitled,blocks:U,rev:y===void 0?F.rev:y,baseMtimeMs:F.mtimeMs,baseSize:F.size});if(P.current={...E.page},L.current=!1,v("saved"),I(null),E.conflictFile){let G=String(E.conflictFile).split(/[\\/]/).pop();N(`已保存；外部改动留档为 ${G}`)}typeof _.current=="function"&&_.current(E.page)}catch(E){E&&E.status===409?(I(E.current||null),v("error")):(v("error"),N(String(E&&E.message||E)))}finally{z.current=!1}},[]),W=(0,h.useCallback)(()=>{T.current&&clearTimeout(T.current),T.current=setTimeout(()=>{T.current=null,S()},ut)},[S]);(0,h.useEffect)(()=>()=>{T.current&&(clearTimeout(T.current),T.current=null),L.current&&S({force:!0}).catch(()=>{})},[S]),(0,h.useEffect)(()=>{let p=y=>{(y.metaKey||y.ctrlKey)&&!y.altKey&&String(y.key).toLowerCase()==="s"&&(y.preventDefault(),S({force:!0}))};return window.addEventListener("keydown",p,!0),()=>window.removeEventListener("keydown",p,!0)},[S]);let oe=(0,h.useCallback)(async p=>{if(p&&p.size>pt)throw new Error(H.current.imageTooLarge);let y=await x.uploadAsset(p);return`asset://${y.sha}.${y.ext}`},[]),re=(0,h.useCallback)(async p=>ft(p),[]),Z=(0,h.useMemo)(()=>({initialContent:Array.isArray(e.blocks)&&e.blocks.length>0?e.blocks:void 0,uploadFile:oe,resolveFileUrl:re}),[e.id]);return(0,m.jsxs)("div",{className:"n-main",children:[(0,m.jsxs)("div",{className:"n-topbar",children:[(0,m.jsx)("input",{className:"n-title-input",value:l,placeholder:t.untitled,"aria-label":t.title,onChange:p=>{g(p.target.value),L.current=!0,v("dirty"),W()},onBlur:()=>S()}),(0,m.jsx)("span",{className:`n-save-state${M==="error"?" is-error":""}`,role:"status","aria-live":"polite",children:M==="saving"?t.saving:M==="dirty"?t.unsaved:M==="error"?t.conflict:t.saved}),(0,m.jsx)("a",{className:"n-btn is-icon",href:x.exportUrl(e.id),download:!0,title:t.exportMd,"aria-label":t.exportMd,children:(0,m.jsx)(We,{})}),(0,m.jsx)("button",{type:"button",className:"n-btn is-icon",title:t.save,"aria-label":t.save,onClick:()=>S({force:!0}),children:(0,m.jsx)(De,{})})]}),k&&(0,m.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,m.jsxs)("span",{className:"n-banner-text",children:[(0,m.jsx)("b",{children:t.conflict})," — ",t.conflictBody]}),(0,m.jsx)("button",{type:"button",className:"n-btn",onClick:()=>{let p=k.rev;I(null),L.current=!0,S({force:!0,rev:p})},children:t.overwrite}),(0,m.jsx)("button",{type:"button",className:"n-btn",onClick:async()=>{I(null);try{let p=await x.readPage(P.current.id);P.current={...p},g(p.title===t.untitled?"":p.title);let y=A.current;y&&Array.isArray(p.blocks)&&y.replaceBlocks(y.document,p.blocks),L.current=!1,v("saved")}catch(p){N(String(p&&p.message||p))}},children:t.reload})]}),J&&(0,m.jsxs)("div",{className:"n-banner",role:"status",children:[(0,m.jsx)("span",{className:"n-banner-text",children:J}),(0,m.jsx)("button",{type:"button",className:"n-btn is-icon","aria-label":t.close,onClick:()=>N(""),children:(0,m.jsx)(te,{})})]}),(0,m.jsx)("div",{className:"n-editor-scroll",children:(0,m.jsxs)("div",{className:"n-editor",children:[u&&(0,m.jsx)("div",{className:"n-empty",children:u}),!n&&!u&&(0,m.jsx)(mt,{t}),n&&(0,m.jsx)(ht,{runtime:n,options:Z,t,onReady:p=>{A.current=p},onChange:()=>{L.current=!0,v(p=>p==="saving"?p:"dirty"),W()}})]})})]})}function ht({runtime:e,options:t,t:r,onReady:n,onChange:s}){let{useCreateBlockNote:u,BlockNoteView:i}=e,l=ze(),g=u(t);return(0,h.useEffect)(()=>{g&&n(g)},[g,n]),g?(0,m.jsx)("div",{className:"n-blocknote",children:(0,m.jsx)(i,{editor:g,theme:l,onChange:s})}):null}var gt={label:"全部笔记本",title:"全部笔记本",currentWorkspace:"当前工作区",noWorkspace:"未选择工作区",createNotebook:"新建笔记本",openNotebook:"打开笔记本",orphan:"游离",newPage:"新建页面",newChild:"新建子笔记本",rename:"重命名",delete:"删除",exportMd:"导出 Markdown",save:"保存",saved:"已保存",saving:"保存中…",unsaved:"未保存",conflict:"他处已修改",conflictBody:"这份笔记在别处被改过。覆盖会丢掉对方的改动。",overwrite:"覆盖",reload:"载入最新",empty:"还没有笔记本",emptyHint:"在左侧选中一个工作区，点「新建笔记本」开始。",noPage:"选一个页面开始编辑，或者新建一页。",untitled:"无标题",searchPlaceholder:"搜索标题与正文…",searchEmpty:"没有命中",deleteNotebookConfirm:e=>`删除笔记本「${e}」？它和里面的页面都会进回收站。`,deletePageConfirm:e=>`删除页面「${e}」？会进回收站。`,renamePrompt:"新名字",loading:"载入中…",retry:"重试",unavailable:"笔记本服务不可用",unavailableHint:"宿主路由没有注册成功，请重启 dsh web 后刷新页面。",imageTooLarge:"图片太大（上限 16MB）",uploadFailed:"图片上传失败",chars:e=>`${e} 字`,more:"更多",noResults:"没有结果",close:"关闭",writeHere:"开始写…",formatting:"格式",bold:"加粗",italic:"斜体",strike:"删除线",code:"行内代码",h1:"一级标题",h2:"二级标题",h3:"三级标题",bulletList:"无序列表",orderedList:"有序列表",taskList:"任务列表",quote:"引用",codeBlock:"代码块",link:"链接",linkPrompt:"链接地址",image:"插入图片",table:"插入表格",undo:"撤销",redo:"重做",notebook:"笔记本",page:"页面"},yt={label:"All notebooks",title:"All notebooks",currentWorkspace:"Current workspace",noWorkspace:"No workspace selected",createNotebook:"New notebook",openNotebook:"Open notebook",orphan:"Orphan",newPage:"New page",newChild:"New sub-notebook",rename:"Rename",delete:"Delete",exportMd:"Export markdown",save:"Save",saved:"Saved",saving:"Saving…",unsaved:"Unsaved",conflict:"Changed elsewhere",conflictBody:"This note changed on disk. Overwriting discards the other version.",overwrite:"Overwrite",reload:"Reload latest",empty:"No notebooks yet",emptyHint:"Pick a workspace on the left, then click “New notebook”.",noPage:"Pick a page to start writing, or create one.",untitled:"Untitled",searchPlaceholder:"Search titles and text…",searchEmpty:"Nothing matched",deleteNotebookConfirm:e=>`Delete notebook “${e}”? It and its pages go to the trash.`,deletePageConfirm:e=>`Delete page “${e}”? It goes to the trash.`,renamePrompt:"New name",loading:"Loading…",retry:"Retry",unavailable:"Notebook service unavailable",unavailableHint:"The host route did not register. Restart dsh web, then reload this page.",imageTooLarge:"Image too large (16MB limit)",uploadFailed:"Image upload failed",chars:e=>`${e} chars`,more:"More",noResults:"No results",close:"Close",writeHere:"Start writing…",formatting:"Formatting",bold:"Bold",italic:"Italic",strike:"Strikethrough",code:"Inline code",h1:"Heading 1",h2:"Heading 2",h3:"Heading 3",bulletList:"Bullet list",orderedList:"Numbered list",taskList:"Task list",quote:"Quote",codeBlock:"Code block",link:"Link",linkPrompt:"Link URL",image:"Insert image",table:"Insert table",undo:"Undo",redo:"Redo",notebook:"Notebook",page:"Page"};function Y(){let e=typeof document<"u"&&document.documentElement.lang||"zh-CN";return String(e).toLowerCase().startsWith("zh")?"zh":"en"}function ce(e){return(e||Y())==="zh"?gt:yt}function de(e){if(typeof MutationObserver!="function"||typeof document>"u")return()=>{};let t=new MutationObserver(r=>{for(let n of r)if(n.attributeName==="lang"){e(Y());return}});return t.observe(document.documentElement,{attributes:!0,attributeFilter:["lang"]}),()=>t.disconnect()}var ue=null,he=new Set;function ge(e){ue=Object.assign({at:Date.now()},e||{});for(let t of he)try{t(ue)}catch{}}function ye(){let e=ue;return ue=null,e}function Ue(e){return he.add(e),()=>he.delete(e)}var pe=require("react");function wt(e){try{let t=e.get&&e.get("uiSession"),r=t&&(t.current||t.adapter?.current)||null,n=r&&typeof r.getSnapshot=="function"?r.getSnapshot():null;if(n&&typeof n.key=="string")return n.key}catch{}try{let t=e.get&&e.get("sessions"),r=t&&t.list&&t.list.getSnapshot();if(r&&r.byId){let n=Object.values(r.byId).find(s=>(s.retainedBy?.mainView??0)>0);if(n&&n.id)return n.id}}catch{}}function vt(e,t){if(!t)return null;let r="";try{let n=e.get&&e.get("workspaces"),s=n&&n.list&&n.list.getSnapshot(),i=(s&&s.items||[]).find(l=>l.path===t);i&&(r=i.title||i.displayTitle||"")}catch{}if(!r){let n=String(t).split(/[\\/]/).filter(Boolean);r=n.length?n[n.length-1]:t}return{path:t,title:r}}function je(e){let t=wt(e);if(!t)return null;try{let r=e.get&&e.get("sessions"),n=r&&r.list&&r.list.getSnapshot(),s=n&&n.byId&&n.byId[t];return s?vt(e,s.cwd):null}catch{return null}}function Ke(e){let[t,r]=(0,pe.useState)(()=>je(e));return(0,pe.useEffect)(()=>{let n=()=>r(je(e)),s=[],u=(l,g)=>{try{let M=g(l);M&&typeof M.subscribe=="function"&&s.push(M.subscribe(n)||(()=>{}))}catch{}},i=e.get&&e.get("uiSession");try{let l=i&&(i.current||i.adapter?.current)||null;l&&typeof l.subscribe=="function"&&s.push(l.subscribe(n)||(()=>{}))}catch{}try{let l=e.get&&e.get("sessions");u(l,g=>g.list)}catch{}try{let l=e.get&&e.get("workspaces");u(l,g=>g.list)}catch{}return n(),()=>{for(let l of s)try{l()}catch{}}},[e]),t}var a=require("react/jsx-runtime");function kt(e){let t=Array.isArray(e?.notebooks)?e.notebooks:[],r=Array.isArray(e?.pages)?e.pages:[],n=new Map(t.map(i=>[i.id,i])),s=new Map;for(let i of t){let l=i.parentId&&n.has(i.parentId)?i.parentId:null;s.has(l)||s.set(l,[]),s.get(l).push(i)}for(let i of s.values())i.sort((l,g)=>(l.order??0)-(g.order??0)||l.title.localeCompare(g.title));let u=new Map;for(let i of r)u.has(i.notebookId)||u.set(i.notebookId,[]),u.get(i.notebookId).push(i);for(let i of u.values())i.sort((l,g)=>(l.order??0)-(g.order??0)||(g.updatedAt??0)-(l.updatedAt??0));return{byId:n,children:s,pagesOf:u,root:s.get(null)||[],notebookCount:t.length}}function _e({value:e,onChange:t,onCommit:r,onCancel:n}){let s=(0,f.useRef)(null);return(0,f.useEffect)(()=>{s.current?.focus(),s.current?.select()},[]),(0,a.jsx)("input",{ref:s,className:"n-title-input",style:{height:"22px",fontSize:"13px",fontWeight:500},value:e,onChange:u=>t(u.target.value),onBlur:r,onKeyDown:u=>{u.key==="Enter"?(u.preventDefault(),r()):u.key==="Escape"&&(u.preventDefault(),n())}})}function Fe({ctx:e}){let[t,r]=(0,f.useState)(Y());(0,f.useEffect)(()=>de(r),[]);let n=(0,f.useMemo)(()=>ce(t),[t]),s=Ke(e),[u,i]=(0,f.useState)({notebooks:[],pages:[]}),[l,g]=(0,f.useState)(!0),[M,v]=(0,f.useState)(""),[k,I]=(0,f.useState)(null),[J,N]=(0,f.useState)(()=>new Set),[P,L]=(0,f.useState)(""),[T,z]=(0,f.useState)(null),[A,q]=(0,f.useState)(null),[H,_]=(0,f.useState)(null),[S,W]=(0,f.useState)(null),[oe,re]=(0,f.useState)(!1),Z=(0,f.useRef)(null),p=(0,f.useMemo)(()=>kt(u),[u]),y=(0,f.useMemo)(()=>{if(!k)return null;let o=(u.pages||[]).find(d=>d.id===k);return o?o.notebookId:null},[k,u]),C=(0,f.useCallback)(async()=>{v("");try{let o=await x.tree();return i({notebooks:o.notebooks||[],pages:o.pages||[]}),g(!1),o}catch(o){return g(!1),v(String(o&&o.message||o)),null}},[]);(0,f.useEffect)(()=>{C()},[C]);let F=(0,f.useCallback)(async o=>{if(!o)return;let d=await C(),c=o.notebookId||null;if(!c&&o.workspacePath)try{let w=await x.findWorkspace(o.workspacePath);c=w?w.id:null}catch{c=null}if(!c)return;if(N(w=>new Set(w).add(c)),o.pageId){I(o.pageId);return}let D=(d&&d.pages||[]).filter(w=>w.notebookId===c);if(D.length>0){I(D[0].id);return}try{let w=await x.createPage({notebookId:c,title:n.untitled});await C(),I(w.id)}catch(w){v(String(w&&w.message||w))}},[C,n]);(0,f.useEffect)(()=>{let o=ye();return o&&F(o),Ue(c=>{ye(),F(c)})},[F]),(0,f.useEffect)(()=>{let o=s?.path;if(!o){q(null);return}let d=!1;return x.findWorkspace(o).then(c=>{d||q(c)}).catch(()=>{d||q(null)}),()=>{d=!0}},[s?.path,u]),(0,f.useEffect)(()=>{let o=P.trim();if(!o){z(null);return}let d=!1,c=setTimeout(()=>{x.search(o,30).then(D=>{d||z(D)}).catch(()=>{d||z([])})},200);return()=>{d=!0,clearTimeout(c)}},[P]);let U=(0,f.useCallback)(async o=>{re(!0);try{return await o()}finally{re(!1)}},[]),E=(0,f.useCallback)(async()=>{if(!s?.path)return null;if(A)return A;let o=await x.bindWorkspace({workspacePath:s.path,workspaceLabel:s.title,title:s.title});return q(o.notebook),o.notebook},[s,A]),G=(0,f.useCallback)(async o=>{if(!o)return;N(c=>new Set(c).add(o.id));let d=(p.pagesOf.get(o.id)||[])[0];d?I(d.id):await ee(o.id)},[p]),ee=(0,f.useCallback)(async o=>{let d=o||y||A&&A.id;d&&await U(async()=>{try{let c=await x.createPage({notebookId:d,title:n.untitled});N(D=>new Set(D).add(d)),await C(),I(c.id)}catch(c){v(String(c&&c.message||c))}})},[y,A,C,n,U]),Xe=(0,f.useCallback)(async(o=null)=>{await U(async()=>{try{let d=await x.createNotebook({parentId:o,title:n.notebook});await C(),o&&N(c=>new Set(c).add(o)),W({kind:"notebook",id:d.id,value:d.title})}catch(d){v(String(d&&d.message||d))}})},[C,n,U]),Qe=(0,f.useCallback)(async()=>{await U(async()=>{try{let o=await E();await C(),await G(o)}catch(o){v(String(o&&o.message||o))}})},[E,C,G,U]),ke=(0,f.useCallback)(async()=>{let o=S;if(W(null),!o)return;let d=o.value.trim();if(d)try{if(o.kind==="notebook")await x.updateNotebook(o.id,{title:d});else{let c=await x.readPage(o.id);await x.savePage({id:c.id,title:d,rev:c.rev,baseMtimeMs:c.mtimeMs,baseSize:c.size})}await C()}catch(c){v(String(c&&c.message||c))}},[S,C]),Ye=(0,f.useCallback)(async()=>{let o=H;if(_(null),!!o)try{o.kind==="page"?(await x.deletePage(o.id),k===o.id&&I(null)):await x.deleteNotebook(o.id),await C()}catch(d){v(String(d&&d.message||d))}},[H,k,C]),xe=(0,f.useCallback)(o=>{N(d=>{let c=new Set(d);return c.has(o)?c.delete(o):c.add(o),c})},[]);(0,f.useEffect)(()=>{let o=d=>{let c=d.metaKey||d.ctrlKey;c&&d.key.toLowerCase()==="p"?(d.preventDefault(),Z.current?.focus(),Z.current?.select?.()):c&&d.shiftKey&&d.key.toLowerCase()==="n"?(d.preventDefault(),ee()):d.key==="Escape"&&document.activeElement===Z.current&&L("")};return window.addEventListener("keydown",o),()=>window.removeEventListener("keydown",o)},[ee]);let Ge=(o,d)=>(p.pagesOf.get(o)||[]).map(c=>{let D=S&&S.kind==="page"&&S.id===c.id;return(0,a.jsxs)("div",{className:`n-row${k===c.id?" is-active":""}`,style:{paddingLeft:`${8+d*12+16}px`},role:"treeitem","aria-selected":k===c.id?"true":"false",tabIndex:0,onClick:()=>I(c.id),onKeyDown:w=>{(w.key==="Enter"||w.key===" ")&&(w.preventDefault(),I(c.id))},children:[(0,a.jsx)(Re,{}),D?(0,a.jsx)(_e,{value:S.value,onChange:w=>W({...S,value:w}),onCommit:ke,onCancel:()=>W(null)}):(0,a.jsx)("span",{className:"n-row-title",children:c.title||n.untitled}),(0,a.jsxs)("span",{className:"n-row-actions",children:[(0,a.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.rename,"aria-label":n.rename,onClick:w=>{w.stopPropagation(),W({kind:"page",id:c.id,value:c.title||""})},children:(0,a.jsx)(ie,{})}),(0,a.jsx)("button",{type:"button",className:"n-btn is-icon is-danger",title:n.delete,"aria-label":n.delete,onClick:w=>{w.stopPropagation(),_({kind:"page",id:c.id,title:c.title||n.untitled})},children:(0,a.jsx)(me,{})})]})]},c.id)}),Ne=(o,d)=>{let c=J.has(o.id),D=p.children.get(o.id)||[],w=p.pagesOf.get(o.id)||[],Se=D.length>0||w.length>0,nt=S&&S.kind==="notebook"&&S.id===o.id,Ce=o.workspacePath&&s?.path&&o.workspacePath===s.path;return(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{className:"n-row is-notebook",style:{paddingLeft:`${8+d*12}px`},role:"treeitem","aria-expanded":c?"true":"false",tabIndex:0,onClick:()=>xe(o.id),onKeyDown:R=>{(R.key==="Enter"||R.key===" ")&&(R.preventDefault(),xe(o.id))},title:o.workspacePath||o.title,children:[(0,a.jsx)("span",{className:`n-twist${Se?"":" is-leaf"}`,"aria-hidden":"true",children:(0,a.jsx)(Ae,{open:c})}),(0,a.jsx)(Q,{}),nt?(0,a.jsx)(_e,{value:S.value,onChange:R=>W({...S,value:R}),onCommit:ke,onCancel:()=>W(null)}):(0,a.jsx)("span",{className:"n-row-title",children:o.title}),Ce&&(0,a.jsx)("span",{className:"n-row-badge",children:n.currentWorkspace}),o.workspacePath&&!Ce&&(0,a.jsx)("span",{className:"n-row-badge",children:n.orphan}),(0,a.jsxs)("span",{className:"n-row-actions",children:[(0,a.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.newPage,"aria-label":n.newPage,onClick:R=>{R.stopPropagation(),ee(o.id)},children:(0,a.jsx)(fe,{})}),(0,a.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.newChild,"aria-label":n.newChild,onClick:R=>{R.stopPropagation(),Xe(o.id)},children:(0,a.jsx)(Q,{size:12})}),(0,a.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.rename,"aria-label":n.rename,onClick:R=>{R.stopPropagation(),W({kind:"notebook",id:o.id,value:o.title})},children:(0,a.jsx)(ie,{})}),(0,a.jsx)("button",{type:"button",className:"n-btn is-icon is-danger",title:n.delete,"aria-label":n.delete,onClick:R=>{R.stopPropagation(),_({kind:"notebook",id:o.id,title:o.title})},children:(0,a.jsx)(me,{})})]})]}),c&&(0,a.jsxs)("div",{role:"group",children:[D.map(R=>Ne(R,d+1)),Ge(o.id,d),!Se&&(0,a.jsx)("div",{className:"n-row",style:{paddingLeft:`${8+(d+1)*12+16}px`,color:"var(--dsw-alias-label-tertiary)"},children:(0,a.jsx)("span",{className:"n-row-title",children:n.noPage})})]})]},o.id)},et=s?s.title:n.noWorkspace,tt=!!s?.path;return(0,a.jsxs)("div",{className:"n-app",children:[(0,a.jsxs)("aside",{className:"n-side",children:[(0,a.jsxs)("div",{className:"n-wsbar",children:[(0,a.jsx)("span",{className:"n-wsbar-label",children:n.currentWorkspace}),(0,a.jsxs)("span",{className:"n-wsbar-name",title:s?.path||"",children:[(0,a.jsx)(Q,{}),(0,a.jsx)("b",{children:et})]}),(0,a.jsxs)("span",{className:"n-wsbar-actions",children:[(0,a.jsxs)("button",{type:"button",className:"n-btn",disabled:!tt||oe,onClick:()=>A?G(A):Qe(),children:[(0,a.jsx)(fe,{}),A?n.openNotebook:n.createNotebook]}),(0,a.jsx)("button",{type:"button",className:"n-btn",disabled:oe,title:n.newPage,"aria-label":n.newPage,onClick:()=>ee(),children:(0,a.jsx)(ie,{})})]})]}),(0,a.jsxs)("div",{className:"n-search",children:[(0,a.jsx)(Be,{}),(0,a.jsx)("input",{ref:Z,type:"search",value:P,placeholder:n.searchPlaceholder,"aria-label":n.search,onChange:o=>L(o.target.value)}),P&&(0,a.jsx)("button",{type:"button",className:"n-btn is-icon","aria-label":n.delete,onClick:()=>L(""),children:(0,a.jsx)(te,{size:12})})]}),M&&(0,a.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,a.jsx)("span",{className:"n-banner-text",children:M}),(0,a.jsx)("button",{type:"button",className:"n-btn",onClick:C,children:n.retry})]}),H&&(0,a.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,a.jsx)("span",{className:"n-banner-text",children:H.kind==="notebook"?n.deleteNotebookConfirm(H.title):n.deletePageConfirm(H.title)}),(0,a.jsx)("button",{type:"button",className:"n-btn is-danger",onClick:Ye,children:n.delete}),(0,a.jsx)("button",{type:"button",className:"n-btn",onClick:()=>_(null),children:(0,a.jsx)(te,{size:12})})]}),(0,a.jsxs)("div",{className:"n-tree",role:"tree","aria-label":n.title,children:[l&&(0,a.jsx)("div",{className:"n-tree-empty",children:n.loading}),!l&&T&&(0,a.jsxs)(a.Fragment,{children:[T.length===0&&(0,a.jsx)("div",{className:"n-tree-empty",children:n.noResults}),T.map(o=>(0,a.jsxs)("div",{className:"n-hit",role:"button",tabIndex:0,onClick:()=>{I(o.id),L("")},onKeyDown:d=>{d.key==="Enter"&&(I(o.id),L(""))},children:[(0,a.jsx)("div",{className:"n-hit-title",children:o.title||n.untitled}),o.snippet&&(0,a.jsx)("div",{className:"n-hit-snippet",children:o.snippet})]},o.id))]}),!l&&!T&&p.notebookCount===0&&(0,a.jsxs)("div",{className:"n-tree-empty",children:[(0,a.jsx)("b",{children:n.empty}),(0,a.jsx)("div",{children:n.emptyHint})]}),!l&&!T&&p.root.map(o=>Ne(o,0))]})]}),(0,a.jsx)(He,{pageId:k,t:n,onChanged:()=>{C()},onGone:()=>{I(null),C()}})]})}var K=require("react");var ne=require("react/jsx-runtime");function we(e,t){if(!e||typeof e.get!="function")return null;try{let r=e.get("sessions"),n=r&&r.list&&r.list.getSnapshot(),s=n&&n.byId&&n.byId[t],u=s&&s.cwd;return typeof u=="string"&&u?u:null}catch{return null}}function Ve(e,t){try{let n=e&&typeof e.get=="function"?e.get("workspaces"):null,s=n&&n.list&&n.list.getSnapshot(),i=(s&&s.items||[]).find(l=>l.path===t);if(i&&(i.title||i.displayTitle))return i.title||i.displayTitle}catch{}let r=String(t||"").split(/[\\/]/).filter(Boolean);return r.length?r[r.length-1]:String(t||"")}function qe(e){let{ctx:t,sessionId:r}=e||{},[n,s]=(0,K.useState)(Y()),[u,i]=(0,K.useState)(null),[l,g]=(0,K.useState)(()=>we(t,r)),[M,v]=(0,K.useState)(!1);(0,K.useEffect)(()=>de(s),[]),(0,K.useEffect)(()=>{if(l)return;let N=null;try{let L=t&&typeof t.get=="function"?t.get("sessions"):null,T=L&&L.list;T&&typeof T.subscribe=="function"&&(N=T.subscribe(()=>{let z=we(t,r);z&&g(z)}))}catch{}let P=setTimeout(()=>g(we(t,r)),200);return()=>{clearTimeout(P),typeof N=="function"&&N()}},[t,r,l]),(0,K.useEffect)(()=>{if(!l){i(null);return}let N=!1;return x.findWorkspace(l).then(P=>{N||i(P)}).catch(()=>{N||i(null)}),()=>{N=!0}},[l]);let k=ce(n),I=!l||M,J=u?k.openNotebook:k.createNotebook;return(0,ne.jsxs)("button",{type:"button",className:"n-menu-item",role:"menuitem",disabled:I,title:l||k.noWorkspace,onClick:async N=>{if(N.preventDefault(),N.stopPropagation(),!(!l||M)){v(!0);try{if(u)ge({workspacePath:l,notebookId:u.id});else{let P=await x.bindWorkspace({workspacePath:l,workspaceLabel:Ve(t,l),title:Ve(t,l)});i(P.notebook),ge({workspacePath:l,notebookId:P.notebook.id})}try{t.layout.selectPanel("notes")}catch{}}catch(P){console.warn("[dsh-notes] 会话菜单建笔记本失败:",P)}finally{v(!1)}}},children:[(0,ne.jsx)(Q,{size:14}),(0,ne.jsx)("span",{children:J})]})}var xt=`
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
    `,Je=!1;function Ze(){if(Je||typeof document>"u")return;Je=!0;let e="dsh-notes-styles";if(document.getElementById(e))return;let t=document.createElement("style");t.id=e,t.textContent=xt,document.head.append(t)}var ve=require("react/jsx-runtime"),Pt=["slots"];function Et(e){Ze(),Le({react:Nt,"react/jsx-runtime":St,"react-dom":Ct,"react-dom/client":It}),e.slots.inject("sidebar.panellist",()=>e.slots.register({name:"sidebar.panellist",id:"notes",order:40,label:{zh:"全部笔记本",en:"All notebooks"}},Oe)),e.slots.inject("main",()=>e.slots.register({name:"main",key:"notes"},()=>(0,ve.jsx)(Fe,{ctx:e}))),e.slots.inject("sidebar.workspaces.session.menu.item",()=>e.slots.register({name:"sidebar.workspaces.session.menu.item",id:"notes",order:300,label:{zh:"新建/打开笔记本",en:"New/Open notebook"}},t=>(0,ve.jsx)(qe,{ctx:e,sessionId:t&&t.sessionId})))}

    return module.exports
  }
})
