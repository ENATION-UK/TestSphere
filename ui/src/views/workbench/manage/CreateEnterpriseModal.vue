<template>
  <n-modal
    v-model:show="showModal"
    :close-on-esc="false"
    :mask-closable="false"
    :show-icon="false"
    :auto-focus="false"
    preset="dialog"
    style="width: 970px; padding: 0"
  >
    <div class="create-enterprise-modal">
      <div class="left">
        <div class="inner-form">
          <div class="tit">{{ $t('wb.fill_enterprise_name') }}</div>
          <div class="trial-info">
            <div class="item">
              <div class="label">企业版：</div>
              <div class="value">试用</div>
            </div>
            <div class="item">
              <div class="label">到期时间：</div>
              <div class="value">2022-01-26（7天）</div>
            </div>
          </div>
          <div class="name-input">
            <n-input v-model:value="enterpriseName" :placeholder="$t('wb.fill_enterprise_name')" />
          </div>
          <div class="agreement">
            <n-checkbox v-model:checked="agreeAgreement" size="small" />
            <span @click="agreeAgreement = !agreeAgreement" class="agree-text">
              {{ $t('wb.agree_agreement_tip') }}
            </span>
          </div>
          <div class="submit-box">
            <n-button type="info" size="small" :disabled="!enterpriseName" class="submit-btn">
              {{ $t('wb.start_trial') }}
            </n-button>
          </div>
        </div>
      </div>
      <div class="right">广告招租</div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showModal = ref(false)
const show = () => {
  showModal.value = true
}
const enterpriseName = ref('')
const agreeAgreement = ref(false)

defineExpose({ show })
</script>

<style scoped lang="scss">
.create-enterprise-modal {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 550px;
  margin-top: -8px;
  .left,
  .right {
    height: 100%;
  }
  .left {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    .inner-form {
      width: 360px;
      .tit {
        color: #222222;
        font-size: 18px;
        font-weight: bold;
      }
      .trial-info {
        margin-top: 28px;
        border: 1px solid var(--border-color);
        font-size: 12px;
        padding: 12px 10px;
        border-radius: 4px;
        .item {
          display: flex;
          & + .item {
            margin-top: 4px;
          }
          .label {
            width: 80px;
          }
        }
      }
      .name-input {
        margin-top: 24px;
      }
      .agreement {
        display: flex;
        font-size: 12px;
        margin-top: 8px;
        .agree-text {
          display: inline-block;
          cursor: pointer;
          margin-left: 3px;
        }
      }
      .submit-box {
        display: flex;
        justify-content: center;
        margin-top: 24px;
        .submit-btn {
          width: 180px;
        }
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 390px;
    flex-shrink: 0;
    color: #ffffff;
    font-size: 18px;
    font-weight: bold;
    background-color: #6c737a;
  }
}
</style>
