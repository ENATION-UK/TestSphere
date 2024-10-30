<template>
  <n-modal
    v-model:show="showModal"
    :auto-focus="false"
    :close-on-ese="false"
    :mask-closable="false"
    :show-icon="false"
    preset="dialog"
    style="width: 1080px"
    transform-origin="center"
  >
    <div class="modal-title">
      <span v-if="step === 1">{{ $t('wb.orders.enterprise_solution_selection') }}</span>
      <span v-else-if="step === 2">{{ $t('wb.orders.confirm_order') }}</span>
      <span v-else-if="step === 3">{{ $t('wb.orders.pay_results') }}</span>
      &nbsp;<span class="step">{{ step }}/3</span>
    </div>
    <div v-if="step === 1" class="solution-view">
      <div class="inner-left">
        <div class="item-left solution-list">
          <div class="tit-content">{{ $t('wb.orders.solution_selection') }}</div>
          <div class="body-solution">
            <div class="item-solution active">
              <div class="tit-item">原型协作版</div>
              <div class="price-item">
                <em class="unit">￥</em>
                <span class="price">399</span>
                /人/年/起
              </div>
              <div>支持多倍图、html导出</div>
              <div class="check-box">
                <n-icon class="icon-check">
                  <checkmark12-filled />
                </n-icon>
              </div>
            </div>
            <div class="item-solution">
              <div class="tit-item">原型协作版</div>
              <div class="price-item">
                <em class="unit">￥</em>
                <span class="price">399</span>
                /人/年/起
              </div>
              <div>支持多倍图、html导出</div>
              <div class="check-box">
                <n-icon class="icon-check">
                  <checkmark12-filled />
                </n-icon>
              </div>
            </div>
            <div class="item-solution">
              <div class="tit-item">原型协作版</div>
              <div class="price-item">
                <em class="unit">￥</em>
                <span class="price">399</span>
                /人/年/起
              </div>
              <div>支持多倍图、html导出</div>
              <div class="check-box">
                <n-icon class="icon-check">
                  <checkmark12-filled />
                </n-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="item-left seat-num">
          <div class="tit-content">{{ $t('wb.orders.all_seats_count') }}</div>
          <div class="body-seat">
            <div class="num-box">
              <n-input-number
                :value="3"
                :min="1"
                button-placement="both"
                class="num-input"
                placeholder=""
                size="large"
              />
              <span>{{ $t('wb.orders.seats_count_change') }} +0</span>
              <n-divider vertical />
              <span>
                {{ $t('wb.orders.unit_price') }}&nbsp;￥349/{{ $t('wb.orders.people') }}/
                {{ $t('wb.orders.year') }}
              </span>
            </div>
          </div>
          <div class="tips-box">
            <i18n-t keypath="wb.orders.consulting_tips">
              <n-button text type="info">400-888-8888</n-button>
            </i18n-t>
          </div>
        </div>
        <div class="item-left service-time">
          <div class="tit-content">{{ $t('wb.orders.select_duration') }}</div>
          <div class="body-duration">
            <div class="item-duration active">
              <div class="inner-duration">
                {{ $t('wb.orders.no_add') }}
                <div class="check-box">
                  <n-icon class="icon-check">
                    <checkmark12-filled />
                  </n-icon>
                </div>
              </div>
            </div>
            <div class="item-duration">
              <div class="inner-duration">
                1{{ $t('wb.orders.year') }}
                <div class="check-box">
                  <n-icon class="icon-check">
                    <checkmark12-filled />
                  </n-icon>
                </div>
              </div>
            </div>
            <div class="item-duration">
              <div class="free-tag">{{ $t('wb.orders.free_9') }}</div>
              <div class="inner-duration">
                2{{ $t('wb.orders.year') }}
                <div class="check-box">
                  <n-icon class="icon-check">
                    <checkmark12-filled />
                  </n-icon>
                </div>
              </div>
            </div>
            <div class="item-duration">
              <div class="free-tag">{{ $t('wb.orders.free_85') }}</div>
              <div class="inner-duration">
                3{{ $t('wb.orders.year') }}
                <div class="check-box">
                  <n-icon class="icon-check">
                    <checkmark12-filled />
                  </n-icon>
                </div>
              </div>
            </div>
          </div>
          <div class="tips-box">
            <span>{{ $t('wb.orders.buy_year_tip') }}</span>
            <n-button text type="info" class="detail-btn">
              {{ $t('wb.orders.see_detail') }}
              <n-icon>
                <ios-chevron-right20-filled />
              </n-icon>
            </n-button>
          </div>
        </div>
      </div>
      <div class="inner-right">
        <div class="enterprise-info">
          <div class="logo-info">
            <n-avatar color="#0388F0">易</n-avatar>
          </div>
          <div class="name-info">
            <div class="name">易族智汇（北京）科技有限公司</div>
            <div class="duration">企业共2人,&nbsp;2022年3月24日到期</div>
          </div>
        </div>
        <div class="order-info">
          <div class="item-order">
            <div class="label-item">{{ $t('wb.orders.plan_name') }}</div>
            <div class="value-item">原型协作版</div>
          </div>
          <div class="item-order">
            <div class="label-item">{{ $t('wb.orders.duration_or_purchase') }}</div>
            <div class="value-item">{{ $t('wb.orders.no_add') }}</div>
          </div>
          <div class="item-order">
            <div class="label-item">{{ $t('wb.orders.plan_seats') }}</div>
            <div class="value-item">总席位3人，席位变更+1</div>
          </div>
          <div class="item-order">
            <div class="label-item">{{ $t('wb.orders.plan_exp_time') }}</div>
            <div class="value-item">2022年3月24日</div>
          </div>
          <n-divider dashed>
            <n-button size="small" text type="info" @click="orderInfoExpand = !orderInfoExpand">
              {{ orderInfoExpand ? $t('wb.orders.stow') : $t('wb.orders.expand') }}
              <n-icon class="icon-arrow" :class="{ down: !orderInfoExpand }">
                <ios-arrow-down />
              </n-icon>
            </n-button>
          </n-divider>
          <div class="item-order">
            <div class="label-item">{{ $t('wb.orders.order_total') }}</div>
            <div class="value-item">￥199.99</div>
          </div>
        </div>
        <div class="total-view">
          <div class="count-box">
            <span class="label">{{ $t('wb.orders.need_pay') }}</span>
            <span class="price">￥199.99</span>
          </div>
          <n-button type="info" class="submit-btn" @click="step = 2">
            {{ $t('wb.orders.submit_order') }}
          </n-button>
          <div class="agreement-box">
            <n-checkbox v-model:checked="agreeAgreement" size="small" />
            <div class="text">{{ $t('wb.orders.read_and_agreed') }}</div>
            <n-button text type="info">《{{ $t('wb.orders.service_agreement') }}》</n-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="step === 2" class="order-view">
      <div class="item-order">
        <div class="tit-content">{{ $t('wb.orders.detail') }}</div>
        <div class="body-order">
          <div class="order-info">
            <div class="enterprise-info">
              <n-avatar>易</n-avatar>
              <div class="info">
                <div class="name">易族智汇（北京）科技有限公司</div>
                <div class="desc">企业共2人，2022年2月24日到期</div>
              </div>
            </div>
            <div class="order-intro">
              <div>{{ $t('wb.orders.order_time') }} <span>2022年1月20日 14:45</span></div>
              <div>{{ $t('wb.orders.order_number') }} <span>Okasjmhasj8Jskl</span></div>
            </div>
          </div>
          <div class="solution-info">
            <div class="left">
              <div class="item-solution">
                <div class="key">{{ $t('wb.orders.plan_name') }}</div>
                <div class="val">原型协作版</div>
              </div>
              <div class="item-solution">
                <div class="key">{{ $t('wb.orders.duration_or_purchase') }}</div>
                <div class="val">{{ $t('wb.orders.no_add') }}</div>
              </div>
              <div class="item-solution">
                <div class="key">{{ $t('wb.orders.plan_seats') }}</div>
                <div class="val">总席位3人，席位变更 +1</div>
              </div>
              <div class="item-solution">
                <div class="key">{{ $t('wb.orders.plan_exp_time') }}</div>
                <div class="val">2022年3月24日</div>
              </div>
            </div>
            <div class="right">
              <div class="item-solution">
                <div class="key">{{ $t('wb.orders.order_total') }}</div>
                <div class="val">￥199.99</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="item-order">
        <div class="tit-content">{{ $t('wb.orders.payment_method') }}</div>
        <div class="body-pay">
          <div class="left">
            <div class="qrcode-view">
              <qrcode-vue value="123321123321" :size="120" />
            </div>
            <div class="pay-info">
              <div class="need-pay">
                {{ $t('wb.orders.need_pay') }}<em class="unit">￥</em><span class="price">199.99</span>
              </div>
              <div class="pay-way">
                <n-icon size="23" class="icon-pay wechat">
                  <logo-wechat />
                </n-icon>
                <n-icon size="26" class="icon-pay alipay">
                  <logo-alipay />
                </n-icon>
                <span>{{ $t('wb.orders.support_payment_tip') }}</span>
              </div>
              <div class="tips">
                <i18n-t keypath="wb.orders.left_time_tip">
                  <span class="left-time">23:59</span>
                </i18n-t>
              </div>
            </div>
          </div>
          <div class="right public-pay">
            <div class="tit">
              <n-icon class="icon-card">
                <card />
              </n-icon>
              {{ $t('wb.orders.public_pay') }}
            </div>
            <div class="tip">{{ $t('wb.orders.public_pay_tip') }}</div>
            <n-button class="pay-btn" @click="step = 3">{{ $t('wb.orders.public_pay_btn') }}</n-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="step === 3" class="pay-results">
      <div class="public-flow">
        <div class="tit">{{ $t('wb.orders.public_pay_flow') }}</div>
        <div class="sub-tit">{{ $t('wb.orders.step_1_sub_tit') }}</div>
        <div class="item-flow">
          <div class="label">{{ $t('wb.orders.account_name') }}</div>
          <div class="value">易族智汇（北京）科技有限公司</div>
        </div>
        <div class="item-flow">
          <div class="label">{{ $t('wb.orders.bank_name') }}</div>
          <div class="value">招商银行股份有限公司</div>
        </div>
        <div class="item-flow">
          <div class="label">{{ $t('wb.orders.bank_number') }}</div>
          <div class="value">6220 1254 5565 202</div>
        </div>
        <div class="item-flow">
          <div class="label">{{ $t('wb.orders.remittance_amount') }}</div>
          <div class="value">￥{{ orderInfo?.totalPrice }}</div>
        </div>
        <div class="item-flow">
          <div class="label">{{ $t('wb.orders.remittance_remark') }}</div>
          <div class="value">{{ $t('wb.orders.order_number') }}{{ orderInfo?.id }}</div>
        </div>
        <div class="red-tip">
          <n-icon class="icon-info">
            <information-circle-outline />
          </n-icon>
          {{ $t('wb.orders.remittance_tip') }}
        </div>
        <n-button type="info" size="small" class="copy-btn">{{ $t('wb.orders.copy') }}</n-button>
        <div class="sub-tit">{{ $t('wb.orders.step_2_sub_tit') }}</div>
        <div class="tip1">
          {{ $t('wb.orders.tip1') }}
        </div>
        <div class="tip2">
          <i18n-t keypath="wb.orders.tip2">
            <n-button text type="info">在线客服</n-button>
            <n-button text type="info">support@javashop.cn</n-button>
          </i18n-t>
        </div>
      </div>
      <div class="public-pay">
        <div class="tit">
          <n-icon size="30" color="#0075EA">
            <card />
          </n-icon>
          <span class="tit-text">{{ $t('wb.orders.public_pay') }}</span>
          <span class="order-number">{{ $t('wb.orders.order_number') }} {{ orderInfo?.id }}</span>
        </div>
        <div class="tip3">{{ $t('wb.orders.tip3') }}</div>
        <div class="tip4">{{ $t('wb.orders.tip4') }}</div>
        <n-button class="pat-done-btn">{{ $t('wb.orders.pay_done') }}</n-button>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Checkmark12Filled from '@vicons/fluent/Checkmark12Filled'
import IosChevronRight20Filled from '@vicons/fluent/IosChevronRight20Filled'
import IosArrowDown from '@vicons/ionicons4/IosArrowDown'
import Card from '@vicons/ionicons5/Card'
import InformationCircleOutline from '@vicons/ionicons5/InformationCircleOutline'
import LogoAlipay from '@vicons/ionicons5/LogoAlipay'
import LogoWechat from '@vicons/ionicons5/LogoWechat'
import QrcodeVue from 'qrcode.vue'
import { IBOrder } from '@/types/workbench'

const showModal = ref(false)
const step = ref(3)
const orderInfo = ref<IBOrder>()
const show = (order?: IBOrder) => {
  step.value = 3
  orderInfo.value = order
  showModal.value = true
}
const orderInfoExpand = ref(true)
const agreeAgreement = ref(true)

defineExpose({ show })
</script>

<style src="./CreateOrderModal.scss" scoped lang="scss"></style>
