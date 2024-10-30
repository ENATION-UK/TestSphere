import { Directive } from 'vue'
import CopyHandler from './CopyHandler'
import DragHandler from './DragHandler'

const drag: Directive = {
  mounted(el, binding, vNode) {
    const { modifiers } = binding
    if (modifiers.copy) {
      new CopyHandler(el, binding, vNode)
    } else {
      new DragHandler(el, binding, vNode)
    }
  }
}

export default drag
