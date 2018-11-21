<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <!-- <v-select v-model="selected" :options="datas"></v-select>-->
    <StreamTable></StreamTable>
  </div>
</template>

<script>
import { default as StreamTable } from './StreamTable.vue'
import vSelect from 'vue-select'
import BitfinexService from '../../services/bitfinex'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      datas: {},
      selected: '',
      symbols: require('../../filters/bitfinex_options').options
    }
  },
  components: {
    StreamTable,
    vSelect
  },
  created () {
    BitfinexService.get('btcusd').then(data => {
      console.log(data)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
