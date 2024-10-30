<template>
  <div class="member-list">
    <div class="title-list">
      <div v-if="company" class="numbers">
        {{ $t('wb.manage.enterprise.all_member') }} &bull;
        <span class="num">{{ company.seatUsed }}&nbsp;/&nbsp;{{ company.seatTotal }}</span>
        <n-button v-if="!userStore.aliYunUser" size="small" class="add-seats-btn" @click="handleAddSeats">
          {{ $t('wb.manage.enterprise.add_seats_db') }}
        </n-button>
      </div>
      <div class="other-opt">
        <n-space>
          <n-button size="small" type="info" :loading="shareLinkLoading" @click="handleInviteJoin">
            {{ $t('wb.manage.enterprise.invite_to_join') }}
          </n-button>
        </n-space>
      </div>
    </div>
    <div class="member-tip">
      <n-alert type="warning" :bordered="false">{{ $t('wb.manage.enterprise.seats_restricted_tip') }}</n-alert>
    </div>
    <div class="body-list">
      <n-table :bordered="false" :single-line="false">
        <thead>
          <tr>
            <th>{{ $t('wb.manage.enterprise.name') }}</th>
            <th v-if="IBConfig.APP_CHINA">{{ $t('wb.manage.enterprise.phone_number') }}</th>
            <th>{{ $t('wb.manage.enterprise.email') }}</th>
            <th>{{ $t('wb.manage.enterprise.role') }}</th>
            <th>{{ $t('wb.manage.enterprise.product_permissions') }}</th>
            <th>{{ $t('operation') }}</th>
            <th style="width: 80px"></th>
          </tr>
        </thead>
        <tbody v-if="memberRes">
          <tr v-for="item in memberRes.records" :key="item.userId">
            <td>
              <div class="user-info">
                <IbUserFace :src="item.face" :name="item.nickname" />
                <span class="user-name">{{ item.nickname }}</span>
              </div>
            </td>
            <td v-if="IBConfig.APP_CHINA">{{ item.mobile }}</td>
            <td>{{ item.email }}</td>
            <td>{{ roleName(item) }}</td>
            <td>{{ productAuthoritiesText(item) }}</td>
            <td>
              <n-space>
                <n-button v-if="editEnable(item)" type="default" size="tiny" @click="onEditMember(item)">
                  {{ $t('edit') }}
                </n-button>
                <n-button v-if="removeEnable(item)" type="warning" size="tiny" @click="onDeleteMember(item)">
                  {{ $t('remove') }}
                </n-button>
              </n-space>
            </td>
            <td></td>
          </tr>
        </tbody>
      </n-table>
    </div>
  </div>
  <n-modal
    v-model:show="showAuthModal"
    :show-icon="false"
    :close-on-esc="false"
    :mask-closable="false"
    :auto-focus="false"
    :positive-text="$t('save')"
    :loading="saveAuthLoading"
    @positiveClick="handleConfirmSaveAuth"
    transform-origin="center"
    preset="dialog"
    style="width: 400px"
  >
    <n-form ref="authFormRef" :model="authForm" :rules="authRules" class="auth-modal">
      <n-form-item :label="$t('wb.name')">
        <span class="readonly-text">{{ authUserInfo.nickname }}</span>
      </n-form-item>
      <n-form-item :label="$t('contact_info')">
        <span class="readonly-text">{{ authUserInfo.mobile || authUserInfo.email }}</span>
      </n-form-item>
      <n-form-item :label="$t('wb.manage.enterprise.product_permissions')" path="productAuthorities">
        <n-checkbox-group v-model:value="authForm.productAuthorities" class="auth-box">
          <n-checkbox value="dbdesign">
            <n-tag>{{ $t('dbDesigner') }}</n-tag>
          </n-checkbox>
          <n-checkbox value="autotest">
            <n-tag>{{ $t('autoTester') }}</n-tag>
          </n-checkbox>
        </n-checkbox-group>
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import { FormInst, FormRules } from 'naive-ui'
import { IBPagerRes } from '@/types/base'
import { IBUserPage } from '@/types/user'
import { IBConfig } from '@/config'
import { useUserStore } from '@/store'
import { useCompanyStore } from '@/store/workbench'
import { useIbModal, useInviteAccessDeniedModal } from '@/hooks'
import { UserApi } from '@/api/user/user'
import { CompanyApi, InviteApi } from '@/api/workbench'
import IbUserFace from '@/components/IbUserFace.vue'

const ibModal = useIbModal()
const userStore = useUserStore()
const companyStore = useCompanyStore()
const company = computed(() => companyStore.company)
const params = ref({
  pageNo: 1,
  pageSize: 999999
})
const roleName = (item: IBUserPage) => {
  if (item.role === 'ADMIN') return window.$t('wb.manage.role_admin')
  if (item.role === 'USER') return window.$t('wb.manage.role_user')
  if (item.companyId === company.value?.companyId) return window.$t('wb.manage.role_owner')
}
const productAuthoritiesText = (item: IBUserPage) => {
  const db = window.$t('dbDesigner')
  const at = window.$t('autoTester')
  switch (item.productAuthorities) {
    case 'dbdesign':
      return db
    case 'autotest':
      return at
    case 'dbdesign autotest':
    case 'autotest dbdesign':
      return `${db}, ${at}`
  }
}
const memberRes = ref<IBPagerRes<IBUserPage>>()
const getMembers = async (otherParams?: Record<string, any>) => {
  memberRes.value = await UserApi.members({ ...params.value, ...otherParams })
}
onMounted(() => getMembers())
defineExpose({ getMembers })

