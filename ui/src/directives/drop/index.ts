import { Directive } from 'vue'
import DropHandler from './DropHandler'

const drop: Directive = {
  mounted(el: HTMLElement, binding) {
    new DropHandler(el, binding)
  }
}

export default drop
