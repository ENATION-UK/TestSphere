<template>
  <div class="ib-menus">
    <router-link v-for="(item, index) in menus" :key="index" :to="item.to" class="item">
      <div class="icon">
        <n-icon>
          <PieChartOutline v-if="item.key === 'overview'" />
          <Playlist v-if="item.key === 'case'" />
          <HistoryOutlined v-if="item.key === 'history'" />
          <Tasks v-if="item.key === 'task'" />
          <BarChartOutline v-if="item.key === 'report'" />
          <SettingsOutline v-if="item.key === 'settings'" />
        </n-icon>
      </div>
      <div class="label">{{ item.label }}</div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import HistoryOutlined from '@vicons/antd/HistoryOutlined'
import Playlist from '@vicons/carbon/Playlist'
import Tasks from '@vicons/fa/Tasks'
import BarChartOutline from '@vicons/ionicons5/BarChartOutline'
import PieChartOutline from '@vicons/ionicons5/PieChartOutline'
import SettingsOutline from '@vicons/ionicons5/SettingsOutline'
import { IBGuide } from '@/types'
import { useGuideStore } from '@/store'
import { useTesterParams } from '@/hooks/useTesterParams'

const menus = computed(() => {
  const { projectId } = useTesterParams()
  return [
    { label: window.$t('tester.overview'), key: 'overview', to: { name: 'testerOverview', params: { id: projectId } } },
    { label: window.$t('tester.case'), key: 'case', to: { name: 'testerCase', params: { id: projectId } } },
    { label: window.$t('tester.history'), key: 'history', to: { name: 'testerHistory', params: { id: projectId } } },
    { label: window.$t('tester.task'), key: 'task', to: { name: 'testerTask', params: { id: projectId } } },
    { label: window.$t('tester.report'), key: 'report', to: { name: 'testerReport', params: { id: projectId } } },
    { label: window.$t('tester.settings'), key: 'settings', to: { name: 'testerSettings' }, params: { id: projectId } }
  ]
})

// 导览
const guideStore = useGuideStore()
const guideItems: IBGuide = {
  key: 'testerMenus',
  steps: [
    {
      title: window.$t('tester.guide_overview_title'),
      content: window.$t('tester.guide_overview_content'),
      placement: 'right-start',
      selector: '#app .inner-detail .ib-menus a:nth-child(1)'
    },
    {
      title: window.$t('tester.guide_case_title'),
      content: window.$t('tester.guide_case_content'),
      placement: 'right-start',
      selector: '#app .inner-detail .ib-menus a:nth-child(2)'
    },
    {
      title: window.$t('tester.guide_history_title'),
      content: window.$t('tester.guide_history_content'),
      placement: 'right-start',
      selector: '#app .inner-detail .ib-menus a:nth-child(3)'
    },
    {
      title: window.$t('tester.guide_task_title'),
      content: window.$t('tester.guide_task_content'),
      placement: 'right-start',
      selector: '#app .inner-detail .ib-menus a:nth-child(4)'
    },
    {
      title: window.$t('tester.guide_report_title'),
      content: window.$t('tester.guide_report_content'),
      placement: 'right-start',
      selector: '#app .inner-detail .ib-menus a:nth-child(5)'
    },
    {
      title: window.$t('tester.guide_settings_title'),
      content: window.$t('tester.guide_settings_content'),
      placement: 'right-start',
      selector: '#app .inner-detail .ib-menus a:nth-child(6)'
    }
  ]
}
onMounted(() => guideStore.addGuide(guideItems))
</script>

<style scoped lang="scss">
.ib-menus {
  display: flex;
  flex-direction: column;
  width: 120px;
  flex-shrink: 0;
  background-color: #ffffff;
  padding-top: 24px;
  box-sizing: border-box;
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #1f1f1f;
    width: 70px;
    height: 70px;
    text-decoration: none;
    border-radius: 12px;
    transition: all 0.2s ease;
    & + .item {
      margin-top: 12px;
    }
    &:hover {
      color: #ffffff;
      background-color: #c3c2c2;
    }
    &.router-link-active {
      color: #ffffff;
      background-color: #8e8d8d;
    }
    .icon {
      width: 35px;
      height: 35px;
      :deep(.n-icon) {
        font-size: 35px;
        line-height: normal;
      }
    }
    .label {
      font-size: 14px;
      font-weight: 400;
    }
  }
}
</style>
