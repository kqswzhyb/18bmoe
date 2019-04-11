<template>
  <div class="">
	<!-- {{data}} -->
	<!-- <img :src="item.avatar" alt="" v-for="(item,i) in data" :key="item.mid"> -->
	<div v-for="(item,i) in data"><span>{{item.mid}}</span>  <img :src="item.avatar" alt=""width="50px"></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    	data:[]
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {

  },
  created () {
  },
  mounted () {
  	axios.get('/static/kurumi.json')
	.then((res)=>{
		this.data=JSON.parse(JSON.stringify(res.data))
		// console.log(res.data)
	}).catch((err)=>{
		console.log(err)
	})
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
// .button {
// 	width:100px;
// 	height:100px;
// }

</style>