<template>
  <div class="app-header">
    <div class="header-left">
      <slot name="left"></slot>
    </div>
    <div class="header-center">
      <slot name="center"></slot>
    </div>
    <div class="header-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.app-header {
  display: flex;
  align-items: center;
  height: 44px;
  min-width: 1300px;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  user-select: none !important;
  .header-left,
  .header-center,
  .header-right {
    flex: 1;
    display: flex;
    align-items: center;
    height: 100%;
  }
  .header-right {
    justify-content: flex-end;
  }
  .header-center {
    justify-content: center;
  }
}
</style>
