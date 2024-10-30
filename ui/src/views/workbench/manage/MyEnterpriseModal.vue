<template>
  <n-modal
    v-model:show="showModal"
    :close-on-esc="false"
    :mask-closable="false"
    :show-icon="false"
    :auto-focus="false"
    preset="dialog"
    style="width: 470px"
  >
    <div class="my-enterprise-modal">
      <div class="enterprise">
        <n-avatar class="avatar">易</n-avatar>
        <div class="info">
          <div class="name">易族智汇（北京）科技有限公司</div>
          <div class="exp">企业共2人，2022年3月24日到期</div>
        </div>
      </div>
      <div class="seats-exp">
        <div class="left">
          <div class="item">
            <div class="value">2</div>
            <div class="label">{{ $t('wb.enterprise_seats') }}</div>
          </div>
          <div class="item">
            <div class="value">63{{ $t('wb.day') }}</div>
            <div class="label">{{ $t('wb.duration') }}</div>
          </div>
        </div>
        <div class="right">
          <n-button type="info" @click="handleRenewNow">{{ $t('wb.renew_now') }}</n-button>
        </div>
      </div>
      <div class="benefits">
        <div class="title">{{ $t('wb.my_enterprise_title') }}</div>
        <div class="subtitle">
          {{ $t('wb.my_enterprise_subtitle') }}
          <n-button text type="info" size="tiny">{{ $t('wb.see_more') }}</n-button>
        </div>
        <div class="icons">
          <div class="item">
            <n-avatar class="icon"></n-avatar>
            <div class="label">{{ $t('wb.my_enterprise_icon1') }}</div>
          </div>
          <div class="item">
            <n-avatar class="icon"></n-avatar>
            <div class="label">{{ $t('wb.my_enterprise_icon2') }}</div>
          </div>
          <div class="item">
            <n-avatar class="icon"></n-avatar>
            <div class="label">{{ $t('wb.my_enterprise_icon3') }}</div>
          </div>
        </div>
      </div>
    </div>
  </n-modal>
  <create-order-modal ref="createOrderModalRef" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import CreateOrderModal from './CreateOrderModal.vue'

export default defineComponent({
  setup() {
    const showModal = ref(false)
    const show = () => {
      showModal.value = true
    }
    const createOrderModalRef = ref<InstanceType<typeof CreateOrderModal>>()
    const handleRenewNow = () => {
      showModal.value = false
      createOrderModalRef.value?.show()
    }

    return {
      showModal,
      show,
      handleRenewNow,
      createOrderModalRef
    }
  },
  components: {
    CreateOrderModal
  }
})
</script>

<style scoped lang="scss">
.my-enterprise-modal {
  .enterprise {
    display: flex;
    align-items: center;
    .avatar {
      width: 50px;
      height: 50px;
      background-color: #0d8ddf;
    }
    .info {
      margin-left: 12px;
      .name {
        color: #222222;
        font-size: 16px;
        font-weight: bold;
      }
      .exp {
        font-size: 12px;
      }
    }
  }
  .seats-exp {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    .left {
      display: flex;
      .item {
        display: flex;
        align-items: center;
        flex-direction: column;
        color: #222222;
        font-size: 14px;
        & + .item {
          margin-left: 10px;
        }
        .value {
          font-weight: bold;
        }
      }
    }
  }
  .benefits {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    background-color: #f5f5f5;
    border-radius: 4px;
    width: 100%;
    height: 200px;
    .title {
      color: #222222;
      font-size: 18px;
      font-weight: bold;
    }
    .subtitle {
      font-size: 12px;
    }
    .icons {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-top: 24px;
      width: 100%;
      padding: 0 24px;
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 90px;
        flex-shrink: 0;
        .icon {
          width: 50px;
          height: 50px;
        }
        .label {
          color: #222222;
          font-size: 14px;
          font-weight: bold;
          text-align: center;
        }
      }
    }
  }
}
</style>
