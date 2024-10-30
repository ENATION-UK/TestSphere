<template>
  <div class="dots">...</div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.dots {
  display: inline-block;
  height: 1em;
  line-height: 1;
  text-align: left;
  vertical-align: -0.25em;
  overflow: hidden;
}

.dots::before {
  display: block;
  /*
   * content中把三个点写在最前面是为了兼容IE9
   * IE9不支持animation，只能显示静态的三个点
   */
  content: '...\A..\A.';
  /* content 默认是会忽略换行，所以要用pre-wrap来保留换行符 */
  white-space: pre-wrap;
  animation: dot 2s infinite step-start both;
}

@keyframes dot {
  33% {
    transform: translateY(-2em);
  }
  66% {
    transform: translateY(-1em);
  }
}
</style>
