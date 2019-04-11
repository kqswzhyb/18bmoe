<template>
  <div class="charts" ref="wrapper">
  	  <div class="wrapper2">
	    <div class="content2">
	       <div class="block">
		    <!-- <span class="demonstration">赛程</span> -->
		    <el-date-picker
		      v-model="value"
		      type="date"
		      placeholder="选择日期"
		      :picker-options="pickerOptions" @change="gettime">
		    </el-date-picker>
		  </div>
		  <ul class="sex">
		  	<li :class="{active:item.sex==sex}" v-for="(item,i) in choose" @click="get(item.sex)"><img :src="'../../static/'+item.src" alt="" width="20" height="20"></li>
		  </ul>
		  <ul class="category">
		  	<li :class="{active:ids==1}" @click="getData(1)"><img src="../../static/paihangbang.png" height="20" width="20" alt="" ><span>&nbsp&nbsp得票数</span></li>
		  	<li :class="{active:ids==0}" @click="getData(0)"><img src="../../static/precent.png" height="20" width="20" alt=""><span>&nbsp&nbsp得票率</span></li>
		  	<li :class="{active:ids==2}" @click="getData(2)"><img src="../../static/shangsheng.png" height="20" width="20" alt=""><span>&nbsp&nbsp票增</span></li>
		  </ul>
	    </div>
	  </div>
    <div class="group" ref="wrapper">
        <div class="zu" v-for="(item,i) in category">
          <span style="cursor:pointer;" :class="{active:id==item.id}" v-show="item.sex==sex" @click="changeData(item.id)">{{item.name}}&nbsp&nbsp&nbsp&nbsp</span>
        </div>
    </div>
    <div class="wrapper3">
      <div class="content3">
      <div id="chartmain2" style="width:100%; height: 450px;"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    	pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.parse('Jul 14, 2018')||time.getTime() > Date.parse('Aug 18, 2018')||time.getTime()==Date.parse('Jul 30, 2018')||time.getTime() == Date.parse('Aug 14, 2018')
        },
      },
      value: 1531497600000,
      group:[],
      category:[],
      time:[],
      page:0,
      sex:1,
      id:'',
    	ids:1,
      length:8,
      chart:'',
    	choose:[{'sex':1,'src':'nv.png'},{'sex':0,'src':'nan.png'}],
    	list:[],
    	activeName: 'first',
    	options: {
        tooltip: {
            trigger: 'axis',
            backgroundColor:'#000',
            // show:false
        },
        legend: {
            // data:['蕾姆','时崎狂三','2232332','22323332','2232332','2232332','2232332','2232332'],
            type:'scroll',
            left:'3%',
            top:'0',
            show:true,
            textStyle:{
              color:'#fff'
            }
        },
        grid: {
            left: '1%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            // boundaryGap: false,
            boundaryGap: ['10px', '10px'],
            axisLabel: { showMaxLabel: true ,color:'#fff'},
            axisLine:{
              lineStyle:{
                type:'dashed'
              }
            },
            axisTick:{
              length:'0'
            },
            // offset:'10px',
            // axisLabel:{color:'#bbbece'},
            // show : false,
            data: []
        },
        dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
    }, {
        start: 0,
        end: 100,
        dataBackground:{
          lineStyle:{
            color:'#fff',
          },
          areaStyle:{
            color:'rgba(255,255,255,.3)',
          }
        },
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        },
        textStyle:{
          color:'#fff'
        }
    }
        ],
        color:['#d82020','#473ce2','#fed435','pink', '#be5dee','green',  '#00eaee', '#6e7074', '#546570', '#c4ccd3'],
        yAxis: {
            // type: 'value',
            scale: true,
            // show:false,
            axisLine: {
              show:false,
              // lineStyle:{
              //   type:'dashed'
              // }
            },
            axisLabel:{color:'#fff'},
            axisTick:{
              inside:true,
              length:1771,
              lineStyle:{
                type:'dashed',
                // color:'#423f3f'
              }
            }
          //   splitLine:{
          // 　　　　show:true
          // 　　 }
          
            // silent:true
            // show : false,
        },

        series: [

            // {
            //     name:'蕾姆',
            //     type:'line',
            //     data:[0, 9444, 15175, 19271, 21621, 23120, 23907],
            // },
            // {
            //     name:'时崎狂三',
            //     type:'line',
            //     data:[0, 10230, 15159, 19155, 21367, 22676, 23418],
            // }   
            
        ]
      }
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    get(sex){
    	if(sex==this.sex) {
    		return
    	}else {
    		switch(sex) {
          case 1:
          this.sex=1
          var index=this.category.findIndex(item=>{
            return  item.sex==this.sex
          })
          this.changeData(this.category[index].id)
          break;
          case 0:
          this.sex=0
          var index=this.category.findIndex(item=>{
            return item.sex==this.sex
          })
          this.changeData(this.category[index].id)
          break;
        }
    	}
    	
    },
    changeData(newid) {
      this.id=newid
      switch(this.ids){
          case 0:
          axios.get('/api/schedule/trend/chart?group_id='+this.id+'&type='+this.ids)
          .then((res)=>{
            this.options.xAxis.data=res.data.result.labels
            this.list=[]
            var rank=res.data.result.orderedCharacter.slice(0,this.length)
            this.data=[]
            rank.forEach((item,i)=>{
              this.data.push(item.chn_name)
            })
            this.data.forEach((item,i)=>{
              let obj={}
              obj.name=item
              obj.type="line"
              obj.data=res.data.result.datas[item].map(item=>{
                return item/100
              })
              this.list.push(obj)
            })
            this.options.series=this.list
            this.options.legend.data=this.data
            console.log(this.options.series)
            this.chart.clear()
           this.chart.setOption(this.options); 
            })
            .catch((err)=>{
              console.log(err)
            })
          break;
          case 1:
          axios.get('/api/schedule/trend/chart?group_id='+this.id+'&type='+this.ids)
          .then((res)=>{
            this.options.xAxis.data=res.data.result.labels
            this.list=[]
            var rank=res.data.result.orderedCharacter.slice(0,this.length)
            this.data=[]
            rank.forEach((item,i)=>{
              this.data.push(item.chn_name)
            })
            this.data.forEach((item,i)=>{
              let obj={}
              obj.name=item
              obj.type="line"
              obj.data=res.data.result.datas[item]
              this.list.push(obj)
            })
            this.options.series=this.list
            this.options.legend.data=this.data
             console.log(this.list)
            this.chart.clear()
           this.chart.setOption(this.options); 
            })
            .catch((err)=>{
              console.log(err)
            })
          break;
          case 2:
          axios.get('/api/schedule/trend/chart?group_id='+this.id+'&type='+this.ids)
          .then((res)=>{
            this.options.xAxis.data=res.data.result.labels
            this.list=[]
            var rank=res.data.result.orderedCharacter.slice(0,this.length)
            this.data=[]
            rank.forEach((item,i)=>{
              this.data.push(item.chn_name)
            })
            this.data.forEach((item,i)=>{
              let obj={}
              obj.name=item
              obj.type="line"
              obj.data=res.data.result.datas[item]
              this.list.push(obj)
            })
            this.options.series=this.list
            this.options.legend.data=this.data
            console.log(this.list)
            this.chart.clear()
           this.chart.setOption(this.options); 
            // console.log(this.data)
          })
          .catch((err)=>{
            console.log(err)
          })
          break;
        }
    },
    getData(newid) {
      if(this.ids==newid) {
        return
      }else {
        this.ids=newid
        switch(this.ids){
          case 0:
          axios.get('/api/schedule/trend/chart?group_id='+this.id+'&type='+this.ids)
          .then((res)=>{
            this.options.xAxis.data=res.data.result.labels
            this.list=[]
            var rank=res.data.result.orderedCharacter.slice(0,this.length)
            this.data=[]
            rank.forEach((item,i)=>{
              this.data.push(item.chn_name)
            })
            this.data.forEach((item,i)=>{
              let obj={}
              obj.name=item
              obj.type="line"
              obj.data=res.data.result.datas[item].map(item=>{
                return item/100
              })
              this.list.push(obj)
            })
            this.options.series=this.list
            this.options.legend.data=this.data
            console.log(this.options.series)
            this.chart.clear()
           this.chart.setOption(this.options); 
            })
            .catch((err)=>{
              console.log(err)
            })
          break;
          case 1:
          axios.get('/api/schedule/trend/chart?group_id='+this.id+'&type='+this.ids)
          .then((res)=>{
            this.options.xAxis.data=res.data.result.labels
            this.list=[]
            var rank=res.data.result.orderedCharacter.slice(0,this.length)
            this.data=[]
            rank.forEach((item,i)=>{
              this.data.push(item.chn_name)
            })
            this.data.forEach((item,i)=>{
              let obj={}
              obj.name=item
              obj.type="line"
              obj.data=res.data.result.datas[item]
              this.list.push(obj)
            })
            this.options.series=this.list
            this.options.legend.data=this.data
            console.log(this.options.series)
            this.chart.clear()
           this.chart.setOption(this.options); 
            })
            .catch((err)=>{
              console.log(err)
            })
          break;
          case 2:
          axios.get('/api/schedule/trend/chart?group_id='+this.id+'&type='+this.ids)
          .then((res)=>{
            this.options.xAxis.data=res.data.result.labels
            this.list=[]
            var rank=res.data.result.orderedCharacter.slice(0,this.length)
            this.data=[]
            rank.forEach((item,i)=>{
              this.data.push(item.chn_name)
            })
            this.data.forEach((item,i)=>{
              let obj={}
              obj.name=item
              obj.type="line"
              obj.data=res.data.result.datas[item]
              this.list.push(obj)
            })
            this.options.series=this.list
            this.options.legend.data=this.data
            console.log(this.options.series)
            this.chart.clear()
           this.chart.setOption(this.options);    
            // console.log(this.data)
          })
          .catch((err)=>{
            console.log(err)
          })
          break;
        }
      }
    },
    gettime() {
      this.sex=1
      this.page=this.time.findIndex((item)=>{
        return item>=Date.parse(this.value)
      })
      // if(this.page<=15) {
      //   this.length=8
      // }else if(15<this.page<=23) {
      //   this.length=4
      // }else {
      //   this.length=2
      // }
      // console.log(this.page)
      this.category=this.group[this.page].groups
      var index=this.category.findIndex(item=>{
     return item.sex==1
     })
      this.changeData(this.category[index].id)
      // console.log(this.options)
    },
    resize() {
      if(document.documentElement.clientWidth<500) {
        this.$refs.wrapper.style.width=100+'%'
        // this.$refs.wrapper2.style.width=100+'%'
        // this.$refs.wrapper3.style.width=100+'%'
      }else {
        this.$refs.wrapper.style.width=(47+(1980/document.documentElement.clientWidth*10))+'%'
        // this.$refs.wrapper2.style.width=(47+(1980/document.documentElement.clientWidth*10))+'%'
        // this.$refs.wrapper3.style.width=(47+(1980/document.documentElement.clientWidth*10))+'%'
      }

    }
  },
  created () {
    axios.get('/api/schedule/calendar')
     .then((res)=>{
      // console.log(res.data.result.schedules)
     this.group=res.data.result.schedules
     this.category=this.group[this.page].groups
     var index=this.category.findIndex(item=>{
     return item.sex==1
     })
     this.id=this.category[index].id
     // console.log(res.data.result.schedules)
      this.group.forEach((item,i)=>{
        this.time.push(item.startTime)
      })
      
     }).then(()=>{
        axios.get('/api/schedule/trend/chart?group_id='+this.id+'&type='+this.ids)
      .then((res)=>{
        this.options.xAxis.data=res.data.result.labels
        this.list=[]
        var rank=res.data.result.orderedCharacter.slice(0,this.length)
        this.data=[]
        rank.forEach((item,i)=>{
          this.data.push(item.chn_name)
        })
        this.data.forEach((item,i)=>{
          let obj={}
          obj.name=item
          obj.type="line"
          obj.data=res.data.result.datas[item]
          this.list.push(obj)
        })
        this.options.series=this.list
        this.options.legend.data=this.data
        this.chart = echarts.init(document.getElementById('chartmain2'));
        this.chart.setOption(this.options);
        setTimeout( ()=>{
          window.onresize =  () => {
              this.chart.resize();
          }
      },200) 
        // console.log(this.data)
      })
      .catch((err)=>{
        console.log(err)
      }) 
     })
     .catch((err)=>{
      console.log(err)
     })
  },
  mounted () {
    this.resize()
    window.addEventListener("resize",this.resize,false)        
  },
  components: {
  },
  watch:{
  }
}
</script>
<style lang="scss" scoped>
// .tabs {
// 	width:600px;
// 	height:500px;
// 	margin:0 auto;
// }
.wrapper2 {
	// width:600px;
	// height:50px;
	margin:20px auto;
  // position: relative;
	// position: absolute;
	// left: 0;
	// top: 0;
	// overflow: hidden;
	.content2 {
		// margin-top:10px;
		// line-height:50px;
		// height:50px;
		// width:1100px;
		padding:0;
		display:flex;
    flex-wrap:wrap;
		justify-content:space-between;
    align-items:center;
		.sex {
			height:50px;
			padding:0;
			margin:0;
			// padding-left:10px;
			display:flex;
			align-items:center;
			li {
				padding:9px 20px;
				margin-left:10px;
				list-style:none;
				cursor:pointer;
				background-color:#121212;
				color:#fff;
				border-radius:10px;
				
				// border:1px solid #e1e1e1;
			}
			.active {
				background-color:rgba(133,23,123,0.7);
				// border-bottom:3px solid red;
			}
		}
		.category {
			height:100%;
			padding:0;
			margin:0;
			// padding-left:10px;
			display:flex;
			align-items:center;
			li {
				padding:9px 15px;
				margin-right:10px;
				list-style:none;
				cursor:pointer;
				background-color:#121212;
				color:#fff;
				border-radius:10px;
				img {
					vertical-align:middle;
				}
			}
			.active {
				background-color:rgba(133,23,123,0.7);
				// border-bottom:3px solid red;
			}
		}
	}
 }
 .charts {
  margin:0 auto;
 }
 .group {
    display:flex;
    flex-wrap:wrap;
    margin-bottom:20px;
    .zu {
      // padding-right:10px;
    }
    .active {
      color:#e66457;
      // border-bottom:3px solid red;
    }
 }
.wrapper {
	// width:600px;
	height:300px;
	margin:0 auto;
  // position: relative;
	// position: absolute;
	// left: 0;
	// top: 0;
	background-color:#ccc;
	overflow: hidden;
	.content {
		height:300px;
		width:1900px;
		padding:0;
		display:flex;
		justify-content:space-around;
		
	}
 }
 .wrapper3 {
  // width:360px;
  height:450px;
  margin:0 auto;
  // position: absolute;
  // left: 0;
  // top: 0;
  background-color:#333;
  // overflow: hidden;
  .content3 {
    height:450px;
    width:100%;
    padding:0;
    display:flex;
    justify-content:space-around;
    
  }
 }

</style>