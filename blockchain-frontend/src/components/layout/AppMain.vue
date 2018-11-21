<template>
  <div class="app-body">
    <AppSidebar fixed>
      <SidebarHeader/>
      <SidebarForm/>
      <SidebarNav :navItems="nav"></SidebarNav>
      <SidebarFooter/>
      <SidebarMinimizer/>
    </AppSidebar>
    <main class="main">
      <transition mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut" appear>
          <router-view></router-view>
      </transition>
    </main>
  </div>
</template>

<script>
// import store from 'vuex-store';
import nav from '../../router/menu/items'
import { SidebarToggler, Sidebar as AppSidebar, SidebarFooter, SidebarForm, SidebarHeader, SidebarMinimizer, SidebarNav, Aside as AppAside, Footer as TheFooter } from '@coreui/vue'
export default {
  data () {
    return {
      nav: nav.items
    }
  },
  components: {
    AppSidebar,
    AppAside,
    TheFooter,
    SidebarForm,
    SidebarFooter,
    SidebarToggler,
    SidebarHeader,
    SidebarNav,
    SidebarMinimizer
  }
}
</script>
