import React from 'react'
import { createRoot } from 'react-dom/client'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'

function App({ markdown }) {
  const editor = useCreateBlockNote()
  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      const blocks = await editor.tryParseMarkdownToBlocks(markdown)
      if (!cancelled) editor.replaceBlocks(editor.document, blocks)
    })()
    return () => { cancelled = true }
  }, [editor, markdown])
  return React.createElement(BlockNoteView, { editor, theme: 'light' })
}

window.mountBlockNote = (el, markdown) => {
  const root = createRoot(el)
  root.render(React.createElement(App, { markdown }))
  return root
}
