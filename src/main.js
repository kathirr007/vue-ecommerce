/* import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;
import 'popper.js'; */
import 'bootstrap';
import './assets/app.scss';
import bsCustomFileInput from 'bs-custom-file-input'
window.bsCustomFileInput = bsCustomFileInput;

import Swal from 'sweetalert2';
window.Swal = Swal;

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

window.Toast = Toast;



import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store.js';
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import ProductList from './sections/ProductList.vue'
import AddToCart from './components/AddToCart.vue'
import MiniCart from './components/MiniCart.vue'
import {fb}   from './firebase'
import VueFirestore from 'vue-firestore'

Vue.use(VueFirestore, {
  key: 'id',         // the name of the property. Default is '.key'.
  enumerable: true  //  whether it is enumerable or not. Default is true.
})

Vue.use(VueFirestore)

import Vue2Filters from 'vue2-filters'
Vue.use(Vue2Filters)

import VueCarousel from 'vue-carousel';
Vue.use(VueCarousel);

Vue.config.productionTip = false;

Vue.component('Navbar', Navbar);
Vue.component('Hero', Hero);
Vue.component('ProductList', ProductList);
Vue.component('AddToCart', AddToCart);
Vue.component('MiniCart', MiniCart);
// Vue.component({Navbar, Hero, ProductList, AddToCart, MiniCart});


let app = '';

$(document).ready(function(){
  bsCustomFileInput.init();
  $('.custom-file-input').on('change', function (e) {
    //get the file name
    var fileName = e.target.files[0].name;
    console.log(fileName)
    //replace the "Choose a file" label
    $('.custom-file-label').html(fileName);
  });
})

fb.auth().onAuthStateChanged(function(user) {

  if(!app){
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");

  }

});
