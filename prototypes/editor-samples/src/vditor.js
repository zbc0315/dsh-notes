import Vditor from 'vditor'
import 'vditor/dist/index.css'

window.mountVditor = (el, markdown) => {
  const vditor = new Vditor(el, {
    value: markdown,
    mode: 'ir',
    height: 620,
    cdn: './vditor',
    cache: { enable: false },
    toolbar: [
      'headings', 'bold', 'italic', 'strike', '|',
      'list', 'ordered-list', 'check', '|',
      'quote', 'line', 'code', 'inline-code', '|',
      'table', 'link', 'upload', '|',
      'undo', 'redo', 'fullscreen',
    ],
  })
  return vditor
}
