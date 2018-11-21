<template>
    <header class="app-header navbar">
       <button type="button" class="hidden-lg-up">|</button> <a href="#/" class="navbar-brand"></a> 
       <ul class="nav navbar-nav hidden-md-down">
          <li class="nav-item"></li>
       </ul>
  
        <div id="userInformation" class="userInformation" v-show="patient.firstname && ['doctor', 'superuser'].indexOf(user.group) !== -1">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12">
                        <div class="well well-sm">
                            <div class="row">

                                <div class="col-sm-1 col-md-1">
                                    <img src="http://placehold.it/50x50" class="img-rounded img-responsive" style="border-radius: 50%; width: 3.5em; padding: 2px;" />
                                </div>
                                
                                <div class="col-sm-2 col-md-2">
                                    <h6> {{patient.firstname | upper}} {{patient.lastname | upper}}</h6>
                                    <div class="row-fluid">
                                    <div class="col-md-4 col-sm-4" style="width: %33; margin: 0 !important; float: left;padding: 0 !important"><i class="fa fa-intersex"></i><i v-if="patient.sex === '0'">M</i> <i v-if="patient.sex === '1'">F</i></div>
                                        <div class="col-sm-4 col-md-4" style="width: 33%;margin: 0 !important;float: left;padding: 0 !important"><i class="fa fa-gift"></i> {{patient.age}} </div>
                                        <div class="col-sm-4 col-md-4" style="width: 33%;margin: 0 !important;float: left;padding: 0 !important">{{patient.blood_group_label}}</div>
                                    </div>
                                </div>
                                <div class="col-sm-2 col-md-2">
                                    <h6>Alerjinler</h6>
                                    <div class="row-fluid">
                                        <div class="col-sm-12 col-md-12" style="padding: 0 !important;">-</div>
                                    </div>
                                </div>
                                <div class="col-sm-3 col-md-3">
                                    <h6>DoB: {{patient.date_of_birth}}</h6>
                                    <div class="row-fluid">
                                        <div class="col-md-6 col-sm-6" style="width: 34%;margin: 0 !important;float: left;padding: 0 !important">Kilo: {{weight = patient.weight ? patient.weight : '-'}}</div>
                                        <div class="col-sm-6 col-md-6" style="width: 40%;margin: 0 !important;float: left;padding: 0 !important">Boy: {{length = patient.length ? patient.length : '-'}}</div>
                                    </div>
                                </div>
                                <div class="col-sm-3 col-md-2">
                                    <h6>Acil Uyarılar</h6>
                                    <div class="row-fluid">
                                        <div class="col-md-6 col-sm-6" style="width: 34%;margin: 0 !important;float: left;padding: 0 !important">
                                          <small v-for="lab ,key, a in patient.critical_lab">
                                                {{lab.lab}}: {{lab.val}}</br>
                                          </small>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-2 col-md-2">
                                  <i class="fa fa-plus pull-right" style="cursor:pointer" @click="show_diagnosis_modal = true; diagnosis_data = {}"></i>
                                  <small v-if="!patient.diagnosis">No Data</small>
                                  <small v-for="diagnosis in patient.diagnosis">
                                    {{diagnosis}} </br>
                                  </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <button v-show="patient.firstname && ['doctor', 'superuser'].indexOf(user.group) !== -1" class="UserbtnToggle"><span id="toggleButton" class="fa fa-chevron-down"></span></button>
 
       <ul class="nav navbar-nav ml-auto">
          <li class="nav-item px-1" style=""><a href="#/" class="nav-link"><i class="fa fa-dashboard"></i></a></li>
          <li class="nav-item px-1"><a href="#/user/settings" class="nav-link"><i class="fa fa-wrench"></i></a></li>
          <li class="nav-item dropdown">

             <a data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false" class="nav-link dropdown-toggle nav-link">
              <span class="hidden-md-down"><i class="fa fa-flag"></i></span>
            </a> 
             <div class="dropdown-menu dropdown-menu-right">
              <a v-show="lang=='tr'" v-on:click="toggleLang" class="dropdown-item"><i class="fa fa-lock"></i> English</a>
              <a v-show="lang=='en'" v-on:click="toggleLang" class="dropdown-item"><i class="fa fa-lock"></i> Türkçe</a>
             </div>
          </li>
          <li class="nav-item dropdown">
             <a data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false" class="nav-link dropdown-toggle nav-link"><span class="hidden-md-down"><i class="fa fa-user"></i></span></a> 
             <div class="dropdown-menu dropdown-menu-right">
                <a href="#/user/settings"class="dropdown-item">{{user.first_name}} {{user.last_name}} <small class="dropdown-item">{{user.group}}</small></a>
                <a href="#/logout" class="dropdown-item"><i class="fa fa-lock"></i> Logout</a>
          
             </div>
          </li>
          <li class="nav-item hidden-md-down"></li>
       </ul>

    <modal v-if="show_diagnosis_modal" @close="show_diagnosis_modal = false">
        <h3 slot="header">Add Diagnosis</h3>
        <div slot="body">
            <catalog-edit-form :form="diagnosis_form" :data="diagnosis_data" ref="diagnosis_edit_form"></catalog-edit-form>
        </div>
        <div slot="footer">
            <button type="button" class="btn btn-primary" v-on:click="diagnosis_add()">Save</button>
            <button type="button" class="btn btn-secondary" @click="show_diagnosis_modal = false">Close</button>
        </div>
    </modal>

    </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CatalogService from 'wisdom-services/catalog';
