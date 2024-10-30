<template>
  <div class="case-container">
    <div class="case-header">
      <n-space>
        <n-button type="primary" @click="addCaseGroup">
          <template #icon>
            <n-icon><FolderAdd20Regular /></n-icon>
          </template>
          {{ $t('tester.create_group') }}
        </n-button>
        <n-button type="info" @click="addCase">
          <template #icon>
            <n-icon><AddCircle20Regular /></n-icon>
          </template>
          {{ $t('tester.create_case') }}
        </n-button>
      </n-space>
      <n-space>
        <n-select
          v-model:value="casesStore.params.status"
          :options="statusOptions"
          @update:value="casesStore.onStatusChange"
          style="width: 120px"
        />
        <n-input
          v-model:value="casesStore.params.keyword"
          :placeholder="$t('tester.search_case')"
          clearable
          @keyup.enter="casesStore.getCaseList"
          style="width: 200px"
        />
      </n-space>
    </div>
    <div class="case-body">
      <div class="case-menu">
        <n-tree
          block-line
          expand-on-click
          v-model:selected-keys="casesStore.treeSelectedKeys"
          :default-expanded-keys="casesStore.caseExpandedKeys"
          :data="groupList"
          :node-props="nodeProps"
          :render-label="renderTreeLabel"
          :on-update:expanded-keys="updatePrefixWithExpand"
        />
      </div>
      <div class="case-content">
        <n-spin :show="casesStore.caseLoading">
          <n-data-table
            remote
            :data="casesStore.records"
            :columns="caseColumns"
            :pagination="casesStore.pagination"
            :min-height="536"
            @update:page="casesStore.onPageChange"
            class="case-table"
          />
        </n-spin>
      </div>
    </div>
  </div>
  <AddCaseModal ref="addCaseModalRef" />
  <AddCaseGroupModal ref="addCaseGroupModalRef" />
  <n-dropdown
    trigger="manual"
    placement="bottom-start"
    show-arrow
    :show="dropdown.show"
    :options="dropdown.options"
    :x="dropdown.x"
    :y="dropdown.y"
    @select="handleDropdownSelect"
    @clickoutside="handleDropdownClickOutside"
  />
</template>

<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AddCircle20Filled from '@vicons/fluent/AddCircle20Filled'
import AddCircle20Regular from '@vicons/fluent/AddCircle20Regular'
import Delete20Filled from '@vicons/fluent/Delete20Filled'
import Edit20Filled from '@vicons/fluent/Edit20Filled'
import FolderAdd20Filled from '@vicons/fluent/FolderAdd20Filled'
import FolderAdd20Regular from '@vicons/fluent/FolderAdd20Regular'
import IconPlay from '@vicons/ionicons5/Play'
import { NEllipsis, NIcon, TreeOption, useDialog, useMessage } from 'naive-ui'
import { IBCase, IBCaseGroup } from '@/types/tester'
import { IBConfig } from '@/config'
import { formatUnix } from '@/utils'
import { useCasesStore } from '@/store/tester'
import { CaseApi, GroupApi } from '@/api/tester'
import AddCaseGroupModal from '../AddCaseGroupModal.vue'
import AddCaseModal from '../AddCaseModal.vue'
import { groupAll, mapGroupTree, runCaseCountLimit, updatePrefixWithExpand, viewCaseHistoryModal } from '../helper'
import ListCaseOptCell from './ListCaseOptCell.vue'
import ListCaseStatusCell from './ListCaseStatusCell.vue'

const dialog = useDialog()
const message = useMessage()
const addCaseModalRef = ref<InstanceType<typeof AddCaseModal>>()
const addCaseGroupModalRef = ref<InstanceType<typeof AddCaseGroupModal>>()
const router = useRouter()
const casesStore = useCasesStore()
const groupList = computed(() => {
  const { groupTree } = casesStore
  if (!groupTree || !groupTree.length) return [groupAll]
  const list = mapGroupTree(groupTree)
  list.splice(0, 0, groupAll)
  return list
})
onMounted(() => {
  casesStore.getGroupTree()
  casesStore.getCaseList()
})

