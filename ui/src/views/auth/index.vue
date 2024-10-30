<template>
  <div class="auth-container">
    <ib-logo width="145" type="left-right" home class="logo" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import IbLogo from '@/components/IbLogo.vue'
</script>

<style scoped lang="scss">
.auth-container {
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/bg-auth.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  .logo {
    position: absolute;
    z-index: 99;
    top: 32px;
    left: 32px;
  }
}
</style>
