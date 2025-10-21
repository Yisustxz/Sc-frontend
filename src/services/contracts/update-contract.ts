import axios from 'axios'
import { API_BASE_URL } from 'config/constants'
import store from 'store'

export default async function updateContract(uuid: string, payload: any) {
  const res = await axios.patch(`${API_BASE_URL}/contracts/${uuid}`, payload, {
    headers: {
      Authorization: `Bearer ${store.getState().auth.token}`
    }
  })
  return res.data
}