const statusOptions = [
  { label: window.$t('all'), value: 'all' },
  { label: window.$t('tester.test_passed'), value: 'success' },
  { label: window.$t('tester.test_failed'), value: 'any_failed' }
]
const dropdown = reactive<Record<string, any>>({
  show: false,
  x: 0,
  y: 0,
  options: [
    {
      label: window.$t('tester.create_case'),
      key: 'add-case',
      icon: () => h(NIcon, {}, { default: () => h(AddCircle20Filled) })
    },
    { label: window.$t('tester.run_case'), key: 'run', icon: () => h(NIcon, {}, { default: () => h(IconPlay) }) },
    {
      label: window.$t('tester.create_group'),
      key: 'add-group',
      icon: () => h(NIcon, {}, { default: () => h(FolderAdd20Filled) })
    },
    {
      label: window.$t('tester.edit_group'),
      key: 'edit',
      icon: () => h(NIcon, {}, { default: () => h(Edit20Filled) })
    },
    {
      label: () =>
        h('span', { style: 'color: var(--error-color)' }, { default: () => window.$t('tester.delete_group') }),
      key: 'delete',
      icon: () => h(NIcon, { color: 'var(--error-color)' }, { default: () => h(Delete20Filled) })
    }
  ],
  optGroup: null
})
const handleDeleteGroup = async (group: IBCaseGroup) => {
  await window.$confirm(window.$t('tester.delete_group_confirm'), { type: 'warning' }, async () => {
    try {
      await GroupApi.delete(group.id)
      window.$message.success(window.$t('delete_success'))
      if (casesStore.treeSelectedKeys[0] === group.id) {
        casesStore.treeSelectedKeys[0] = 'all'
      }
      await casesStore.getGroupTree()
    } catch (e) {
      if (e.code === '003') {
        window.$dialog.error(window.$t('tester.delete_group_error_not_empty'))
      } else {
        window.$dialog.error(e.message)
      }
      return Promise.reject(e)
    }
  })
}
const handleRunGroupCase = async (group: IBCaseGroup) => {
  const groupId = group?.id || ''
  await window.$confirm(window.$t('tester.run_group_confirm'), { type: 'warning' }, async () => {
    try {
      await CaseApi.runGroup(groupId)
      window.$dialog.success({
        title: window.$t('tip'),
        content: window.$t('tester.run_group_tip'),
        negativeText: window.$t('cancel'),
        onPositiveClick: () => {
          router.push({ name: 'testerTask' })
        }
      })
    } catch (e) {
      if (!e.code) return
      runCaseCountLimit(e)
    }
  })
}
const handleAddCase = async (group: IBCaseGroup) => {
  await addCaseModalRef.value?.show({ groupId: group.id })
  casesStore.getCaseList()
  casesStore.getGroupTree()
}
const handleDropdownSelect = async (key: string) => {
  const group = dropdown.optGroup as unknown as IBCaseGroup
  dropdown.show = false
  switch (key) {
    case 'delete':
      return handleDeleteGroup(group)
    case 'edit':
      return addCaseGroupModalRef.value?.show(group)
    case 'run':
      return handleRunGroupCase(group)
    case 'add-case':
      return handleAddCase(group)
    case 'add-group':
      return addCaseGroup(group.id)
  }
}
const handleDropdownClickOutside = (e: MouseEvent) => {
  if (e.button === 2) return
  dropdown.show = false
}
const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {
      casesStore.params.pageNo = 1
      casesStore.params.groupId = option.key as string
      casesStore.getCaseList()
    },
    onContextmenu(e: MouseEvent) {
      e.preventDefault()
      if (option.key === '') return
      dropdown.x = e.clientX
      dropdown.y = e.clientY
      dropdown.show = true
      dropdown.optGroup = option.group
    }
  }
}
const renderTreeLabel = ({ option }: { option: TreeOption }) => {
  let num = option.group?.deepCaseCount || 0
  if (option.key === 'all') {
    casesStore.groupTree.forEach((item) => {
      num += item.deepCaseCount
    })
  }
  return `${option.label}(${num})`
}
const onRunCase = (item: IBCase) => {
  router.push({ name: 'testerCaseDetail', params: { caseId: item.id } })
}
const onEditCase = async (item: IBCase) => {
  try {
    await addCaseModalRef.value?.show(item)
    window.$message.success(window.$t('update_success'))
    casesStore.getCaseList()
  } catch (e) {
    //
  }
}
// 删除用例
const onDeleteCase = async (item: IBCase) => {
  dialog.error({
    title: window.$t('tip'),
    closable: false,
    autoFocus: false,
    closeOnEsc: false,
    maskClosable: false,
    transformOrigin: 'center',
    content: window.$t('tester.delete_case_confirm'),
    negativeText: window.$t('cancel'),
    positiveText: window.$t('confirm'),
    onPositiveClick: async () => {
      await CaseApi.delete(item.id)
      message.success(window.$t('delete_success'))
      casesStore.params.pageNo = 1
      casesStore.getCaseList()
      casesStore.getGroupTree()
    }
  })
}
// 复制用例
const onCopyCase = async (item: IBCase) => {
  const newName = `${item.name}_${IBConfig.APP_CHINA ? '副本' : 'copy'}`
  await window.$prompt(
    {
      title: window.$t('tester.copy_case'),
      defaultValue: newName.length > 20 ? item.name : newName,
      maxlength: 20,
      showCount: true,
      clearable: true,
      placeholder: window.$t('tester.case_new_name_placeholder'),
      validator: (value) => {
        if (!value) return window.$t('tester.case_new_name_placeholder')
        if (value === item.name) return window.$t('tester.case_new_name_same_error')
      }
    },
    async (name) => {
      try {
        await CaseApi.copy(item.id, name)
        await casesStore.getCaseList()
        message.success(window.$t('copy_success'))
      } catch (e) {
        if (e.coee === 'SAME_COPY_NAME_ERROR') {
          return Promise.reject(window.$t('tester.copy_case_same_name_error'))
        }
        return Promise.reject(e)
      }
    }
  )
}

