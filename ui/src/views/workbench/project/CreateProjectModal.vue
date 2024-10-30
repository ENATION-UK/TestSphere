<template>
  <n-modal
    v-model:show="showModal"
    :title="$t('wb.project.new')"
    :show-icon="false"
    :closable="false"
    :close-on-esc="false"
    :mask-closable="false"
    :negative-text="$t('cancel')"
    :positive-text="$t('confirm')"
    :loading="createProjectLoading"
    @positive-click="handleConfirmCreateProject"
    preset="dialog"
    transform-origin="center"
  >
    <div class="modal-hr top"></div>
    <n-form
      ref="projectFormRef"
      :model="projectForm"
      :rules="projectFormRules"
      label-placement="top"
      @keyup.enter="handleConfirmCreateProject"
    >
      <n-form-item :label="$t('wb.project_name')" path="name">
        <n-input v-model:value="projectForm.name" :placeholder="$t('wb.project_name_placeholder')" />
      </n-form-item>
      <n-form-item :show-label="false" :show-feedback="false" path="database">
        <n-collapse display-directive="show" accordion default-expanded-names="database">
          <n-collapse-item name="database">
            <template #header>
              <span>{{ $t('wb.project.database_setting') }}</span>
            </template>
            <DatabaseSetting
              ref="databaseSettingRef"
              auto-select
              :auto-select-bias="['MySQL', 'utf8', 'utf8_bin']"
              @handle-select="handleDatabaseSettingSelect"
            />
          </n-collapse-item>
        </n-collapse>
      </n-form-item>

      <!--<n-form-item :label="$t('wb.project_desc')" path="description">
        <n-input v-model:value="projectForm.description" type="textarea" :autosize="{ minRows: 3 }" placeholder="" />
      </n-form-item>-->
    </n-form>
    <div class="modal-hr bottom"></div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormInst, FormRules } from 'naive-ui'
import { IBDatabaseSetting } from '@/types/project'
import { useProjectsStore } from '@/store'
import { ProjectApi } from '@/api/project'
import DatabaseSetting from '@/views/project/ProjectSetting/DatabaseSetting.vue'

const databaseSettingRef = ref<InstanceType<typeof DatabaseSetting>>()
const databaseSetting = ref<IBDatabaseSetting>()
const handleDatabaseSettingSelect = (setting: IBDatabaseSetting) => {
  databaseSetting.value = setting
}

const projectForm = ref({ name: '', description: '' })
const projectFormRef = ref<FormInst>()
const projectFormRules: FormRules = {
  name: { required: true, message: window.$t('wb.project_name_placeholder'), trigger: 'blur' }
}
const createProjectLoading = ref(false)
const handleConfirmCreateProject = async () => {
  try {
    await projectFormRef.value?.validate()
  } catch (e) {
    window.$message.error(window.$t('form_error'))
    return false
  }
  try {
    createProjectLoading.value = true
    await ProjectApi.create(projectForm.value, databaseSetting.value!)
    await useProjectsStore().getProjects()
    showModal.value = false
  } finally {
    createProjectLoading.value = false
  }
}

const showModal = ref(false)
const show = () => {
  projectForm.value = { name: '', description: '' }
  showModal.value = true
}

defineExpose({ show })
</script>

<style scoped lang="scss">
:deep(.database-setting) {
  width: auto;
  margin-top: 0;
  margin-left: 0;
}
</style>
