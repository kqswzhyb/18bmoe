// import Vue from 'vue'
// import Router from 'vue-router'
const Maps = resolve => require(['@/components/map.vue'], resolve);
// const Test = resolve => require(['@/components/test.vue'], resolve);

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
  	{ path: '/', redirect: '/map' },
    // {
    //   path: '/home',
    //   name: 'Map',
    //   component: Maps
    // },
    {
      path: '/map',
      name: 'map',
      component: Maps
    }
  ]
})
