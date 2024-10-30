<template>
  <IbApplication>
    <router-view />
  </IbApplication>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { IBConfig } from '@/config'
import IbApplication from '@/components/IbApplication.vue'

const loadHubSpot = () => {
  const id = IBConfig.HUBSPOT_ID
  if (!id) return
  if (document.getElementById('hs-script-loader')) return
  const script = document.createElement('script')
  script.id = 'hs-script-loader'
  script.src = `//js-na1.hs-scripts.com/${id}.js`
  script.defer = true
  script.async = true
  document.head.appendChild(script)
}

onMounted(() => loadHubSpot())
</script>

<style lang="scss">
@import './styles/variables';
@import './styles/common';
@import './styles/theme';
.main-container {
  width: calc(100vw - 20rem);
  height: 100vh;
  padding: var(--header-height) 10px 10px;
  margin-left: 20rem;
  box-sizing: border-box;
}
</style>
