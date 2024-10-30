import type { DirectiveBinding, VNode } from 'vue'
import { isNumber, throttle } from 'lodash-es'
import { getAllSiblingNodes } from '@/utils'

export default class DragHandler {
  ele: HTMLElement
  binding: DirectiveBinding
  vNode: VNode
  isDragging = false
  startPosition = { x: 0, y: 0 }
  elePosition = { x: 0, y: 0 }

  constructor(el: HTMLElement, binding: DirectiveBinding, vNode: VNode) {
    this.ele = el
    this.binding = binding
    this.vNode = vNode
    this.init(this)
  }

  /**
   * 初始化
   * @param self
   */
  init(self: DragHandler) {
    let x = self.binding.value?.x
    let y = self.binding.value?.y
    if (!isNumber(x)) x = self.ele.offsetLeft
    if (!isNumber(y)) y = self.ele.offsetTop
    x -= self.ele.offsetWidth / 2
    // y -= self.ele.offsetHeight / 2
    this.elePosition.x = x <= 0 ? 0 : x
    this.elePosition.y = y <= 0 ? 0 : y
    this.setEleStyle()

    this.handleMousedown = this.handleMousedown.bind(this)
    this.handleMousemove = this.handleMousemove.bind(this)
    this.handleMousemove = throttle(this.handleMousemove, 16)
    this.handleMouseup = this.handleMouseup.bind(this)
    this.handleMouseleave = this.handleMouseleave.bind(this)
    this.addListener()
  }

  /**
   * 添加事件监听
   */
  addListener() {
    const parentEle = this.ele.parentElement
    if (!parentEle) return
    parentEle.addEventListener('mousedown', this.handleMousedown)
    parentEle.addEventListener('mousemove', this.handleMousemove)
    parentEle.addEventListener('mouseup', this.handleMouseup)
    parentEle.addEventListener('mouseleave', this.handleMouseleave)
  }

  /**
   * 鼠标按下
   * 移动可能开始
   * @param e
   */
  handleMousedown(e: MouseEvent) {
    if (e.button !== 0) return
    if (!this.isTargetEle(e)) return
    this.isDragging = true
    this.startPosition.x = e.x
    this.startPosition.y = e.y
    getAllSiblingNodes(this.ele).forEach((el) => {
      el.style.zIndex = '1'
    })
    this.ele.style.zIndex = '2'
  }

  /**
   * 鼠标移动中
   * @param e
   */
  handleMousemove(e: MouseEvent) {
    if (!this.isDragging) return
    let distanceX = e.x - this.startPosition.x
    let distanceY = e.y - this.startPosition.y

    this.elePosition.x += distanceX
    this.elePosition.y += distanceY

    this.startPosition.x = e.x
    this.startPosition.y = e.y

    const move = this.binding.value?.move
    typeof move === 'function' && move(e)

    // 移动的时候，隐藏菜单
    if (window.$AppDropdown) {
      window.$AppDropdown.showDropdown = false
    }

    this.setEleStyle()
  }

  /**
   * 鼠标弹起
   * 移动结束
   */
  handleMouseup(e: MouseEvent) {
    this.isDragging = false
  }

  /**
   * 鼠标移出了区域
   * @param e
   */
  handleMouseleave(e: MouseEvent) {
    this.isDragging = false
  }

  /**
   * 设置元素样式
   */
  setEleStyle() {
    this.ele.style.transform = `translate3d(${this.elePosition.x}px,${this.elePosition.y}px,0)`
  }

  /**
   * 是否在目标元素上
   * @param e
   */
  isTargetEle(e: MouseEvent): boolean {
    return this.ele.contains(e.target as Node)
  }
}
