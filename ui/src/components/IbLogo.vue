<template>
  <router-link v-if="home" to="/">
    <div class="ib-logo" :style="logoStyles" :class="[logoClass, type]"></div>
  </router-link>
  <div v-else class="ib-logo" :style="logoStyles" :class="[logoClass, type]" @click="handleClickLogo"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IBConfig } from '@/config'

const props = withDefaults(
  defineProps<{
    width: string
    height?: string
    type?: 'up-down' | 'left-right'
    home?: boolean
  }>(),
  {
    home: false
  }
)
const emit = defineEmits<{
  (e: 'handle-click'): void
}>()
const inChina = IBConfig.APP_CHINA
const logoClass = inChina ? 'itbuilder' : 'softfactory'

const logoStyles = computed(() => {
  let width = props.width
  let height = props.height
  if (!height) {
    if (props.type === 'up-down') {
      height = parseInt(String(Number(width) * 0.75)).toString()
    } else if (props.type === 'left-right') {
      height = parseInt(String(Number(width) * (inChina ? 0.194 : 0.265))).toString()
    } else {
      height = String(width)
    }
  }

  return {
    width: `${width}px`,
    height: `${height}px`
  }
})
const handleClickLogo = () => {
  emit('handle-click')
}
</script>

<style scoped lang="scss">
.ib-logo {
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('@/assets/logo.png');
  &.itbuilder.up-down {
    background-image: url('@/assets/logo-up_down.itbuilder.png');
  }
  &.itbuilder.left-right {
    background-image: url('@/assets/logo-left_right.itbuilder.png');
  }
  &.softfactory.up-down {
    background-image: url('@/assets/logo-up_down.softfactory.png');
  }
  &.softfactory.left-right {
    background-image: url('@/assets/logo-left_right.softfactory.png');
  }
}
</style>
