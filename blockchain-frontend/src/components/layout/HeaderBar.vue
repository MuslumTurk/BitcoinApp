<template>
  <AppHeader fixed>
    <SidebarToggler class="d-lg-none" display="md" mobile />
    <b-link class="navbar-brand" to="#">
      <img class="navbar-brand-full" src="static/img/brand/logo.svg" width="89" height="25" alt="CoreUI Logo">
      <img class="navbar-brand-minimized" src="static/img/brand/sygnet.svg" width="30" height="30" alt="CoreUI Logo">
    </b-link>
    <SidebarToggler class="d-md-down-none" display="lg" />
    <b-navbar-nav class="d-md-down-none">
      <b-nav-item class="px-3">Settings</b-nav-item>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto">
    </b-navbar-nav>
  </AppHeader>
</template>

<script>
import { Header as AppHeader, SidebarToggler } from '@coreui/vue'
export default {
  components: {
    AppHeader,
    SidebarToggler
  }
}
</script>
