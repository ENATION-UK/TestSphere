<template>
  <div class="workbench-manage">
    <div class="workbench-manage-menus">
      <ManageMenus />
    </div>
    <div class="workbench-manage-content">
      <div class="title-content">{{ title }}</div>
      <div class="body-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ManageMenus from './ManageMenus.vue'

const route = useRoute()
const title = computed(() => (route.meta as Record<string, string>).title)
</script>

<style scoped lang="scss">
.workbench-manage {
  display: flex;
  width: 100%;
  height: 100%;
  &-menus {
    flex-shrink: 0;
    height: 100%;
  }
  &-content {
    flex: 1;
    height: 100%;
    overflow: auto;
    padding: 0 40px;
    .title-content {
      display: flex;
      align-items: center;
      height: 68px;
      font-size: 20px;
      font-weight: bold;
    }
    .body-content {
      border-radius: 8px;
      width: 100%;
      min-height: 600px;
    }
  }
}
</style>
