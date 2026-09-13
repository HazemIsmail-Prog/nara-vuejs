import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

export async function csrf() {
  await axios.get(import.meta.env.VITE_API_URL + '/sanctum/csrf-cookie', {
    withCredentials: true,
    withXSRFToken: true,
  })
}

export default http
