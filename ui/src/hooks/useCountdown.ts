import { ref } from 'vue'

export function useCountdown() {
  let timer: any = null
  const time = ref(0)

  const start = (seconds = 60) => {
    clearTimeout(timer)
    time.value = seconds
    countdown()
  }
  const end = () => {
    clearTimeout(timer)
    time.value = 0
  }
  const countdown = () => {
    if (time.value <= 0) {
    } else {
      time.value--
      timer = setTimeout(countdown, 1000)
    }
  }

  return {
    start,
    end,
    time
  }
}
