<template>
  <div class="ib-full-header" :class="{ 'bottom-border': bottomBorder }">
    <div class="inner-header">
      <IbLogo width="150" type="left-right" @handle-click="handleClick" />
      <div v-if="title" class="title-header">
        <h2>{{ title }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IbLogo from './IbLogo.vue'

defineProps<{
  title?: string
  bottomBorder?: boolean
}>()

const emit = defineEmits<{
  (e: 'handle-click'): void
}>()

const handleClick = () => {
  emit('handle-click')
}
</script>

<style scoped lang="scss">
.ib-full-header {
  width: 100vw;
  height: 65px;
  background-color: #ffffff;
  box-sizing: border-box;
  &.bottom-border {
    border-bottom: 1px solid var(--divider-color);
  }
  .inner-header {
    display: flex;
    align-items: center;
    width: 1200px;
    height: 100%;
    margin: 0 auto;
  }
  .title-header {
    position: relative;
    padding-left: 20px;
    &::before {
      content: '';
      position: absolute;
      left: 10px;
      top: 50%;
      margin-top: -20px;
      width: 1px;
      height: 40px;
      background-color: #cccccc;
    }
    h2 {
      font-size: 26px;
      font-weight: bold;
    }
  }
}
</style>
