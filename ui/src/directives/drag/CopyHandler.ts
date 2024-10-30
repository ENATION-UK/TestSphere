import type { DirectiveBinding, VNode } from 'vue'

export default class CopyHandler {
  ele: HTMLElement
  binding: DirectiveBinding
  vNode: VNode

  constructor(el: HTMLElement, binding: DirectiveBinding, vNode: VNode) {
    this.ele = el
    this.binding = binding
    this.vNode = vNode
    this.addListener(el)
  }

  /**
   * 添加事件监听
   */
  addListener(ele: HTMLElement) {
    ele.setAttribute('draggable', 'true')
    ele.addEventListener('dragstart', this.handleDragstart.bind(this))
  }

  /**
   * 开始拖拽
   * @param ev
   */
  handleDragstart(ev: DragEvent) {
    if (!ev.dataTransfer || !this.binding.arg) return
    window.$IBAttaches.dragging_mark = this.binding.arg
    ev.dataTransfer.setData('text', this.binding.arg)
    ev.dataTransfer.effectAllowed = 'copy'
  }
}
