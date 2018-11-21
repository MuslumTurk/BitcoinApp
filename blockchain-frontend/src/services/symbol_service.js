import Vue from 'vue'
import { BITFINEX_API_URL } from '../config'
export default {
  search (data) {
    return Vue.http.post(BITFINEX_API_URL)
  },
  get (symbol) {
    let url = BITFINEX_API_URL + 'pubticker/' + symbol
    return Vue.http.get(url)
  }
}
