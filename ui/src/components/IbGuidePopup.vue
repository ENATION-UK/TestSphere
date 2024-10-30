<template>
  <div v-if="showGuide && step" class="ib-guide-popup" :style="guideStore.popupStyles">
    <div class="popup-box" :class="[step.placement]">
      <div class="popup-content">
        <div class="title-content">
          <div class="title-text">{{ $t(step.title) }}</div>
          <n-button
            v-if="guideStore.onlyOneStep"
            circle
            quaternary
            :focusable="false"
            class="close-btn"
            @click="guideStore.close"
          >
            <template #icon>
              <n-icon class="icon-close"><IosClose /></n-icon>
            </template>
          </n-button>
          <n-popconfirm v-else :z-index="10000" @positive-click="guideStore.close">
            <template #trigger>
              <n-button circle quaternary :focusable="false" class="close-btn">
                <template #icon>
                  <n-icon class="icon-close"><IosClose /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('guide.confirm_exit') }}
          </n-popconfirm>
        </div>
        <div class="body-content">
          <div class="text-content">{{ $t(step.content) }}</div>
          <div v-if="step.images && step.images.length !== 0" class="images-content">
            <n-image v-for="item in step.images" :key="item" :src="item" class="img-content" />
          </div>
          <div v-if="step.tip" class="tip-content" :class="{ underline: !!step.tipUrl }" @click="handleClickTip(step)">
            <n-icon><LightbulbRegular /></n-icon>
            {{ step.tip }}
          </div>
        </div>
        <div class="footer-content">
          <n-button v-if="!guideStore.onlyOneStep" quaternary :focusable="false" @click="handleExpandSteps">
            {{ stepIndex }}/{{ guideStore.currentSteps.length }}
            <n-icon class="icon-arrow" :class="{ expand: expandSteps }"><IosArrowDown /></n-icon>
          </n-button>
          <div v-else></div>
          <n-button quaternary type="primary" :focusable="false" @click="guideStore.nextStep">
            <span v-if="guideStore.onlyOneStep">{{ $t('guide.ok') }}</span>
            <span v-else>
              {{ stepIndex === guideStore.currentSteps.length ? $t('guide.completed_guide') : $t('guide.next_step') }}
            </span>
          </n-button>
        </div>
        <div v-if="!guideStore.onlyOneStep" class="expand-content" :class="{ expand: expandSteps }">
          <n-steps vertical size="small" status="process" :current="stepIndex">
            <n-step
              v-for="(item, index) in guideStore.currentSteps"
              :key="index"
              :title="$t(item.title)"
              :description="$t(item.content)"
            />
          </n-steps>
        </div>
      </div>
      <div class="arrow"></div>
    </div>
  </div>
  <div v-if="showGuide" class="ib-guide-popup--mask" :style="guideStore.maskStyles" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import LightbulbRegular from '@vicons/fa/LightbulbRegular'
import IosArrowDown from '@vicons/ionicons4/IosArrowDown'
import IosClose from '@vicons/ionicons4/IosClose'
import { IBGuideStep } from '@/types'
import { getItem, Keys, removeItem } from '@/utils/storage'
import { useGuideStore } from '@/store'

const guideStore = useGuideStore()
const step = computed(() => guideStore.currentStep)
onMounted(() => {
  const guideStepObj = getItem(Keys.guideStep)
  if (guideStepObj) {
    guideStore.steps = guideStepObj
    removeItem(Keys.guideStep)
  }
})

const stepIndex = computed(() => {
  if (!guideStore.currentGuide) return -1
  const key = guideStore.currentGuide.key
  return guideStore.steps[key] + 1
})
const expandSteps = ref(false)
const showGuide = computed(() => {
  if (!guideStore.currentStep) return false
  if (!guideStore.popupStyles) return false
  if (!guideStore.maskStyles) return false
  return true
})
const handleExpandSteps = () => {
  expandSteps.value = !expandSteps.value
}
const handleClickTip = (step: IBGuideStep) => {
  if (!step.tipUrl) return
  window.open(step.tipUrl, '_blank')
}
</script>

<style scoped lang="scss">
.ib-guide-popup {
  position: fixed !important;
  z-index: 9999 !important;
  width: initial !important;
  height: initial !important;
  box-shadow: var(--box-shadow-1);
  border-radius: 8px;
  transition: all 0.2s var(--bezier);
  .popup-box {
    position: relative;
    &.bottom-start {
      .arrow {
        top: -6px;
        left: 20px;
      }
    }
    &.bottom-end {
      .arrow {
        top: -6px;
        right: 35px;
      }
    }
    &.right-start {
      .arrow {
        top: 20px;
        left: -6px;
      }
    }
  }
  .popup-content {
    width: 390px;
    background-color: var(--modal-color);
    border-radius: 8px;
    overflow: hidden;
    .title-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      padding: 16px 16px 0 16px;
      font-size: 18px;
      font-weight: 400;
      color: var(--text-color-base);
      .icon-close {
        font-size: 32px;
      }
    }
    .body-content {
      padding: 2px 16px 16px 16px;
      font-size: 14px;
      font-weight: 400;
      color: var(--text-color-2);
      .text-content {
        word-break: break-all;
      }
      .images-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin-top: 12px;
        .img-content {
          display: flex;
          justify-content: center;
          width: 100%;
          cursor: auto;
          & + .img-content {
            margin-top: 5px;
          }
          :deep(img) {
            border: 1px solid var(--divider-color);
            border-radius: 4px;
            cursor: pointer;
          }
        }
      }
      .tip-content {
        color: #666666;
        font-size: 13px;
        margin-top: 8px;
        &.underline {
          cursor: pointer;
          color: #5f0dd2;
        }
        :deep(.n-icon) {
          position: relative;
          top: 2px;
        }
      }
    }
    .footer-content {
      border-top: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px 12px 2px;
      height: 24px;
      box-sizing: content-box;
      .icon-arrow {
        font-size: 20px;
        transition: all 0.2s var(--bezier);
        &.expand {
          transform: rotate(-179deg);
        }
      }
    }
    .expand-content {
      padding-left: 57px;
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.2s var(--bezier);
      &.expand {
        max-height: 600px;
        overflow-y: auto;
        padding-top: 5px;
        padding-bottom: 12px;
      }
      :deep(.n-step-indicator) {
        flex-shrink: 0;
      }
      :deep(.n-step-content) {
        .n-step-content-header__title {
          white-space: pre-wrap;
          flex: initial;
        }
      }
    }
  }
  .arrow {
    position: absolute;
    width: 12px;
    height: 12px;
    transform: rotate(45deg);
    background-color: var(--modal-color);
    z-index: -1;
    box-shadow: var(--box-shadow-1);
    &.left-top {
      left: -6px;
      top: 20px;
    }
  }
}
.ib-guide-popup--mask {
  position: fixed !important;
  z-index: 9998 !important;
  left: 0 !important;
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
