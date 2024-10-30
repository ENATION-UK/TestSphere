<template>
  <n-button type="primary" size="tiny" @click="handleInviteFriends" class="invite-btn">
    {{ btnText }}
  </n-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useInviteFriendsModalModal } from '@/hooks'

const isTester = location.href.includes('/tester')
const btnText = computed(() => {
  let msg = 'invite_friends_earn_ai_point'
  if (isTester) {
    msg = 'invite_friends_earn_run_limit'
  }
  return window.$t(msg)
})
const handleInviteFriends = () => {
  useInviteFriendsModalModal()
}
</script>

<style scoped lang="scss">
.invite-btn {
  border: none !important;
  box-shadow: none !important;
  background-image: linear-gradient(90deg, rgba(104, 74, 243, 255) 0, rgb(134, 77, 248) 50%, rgb(200, 54, 223) 100%);
  :deep(.n-base-wave),
  :deep(.n-button__border),
  :deep(.n-button__state-border) {
    display: none;
  }
}
.invite-btn {
  color: #8b451e;
  background: linear-gradient(282.16deg, #ffdb95 3.33%, #fff3d6 93.67%);
  &:hover,
  &:active,
  &:focus {
    color: #8b451e;
  }
  :deep(.n-button__content) {
    font-weight: bold;
  }
}
</style>
