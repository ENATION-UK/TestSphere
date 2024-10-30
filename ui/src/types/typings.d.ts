import { Router } from 'vue-router'
import { Store } from 'pinia'

export {}

declare module 'pinia' {
  export interface Pinia {
    _s: Map<string, Store>
  }
  export interface PiniaCustomProperties {
    router: Router
  }
}
