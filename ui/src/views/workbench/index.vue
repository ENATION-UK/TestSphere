<template>
  <router-view v-if="['cashier', 'buyAiPointResult'].includes(routeName)" />
  <div v-else class="workbench-layout" @contextmenu="handleContextmenu">

    <div class="workbench-content">
      <div class="router-view">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import WorkbenchMenus from './WorkbenchMenus.vue'

const handleContextmenu = (event: MouseEvent) => {
  event.preventDefault()
}
const routeName = computed(() => useRoute().name as string)
</script>

<style lang="scss" scoped>
.workbench-layout {
  display: flex;
  background-color: #f5f5f7;
  width: 100vw;
  height: 100vh;
  .workbench-content {
    width: calc(100vw - 200px);
    height: 100%;
  }
  .router-view {
    width: 100%;
    height: 100%;
  }
}
</style>
