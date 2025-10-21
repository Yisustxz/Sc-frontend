import axios from 'axios'
import { API_BASE_URL } from 'config/constants'
import store from 'store'

export type ContractType = 'professor' | 'worker'

export default async function createContract(type: ContractType, payload: any) {
  const endpoint = type === 'professor' ? `${API_BASE_URL}/contracts/profesor` : `${API_BASE_URL}/contracts/worker`
  const res = await axios.post(endpoint, payload, {
    headers: {
      Authorization: `Bearer ${store.getState().auth.token}`
    }
  })
  return res.data
}
