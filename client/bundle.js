/* 由 tools/build.mjs 从 src/client/index.js 生成 —— 请勿手改。
 * 重新生成：npm run build
 */
window.__ModuleLoader__.load({
  id: "@tom2012/dsh-notes",
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
    var pt=Object.create;var ue=Object.defineProperty;var ut=Object.getOwnPropertyDescriptor;var ft=Object.getOwnPropertyNames;var gt=Object.getPrototypeOf,mt=Object.prototype.hasOwnProperty;var ht=(e,t)=>{for(var r in t)ue(e,r,{get:t[r],enumerable:!0})},Oe=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of ft(t))!mt.call(e,a)&&a!==r&&ue(e,a,{get:()=>t[a],enumerable:!(n=ut(t,a))||n.enumerable});return e};var fe=(e,t,r)=>(r=e!=null?pt(gt(e)):{},Oe(t||!e||!e.__esModule?ue(r,"default",{value:e,enumerable:!0}):r,e)),bt=e=>Oe(ue({},"__esModule",{value:!0}),e);var zt={};ht(zt,{apply:()=>Bt,inject:()=>Wt});module.exports=bt(zt);var $t=fe(require("react")),Lt=fe(require("react/jsx-runtime")),Ot=fe(require("react-dom")),At=fe(require("react-dom/client"));var g=require("react");var W="/-/notes";function yt(e){return e===404?"接口不存在（宿主插件可能未加载）":e===403?"没有权限（宿主鉴权拒绝了请求）":e===409?"内容已在别处修改":e===413?"内容过大":e===503?"宿主服务不可用，请重启 dsh web":e>=500?"宿主内部错误":`HTTP ${e}`}async function j(e){let t=null;try{t=await e.json()}catch{t=null}if(!e.ok||t&&t.ok===!1){let r=new Error(t&&t.error||yt(e.status));throw r.status=e.status,t&&t.current!==void 0&&(r.current=t.current),r}return t||{}}function G(e){let t=[];for(let[r,n]of Object.entries(e||{}))n==null||n===""||t.push(`${encodeURIComponent(r)}=${encodeURIComponent(String(n))}`);return t.length?`?${t.join("&")}`:""}var x={base:W,async status(){return j(await fetch(`${W}/status`,{credentials:"same-origin"}))},async tree(){return j(await fetch(`${W}/tree`,{credentials:"same-origin"}))},async readPage(e){return(await j(await fetch(`${W}/page${G({id:e})}`,{credentials:"same-origin"}))).page},async savePage({id:e,title:t,blocks:r,rev:n,baseMtimeMs:a,baseSize:c}){let i={title:t,rev:n,baseMtimeMs:a,baseSize:c};return Array.isArray(r)&&(i.blocks=r),j(await fetch(`${W}/page${G({id:e})}`,{method:"PUT",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}))},async createPage({notebookId:e,title:t,blocks:r,markdown:n}){let a={notebookId:e,title:t};return Array.isArray(r)&&(a.blocks=r),typeof n=="string"&&(a.markdown=n),(await j(await fetch(`${W}/page`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}))).page},async deletePage(e){return j(await fetch(`${W}/page${G({id:e})}`,{method:"DELETE",credentials:"same-origin"}))},async createNotebook({parentId:e=null,title:t,workspacePath:r=null,workspaceLabel:n=null}){return(await j(await fetch(`${W}/notebook`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({parentId:e,title:t,workspacePath:r,workspaceLabel:n})}))).notebook},async updateNotebook(e,t){return(await j(await fetch(`${W}/notebook${G({id:e})}`,{method:"PATCH",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(t||{})}))).notebook},async deleteNotebook(e){return j(await fetch(`${W}/notebook${G({id:e})}`,{method:"DELETE",credentials:"same-origin"}))},async findWorkspace(e){return(await j(await fetch(`${W}/workspace${G({path:e})}`,{credentials:"same-origin"}))).notebook},async bindWorkspace({workspacePath:e,title:t,workspaceLabel:r}){return j(await fetch(`${W}/workspace`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({workspacePath:e,title:t,workspaceLabel:r})}))},async search(e,t=30){return(await j(await fetch(`${W}/search${G({q:e,limit:t})}`,{credentials:"same-origin"}))).results||[]},async uploadAsset(e){let t=(e.name.split(".").pop()||"").toLowerCase(),r=await fetch(`${W}/asset`,{method:"POST",credentials:"same-origin",headers:{"Content-Type":e.type||"application/octet-stream","x-notes-ext":t},body:e});return j(r)},exportUrl(e){return`${W}/export${G({id:e})}`}};var v=require("react");var Ae="/-/notes/client",ze={},oe=null;function De(e){Object.assign(ze,e||{})}function We(){return e=>{let t=ze[e];if(t!==void 0)return t;throw new Error(`dsh-notes: 编辑器模块请求了未注册的依赖 ${e}`)}}function je(){return oe||(oe=new Promise((e,t)=>{if(typeof document>"u"){t(new Error("dsh-notes: 没有 document，无法加载编辑器"));return}let r="dsh-notes-editor-css";if(!document.getElementById(r)){let i=document.createElement("link");i.id=r,i.rel="stylesheet",i.href=`${Ae}/editor.css`,document.head.append(i)}let n="__DSH_NOTES_EDITOR_FACTORY__",a=window[n];if(typeof a=="function"){try{e(a(We()))}catch(i){t(Be(i))}return}let c=document.createElement("script");c.src=`${Ae}/editor.js`,c.async=!0,c.onload=()=>{let i=window[n];if(typeof i!="function"){t(new Error("dsh-notes: 编辑器模块加载后没有注册工厂"));return}try{e(i(We()))}catch(l){t(Be(l))}},c.onerror=()=>t(new Error("dsh-notes: 编辑器模块下载失败（/-/notes/client/editor.js）")),document.head.append(c)}),oe.catch(()=>{oe=null}),oe)}function Be(e){return e instanceof Error?e:new Error(String(e))}var y=require("react/jsx-runtime"),z={fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"};function Z(e,t){return(0,y.jsx)("svg",{viewBox:"0 0 24 24",width:e,height:e,"aria-hidden":"true",focusable:"false",fill:"none",children:t})}function ee({size:e=16}){return Z(e,(0,y.jsx)(y.Fragment,{children:(0,y.jsx)("path",{d:"M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-6-3.5-6 3.5V5A1.5 1.5 0 0 1 6 3.5Z",...z})}))}function He({size:e=16}){return Z(e,(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("path",{d:"M7 3.5h7.2L18.5 7.8V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z",...z}),(0,y.jsx)("path",{d:"M13.8 3.8V8h4.2",...z})]}))}function ke({size:e=14}){return Z(e,(0,y.jsx)("path",{d:"M12 5.5v13M5.5 12h13",...z}))}function Ue({size:e=12,open:t=!1}){return(0,y.jsx)("svg",{viewBox:"0 0 24 24",width:e,height:e,"aria-hidden":"true",focusable:"false",fill:"none",style:{transform:t?"rotate(90deg)":"none",transition:"transform 120ms ease"},children:(0,y.jsx)("path",{d:"M9 5.5 15.5 12 9 18.5",...z})})}function Ke({size:e=14}){return Z(e,(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("circle",{cx:"11",cy:"11",r:"5.75",...z}),(0,y.jsx)("path",{d:"M15.4 15.4 19 19",...z})]}))}function xe({size:e=14}){return Z(e,(0,y.jsx)(y.Fragment,{children:(0,y.jsx)("path",{d:"M4.5 7h15M10 4.5h4M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12",...z})}))}function ge({size:e=14}){return Z(e,(0,y.jsx)(y.Fragment,{children:(0,y.jsx)("path",{d:"M4.5 19.5h4L19 9a2 2 0 0 0 0-2.8l-1.2-1.2A2 2 0 0 0 15 5L4.5 15.5v4Z",...z})}))}function ie({size:e=14}){return Z(e,(0,y.jsx)("path",{d:"M6 6l12 12M18 6 6 18",...z}))}function _e({size:e=14}){return Z(e,(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("path",{d:"M12 3.5v11M8 10.5 12 14.5 16 10.5",...z}),(0,y.jsx)("path",{d:"M5 17v2a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-2",...z})]}))}function Fe({size:e=14}){return Z(e,(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("path",{d:"M6 3.5h9.2L19 7.3V18a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 18V6a2.5 2.5 0 0 1 1-2Z",...z}),(0,y.jsx)("path",{d:"M8.5 3.5v5h6M8.5 20.5v-6h7v6",...z})]}))}var me=require("react");function Ne(){return typeof document>"u"||!document.body?"light":document.body.hasAttribute("data-ds-dark-theme")?"dark":"light"}function Ve(){let[e,t]=(0,me.useState)(Ne);return(0,me.useEffect)(()=>{if(typeof MutationObserver!="function"||typeof document>"u"||!document.body)return;let r=new MutationObserver(()=>t(Ne()));return r.observe(document.body,{attributes:!0,attributeFilter:["data-ds-dark-theme","class"]}),t(Ne()),()=>r.disconnect()},[]),e}var m=require("react/jsx-runtime"),wt=800,vt=16*1024*1024;function kt(e){if(typeof e!="string"||!e.startsWith("asset://"))return e;let t=e.slice(8),r=t.lastIndexOf("."),n=r===-1?t:t.slice(0,r),a=r===-1?"png":t.slice(r+1);return`/-/notes/asset?sha=${encodeURIComponent(n)}&ext=${encodeURIComponent(a)}`}function qe({pageId:e,t,onChanged:r,onGone:n}){let[a,c]=(0,v.useState)(null),[i,l]=(0,v.useState)("idle"),[h,S]=(0,v.useState)("");return(0,v.useEffect)(()=>{if(!e){c(null),l("idle");return}let b=!1;return l("loading"),S(""),x.readPage(e).then(w=>{b||(c(w),l("ready"))}).catch(w=>{b||(S(String(w&&w.message||w)),l("error"),w&&w.status===404&&typeof n=="function"&&n())}),()=>{b=!0}},[e,n]),e?i==="loading"||i==="idle"?(0,m.jsx)("div",{className:"n-empty",children:t.loading}):i==="error"?(0,m.jsx)("div",{className:"n-empty",children:h}):a?(0,m.jsx)(Nt,{page:a,t,onSaved:r},a.id):(0,m.jsx)("div",{className:"n-empty",children:t.loading}):(0,m.jsx)("div",{className:"n-empty",children:t.noPage})}function xt({t:e}){return(0,m.jsxs)("div",{className:"n-editor-skeleton",role:"status","aria-live":"polite",children:[(0,m.jsx)("div",{className:"n-skel-line",style:{width:"38%",height:"18px"}}),(0,m.jsx)("div",{className:"n-skel-line",style:{width:"92%"}}),(0,m.jsx)("div",{className:"n-skel-line",style:{width:"86%"}}),(0,m.jsx)("div",{className:"n-skel-line",style:{width:"70%"}}),(0,m.jsx)("div",{className:"n-skel-hint",children:e.loading})]})}function Nt({page:e,t,onSaved:r}){let[n,a]=(0,v.useState)(null),[c,i]=(0,v.useState)(""),[l,h]=(0,v.useState)(e.title&&e.title!==t.untitled?e.title:""),[S,b]=(0,v.useState)("saved"),[w,C]=(0,v.useState)(null),[O,k]=(0,v.useState)(""),R=(0,v.useRef)({...e}),u=(0,v.useRef)(!1),$=(0,v.useRef)(null),B=(0,v.useRef)(!1),I=(0,v.useRef)(null),q=(0,v.useRef)(l),F=(0,v.useRef)(t),Y=(0,v.useRef)(r);q.current=l,F.current=t,Y.current=r,(0,v.useEffect)(()=>{let f=!1;return je().then(P=>{f||a(P)}).catch(P=>{f||i(String(P&&P.message||P))}),()=>{f=!0}},[]);let T=(0,v.useCallback)(async({force:f=!1,rev:P}={})=>{let M=I.current;if(!M||B.current||!u.current&&!f)return;let Q=R.current,J;try{J=JSON.parse(JSON.stringify(M.document))}catch(L){k(String(L&&L.message||L));return}B.current=!0,b("saving");try{let L=await x.savePage({id:Q.id,title:q.current.trim()||F.current.untitled,blocks:J,rev:P===void 0?Q.rev:P,baseMtimeMs:Q.mtimeMs,baseSize:Q.size});if(R.current={...L.page},u.current=!1,b("saved"),C(null),L.conflictFile){let ae=String(L.conflictFile).split(/[\\/]/).pop();k(`已保存；外部改动留档为 ${ae}`)}typeof Y.current=="function"&&Y.current(L.page)}catch(L){L&&L.status===409?(C(L.current||null),b("error")):(b("error"),k(String(L&&L.message||L)))}finally{B.current=!1}},[]),U=(0,v.useCallback)(()=>{$.current&&clearTimeout($.current),$.current=setTimeout(()=>{$.current=null,T()},wt)},[T]);(0,v.useEffect)(()=>()=>{$.current&&(clearTimeout($.current),$.current=null),u.current&&T({force:!0}).catch(()=>{})},[T]),(0,v.useEffect)(()=>{let f=P=>{(P.metaKey||P.ctrlKey)&&!P.altKey&&String(P.key).toLowerCase()==="s"&&(P.preventDefault(),T({force:!0}))};return window.addEventListener("keydown",f,!0),()=>window.removeEventListener("keydown",f,!0)},[T]);let de=(0,v.useCallback)(async f=>{if(f&&f.size>vt)throw new Error(F.current.imageTooLarge);let P=await x.uploadAsset(f);return`asset://${P.sha}.${P.ext}`},[]),pe=(0,v.useCallback)(async f=>kt(f),[]),re=(0,v.useMemo)(()=>({initialContent:Array.isArray(e.blocks)&&e.blocks.length>0?e.blocks:void 0,uploadFile:de,resolveFileUrl:pe}),[e.id]);return(0,m.jsxs)("div",{className:"n-main",children:[(0,m.jsxs)("div",{className:"n-topbar",children:[(0,m.jsx)("input",{className:"n-title-input",value:l,placeholder:t.untitled,"aria-label":t.title,onChange:f=>{h(f.target.value),u.current=!0,b("dirty"),U()},onBlur:()=>T()}),(0,m.jsx)("span",{className:`n-save-state${S==="error"?" is-error":""}`,role:"status","aria-live":"polite",children:S==="saving"?t.saving:S==="dirty"?t.unsaved:S==="error"?t.conflict:t.saved}),(0,m.jsx)("a",{className:"n-btn is-icon",href:x.exportUrl(e.id),download:!0,title:t.exportMd,"aria-label":t.exportMd,children:(0,m.jsx)(_e,{})}),(0,m.jsx)("button",{type:"button",className:"n-btn is-icon",title:t.save,"aria-label":t.save,onClick:()=>T({force:!0}),children:(0,m.jsx)(Fe,{})})]}),w&&(0,m.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,m.jsxs)("span",{className:"n-banner-text",children:[(0,m.jsx)("b",{children:t.conflict})," — ",t.conflictBody]}),(0,m.jsx)("button",{type:"button",className:"n-btn",onClick:()=>{let f=w.rev;C(null),u.current=!0,T({force:!0,rev:f})},children:t.overwrite}),(0,m.jsx)("button",{type:"button",className:"n-btn",onClick:async()=>{C(null);try{let f=await x.readPage(R.current.id);R.current={...f},h(f.title===t.untitled?"":f.title);let P=I.current;P&&Array.isArray(f.blocks)&&P.replaceBlocks(P.document,f.blocks),u.current=!1,b("saved")}catch(f){k(String(f&&f.message||f))}},children:t.reload})]}),O&&(0,m.jsxs)("div",{className:"n-banner",role:"status",children:[(0,m.jsx)("span",{className:"n-banner-text",children:O}),(0,m.jsx)("button",{type:"button",className:"n-btn is-icon","aria-label":t.close,onClick:()=>k(""),children:(0,m.jsx)(ie,{})})]}),(0,m.jsx)("div",{className:"n-editor-scroll",children:(0,m.jsxs)("div",{className:"n-editor",children:[c&&(0,m.jsx)("div",{className:"n-empty",children:c}),!n&&!c&&(0,m.jsx)(xt,{t}),n&&(0,m.jsx)(Ct,{runtime:n,options:re,t,onReady:f=>{I.current=f},onChange:()=>{u.current=!0,b(f=>f==="saving"?f:"dirty"),U()}})]})})]})}function Ct({runtime:e,options:t,t:r,onReady:n,onChange:a}){let{useCreateBlockNote:c,BlockNoteView:i}=e,l=Ve(),h=c(t);return(0,v.useEffect)(()=>{h&&n(h)},[h,n]),h?(0,m.jsx)("div",{className:"n-blocknote",children:(0,m.jsx)(i,{editor:h,theme:l,onChange:a})}):null}var St={label:"全部笔记本",title:"全部笔记本",currentWorkspace:"当前工作区",noWorkspace:"未选择工作区",createNotebook:"新建笔记本",openNotebook:"打开笔记本",orphan:"游离",newPage:"新建页面",newChild:"新建子笔记本",rename:"重命名",delete:"删除",exportMd:"导出 Markdown",save:"保存",saved:"已保存",saving:"保存中…",unsaved:"未保存",conflict:"他处已修改",conflictBody:"这份笔记在别处被改过。覆盖会丢掉对方的改动。",overwrite:"覆盖",reload:"载入最新",empty:"还没有笔记本",emptyHint:"在左侧选中一个工作区，点「新建笔记本」开始。",noPage:"选一个页面开始编辑，或者新建一页。",untitled:"无标题",searchPlaceholder:"搜索标题与正文…",searchEmpty:"没有命中",deleteNotebookConfirm:e=>`删除笔记本「${e}」？它和里面的页面都会进回收站。`,deletePageConfirm:e=>`删除页面「${e}」？会进回收站。`,renamePrompt:"新名字",loading:"载入中…",retry:"重试",unavailable:"笔记本服务不可用",unavailableHint:"宿主路由没有注册成功，请重启 dsh web 后刷新页面。",imageTooLarge:"图片太大（上限 16MB）",uploadFailed:"图片上传失败",chars:e=>`${e} 字`,more:"更多",noResults:"没有结果",notebook:"笔记本",page:"页面",rightTab:"笔记本",rightTabDesc:"浏览全部工作区的笔记本",rightEmptyHint:"点上面的「新建笔记本」开始。"},It={label:"All notebooks",title:"All notebooks",currentWorkspace:"Current workspace",noWorkspace:"No workspace selected",createNotebook:"New notebook",openNotebook:"Open notebook",orphan:"Orphan",newPage:"New page",newChild:"New sub-notebook",rename:"Rename",delete:"Delete",exportMd:"Export markdown",save:"Save",saved:"Saved",saving:"Saving…",unsaved:"Unsaved",conflict:"Changed elsewhere",conflictBody:"This note changed on disk. Overwriting discards the other version.",overwrite:"Overwrite",reload:"Reload latest",empty:"No notebooks yet",emptyHint:"Pick a workspace on the left, then click “New notebook”.",noPage:"Pick a page to start writing, or create one.",untitled:"Untitled",searchPlaceholder:"Search titles and text…",searchEmpty:"Nothing matched",deleteNotebookConfirm:e=>`Delete notebook “${e}”? It and its pages go to the trash.`,deletePageConfirm:e=>`Delete page “${e}”? It goes to the trash.`,renamePrompt:"New name",loading:"Loading…",retry:"Retry",unavailable:"Notebook service unavailable",unavailableHint:"The host route did not register. Restart dsh web, then reload this page.",imageTooLarge:"Image too large (16MB limit)",uploadFailed:"Image upload failed",chars:e=>`${e} chars`,more:"More",noResults:"No results",notebook:"Notebook",page:"Page",rightTab:"Notebooks",rightTabDesc:"Browse notebooks from every workspace",rightEmptyHint:"Use “New notebook” above to get started."};function V(){let e=typeof document<"u"&&document.documentElement.lang||"zh-CN";return String(e).toLowerCase().startsWith("zh")?"zh":"en"}function H(e){return(e||V())==="zh"?St:It}function te(e){if(typeof MutationObserver!="function"||typeof document>"u")return()=>{};let t=new MutationObserver(r=>{for(let n of r)if(n.attributeName==="lang"){e(V());return}});return t.observe(document.documentElement,{attributes:!0,attributeFilter:["lang"]}),()=>t.disconnect()}var he=null,Ce=new Set;function ne(e){he=Object.assign({at:Date.now()},e||{});for(let t of Ce)try{t(he)}catch{}}function Se(){let e=he;return he=null,e}function Je(e){return Ce.add(e),()=>Ce.delete(e)}var be=require("react");function Pt(e){try{let t=e.get&&e.get("uiSession"),r=t&&(t.current||t.adapter?.current)||null,n=r&&typeof r.getSnapshot=="function"?r.getSnapshot():null;if(n&&typeof n.key=="string")return n.key}catch{}try{let t=e.get&&e.get("sessions"),r=t&&t.list&&t.list.getSnapshot();if(r&&r.byId){let n=Object.values(r.byId).find(a=>(a.retainedBy?.mainView??0)>0);if(n&&n.id)return n.id}}catch{}}function Et(e,t){if(!t)return null;let r="";try{let n=e.get&&e.get("workspaces"),a=n&&n.list&&n.list.getSnapshot(),i=(a&&a.items||[]).find(l=>l.path===t);i&&(r=i.title||i.displayTitle||"")}catch{}if(!r){let n=String(t).split(/[\\/]/).filter(Boolean);r=n.length?n[n.length-1]:t}return{path:t,title:r}}function Ze(e){let t=Pt(e);if(!t)return null;try{let r=e.get&&e.get("sessions"),n=r&&r.list&&r.list.getSnapshot(),a=n&&n.byId&&n.byId[t];return a?Et(e,a.cwd):null}catch{return null}}function ye(e){let[t,r]=(0,be.useState)(()=>Ze(e));return(0,be.useEffect)(()=>{let n=()=>r(Ze(e)),a=[],c=(l,h)=>{try{let S=h(l);S&&typeof S.subscribe=="function"&&a.push(S.subscribe(n)||(()=>{}))}catch{}},i=e.get&&e.get("uiSession");try{let l=i&&(i.current||i.adapter?.current)||null;l&&typeof l.subscribe=="function"&&a.push(l.subscribe(n)||(()=>{}))}catch{}try{let l=e.get&&e.get("sessions");c(l,h=>h.list)}catch{}try{let l=e.get&&e.get("workspaces");c(l,h=>h.list)}catch{}return n(),()=>{for(let l of a)try{l()}catch{}}},[e]),t}var s=require("react/jsx-runtime");function Tt(e){let t=Array.isArray(e?.notebooks)?e.notebooks:[],r=Array.isArray(e?.pages)?e.pages:[],n=new Map(t.map(i=>[i.id,i])),a=new Map;for(let i of t){let l=i.parentId&&n.has(i.parentId)?i.parentId:null;a.has(l)||a.set(l,[]),a.get(l).push(i)}for(let i of a.values())i.sort((l,h)=>(l.order??0)-(h.order??0)||l.title.localeCompare(h.title));let c=new Map;for(let i of r)c.has(i.notebookId)||c.set(i.notebookId,[]),c.get(i.notebookId).push(i);for(let i of c.values())i.sort((l,h)=>(l.order??0)-(h.order??0)||(h.updatedAt??0)-(l.updatedAt??0));return{byId:n,children:a,pagesOf:c,root:a.get(null)||[],notebookCount:t.length}}function Xe({value:e,onChange:t,onCommit:r,onCancel:n}){let a=(0,g.useRef)(null);return(0,g.useEffect)(()=>{a.current?.focus(),a.current?.select()},[]),(0,s.jsx)("input",{ref:a,className:"n-title-input",style:{height:"22px",fontSize:"13px",fontWeight:500},value:e,onChange:c=>t(c.target.value),onBlur:r,onKeyDown:c=>{c.key==="Enter"?(c.preventDefault(),r()):c.key==="Escape"&&(c.preventDefault(),n())}})}function Ye({ctx:e}){let[t,r]=(0,g.useState)(V());(0,g.useEffect)(()=>te(r),[]);let n=(0,g.useMemo)(()=>H(t),[t]),a=ye(e),[c,i]=(0,g.useState)({notebooks:[],pages:[]}),[l,h]=(0,g.useState)(!0),[S,b]=(0,g.useState)(""),[w,C]=(0,g.useState)(null),[O,k]=(0,g.useState)(()=>new Set),[R,u]=(0,g.useState)(""),[$,B]=(0,g.useState)(null),[I,q]=(0,g.useState)(null),[F,Y]=(0,g.useState)(null),[T,U]=(0,g.useState)(null),[de,pe]=(0,g.useState)(!1),re=(0,g.useRef)(null),f=(0,g.useMemo)(()=>Tt(c),[c]),P=(0,g.useMemo)(()=>{if(!w)return null;let o=(c.pages||[]).find(p=>p.id===w);return o?o.notebookId:null},[w,c]),M=(0,g.useCallback)(async()=>{b("");try{let o=await x.tree();return i({notebooks:o.notebooks||[],pages:o.pages||[]}),h(!1),o}catch(o){return h(!1),b(String(o&&o.message||o)),null}},[]);(0,g.useEffect)(()=>{M()},[M]);let Q=(0,g.useCallback)(async o=>{if(!o)return;let p=await M(),d=o.notebookId||null;if(!d&&o.workspacePath)try{let E=await x.findWorkspace(o.workspacePath);d=E?E.id:null}catch{d=null}if(!d)return;if(k(E=>new Set(E).add(d)),o.pageId){C(o.pageId);return}let K=(p&&p.pages||[]).filter(E=>E.notebookId===d);if(K.length>0){C(K[0].id);return}try{let E=await x.createPage({notebookId:d,title:n.untitled});await M(),C(E.id)}catch(E){b(String(E&&E.message||E))}},[M,n]);(0,g.useEffect)(()=>{let o=Se();return o&&Q(o),Je(d=>{Se(),Q(d)})},[Q]),(0,g.useEffect)(()=>{let o=a?.path;if(!o){q(null);return}let p=!1;return x.findWorkspace(o).then(d=>{p||q(d)}).catch(()=>{p||q(null)}),()=>{p=!0}},[a?.path,c]),(0,g.useEffect)(()=>{let o=R.trim();if(!o){B(null);return}let p=!1,d=setTimeout(()=>{x.search(o,30).then(K=>{p||B(K)}).catch(()=>{p||B([])})},200);return()=>{p=!0,clearTimeout(d)}},[R]);let J=(0,g.useCallback)(async o=>{pe(!0);try{return await o()}finally{pe(!1)}},[]),L=(0,g.useCallback)(async()=>{if(!a?.path)return null;if(I)return I;let o=await x.bindWorkspace({workspacePath:a.path,workspaceLabel:a.title,title:a.title});return q(o.notebook),o.notebook},[a,I]),ae=(0,g.useCallback)(async o=>{if(!o)return;k(d=>new Set(d).add(o.id));let p=(f.pagesOf.get(o.id)||[])[0];p?C(p.id):await se(o.id)},[f]),se=(0,g.useCallback)(async o=>{let p=o||P||I&&I.id;p&&await J(async()=>{try{let d=await x.createPage({notebookId:p,title:n.untitled});k(K=>new Set(K).add(p)),await M(),C(d.id)}catch(d){b(String(d&&d.message||d))}})},[P,I,M,n,J]),ot=(0,g.useCallback)(async(o=null)=>{await J(async()=>{try{let p=await x.createNotebook({parentId:o,title:n.notebook});await M(),o&&k(d=>new Set(d).add(o)),U({kind:"notebook",id:p.id,value:p.title})}catch(p){b(String(p&&p.message||p))}})},[M,n,J]),at=(0,g.useCallback)(async()=>{await J(async()=>{try{let o=await L();await M(),await ae(o)}catch(o){b(String(o&&o.message||o))}})},[L,M,ae,J]),Te=(0,g.useCallback)(async()=>{let o=T;if(U(null),!o)return;let p=o.value.trim();if(p)try{if(o.kind==="notebook")await x.updateNotebook(o.id,{title:p});else{let d=await x.readPage(o.id);await x.savePage({id:d.id,title:p,rev:d.rev,baseMtimeMs:d.mtimeMs,baseSize:d.size})}await M()}catch(d){b(String(d&&d.message||d))}},[T,M]),st=(0,g.useCallback)(async()=>{let o=F;if(Y(null),!!o)try{o.kind==="page"?(await x.deletePage(o.id),w===o.id&&C(null)):await x.deleteNotebook(o.id),await M()}catch(p){b(String(p&&p.message||p))}},[F,w,M]),Me=(0,g.useCallback)(o=>{k(p=>{let d=new Set(p);return d.has(o)?d.delete(o):d.add(o),d})},[]);(0,g.useEffect)(()=>{let o=p=>{let d=p.metaKey||p.ctrlKey;d&&p.key.toLowerCase()==="p"?(p.preventDefault(),re.current?.focus(),re.current?.select?.()):d&&p.shiftKey&&p.key.toLowerCase()==="n"?(p.preventDefault(),se()):p.key==="Escape"&&document.activeElement===re.current&&u("")};return window.addEventListener("keydown",o),()=>window.removeEventListener("keydown",o)},[se]);let it=(o,p)=>(f.pagesOf.get(o)||[]).map(d=>{let K=T&&T.kind==="page"&&T.id===d.id;return(0,s.jsxs)("div",{className:`n-row${w===d.id?" is-active":""}`,style:{paddingLeft:`${8+p*12+16}px`},role:"treeitem","aria-selected":w===d.id?"true":"false",tabIndex:0,onClick:()=>C(d.id),onKeyDown:E=>{(E.key==="Enter"||E.key===" ")&&(E.preventDefault(),C(d.id))},children:[(0,s.jsx)(He,{}),K?(0,s.jsx)(Xe,{value:T.value,onChange:E=>U({...T,value:E}),onCommit:Te,onCancel:()=>U(null)}):(0,s.jsx)("span",{className:"n-row-title",children:d.title||n.untitled}),(0,s.jsxs)("span",{className:"n-row-actions",children:[(0,s.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.rename,"aria-label":n.rename,onClick:E=>{E.stopPropagation(),U({kind:"page",id:d.id,value:d.title||""})},children:(0,s.jsx)(ge,{})}),(0,s.jsx)("button",{type:"button",className:"n-btn is-icon is-danger",title:n.delete,"aria-label":n.delete,onClick:E=>{E.stopPropagation(),Y({kind:"page",id:d.id,title:d.title||n.untitled})},children:(0,s.jsx)(xe,{})})]})]},d.id)}),Re=(o,p)=>{let d=O.has(o.id),K=f.children.get(o.id)||[],E=f.pagesOf.get(o.id)||[],$e=K.length>0||E.length>0,dt=T&&T.kind==="notebook"&&T.id===o.id,Le=o.workspacePath&&a?.path&&o.workspacePath===a.path;return(0,s.jsxs)("div",{children:[(0,s.jsxs)("div",{className:"n-row is-notebook",style:{paddingLeft:`${8+p*12}px`},role:"treeitem","aria-expanded":d?"true":"false",tabIndex:0,onClick:()=>Me(o.id),onKeyDown:A=>{(A.key==="Enter"||A.key===" ")&&(A.preventDefault(),Me(o.id))},title:o.workspacePath||o.title,children:[(0,s.jsx)("span",{className:`n-twist${$e?"":" is-leaf"}`,"aria-hidden":"true",children:(0,s.jsx)(Ue,{open:d})}),(0,s.jsx)(ee,{}),dt?(0,s.jsx)(Xe,{value:T.value,onChange:A=>U({...T,value:A}),onCommit:Te,onCancel:()=>U(null)}):(0,s.jsx)("span",{className:"n-row-title",children:o.title}),Le&&(0,s.jsx)("span",{className:"n-row-badge",children:n.currentWorkspace}),o.workspacePath&&!Le&&(0,s.jsx)("span",{className:"n-row-badge",children:n.orphan}),(0,s.jsxs)("span",{className:"n-row-actions",children:[(0,s.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.newPage,"aria-label":n.newPage,onClick:A=>{A.stopPropagation(),se(o.id)},children:(0,s.jsx)(ke,{})}),(0,s.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.newChild,"aria-label":n.newChild,onClick:A=>{A.stopPropagation(),ot(o.id)},children:(0,s.jsx)(ee,{size:12})}),(0,s.jsx)("button",{type:"button",className:"n-btn is-icon",title:n.rename,"aria-label":n.rename,onClick:A=>{A.stopPropagation(),U({kind:"notebook",id:o.id,value:o.title})},children:(0,s.jsx)(ge,{})}),(0,s.jsx)("button",{type:"button",className:"n-btn is-icon is-danger",title:n.delete,"aria-label":n.delete,onClick:A=>{A.stopPropagation(),Y({kind:"notebook",id:o.id,title:o.title})},children:(0,s.jsx)(xe,{})})]})]}),d&&(0,s.jsxs)("div",{role:"group",children:[K.map(A=>Re(A,p+1)),it(o.id,p),!$e&&(0,s.jsx)("div",{className:"n-row",style:{paddingLeft:`${8+(p+1)*12+16}px`,color:"var(--dsw-alias-label-tertiary)"},children:(0,s.jsx)("span",{className:"n-row-title",children:n.noPage})})]})]},o.id)},lt=a?a.title:n.noWorkspace,ct=!!a?.path;return(0,s.jsxs)("div",{className:"n-app",children:[(0,s.jsxs)("aside",{className:"n-side",children:[(0,s.jsxs)("div",{className:"n-wsbar",children:[(0,s.jsx)("span",{className:"n-wsbar-label",children:n.currentWorkspace}),(0,s.jsxs)("span",{className:"n-wsbar-name",title:a?.path||"",children:[(0,s.jsx)(ee,{}),(0,s.jsx)("b",{children:lt})]}),(0,s.jsxs)("span",{className:"n-wsbar-actions",children:[(0,s.jsxs)("button",{type:"button",className:"n-btn",disabled:!ct||de,onClick:()=>I?ae(I):at(),children:[(0,s.jsx)(ke,{}),I?n.openNotebook:n.createNotebook]}),(0,s.jsx)("button",{type:"button",className:"n-btn",disabled:de,title:n.newPage,"aria-label":n.newPage,onClick:()=>se(),children:(0,s.jsx)(ge,{})})]})]}),(0,s.jsxs)("div",{className:"n-search",children:[(0,s.jsx)(Ke,{}),(0,s.jsx)("input",{ref:re,type:"search",value:R,placeholder:n.searchPlaceholder,"aria-label":n.search,onChange:o=>u(o.target.value)}),R&&(0,s.jsx)("button",{type:"button",className:"n-btn is-icon","aria-label":n.delete,onClick:()=>u(""),children:(0,s.jsx)(ie,{size:12})})]}),S&&(0,s.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,s.jsx)("span",{className:"n-banner-text",children:S}),(0,s.jsx)("button",{type:"button",className:"n-btn",onClick:M,children:n.retry})]}),F&&(0,s.jsxs)("div",{className:"n-banner",role:"alert",children:[(0,s.jsx)("span",{className:"n-banner-text",children:F.kind==="notebook"?n.deleteNotebookConfirm(F.title):n.deletePageConfirm(F.title)}),(0,s.jsx)("button",{type:"button",className:"n-btn is-danger",onClick:st,children:n.delete}),(0,s.jsx)("button",{type:"button",className:"n-btn",onClick:()=>Y(null),children:(0,s.jsx)(ie,{size:12})})]}),(0,s.jsxs)("div",{className:"n-tree",role:"tree","aria-label":n.title,children:[l&&(0,s.jsx)("div",{className:"n-tree-empty",children:n.loading}),!l&&$&&(0,s.jsxs)(s.Fragment,{children:[$.length===0&&(0,s.jsx)("div",{className:"n-tree-empty",children:n.noResults}),$.map(o=>(0,s.jsxs)("div",{className:"n-hit",role:"button",tabIndex:0,onClick:()=>{C(o.id),u("")},onKeyDown:p=>{p.key==="Enter"&&(C(o.id),u(""))},children:[(0,s.jsx)("div",{className:"n-hit-title",children:o.title||n.untitled}),o.snippet&&(0,s.jsx)("div",{className:"n-hit-snippet",children:o.snippet})]},o.id))]}),!l&&!$&&f.notebookCount===0&&(0,s.jsxs)("div",{className:"n-tree-empty",children:[(0,s.jsx)("b",{children:n.empty}),(0,s.jsx)("div",{children:n.emptyHint})]}),!l&&!$&&f.root.map(o=>Re(o,0))]})]}),(0,s.jsx)(qe,{pageId:w,t:n,onChanged:()=>{M()},onGone:()=>{C(null),M()}})]})}var D=require("react");function Ie(e,t){if(!e||typeof e.get!="function")return null;try{let r=e.get("sessions"),n=r&&r.list&&r.list.getSnapshot(),a=n&&n.byId&&n.byId[t],c=a&&a.cwd;return typeof c=="string"&&c?c:null}catch{return null}}function Mt(e,t){try{let n=e&&typeof e.get=="function"?e.get("workspaces"):null,a=n&&n.list&&n.list.getSnapshot(),i=(a&&a.items||[]).find(l=>l.path===t);if(i&&(i.title||i.displayTitle))return i.title||i.displayTitle}catch{}let r=String(t||"").split(/[\\/]/).filter(Boolean);return r.length?r[r.length-1]:String(t||"")}async function we(e,t){let r=await x.findWorkspace(t);if(r)return{notebook:r,created:!1};let n=Mt(e,t);return{notebook:await x.createNotebook({title:n,workspacePath:t,workspaceLabel:n}),created:!0}}function ve(e){try{let t=e&&typeof e.get=="function"?e.get("layout"):null;t&&typeof t.selectPanel=="function"&&t.selectPanel("notes")}catch{}}var N=require("react/jsx-runtime");function Qe({ctx:e}){let[t,r]=(0,D.useState)(V());(0,D.useEffect)(()=>te(r),[]);let n=(0,D.useMemo)(()=>H(t),[t]),a=ye(e),[c,i]=(0,D.useState)(null),[l,h]=(0,D.useState)(""),[S,b]=(0,D.useState)(!1),w=(0,D.useCallback)(async()=>{b(!0),h("");try{let u=await x.tree();i({notebooks:u.notebooks||[],pages:u.pages||[]})}catch(u){h(String(u&&u.message||u))}finally{b(!1)}},[]);(0,D.useEffect)(()=>{w()},[w]);let C=(0,D.useMemo)(()=>{let u=c&&c.notebooks||[],$=c&&c.pages||[],B=new Map;for(let I of $)B.set(I.notebookId,(B.get(I.notebookId)||0)+1);return u.filter(I=>I.parentId===null||I.parentId===void 0).sort((I,q)=>(I.order||0)-(q.order||0)).map(I=>({...I,pageCount:B.get(I.id)||0}))},[c]),O=u=>{ne({notebookId:u}),ve(e)},k=(0,D.useMemo)(()=>!a||!C.length?null:C.find(u=>u.workspacePath&&u.workspacePath===a.path)||null,[C,a]),R=async()=>{if(!(!a||S)){b(!0),h("");try{if(k)O(k.id);else{let{notebook:u}=await we(e,a.path);await w(),O(u.id)}}catch(u){h(String(u&&u.message||u))}finally{b(!1)}}};return(0,N.jsxs)("div",{className:"n-right",children:[(0,N.jsxs)("div",{className:"n-right-head",children:[(0,N.jsx)("span",{className:"n-right-title",children:n.label}),(0,N.jsx)("button",{type:"button",className:"n-right-refresh",onClick:w,disabled:S,"aria-label":n.retry,title:n.retry,children:"⟳"})]}),(0,N.jsx)("div",{className:"n-right-ws",children:a?(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)("span",{className:"n-right-ws-name",title:a.path,children:a.title}),(0,N.jsx)("button",{type:"button",className:"n-right-action n-right-ws-btn",onClick:R,disabled:S,children:k?n.openNotebook:n.createNotebook})]}):(0,N.jsx)("span",{className:"n-right-ws-name",children:n.noWorkspace})}),l?(0,N.jsxs)("div",{className:"n-right-empty",children:[(0,N.jsx)("div",{children:n.unavailable}),(0,N.jsx)("div",{className:"n-right-hint",children:l}),(0,N.jsx)("button",{type:"button",className:"n-right-action",onClick:w,children:n.retry})]}):c?C.length===0?(0,N.jsxs)("div",{className:"n-right-empty",children:[(0,N.jsx)("div",{children:n.empty}),(0,N.jsx)("div",{className:"n-right-hint",children:n.rightEmptyHint})]}):(0,N.jsx)("div",{className:"n-right-list",role:"list",children:C.map(u=>(0,N.jsxs)("button",{type:"button",role:"listitem",className:"n-right-row",onClick:()=>O(u.id),title:u.workspacePath||u.title,children:[(0,N.jsxs)("span",{className:"n-right-row-main",children:[(0,N.jsx)("span",{className:"n-right-row-title",children:u.title}),(0,N.jsxs)("span",{className:"n-right-row-meta",children:[u.pageCount," ",n.page,u.workspacePath?"":` · ${n.orphan}`]})]}),(0,N.jsx)("span",{className:"n-right-arrow","aria-hidden":"true",children:"→"})]},u.id))}):(0,N.jsx)("div",{className:"n-right-empty",children:n.loading})]})}var _=require("react");var Pe=require("react/jsx-runtime");function Ge({ctx:e,sessionId:t}){let[r,n]=(0,_.useState)(V()),[a,c]=(0,_.useState)(()=>Ie(e,t)),[i,l]=(0,_.useState)(null),[h,S]=(0,_.useState)(!1),b=(0,_.useRef)(!0);(0,_.useEffect)(()=>te(n),[]),(0,_.useEffect)(()=>{if(b.current=!0,!!a)return x.findWorkspace(a).then(O=>{b.current&&l(O!=null)}).catch(()=>{b.current&&l(null)}),()=>{b.current=!1}},[a]),(0,_.useEffect)(()=>{if(a)return;let O=setTimeout(()=>c(Ie(e,t)),300);return()=>clearTimeout(O)},[e,t,a]);let w=i?H(r).openNotebook:H(r).createNotebook;return(0,Pe.jsx)("button",{type:"button",className:"n-rowaction","aria-label":w,title:w,disabled:h||!a,onClick:async O=>{if(O.stopPropagation(),!(h||!a)){S(!0);try{let{notebook:k}=await we(e,a);l(!0),ne({notebookId:k.id}),ve(e)}catch(k){console.warn("[dsh-notes] 建/开笔记本失败：",k&&k.message)}finally{S(!1)}}},children:(0,Pe.jsx)(ee,{size:14})})}var X=require("react");var le=require("react/jsx-runtime");function Ee(e,t){if(!e||typeof e.get!="function")return null;try{let r=e.get("sessions"),n=r&&r.list&&r.list.getSnapshot(),a=n&&n.byId&&n.byId[t],c=a&&a.cwd;return typeof c=="string"&&c?c:null}catch{return null}}function et(e,t){try{let n=e&&typeof e.get=="function"?e.get("workspaces"):null,a=n&&n.list&&n.list.getSnapshot(),i=(a&&a.items||[]).find(l=>l.path===t);if(i&&(i.title||i.displayTitle))return i.title||i.displayTitle}catch{}let r=String(t||"").split(/[\\/]/).filter(Boolean);return r.length?r[r.length-1]:String(t||"")}function tt(e){let{ctx:t,sessionId:r}=e||{},[n,a]=(0,X.useState)(V()),[c,i]=(0,X.useState)(null),[l,h]=(0,X.useState)(()=>Ee(t,r)),[S,b]=(0,X.useState)(!1);(0,X.useEffect)(()=>te(a),[]),(0,X.useEffect)(()=>{if(l)return;let k=null;try{let u=t&&typeof t.get=="function"?t.get("sessions"):null,$=u&&u.list;$&&typeof $.subscribe=="function"&&(k=$.subscribe(()=>{let B=Ee(t,r);B&&h(B)}))}catch{}let R=setTimeout(()=>h(Ee(t,r)),200);return()=>{clearTimeout(R),typeof k=="function"&&k()}},[t,r,l]),(0,X.useEffect)(()=>{if(!l){i(null);return}let k=!1;return x.findWorkspace(l).then(R=>{k||i(R)}).catch(()=>{k||i(null)}),()=>{k=!0}},[l]);let w=H(n),C=!l||S,O=c?w.openNotebook:w.createNotebook;return(0,le.jsxs)("button",{type:"button",className:"n-menu-item",role:"menuitem",disabled:C,title:l||w.noWorkspace,onClick:async k=>{if(k.preventDefault(),k.stopPropagation(),!(!l||S)){b(!0);try{if(c)ne({workspacePath:l,notebookId:c.id});else{let R=await x.bindWorkspace({workspacePath:l,workspaceLabel:et(t,l),title:et(t,l)});i(R.notebook),ne({workspacePath:l,notebookId:R.notebook.id})}try{t.layout.selectPanel("notes")}catch{}}catch(R){console.warn("[dsh-notes] 会话菜单建笔记本失败:",R)}finally{b(!1)}}},children:[(0,le.jsx)(ee,{size:14}),(0,le.jsx)("span",{children:O})]})}var Rt=`
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
    `,nt=!1;function rt(){if(nt||typeof document>"u")return;nt=!0;let e="dsh-notes-styles";if(document.getElementById(e))return;let t=document.createElement("style");t.id=e,t.textContent=Rt,document.head.append(t)}var ce=require("react/jsx-runtime"),Wt=["slots"];function Bt(e){rt(),De({react:$t,"react/jsx-runtime":Lt,"react-dom":Ot,"react-dom/client":At}),e.slots.inject("main",()=>e.slots.register({name:"main",key:"notes"},()=>(0,ce.jsx)(Ye,{ctx:e}))),e.slots.inject("sidebar.workspaces.session.menu.item",()=>e.slots.register({name:"sidebar.workspaces.session.menu.item",id:"notes",order:300},t=>(0,ce.jsx)(tt,{ctx:e,sessionId:t&&t.sessionId}))),e.slots.inject("sidebar.workspaces.session.row.action",()=>e.slots.register({name:"sidebar.workspaces.session.row.action",id:"notes",order:100},t=>(0,ce.jsx)(Ge,{ctx:e,sessionId:t&&t.sessionId}))),e.inject(["slots","sidebarRightTabs"],t=>{let r=t.sidebarRightTabs,n=t.slots;r&&typeof r.register=="function"&&e.effect(()=>r.register({id:"dsh-notes",kind:"notes",title:()=>H().rightTab,guide:[{id:"all",order:20,title:()=>H().label,description:()=>H().rightTabDesc}]}),"dsh-notes: right tab type"),n&&typeof n.inject=="function"&&e.effect(()=>n.inject("sidebar.right.pane.tab",()=>n.register({name:"sidebar.right.pane.tab",key:"dsh-notes"},a=>(0,ce.jsx)(Qe,{ctx:e,...a}))),"dsh-notes: right tab body")})}

    return module.exports
  }
})
