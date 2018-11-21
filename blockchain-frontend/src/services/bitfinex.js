import Vue from 'vue'
import { BITFINEX_API_URL, API_BASE_URL } from '../config'
export default {
  save (data) {
    let url = API_BASE_URL + 'app/bitfinex/new'
    return Vue.http.put(url, data)
  },
  search (data) {
    return Vue.http.post(BITFINEX_API_URL)
  },
  get () {
    let url = API_BASE_URL + 'app/bitfinex'
    return Vue.http.get(url)
  }
}
