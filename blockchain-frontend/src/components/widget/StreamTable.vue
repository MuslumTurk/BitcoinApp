<template>
  <div class="loading-parent">
    <loading :active.sync="isLoading"
        :is-full-page="fullPage"></loading>
    <!-- Breadcrumb -->
    <ol class="breadcrumb">
        <li class="breadcrumb-item">Dashboard</li>
    </ol>
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header">
              <strong>Stream Data</strong>
              <div class="btn-group pull-right" role="group">
                <button type="button" class="btn btn-success" v-on:click="start_data()">Start Stream</button>
                <button type="button" class="btn btn-primary" v-on:click="saved_data()">Save Table</button>
                <button type="button" class="btn btn-danger" v-on:click="get_data()">Get Data</button>
              </div>
            </div>
            <div class="card-block">
              <div id="people" >
                <pre>The graph is shown according to the ask values.</pre>
                <!-- <v-select name="data" :options="symbols" :on-change="change_symbol" v-model="selected_symbol"></v-select>-->
                <!--<line-chart :chart-data="datacollection"></line-chart>-->
                <json-excel v-if="tableData.length != 0" class="btn btn-default" :data="tableData" type="csv" name="filename.xls">
                  <h2>> Download Table Data</h2>
                </json-excel>
                <v-client-table :data="tableData" :columns="data.columns" :options="data.options"></v-client-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import ChartWidget from './ChartWidget.vue'
import moment from 'moment'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.min.css'
import SymbolService from '../../services/symbol_service'
import BitfinexService from '../../services/bitfinex'
import JsonExcel from 'vue-json-excel'
import vSelect from 'vue-select'
import { ClientTable } from 'vue-tables-2'

Vue.use(ClientTable, {}, false)

export default {
  components: {
    vSelect,
    ChartWidget,
    JsonExcel,
    Loading
  },
  data () {
    return {
      data: {
        columns: ['name', 'ask', 'last_price', 'volume', 'mid', 'statistics'],
        aaaa: false,
        options: {
          // see the options API
          filterable: ['name'],
          templates: {
            statistics: ChartWidget
          }
        }
      },
      isLoading: false,
      fullPage: true,
      tableData: [],
      save_data: [],
      graphdata: [],
      filter_symbols: require('../../filters/symbols').options
    }
  },
  created () {
    this.isLoading = true
    this.getTableData()
    this.refresh_table()
  },
  methods: {
    start_data () {
      this.getTableData()
      this.refresh_table()
    },
    getTableData () {
      BitfinexService.get().then(resp => {
        this.tableData = []
        for (var i = 0; i < this.filter_symbols.length; i++) {
          for (var j = 0; j < resp.data.result.length; j++) {
            if (this.filter_symbols[i].caption === resp.data.result[j].key) {
              this.getSymbolsData(resp.data.result[j].value, this.filter_symbols[i], i)
            }
          }
        }
        this.isLoading = false
      })
    },
    getSymbolsData (graph, symbol, index = 0) {
      SymbolService.get(symbol.value).then(getdata => {
        let editobj = this.edit_data(getdata.data)
        let obj = {'key': {}, 'value': []}
        obj['key'] = symbol.caption
        obj['value'].push(editobj)
        getdata.data.name = symbol.caption
        getdata.data.id = index
        getdata.data.graph = graph
        this.save_data.push(obj)
        this.tableData.push(getdata.data)
      })
    },
    edit_data (getdata) {
      console.log(getdata)
      let date = moment().format('YYYY-MM-DD-hh-mm')
      let ask = getdata.ask
      let mid = getdata.mid
      let bid = getdata.bid
      let volume = getdata.volume
      let lastprice = getdata.last_price
      return {date, ask, lastprice, volume, mid, bid}
    },
    refresh_table () {
      const self = this
      setInterval(function () {
        self.getTableData()
        self.saved_data()
        self.save_data = []
      }, 60000)
    },
    get_data () {
      this.graph_data = []
      BitfinexService.get().then(resp => {
        console.log(this.tableData)
        for (var i = 0; i < resp.data.result.length; i++) {
          for (var j = 0; j < this.tableData.length; j++) {
            if (this.tableData[j].name === resp.data.result[i].key) {
              this.graph_data.push(resp.data.result[i].value.slice(-10))
            }
          }
          // this.arr[resp.data.result[i].key] = resp.data.result[i].value.slice(-10)
        }
        console.log('>>>>>', this.graph_data)
      })
    },
    saved_data () {
      BitfinexService.save(this.save_data).then(resp => {
        console.log(resp)
      })
    }
  }
}
</script>
<style>
  .loading-parent {
    position: relative;
  }
  .small {
    max-width: 600px;
    margin:  150px auto;
  }
</style>
