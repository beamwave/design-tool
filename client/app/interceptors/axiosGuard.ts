import axios from 'axios'
export const axiosGuard = axios.create()
axiosGuard.interceptors.request.use(config => {
  config.headers.Authorization = localStorage.getItem('arsenal')
  return config
})
