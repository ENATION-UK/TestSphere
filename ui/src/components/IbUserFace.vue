<template>
  <n-avatar v-if="faceUrl" :src="faceUrl" round class="ib-user-face" />
  <n-avatar v-else-if="showName" round class="ib-user-face">{{ showName }}</n-avatar>
  <n-avatar v-else round class="ib-user-face default-face">
    <n-icon :component="PersonSharp" size="28" />
  </n-avatar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PersonSharp from '@vicons/ionicons5/PersonSharp'
import { IBConfig } from '@/config'
import { useUserStore } from '@/store'

const props = defineProps<{
  src?: string
  name?: string
  nameLen?: number
}>()

// 头像url
const faceUrl = computed(() => {
  if (props.src) return props.src
  return useUserStore().user?.face
})

// 显示文字
const showName = computed(() => {
  let len = props.nameLen || (IBConfig.APP_CHINA ? 1 : 2)
  if (props.name) {
    return props.name.substring(0, len)
  }
  const user = useUserStore().user
  if (!user) return ''
  const { nickname, perfectNickName } = user
  if (perfectNickName === 0) return ''
  return nickname.substring(0, len)
})
</script>

<style scoped lang="scss">
.ib-user-face {
  color: #ffffff;
  background-color: var(--primary-color);
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  &.default-face {
    background-color: pink;
  }
}
</style>
