<template>
  <trend
    :data="stream_data"
    auto-draw
    :gradient="['#6fa8dc', '#42b983', '#2c3e50']"
    smooth style="height: 50px; width: 150px; display: block; margin-left: auto; margin-right: auto;">
    asd
  </trend>
</template>
<script>
import Trend from 'vuetrend'
export default {
  props: ['data'],
  components: {
    Trend
  },
  created () {
    for (var i = 0; i < this.data.graph.length; i++) {
      this.stream_data.push(parseInt(this.data.graph[i].ask))
    }
  },
  data () {
    return {
      stream_data: []
    }
  }
}
</script>