const caseColumns = [
  {
    title: window.$t('tester.case_name'),
    key: 'name',
    width: 450,
    render: (row: IBCase) =>
      h(
        RouterLink,
        { to: { name: 'testerCaseDetail', params: { caseId: row.id } }, class: 'test-name' },
        {
          default: () =>
            h(
              NEllipsis,
              { style: 'max-width: 426px', tooltip: { style: 'max-width: 400px' } },
              { default: () => row.name }
            )
        }
      )
  },
  {
    title: window.$t('last_update_date'),
    key: 'lastUpdateTime',
    align: 'center',
    render: (row: IBCase) => formatUnix(row.lastUpdateTime)
  },
  {
    title: window.$t('tester.last_run_date'),
    key: 'lastRunTime',
    align: 'center',
    render: (row: IBCase) => formatUnix(row.lastRunTime)
  },
  {
    title: window.$t('status'),
    key: 'lastRunStatus',
    align: 'center',
    render: (row: IBCase) => h(ListCaseStatusCell, { row })
  },
  {
    title: '',
    key: 'opt',
    align: 'center',
    render: (row: IBCase) =>
      h(ListCaseOptCell, {
        onHandleMenu: (key: string) => {
          switch (key) {
            case 'run':
              return onRunCase(row)
            case 'history':
              return viewCaseHistoryModal(row)
            case 'edit':
              return onEditCase(row)
            case 'copy':
              return onCopyCase(row)
            case 'delete':
              return onDeleteCase(row)
          }
        }
      })
  }
]

const addCase = async () => {
  let groupId = casesStore.treeSelectedKeys[0]
  if (!groupId && casesStore.groupTree[0]) {
    groupId = casesStore.groupTree[0].id
  }
  try {
    await addCaseModalRef.value?.show({ groupId })
    casesStore.getCaseList()
    casesStore.getGroupTree()
  } catch (e) {
    window.$message.error(window.$t('tester.create_case_failed'))
    //
  }
}
const addCaseGroup = (parentId: any) => {
  parentId = typeof parentId === 'string' ? parentId : casesStore.treeSelectedKeys[0] || 'all'
  addCaseGroupModalRef.value?.show({ parentId })
}
</script>

<style scoped lang="scss">
.case-container {
  width: 100%;
  height: 100%;
  padding-top: 24px;
  box-sizing: border-box;
}
.case-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  border-bottom: 1px dashed #e3e2e2;
  box-sizing: border-box;
}
.case-body {
  display: flex;
  width: 100%;
  height: calc(100% - 50px);
  padding-top: 35px;
  box-sizing: border-box;
  .case-menu {
    width: 190px;
    max-height: calc(100vh - 45px - 24px - 50px - 35px);
    overflow: auto;
    flex-shrink: 0;
    user-select: none;
    margin-right: 10px;
  }
  .case-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
}
.case-table {
  :deep(td) {
    padding-top: 1px;
    padding-bottom: 1px;
  }
  :deep(.test-name) {
    display: block;
    height: 100%;
    padding-top: 11px;
    padding-bottom: 11px;
    &:hover .n-ellipsis {
      text-decoration: underline;
    }
  }
}
</style>
