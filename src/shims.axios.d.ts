import { AxiosRequestConfig } from 'axios'

declare module 'axios' {

  export interface AxiosHeaders {
    token?: string
  }
} 