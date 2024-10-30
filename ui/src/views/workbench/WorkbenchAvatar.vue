<template>
  <n-avatar v-if="src" :src="src" :round="round" class="avatar" />
  <n-avatar v-else-if="name" :round="round" class="avatar default">{{ showName }}</n-avatar>
  <n-avatar v-else :round="round" class="avatar default">
    <n-icon :component="PersonSharp" size="28" />
  </n-avatar>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import PersonSharp from '@vicons/ionicons5/PersonSharp'
import { IBConfig } from '@/config'

const props = withDefaults(
  defineProps<{
    src?: string
    name?: string
    round?: boolean
    company?: boolean
  }>(),
  {
    round: true,
    company: false
  }
)

const showName = computed(() => {
  if (!props.name) return ''
  let len = IBConfig.APP_CHINA ? 1 : 2
  if (props.company) len = 2
  return props.name.substring(0, len)
})
</script>

<style scoped lang="scss">
.avatar {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
}
.default {
  color: #ffffff;
  background-color: var(--primary-color);
}
</style>
