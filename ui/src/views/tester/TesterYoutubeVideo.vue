<template>
  <n-modal
    v-model:show="projectsStore.showYoutubeVideo"
    :show-icon="false"
    :auto-focus="false"
    :mask-closable="false"
    :close-on-esc="false"
    preset="dialog"
    style="width: fit-content; padding-top: 45px"
    @close="handleVideoClose"
  >
    <iframe
      width="800"
      height="450"
      src="https://www.youtube.com/embed/xlkK3VyjLlg?si=jW99A-gNlTbiMzor"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
  </n-modal>
</template>

<script setup lang="ts">
import { useTesterProjectsStore } from '@/store/tester'

const projectsStore = useTesterProjectsStore()

const handleVideoClose = () => {
  projectsStore.showYoutubeVideo = false
}
</script>

<style scoped lang="scss"></style>
