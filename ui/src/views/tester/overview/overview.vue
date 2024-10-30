<template>
  <div class="overview">
    <TotalView />
    <ChartView />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const TotalView = defineAsyncComponent(() => import('./TotalView.vue'))
const ChartView = defineAsyncComponent(() => import('./ChartView.vue'))
</script>

<style scoped lang="scss">
.overview {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
}
</style>
