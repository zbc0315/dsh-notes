/**
 * 图标：全部内联 SVG，只吃 currentColor，跟宿主暗色/亮色自动走。
 * 统一 24×24 视框、1.7 描边，与 DSH 自身的线性图标同调。
 */

const S = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function svg(size, children) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      {children}
    </svg>
  )
}

export function NotebookIcon({ size = 16 }) {
  return svg(
    size,
    <>
      <path d="M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-6-3.5-6 3.5V5A1.5 1.5 0 0 1 6 3.5Z" {...S} />
    </>,
  )
}

export function PageIcon({ size = 16 }) {
  return svg(
    size,
    <>
      <path d="M7 3.5h7.2L18.5 7.8V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" {...S} />
      <path d="M13.8 3.8V8h4.2" {...S} />
    </>,
  )
}

export function PanelIcon() {
  // 侧栏面板列表里那一行的图标（16px 视觉框内）。
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill="none">
      <path d="M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-6-3.5-6 3.5V5A1.5 1.5 0 0 1 6 3.5Z" {...S} />
      <path d="M9.5 9h5M9.5 12.5h3" {...S} />
    </svg>
  )
}

export function PlusIcon({ size = 14 }) {
  return svg(size, <path d="M12 5.5v13M5.5 12h13" {...S} />)
}

export function ChevronIcon({ size = 12, open = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      fill="none"
      style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 120ms ease' }}
    >
      <path d="M9 5.5 15.5 12 9 18.5" {...S} />
    </svg>
  )
}

export function SearchIcon({ size = 14 }) {
  return svg(
    size,
    <>
      <circle cx="11" cy="11" r="5.75" {...S} />
      <path d="M15.4 15.4 19 19" {...S} />
    </>,
  )
}

export function TrashIcon({ size = 14 }) {
  return svg(
    size,
    <>
      <path d="M4.5 7h15M10 4.5h4M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12" {...S} />
    </>,
  )
}

export function EditIcon({ size = 14 }) {
  return svg(
    size,
    <>
      <path d="M4.5 19.5h4L19 9a2 2 0 0 0 0-2.8l-1.2-1.2A2 2 0 0 0 15 5L4.5 15.5v4Z" {...S} />
    </>,
  )
}

export function CloseIcon({ size = 14 }) {
  return svg(size, <path d="M6 6l12 12M18 6 6 18" {...S} />)
}

export function ExportIcon({ size = 14 }) {
  return svg(
    size,
    <>
      <path d="M12 3.5v11M8 10.5 12 14.5 16 10.5" {...S} />
      <path d="M5 17v2a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-2" {...S} />
    </>,
  )
}

export function CheckIcon({ size = 14 }) {
  return svg(size, <path d="m5 12.5 4.5 4.5L19 6.5" {...S} />)
}

export function SaveIcon({ size = 14 }) {
  return svg(
    size,
    <>
      <path d="M6 3.5h9.2L19 7.3V18a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 18V6a2.5 2.5 0 0 1 1-2Z" {...S} />
      <path d="M8.5 3.5v5h6M8.5 20.5v-6h7v6" {...S} />
    </>,
  )
}

export function ImagePlusIcon({ size = 14 }) {
  return svg(
    size,
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" {...S} />
      <circle cx="9" cy="10" r="1.6" {...S} />
      <path d="m5 17 4.5-4.5 3.5 3.5 2.5-2.5 3.5 3.5" {...S} />
    </>,
  )
}
