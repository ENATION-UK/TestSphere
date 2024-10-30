<template>
  <div class="project-menus">
    <div class="search-view">
      <n-input class="input-search" round placeholder="搜索项目">
        <template #prefix>
          <n-icon>
            <ios-search />
          </n-icon>
        </template>
      </n-input>
    </div>
    <div class="menus-view">
      <n-button quaternary>
        <template #icon>
          <n-icon>
            <enterprise />
          </n-icon>
        </template>
        企业全部
      </n-button>
      <n-divider />
      <n-button quaternary>
        <template #icon>
          <n-icon>
            <cube />
          </n-icon>
        </template>
        我的项目
      </n-button>
      <n-button quaternary>
        <template #icon>
          <n-icon>
            <star />
          </n-icon>
        </template>
        星标项目
      </n-button>
      <n-button quaternary>
        <template #icon>
          <n-icon>
            <folder-add-outlined />
          </n-icon>
        </template>
        我创建的
      </n-button>
      <n-button quaternary>
        <template #icon>
          <n-icon>
            <exit-to-app-filled />
          </n-icon>
        </template>
        我加入的
      </n-button>
      <n-divider />
      <n-button quaternary>
        <template #icon>
          <n-icon>
            <recycle />
          </n-icon>
        </template>
        回收站
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import FolderAddOutlined from '@vicons/antd/FolderAddOutlined'
import Cube from '@vicons/carbon/Cube'
import Enterprise from '@vicons/carbon/Enterprise'
import Star from '@vicons/carbon/Star'
import IosSearch from '@vicons/ionicons4/IosSearch'
import ExitToAppFilled from '@vicons/material/ExitToAppFilled'
import Recycle from '@vicons/tabler/Recycle'
</script>

<style scoped lang="scss">
.project-menus {
  width: 220px;
  height: 100vh;
  padding: 0 12px;
  border-right: 1px solid var(--border-color);
  background-color: #ffffff;
  .search-view {
    margin-top: 44px;
  }
  .menus-view {
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    :deep(.btn-icon) {
      color: var(--text-color-1);
    }
    :deep(.n-divider) {
      margin-top: 12px;
      margin-bottom: 12px;
    }
  }
}
</style>
