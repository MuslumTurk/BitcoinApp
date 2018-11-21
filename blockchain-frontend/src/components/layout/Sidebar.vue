<template>
    <div class="sidebar" :class="{ slideInLeft: show, slideOutLeft: !show }">
        <nav class="sidebar-nav">
            <ul class="nav">
                <b><li class="nav-title">{{patient.firstname}} {{patient.lastname}} - {{sex}} - {{patient.age}}</li></b>
                </hr>
                <li v-for="(item, index) in menu" v-if="item.permissions.indexOf(user.group) !== -1" class="nav-item" v-bind:class="{ 'nav-dropdown':(item.children && item.children.length), 'open': isExpanded(item) }">
                    <router-link class="nav-link" v-bind:class="{ 'nav-dropdown-toggle':(item.children && item.children.length) }" :to="item.path" :exact="true" :aria-expanded="isExpanded(item) ? 'true' : 'false'" v-if="item.path" @click="toggle(index, item)">
                        <span class="icon is-small"><i :class="['fa', item.meta.icon]"></i></span> <b v-if="names = item.name ? item.name : item.name">{{ $t('LeftSidebar.' + names) }}</b>
                    </router-link>
                    <a role="button" class="nav-link nav-dropdown-toggle" @click="toggle(index, item)" v-if="item.children && item.children.length"><i :class="['fa', item.meta.icon]"></i> <b v-if="names = item.name ? item.name : item.name">{{$t('LeftSidebar.' + names)}}</b></a>

                    <ul class="nav-dropdown-items" v-if="item.children && item.children.length">

                        <li v-for="subItem in item.children" v-if="subItem.sub_permissions.indexOf(user.group) !== -1 && subItem.path" class="nav-item">
                            <router-link :to="generatePath(item, subItem)" class="nav-link">
                                <span class="icon is-small"><i v-if="subItem.meta && subItem.meta.icon" :class="['fa', subItem.meta.icon]"></i></span> <b v-if="names = subItem.name ? subItem.name : subItem.name">{{ $t('LeftSidebar.' + names) }}</b>
                            </router-link>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
  },

  props: {
    show: Boolean
  },

  data () {
    return {
      isReady: false,
      user: {}
    };
  },

  mounted () {
    let user = localStorage.getItem('user');
    this.user = JSON.parse(user);
    let route = this.$route;
    if (route.name) {
      this.isReady = true;
      this.shouldExpandMatchItem(route);
    }
  },

  computed: mapGetters({
    menu: 'menuitems',
    patient: 'patient_selected'
  }),
  created: function () {
    this.sex = this.patient.sex === '0' ? 'Male' : 'Female';
  },
  methods: {
    ...mapActions([
      'expandMenu'
    ]),

    isExpanded (item) {
      return item.meta.expanded;
    },

    toggle (index, item) {
      this.expandMenu({
        index: index,
        expanded: !item.meta.expanded
      });
    },

    shouldExpandMatchItem (route) {
      let matched = route.matched;
      let lastMatched = matched[matched.length - 1];
      let parent = lastMatched.parent || lastMatched;
      const isParent = parent === lastMatched;

      if (isParent) {
        const p = this.findParentFromMenu(route);
        if (p) {
          parent = p;
        }
      }

      if ('expanded' in parent.meta && !isParent) {
        this.expandMenu({
          item: parent,
          expanded: true
        });
      }
    },

    generatePath (item, subItem) {
      return `${item.component ? item.path + '/' : ''}${subItem.path}`;
    },

    findParentFromMenu (route) {
      const menu = this.menu;
      for (let i = 0, l = menu.length; i < l; i++) {
        const item = menu[i];
        const k = item.children && item.children.length;
        if (k) {
          for (let j = 0; j < k; j++) {
            if (item.children[j].name === route.name) {
              return item;
            }
          }
        }
      }
    }
  },

  watch: {
    $route (route) {
      this.isReady = true;
      this.shouldExpandMatchItem(route);
    }
  }

};
</script>
