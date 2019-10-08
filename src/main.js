import jQuery from 'jquery';

window.$ = window.jQuery = jQuery;

import 'popper.js';
import 'bootstrap';
import './assets/app.scss';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import ProductList from './sections/ProductList.vue'
import {fb}   from './firebase'

Vue.config.productionTip = false;

Vue.component('Navbar', Navbar);
Vue.component('Hero', Hero);
Vue.component('ProductList', ProductList);


let app = '';

fb.auth().onAuthStateChanged(function(user) {

  if(!app){
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");

  }

});
