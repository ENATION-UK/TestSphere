<template>
  <div class="ib-ai-chat-loading" :class="{ complete }">
    <div class="dot dot-1"></div>
    <div class="dot dot-2"></div>
    <div class="dot dot-3"></div>
    <n-icon :component="CommentCheckmark20Regular" class="icon-ok" />
  </div>
</template>

<script setup lang="ts">
import CommentCheckmark20Regular from '@vicons/fluent/CommentCheckmark20Regular'

defineProps<{
  complete: boolean
}>()
</script>

<style scoped lang="scss">
@keyframes dot-zoom {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.7);
  }
  75% {
    transform: scale(0.4);
  }
  100% {
    transform: scale(0.1);
  }
}
.ib-ai-chat-loading {
  position: absolute;
  top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 10px;
  overflow: hidden;
  box-sizing: border-box;
  &.complete {
    .dot {
      display: none;
    }
    .icon-ok {
      display: inline-block;
    }
  }
  .dot {
    width: 5px;
    height: 5px;
    border-radius: 9999px;
    transition: all 0.2s ease;
    background-color: var(--text-color-1);
    animation: dot-zoom 1s linear infinite;
    &.dot-1 {
    }
    &.dot-2 {
      animation-delay: 0.3s;
    }
    &.dot-3 {
      animation-delay: 0.6s;
    }
  }
  .icon-ok {
    display: none;
    color: var(--success-color);
    text-indent: initial;
  }
}
</style>
