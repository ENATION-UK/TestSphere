<template>
  <div class="settings">
    <div class="title">{{ $t('tester.base_settings') }}</div>
    <n-form ref="settingsFormRef" :model="settingsForm" :rules="settingsRules" class="settings-form">
      <n-form-item :label="$t('wb.project_name')" path="name">
        <n-input v-model:value="settingsForm.name" clearable :placeholder="$t('wb.project_name_placeholder')" />
      </n-form-item>
      <n-form-item :label="$t('tester.screen_resolution')">
        <n-select
          v-model:value="screenResolution"
          :options="screenResolutionOptions"
          clearable
          :placeholder="$t('tester.screen_resolution_placeholder')"
        />
      </n-form-item>
      <n-form-item :label="$t('tester.default_base_url')" path="baseUrl">
        <n-input
          ref="urlInputRef"
          type="textarea"
          v-model:value="settingsForm.baseUrl"
          clearable
          :placeholder="$t('tester.default_base_url')"
        />
      </n-form-item>
      <n-form-item label="" label-placement="left">
        <n-button type="info" :loading="saveLoading" @click="saveSettings">{{ $t('save_settings') }}</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import { FormInst, FormRules } from 'naive-ui'
import { IBTesterProject } from '@/types/tester'
import { useTesterProjectStore } from '@/store/tester'
import { TesterProjectApi } from '@/api/tester'
import { screenResolutionOptions } from '../helpers'

const testerProjectStore = useTesterProjectStore()
const settingsFormRef = ref<FormInst>()
const settingsForm = ref<IBTesterProject>({
  id: '',
  name: '',
  baseUrl: ''
})
const settingsRules: FormRules = {
  name: { required: true, message: window.$t('wb.project_name_placeholder'), trigger: 'input' }
}
const screenResolution = ref()
const saveLoading = ref(false)
const saveSettings = async () => {
  try {
    await settingsFormRef.value?.validate()
  } catch (e) {
    window.$message.error(window.$t('form_error'))
    return
  }
  saveLoading.value = true
  try {
    const params = cloneDeep(settingsForm.value)
    if (screenResolution.value) {
      const sps = screenResolution.value.split('x')
      params.screenWidth = Number(sps[0])
      params.screenHeight = Number(sps[1])
    } else {
      delete params.screenWidth
      delete params.screenHeight
    }
    await TesterProjectApi.update(params.id, params)
    testerProjectStore.getProject(params.id)
    window.$message.success(window.$t('save_success'))
  } finally {
    saveLoading.value = false
  }
}

watch(
  () => testerProjectStore.project,
  (project) => {
    if (!project) return
    settingsForm.value = cloneDeep(project)
    if (project.screenWidth && project.screenHeight) {
      screenResolution.value = `${project.screenWidth}x${project.screenHeight}`
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.settings {
  padding-top: 40px;
  padding-left: 24px;
  .title {
    font-weight: bold;
    font-size: 24px;
  }
  .settings-form {
    width: 300px;
    margin-top: 24px;
  }
}
</style>
