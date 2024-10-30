<template>
  <div class="context-menu-box" @contextmenu.prevent>
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      size="small"
      :options="AppDropdown.options"
      :x="menuX"
      :y="menuY"
      :show="AppDropdown.showDropdown"
      :on-clickoutside="onClickOutside"
      @select="handleSelectMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { isPromiseLike, MenuKey } from '@/utils'

const { t } = useI18n()

const menuX = ref(0)
const menuY = ref(0)
const selectPromise = ref<void | Promise<void> | null>(null)

const AppDropdown: AppDropdown = reactive({
  options: [],
  select: () => {},
  showDropdown: false,
  handleContextMenu: (e: MouseEvent, targetEle?: HTMLElement) => {
    e.preventDefault()
    e.stopPropagation()
    removeMenuActiveClass()
    AppDropdown.cacheEvent = e
    AppDropdown.targetElement = targetEle
    AppDropdown.showDropdown = false
    nextTick().then(() => {
      AppDropdown.showDropdown = true
      menuX.value = e.clientX
      menuY.value = e.clientY
      addMenuActiveClass()
    })
  }
})

window.$AppDropdown = AppDropdown

const onClickOutside = (e: MouseEvent) => {
  if (e.button === 2) return
  if (selectPromise.value !== null) return
  AppDropdown.showDropdown = false
}
const handleSelectMenu = (key: MenuKey) => {
  const AppDropdown = window.$AppDropdown
  if (typeof AppDropdown.select !== 'function') return
  selectPromise.value = AppDropdown.select(key, AppDropdown.cacheEvent, AppDropdown.data)
  if (isPromiseLike(selectPromise.value)) {
    selectPromise.value
      .then(() => {
        AppDropdown.showDropdown = false
      })
      .catch(() => {
        //
      })
      .finally(() => {
        AppDropdown.showDropdown = false
        selectPromise.value = null
      })
  } else {
    AppDropdown.showDropdown = false
    selectPromise.value = null
  }
}

const addMenuActiveClass = () => {
  AppDropdown.targetElement?.classList.add('ib-menu-active')
}
const removeMenuActiveClass = () => {
  AppDropdown.targetElement?.classList.remove('ib-menu-active')
}
watch(
  () => AppDropdown.showDropdown,
  (newVal) => {
    !newVal && removeMenuActiveClass()
  }
)
</script>

<style lang="scss" scoped>
.context-menu-box {
  width: inherit;
  height: inherit;
}
</style>