import DiagnosisService from 'wisdom-services/diagnosis';
import {default as Modal} from '../../components/widgets/Modal';

export default {
  name: 'Navbar',
  mounted () {
    var vm = this;
    let user = localStorage.getItem('user');
    this.user = JSON.parse(user);
    document.addEventListener('DOMContentLoaded', function () {
      var show = document.getElementsByClassName('UserbtnToggle');
      var toggle = document.getElementById('toggleButton');
      var pron = document.getElementsByClassName('userInformation');
      pron[0].classList.add('hidden');
      show[0].addEventListener('click', function (e) {
        show[0].className = show[0].className.indexOf('toggleafter') !== -1 ? 'UserbtnToggle' : 'UserbtnToggle toggleafter'; //  userInformation__opened
        let len = 120;
        if (vm.patient.diagnosis) {
          len = vm.patient.diagnosis.length > 1 ? (vm.patient.diagnosis.length * 45) : 120;
        }
        if (pron[0].className.indexOf('userInformation__opened') !== -1) {
          pron[0].className = 'userInformation';
          pron[0].style.height = '55px';
          show[0].style.top = '46px';
          toggle.className = 'fa fa-chevron-down';
        } else {
          pron[0].className = 'userInformation userInformation__opened';
          pron[0].style.height = len + 'px';
          show[0].style.top = len - 10 + 'px';
          toggle.className = 'fa fa-chevron-up';
        }
      });
    });
  },
  components: {
    Modal
  },
  props: {
    show: Boolean
  },
  data () {
    return {sex: '', show_diagnosis_modal: false, diagnosis_form: CatalogService.get('patient_follow_diagnosis'), diagnosis_data: {}, user: {}};
  },
  computed: mapGetters({
    lang: 'lang',
    patient: 'patient_selected'
  }),
  created: function () {
  },
  filters: {
    upper: function (value) {
      if (value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
    }
  },
  methods: {
    ...mapActions([
      'toggleSidebar',
      'toggleLang'
    ]),
    diagnosis_add: function () {
      let result = this.$refs.diagnosis_edit_form.validateBeforeSubmit();
      var vm = this;
      result.then(function (res) {
        if (res.result) {
          vm.diagnosis_data.patient_id = vm.patient.id;
          DiagnosisService.save(vm.diagnosis_data)
                          .then(resp => {
                            vm.show_diagnosis_modal = false;
                            vm.$refs.diagnosis_table.refresh();
                          });
        } else {
          alert('Please check this form');
        }
      });
    }
  }
};
</script>
