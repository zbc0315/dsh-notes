/** 把渲染错误（含组件栈）打进控制台，避免被宿主槽的兜底吞掉。 */
import { Component } from 'react'

export class NotesBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    console.error('[dsh-notes] app crashed:', error && error.message, '\n', info && info.componentStack)
  }
  render() {
    if (this.state.error) {
      return <div className="n-empty">笔记本渲染失败：{String((this.state.error && this.state.error.message) || this.state.error)}</div>
    }
    return this.props.children
  }
}
