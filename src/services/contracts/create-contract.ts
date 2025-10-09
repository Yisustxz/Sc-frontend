import axios from 'axios'
import { API_BASE_URL } from 'config/constants'
import store from 'store'

const URL = `${API_BASE_URL}/contracts`

export default async function createContract(payload: any) {
  const res = await axios.post(`${URL}`, payload, {
    headers: {
      Authorization: `Bearer ${store.getState().auth.token}`
    }
  })
  return res.data
}
