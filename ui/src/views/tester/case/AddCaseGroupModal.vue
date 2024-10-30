<template>
  <n-modal
    v-model:show="showModal"
    :closable="false"
    :show-icon="false"
    :close-on-esc="false"
    :mask-closable="false"
    :loading="submitLoading"
    :negative-text="$t('cancel')"
    :positive-text="$t('confirm')"
    transform-origin="center"
    preset="dialog"
    @positive-click="confirmSubmit"
  >
    <n-form ref="formRef" :model="form" :rules="formRules" label-placement="top" @keyup.enter="confirmSubmit">
      <n-form-item :label="$t('tester.group_name')" path="name">
        <n-input v-model:value="form.name" :placeholder="$t('tester.group_name_placeholder')" />
      </n-form-item>
      <n-form-item :label="$t('tester.group_parent')" path="parentId">
        <n-tree-select
          v-model:value="form.parentId"
          :options="casesStore.groupTree"
          show-path
          key-field="id"
          label-field="name"
          clearable
          :placeholder="$t('tester.group_parent_placeholder')"
        />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormInst, FormRules, useMessage } from 'naive-ui'
import { IBCaseGroup } from '@/types/tester'
import { useCasesStore } from '@/store/tester'
import { GroupApi } from '@/api/tester'

const casesStore = useCasesStore()
const message = useMessage()
const showModal = ref(false)
const promise = {
  resolve: (res?: any): void => {},
  reject: (e?: any): void => {}
}
const show = (item?: Partial<IBCaseGroup>): Promise<void> => {
  return new Promise((resolve, reject) => {
    form.value.id = item?.id || ''
    form.value.name = item?.name || ''
    form.value.parentId = item?.parentId || ''
    promise.resolve = resolve
    promise.reject = reject
    showModal.value = true
  })
}
const form = ref({
  id: '',
  name: '',
  parentId: ''
})
const formRef = ref<FormInst>()
const formRules: FormRules = {
  name: { required: true, message: window.$t('tester.group_name_placeholder'), trigger: 'blur' }
}

const submitLoading = ref(false)
const confirmSubmit = async () => {
  try {
    await formRef.value?.validate()
  } catch (e) {
    message.error(window.$t('form_error'))
    return false
  }
  const { id, ...data } = form.value
  if (data.parentId === 'all') data.parentId = ''
  try {
    submitLoading.value = true
    if (id) {
      await GroupApi.update(id, data)
      window.$message.success(window.$t('update_success'))
    } else {
      await GroupApi.add(data)
      window.$message.success(window.$t('create_success'))
    }
    await casesStore.getGroupTree()
    showModal.value = false
  } finally {
    submitLoading.value = false
  }
}

defineExpose({ show })
</script>

<style scoped lang="scss"></style>
