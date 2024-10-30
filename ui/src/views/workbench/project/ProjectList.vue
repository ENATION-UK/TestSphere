<template>
  <div class="project-list">
    <div class="title-view">
      <slot name="title-before" />
      <n-button size="small" round @click="emit('handle-add')">
        <template #icon>
          <n-icon :component="AddOutline" />
        </template>
        {{ $t('wb.project.new') }}
      </n-button>
      <div class="search-box">
        <n-input
          v-model:value="keyword"
          clearable
          size="small"
          round
          :loading="loading"
          :placeholder="$t('search_placeholder')"
          class="search-input"
          @clear="emit('handle-search', '')"
          @keyup.enter="emit('handle-search', keyword)"
        >
          <template #prefix>
            <n-icon :component="SearchOutline" />
          </template>
        </n-input>
      </div>
    </div>
    <div class="list-view" :class="{ empty: projects.length === 0 }">
      <div v-for="item in projects" :key="item.id" class="project-item">
        <div class="bg-item" @click="emit('handle-to-detail', item)">
          <n-dropdown
            v-if="menuOptions && menuOptions.length !== 0"
            trigger="hover"
            placement="right-start"
            show-arrow
            @select="emit('handle-menu', $event, item)"
            :options="menuOptions"
          >
            <div class="menu-btn" @click.stop>
              <n-icon size="24" :component="OverflowMenuHorizontal" />
            </div>
          </n-dropdown>
          <i class="icon-code"></i>
        </div>
        <n-ellipsis class="name-item">{{ item.name }}</n-ellipsis>
      </div>
      <n-empty v-if="projects.length === 0" size="large" :description="$t('wb.project.no_project')">
        <template #extra>
          <n-button size="small" type="primary" ghost @click="emit('handle-add')">
            <template #icon>
              <n-icon :component="AddOutline" />
            </template>
            {{ $t('wb.project.new') }}
          </n-button>
        </template>
      </n-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OverflowMenuHorizontal from '@vicons/carbon/OverflowMenuHorizontal'
import AddOutline from '@vicons/ionicons5/AddOutline'
import SearchOutline from '@vicons/ionicons5/SearchOutline'
import { IBProductType } from '@/types'
import { IBProject } from '@/types/project'
import { IBTesterProject } from '@/types/tester'
import { MenuOption } from '@/utils/menus'

defineProps<{
  type: IBProductType
  projects: IBProject[] | IBTesterProject[]
  loading: boolean
  menuOptions?: MenuOption[]
}>()
const emit = defineEmits<{
  (e: 'handle-menu', key: string, project: IBProject | IBTesterProject): Promise<void>
  (e: 'handle-add'): Promise<void>
  (e: 'handle-search', keyword: string): Promise<void>
  (e: 'handle-to-detail', project: IBProject | IBTesterProject): Promise<void>
}>()

const keyword = ref('')
</script>

<style scoped lang="scss">
.project-list {
  width: 100%;
  height: 100%;
  padding-top: 24px;
  background-color: #ffffff;
}
.title-view {
  display: flex;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid var(--divider-color);
  padding-bottom: 24px;
  padding-left: 44px;
  .title-text {
    font-size: 20px;
    font-weight: bold;
  }
  .search-box {
    margin-left: 20px;
    .search-input {
      width: 250px;
    }
  }
}
.list-view {
  width: 100%;
  height: calc(100vh - 24px - 24px - 30px);
  overflow: hidden;
  overflow-y: auto;
  padding: 30px 44px;
  &::after {
    content: '';
    clear: both;
  }
  .project-item {
    float: left;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 40px;
    margin-bottom: 20px;
    .bg-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 130px;
      height: 90px;
      border: 1px solid #bababa;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s var(--bezier);
      &:hover {
        background-color: var(--hover-color);
        border-color: var(--info-color);
        .icon-code {
          transform: scale(1.2);
        }
      }
      .icon-code {
        display: block;
        width: 60px;
        height: 50px;
        background-image: url('@/assets/icons/icon-code.png');
        background-size: 100% 100%;
        transition: all 0.2s var(--bezier);
      }
      .menu-btn {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 25px;
        &:hover:deep(.n-icon) {
          color: var(--primary-color);
        }
      }
    }
    :deep(.name-item) {
      margin-top: 12px;
      line-height: 20px;
      min-height: 20px;
      max-width: 120px;
    }
  }
  &.empty {
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(100% - 28px - 30px);
  }
}
</style>