const router = useRouter()
const handleAddSeats = () => {
  if (company.value?.subscribeTypeDb.indexOf('TEAM') !== 0) {
    useInviteAccessDeniedModal(window.$t('wb.manage.enterprise.add_seats_db'))
    return
  }
  if (IBConfig.APP_CHINA) {
    ibModal.buySeatsModalRef.value?.show()
  } else {
    router.push({ name: 'billsSubscription' })
  }
}
const shareLinkLoading = ref(false)
const handleInviteJoin = async () => {
  try {
    shareLinkLoading.value = true
    const res = await InviteApi.shareData()
    ibModal.inviteToJoinModalRef.value?.show(res)
  } finally {
    shareLinkLoading.value = false
  }
}

const showAuthModal = ref(false)
const saveAuthLoading = ref(false)
const authUserInfo = ref<IBUserPage>(<IBUserPage>{})
const authFormRef = ref<FormInst>()
const authForm = ref({
  productAuthorities: []
})
const authRules: FormRules = {
  productAuthorities: {
    key: 'productAuthorities',
    required: true,
    validator: (rule, value: string[]) => {
      if (!value || value.length === 0) return new Error(window.$t('wb.least_one_product_error'))
      return true
    },
    trigger: 'change'
  }
}
const onEditMember = (user: IBUserPage) => {
  authUserInfo.value = cloneDeep(user)
  authForm.value.productAuthorities = []
  const auth = user.productAuthorities || ''
  if (auth.indexOf('dbdesign') !== -1) {
    authForm.value.productAuthorities.push('dbdesign')
  }
  if (auth.indexOf('autotest') !== -1) {
    authForm.value.productAuthorities.push('autotest')
  }
  showAuthModal.value = true
}
const handleConfirmSaveAuth = async () => {
  if (!authForm.value) return false
  await authFormRef.value?.validate()
  saveAuthLoading.value = true
  try {
    const { userId } = authUserInfo.value
    const { productAuthorities } = authForm.value
    await CompanyApi.updateUserProductAuths(userId, productAuthorities.join(' '))
    await getMembers()
    await companyStore.getCompanyInfo()
    showAuthModal.value = false
    window.$message.success(window.$t('save_success'))
  } finally {
    saveAuthLoading.value = false
  }
}
const onDeleteMember = (user: IBUserPage) => {
  window.$confirm(window.$t('wb.manage.enterprise.remove_member_confirm_tip'), { type: 'error' }, async () => {
    await CompanyApi.removeUser(user.userId)
    await getMembers()
    await companyStore.getCompanyInfo()
    window.$message.success(window.$t('remove_success'))
  })
}

const editEnable = (user: IBUserPage) => {
  // 当前企业ID
  const companyId = companyStore.company?.companyId
  // 自己不能编辑自己
  if (userStore.user?.userId === user.userId) return false
  // 企业拥有者
  if (userStore.user?.companyId === companyId) return true
  // 不能编辑企业拥有者
  if (user.companyId === companyId) return false
  // 不能编辑其他管理员
  if (user.role === 'ADMIN') return false
  return userStore.companyRole === 'ADMIN'
}
const removeEnable = (user: IBUserPage) => {
  // 自己不能删除自己
  if (user.userId === userStore.user?.userId) return false
  // 企业拥有者
  return userStore.user?.companyId === companyStore.company?.companyId
}
</script>

<style scoped lang="scss">
.member-list {
  padding-top: 24px;
  width: 100%;
  .title-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    width: 100%;
    .numbers {
      font-size: 16px;
      font-weight: bold;
      .num {
        color: var(--error-color);
        font-size: 16px;
      }
      .add-seats-btn {
        margin-left: 24px;
      }
    }
  }
  .member-tip {
    width: fit-content;
    margin-top: 10px;
    margin-left: 24px;
    :deep(.n-alert) {
      display: flex;
      align-items: center;
      background-color: rgb(247, 240, 176);
      height: 40px;
      padding-left: 12px;
      overflow: hidden;
      .n-alert__icon {
        position: relative;
        line-height: normal;
        margin: auto;
      }
      .n-alert-body {
        padding-left: inherit;
      }
    }
  }
  .body-list {
    padding: 24px;
    :deep(.n-table) {
      th {
        background-color: transparent;
        border: none;
      }
      td {
        border: none;
      }
    }
    .user-info {
      display: flex;
      align-items: center;
      .user-name {
        margin-left: 12px;
      }
    }
  }
}
.auth-modal {
  .readonly-text {
    color: #999;
  }
  .auth-box {
    display: flex;
    flex-direction: column;
    margin-top: 5px;
  }
  .n-checkbox {
    flex-direction: row-reverse;
    align-items: center;
    cursor: pointer;
    :deep(.n-tag) {
      user-select: none;
      cursor: pointer;
      margin-right: 5px;
    }
    & + .n-checkbox {
      margin-top: 10px;
    }
  }
}
</style>
