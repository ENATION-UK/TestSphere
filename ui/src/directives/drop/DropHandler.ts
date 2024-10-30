import { DirectiveBinding } from 'vue'

export default class CopyHandler {
  ele: HTMLElement
  binding: DirectiveBinding

  constructor(el: HTMLElement, binding: DirectiveBinding) {
    this.ele = el
    this.binding = binding
    this.handleDrop = this.handleDrop.bind(this)
    this.handleDragover = this.handleDragover.bind(this)
    this.addListener(el)
  }

  /**
   * 添加事件监听
   */
  addListener(ele: HTMLElement) {
    ele.addEventListener('drop', this.handleDrop)
    ele.addEventListener('dragover', this.handleDragover)
  }

  handleDrop(ev: DragEvent) {
    ev.preventDefault()
    ev.stopPropagation()
    if (!ev.dataTransfer) return
    const data = ev.dataTransfer.getData('text')
    const { binding } = this
    if (binding.arg && data !== binding.arg) return
    if (typeof binding.value !== 'function') return
    delete window.$IBAttaches.dragging_mark
    binding.value(data, ev)
  }

  /**
   * 拖拽可被释放时
   * @param ev
   */
  handleDragover(ev: DragEvent) {
    ev.preventDefault()
    ev.stopPropagation()
    if (!ev.dataTransfer) return
    if (!ev.target || !(ev.target instanceof HTMLElement)) return
    let showCopy = window.$IBAttaches.dragging_mark === this.binding.arg && this.ele.contains(ev.target)
    if (showCopy) {
      ev.dataTransfer.dropEffect = 'copy'
    } else {
      ev.dataTransfer.dropEffect = 'none'
    }
  }
}
