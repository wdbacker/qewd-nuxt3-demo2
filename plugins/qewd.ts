import { QEWD } from 'qewd-client'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      hello: (msg: string) => `Hello ${msg}!`,
      qewd: QEWD
    }
  }
})