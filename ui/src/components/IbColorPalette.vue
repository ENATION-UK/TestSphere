<template>
  <div class="color-palette">
    <!-- 主题色彩 -->
    <div class="color-palette__item theme">
      <h4 class="color-palette__title">{{ themeTitle }}</h4>
      <div class="color-palette__content">
        <div class="color-palette__color-list">
          <div class="color-items" v-for="c in themeColorList" :key="c">
            <div class="color-items__inner-color" :style="{ backgroundColor: c }" @click="handleChooseTheme(c)" />
          </div>
        </div>
      </div>
    </div>
    <!-- 当前使用色彩 -->
    <div class="color-palette__item currently-used">
      <h4 class="color-palette__title">{{ currentlyUsedTitle }}</h4>
      <div class="color-palette__content">
        <div class="color-palette__color-list">
          <div class="color-items">
            <div class="color-items__inner-color" :style="{ backgroundColor: currentlyUsedTheme }"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 自定义色彩 -->
    <div class="color-palette__item custom">
      <h4 class="color-palette__title">{{ customTitle }}</h4>
      <div class="color-palette__content">
        <n-input
          :value="customThemeValue"
          @input="handleInputThemeValue"
          round
          placeholder=""
          class="color-palette-input"
          size="small"
        >
          <template #prefix>
            <div style="color: #999; font-size: 12px">HEX:&nbsp;&nbsp;&nbsp;&nbsp;</div>
            <div>#</div>
          </template>
          <template #suffix>
            <n-icon v-show="customValueReg" class="palette-confrim-btn" @click="handleChooseCustomTheme">
              <svg
                t="1699611375522"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2301"
                width="200"
                height="200"
              >
                <path
                  d="M479.287 761.117c-28.762 28.039-75.489 28.039-104.251 0l-234.739-229.703c-28.762-28.039-28.762-74.052 0-102.087s75.489-28.039 104.251 0l182.615 178.658 351.927-344.736c28.762-28.039 75.489-28.039 104.251 0s28.762 74.052 0 102.087l-404.048 395.781z"
                  fill="#1afa29"
                  p-id="2302"
                ></path>
              </svg>
            </n-icon>
            <n-icon v-show="!customValueReg" class="palette-confrim-btn" @click="clearCustomTheme">
              <svg
                t="1699611528849"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3360"
                width="200"
                height="200"
              >
                <path
                  d="M886.784 746.496q29.696 30.72 43.52 56.32t-4.608 58.368q-4.096 6.144-11.264 14.848t-14.848 16.896-15.36 14.848-12.8 9.728q-25.6 15.36-60.416 8.192t-62.464-34.816l-43.008-43.008-57.344-57.344-67.584-67.584-73.728-73.728-131.072 131.072q-60.416 60.416-98.304 99.328-38.912 38.912-77.312 48.128t-68.096-17.408l-7.168-7.168-11.264-11.264-11.264-11.264q-6.144-6.144-7.168-8.192-11.264-14.336-13.312-29.184t2.56-29.184 13.824-27.648 20.48-24.576q9.216-8.192 32.768-30.72l55.296-57.344q33.792-32.768 75.264-73.728t86.528-86.016q-49.152-49.152-93.696-93.184t-79.872-78.848-57.856-56.832-27.648-27.136q-26.624-26.624-27.136-52.736t17.92-52.736q8.192-10.24 23.552-24.064t21.504-17.92q30.72-20.48 55.296-17.92t49.152 28.16l31.744 31.744q23.552 23.552 58.368 57.344t78.336 76.288 90.624 88.576q38.912-38.912 76.288-75.776t69.632-69.12 58.368-57.856 43.52-43.008q24.576-23.552 53.248-31.232t55.296 12.8q1.024 1.024 6.656 5.12t11.264 9.216 10.752 9.728 7.168 5.632q27.648 26.624 27.136 57.856t-27.136 57.856q-18.432 18.432-45.568 46.08t-60.416 60.416-70.144 69.632l-77.824 77.824q37.888 36.864 74.24 72.192t67.584 66.048 56.32 56.32 41.472 41.984z"
                  p-id="3361"
                  fill="#d81e06"
                ></path>
              </svg>
            </n-icon>
          </template>
        </n-input>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  currentlyTheme?: string
}>()
const emit = defineEmits<{
  (e: 'handle-choose', value: string): void
}>()

const themeTitle = window.$t('palette_theme_title')
const currentlyUsedTitle = window.$t('palette_currently_used_title')
const customTitle = window.$t('palette_custom_title')

const themeColorList = [
  '#409EFF',
  '#67C23A',
  '#E6A23C',
  '#F56C6C',
  '#909399',
  '#8CF56C',
  '#F56CE0',
  '#C0C4CC',
  '#1A2FC8',
  '#F50707',
  '#EEF56C',
  '#6CECF5',
  '#5850ff',
  '#F2F6FC',
  '#bd00ff'
]

const currentlyUsedTheme = computed<string>(() => {
  return props.currentlyTheme || 'var(--primary-color)'
})
const customThemeValue = ref('')
watch(
  props,
  (newVal) => {
    if (!newVal) return '5850ff'
    customThemeValue.value = newVal && newVal.currentlyTheme ? newVal.currentlyTheme.split('#')[1] : ''
  },
  { immediate: true, deep: true }
)
const customValueReg = computed(() => {
  const reg = /^([0-9a-f]{3}){1,2}$/i
  return reg.test(customThemeValue.value)
})
const handleInputThemeValue = (value: string) => {
  customThemeValue.value = value
}
const handleChooseCustomTheme = () => {
  const emitColor = customThemeValue.value.indexOf('#') > -1 ? customThemeValue.value : `#${customThemeValue.value}`
  emit('handle-choose', emitColor)
}
const clearCustomTheme = () => {
  customThemeValue.value = ''
}
const handleChooseTheme = (color: string) => {
  emit('handle-choose', color)
}
</script>

<style scoped lang="scss">
.color-palette {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  &__item {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
  &__title {
    margin: 10px;
    margin-bottom: 0;
  }
  &__content {
    width: 100%;
    .color-palette-input {
      width: calc(100% - 20px);
      margin: 10px;
      // height: 26px;
      border-radius: 4px;
      border: none;
      background-color: #f4f4f4;
      font-size: 12px;
    }
    .palette-confrim-btn {
      cursor: pointer;
    }
  }
  &__color-list {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    .color-items {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      &__inner-color {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        position: relative;
        cursor: pointer;
        &::after {
          content: '';
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #ccc;
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          display: block;
        }
        &:hover {
          &:after {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
