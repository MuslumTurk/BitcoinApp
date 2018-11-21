<template>
  <div class="app">
    <header-bar></header-bar>
    <app-main></app-main>
    <footer-bar></footer-bar>
  </div>
</template>

<script>
import { HeaderBar, AppMain, FooterBar } from './components/layout/index'

export default {
  name: 'full',
  components: {
    HeaderBar,
    AppMain,
    FooterBar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
<style lang="scss">
  // CoreUI Icons Set
  /* Import Font Awesome Icons Set */
  $fa-font-path: '~font-awesome/fonts/';
  @import '~font-awesome/scss/font-awesome.scss';
  /* Import Simple Line Icons Set */
  $simple-line-font-path: '~simple-line-icons/fonts/';
  @import '~simple-line-icons/scss/simple-line-icons.scss';
  /* Import Flag Icons Set */
  /* Import Bootstrap Vue Styles */
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>
