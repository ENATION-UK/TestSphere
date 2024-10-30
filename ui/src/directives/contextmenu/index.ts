import { Directive } from 'vue'

export default {
  mounted(el, binding) {
    el.addEventListener('contextmenu', (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const { options, select, data, onRightClick } = binding.value
      if (typeof onRightClick === 'function') {
        onRightClick()
      }
      const AppDropdown = window.$AppDropdown
      AppDropdown.options = options
      AppDropdown.select = select
      AppDropdown.data = data
      AppDropdown.handleContextMenu(e, el)
    })
  }
} as Directive
