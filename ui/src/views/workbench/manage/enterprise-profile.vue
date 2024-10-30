<template>
  <div class="enterprise-profile">
    <div class="tabs-nav">
      <div class="item-nav" :class="{ active: tabActive === 'info' }" @click="tabActive = 'info'">
        {{ $t('wb.manage.enterprise.info') }}
      </div>
      <!--<div class="item-nav" :class="{ active: tabActive === 'card' }" @click="tabActive = 'card'">
        {{ $t('wb.manage.enterprise.card') }}
      </div>-->
    </div>
    <div v-show="tabActive === 'info'" class="info-content">
      <div class="logo-enterprise"></div>
      <n-form ref="formRef" :model="form" :rules="formRules" label-placement="top">
        <n-form-item :label="$t('wb.manage.enterprise.company_name')" path="companyName">
          <span v-if="readonly">{{ form.companyName }}</span>
          <n-input
            v-else
            v-model:value="form.companyName"
            :placeholder="$t('wb.manage.enterprise.company_name_placeholder')"
          />
        </n-form-item>
        <n-form-item :label="$t('wb.manage.enterprise.team_size')" path="scale">
          <span v-if="readonly">{{ form.scale }}</span>
          <n-input v-else v-model:value="form.scale" :placeholder="$t('wb.manage.enterprise.team_size_placeholder')" />
        </n-form-item>
        <n-form-item :label="$t('wb.manage.enterprise.industry')" path="industry">
          <span v-if="readonly">{{ form.industry }}</span>
          <n-input
            v-else
            v-model:value="form.industry"
            :placeholder="$t('wb.manage.enterprise.industry_placeholder')"
          />
        </n-form-item>
        <n-form-item :label="$t('wb.manage.enterprise.contacts_name')" path="contactsName">
          <span v-if="readonly">{{ form.contactsName }}</span>
          <n-input
            v-else
            v-model:value="form.contactsName"
            :placeholder="$t('wb.manage.enterprise.contacts_name_placeholder')"
          />
        </n-form-item>
        <n-form-item :label="$t('wb.manage.enterprise.phone_number')" path="tel">
          <span v-if="readonly">{{ form.tel }}</span>
          <n-input v-else v-model:value="form.tel" :placeholder="$t('wb.manage.enterprise.phone_number_placeholder')" />
        </n-form-item>
        <n-form-item :label="$t('wb.manage.enterprise.company_address')" path="address">
          <span v-if="readonly">{{ form.address }}</span>
          <n-input v-else v-model:value="form.address" type="textarea" placeholder="" />
        </n-form-item>
      </n-form>
      <n-button v-if="!readonly" type="info" :loading="saveLoading" @click="handleSubmit">
        {{ $t('wb.manage.enterprise.update_profile') }}
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { clone } from 'lodash-es'
import { FormInst, FormRules } from 'naive-ui'
import { IBCompany } from '@/types/workbench'
import { regExp } from '@/utils'
import { useUserStore } from '@/store'
import { useCompanyStore } from '@/store/workbench'
import { CompanyApi } from '@/api/workbench'

const userStore = useUserStore()
const companyStore = useCompanyStore()
const readonly = computed(() => {
  return userStore.companyRole !== 'ADMIN'
})
const tabActive = ref('info')
const form = ref({} as IBCompany)
const formRef = ref<FormInst>()
const formRules: FormRules = {
  companyName: { required: true, message: window.$t('wb.manage.enterprise.company_name_placeholder'), trigger: 'blur' },
  scale: { required: true, message: window.$t('wb.manage.enterprise.team_size_placeholder'), trigger: 'blur' },
  industry: { required: true, message: window.$t('wb.manage.enterprise.industry_placeholder'), trigger: 'blur' },
  contactsName: {
    required: true,
    message: window.$t('wb.manage.enterprise.contacts_name_placeholder'),
    trigger: 'blur'
  },
  tel: {
    required: true,
    key: 'tel',
    validator: (rule, value) => {
      if (!value) return new Error(window.$t('wb.manage.enterprise.phone_number_placeholder'))
      if (!regExp.mobile.test(value) && !regExp.tel.test(value)) {
        return new Error(window.$t('auth.mobile_tel_format_error'))
      }
      return true
    },
    trigger: 'blur'
  }
}
const saveLoading = ref(false)
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
  } catch (e) {
    return window.$message.error(window.$t('form_error'))
  }
  try {
    saveLoading.value = true
    await CompanyApi.update(form.value)
    await companyStore.getCompanyInfo()
    window.$message.success(window.$t('save_success'))
  } finally {
    saveLoading.value = false
  }
}
watch(
  () => companyStore.company,
  (newVal) => {
    if (!newVal) return
    form.value = clone(newVal)
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.enterprise-profile {
  padding: 24px;
  background-color: #ffffff;
  .tabs-nav {
    display: flex;
    align-items: center;
    height: 32px;
    .item-nav {
      font-size: 18px;
      cursor: pointer;
      &.active {
        font-weight: bold;
      }
      & + .item-nav {
        margin-left: 24px;
      }
    }
  }
  .info-content {
    margin-top: 24px;
    :deep(.n-select) {
      width: 300px;
    }
    :deep(.n-input) {
      width: 300px;
      &.n-input--textarea {
        width: 500px;
      }
    }
  }
}
</style>
