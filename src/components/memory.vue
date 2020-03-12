<template>
	<div>
		<div style="width:100%;padding:20px;">
			<el-dialog title="新建新闻" :visible.sync="dialogFormVisible">
			  <newMemory :close="close"></newMemory>
			</el-dialog>
			<el-input prefix-icon="el-icon-search" style="float:left;width:300px;margin-left:10px;" v-model="findname"></el-input>
			<el-button @click="find()" style="float:left;width:100px;margin-left:10px;" type="primary">搜索</el-button>
			<el-button @click="dialogFormVisible = true" style="float:left;width:100px;margin-left:10px;" type="success">上传</el-button>
			<div class="content1" style="width:90%;height:400px;margin-top:50px;">
				<vue-waterfall-easy 
				  :imgsArr="imgsArr" 
				  :enablePullDownEvent="openPullDown"
				  :style="{transform: contentMove}"
				  :class="ifUp?'moveUpAnimate':''"
				  :maxCols="max"
				  :imgWidth="imgWidth"
				  linkRange="img"
				  @click="clickFn"
				  @scrollReachBottom="fetchImgsData" 
				  @pullDownEnd="endMove"
				  @touchmove.native="pullDown($event)"
				  @touchstart.native="pullDownStart($event)"
				  ref="downRefresh"
				>
					<div class="img-info" slot-scope="props">
						<div style="text-align:left;color:#E16D00;width:100%;text-indent: 1em;">{{props.value.user}}</div>
						<p class="some-info" style="text-align:left;width:100%;text-indent: 1em;">{{props.value.info}}</p>
					</div>
					<div slot="loading" slot-scope="{isFirstLoad}" style="font-size:30px;color:#E16D00">
						<div slot="loading" v-if="ifEmpty" >没有更多内容了</div>
						<div v-else><i class="el-icon-loading"></i></div>
					</div>
				</vue-waterfall-easy>
			</div>
		</div>
	</div>
</template>

<script>
	import vueWaterfallEasy from 'vue-waterfall-easy'
	import newMemory from './newMemory.vue'
	export default {
		name: 'memory',
		props: {
		  getword: ''
		},
		components: {
		    vueWaterfallEasy,
			newMemory,
		},
		data(){
		   return {
			    waterfallData: [],
			    backUrl: '/api',
				max: 4,
				dialogFormVisible: false,
				imgWidth: 200,
				findname: '',
				moveTime: 0,			// 记录滚动事件触发次数
				pullStart: 0,			// 首次移动的初始Y轴位置
				pullMove: 0,			// 移动后当前点Y轴位置
				pullDistance: 0,		// 计算得到Y轴移动距离
				ifUp: false,			// 是否需要回弹动画
				moveTop: -50 + "px",	// 下拉刷新移动距离
				ifReload: "下拉刷新",	// 下拉刷新字样
				contentMove: "translate3d(0px, '+ 0 +'px, 0px)",	// 内容移动距离
				openPullDown: true,	 	// 开启下拉刷新
				imgsArr: [],         	//存放所有已加载图片的数组（即当前页面会加载的所有图片）
				fetchImgsArr: []     	,//存放每次滚动时下一批要加载的图片的数组
				n: 0,
				m: 0,
				step: 6,
				ifEmpty:false
			}
		},
		methods: {
			find(findname=null){
				if (findname){
					console.log('外调')
				} else {
					findname = this.findname
				}
				this.$axios.post('/api/findM',
				{
					word: findname
				}
				)
				  .then((response) => {
				    if (response.data.flag == 'success') {
				      let mems = response.data.content
					  let arr = [];
					  let brr = [];
					  for(let i =0; i < mems.length ; i++){
						  if(i<mems.length/2){
							  let s = mems[i][2].split(' ')
							  let u = "/memory/?id="+mems[i][0]
							  arr.push({ src: this.backUrl+s[0], link: u, info: mems[i][1], user: mems[i][4], id: mems[i][0]}, )
						  } else {
							  let s = mems[i][2].split(' ')
							  let u = "/memory/?id="+mems[i][0]
							  brr.push({ src: this.backUrl+s[0], link: u, info: mems[i][1], user: mems[i][4], id: mems[i][0]}, )
						  }
					   }
					   this.ifEmpty = true
					   this.imgsArr = arr
					   this.fetchImgsArr = brr
				    } else {
				      this.$message.error({
				        message: '获取失败',
				        showClose: true,
				        type: 'error'
				      })
				    }
				  },
				  (response) => {
				    this.$message.error({
				      message: '获取失败',
				      showClose: true,
				      type: 'error'
				    })
				  }
				  )
			},
			 clickFn(event, { index, value }) {
			    // 阻止a标签跳转
			    event.preventDefault()
					let id = value.id
			      this.$router.push({
					path: `/memory/${id}`,
				  })
			  },
			pullDown(e){
				// 监听该组件的滚动
				let scrollTop = document.getElementsByClassName('vue-waterfall-easy-scroll')[0].scrollTop;
				this.moveTime++;
				// 当滚动到顶部的时候触发
				if(scrollTop == 0){
				  if(this.moveTime == 1){
					 if(this.moveTime%2 == 1){
					 // 记录下初始点的Y轴位置
					 this.pullStart = e.touches[0].pageY;		
					 }
				  }
				  // 记录下移动后点的Y轴位置 和 Y轴移动距离
				  this.pullMove = e.touches[0].pageY;						
				  this.pullDistance = this.pullMove - this.pullStart;		
			
				  // 如果计算出距离为负数则规定移动位置为0 重新确定初始点位置
				  if(this.pullDistance < 0){					
					this.moveTime = 0;
				  } else {
					// 可以理解为移动速度，防止手指移动到屏幕底端,下拉刷新跟到底端的情况发生
					let moveSpeed = this.pullDistance/2;
					this.ifUp = false;
					this.ifReload = "下拉刷新";
					this.contentMove = "translate3d(0px, " + moveSpeed + "px, 0px)";
					this.moveTop = (moveSpeed - 50) + "px";
					if(this.pullDistance >= 200){
					  this.ifReload = "释放刷新";
					  // console.log("ok");
					}
				  }
			    }
			  },
			  // 点击屏幕
			  pullDownStart(e){
				this.moveTime = 0;
			  },
			  // 结束下拉（手指离开）
			  endMove(){
				this.ifUp = true;
				if(this.pullDistance < 200){
				  this.contentMove = "translate3d(0px, " + 0 + "px, 0px)";
				  this.moveTop = -50 + "px";
				} else {
				  this.contentMove = "translate3d(0px, " + 50 + "px, 0px)";
				  this.moveTop = 0 + "px";
				  this.ifReload = "加载中";
				  // ...调用接口获取数据，成功后 ↓
				  this.imgsArr = this.initImgsArr(0,6);
				  this.ifReload = "加载完成";
				  setTimeout(()=>{
					this.contentMove = "translate3d(0px, " + 0 + "px, 0px)";
					this.moveTop = -50 + "px";
					console.log("完成刷新");
				  },1000);
				}
			  },
			  // 获取图片
			  initImgsArr(the, n, m){
				if(this.ifEmpty){
					console.log('已取完')
				} else {
					let mems = []
					let arr = []
					this.$axios.post('/api/getM',
					{
						n: n,
						m: m
					}
					)
					  .then((response) => {
					    if (response.data.flag == 'success') {
							mems = response.data.content
							if(mems.length<this.step){
								this.ifEmpty = true
							}
							for(let i =0; i <mems.length ; i++){
								let s = mems[i][2].split(' ')
								let u = "/memory/?id="+mems[i][0]
								arr.push({ src: this.backUrl+s[0], link: u, info: mems[i][1], user: mems[i][4], id: mems[i][0]}, )
							}
							if(the === 1){
								this.imgsArr = arr
							} else {
								this.fetchImgsArr = arr
							}
					    } else {
							this.$message.error({
								message: '获取失败',
								showClose: true,
								type: 'error'
							})
					    }
					  },
					  (response) => {
					    this.$message.error({
							message: '获取失败',
							showClose: true,
							type: 'error'
					    })
					  }
					  )
				}
			  },
			  //获取新的图片数据的方法，用于页面滚动满足条件时调用
			  fetchImgsData(){
			  if(this.ifEmpty){
				console.log('已取完')
			  } else {
				this.imgsArr = this.imgsArr.concat(this.fetchImgsArr);
				this.m += this.step
				this.n += this.step
				this.initImgsArr(2, this.n, this.m);
				}
			  },
			close(){
				this.dialogFormVisible=false
			}
		},
		created () {
			if(this.getword == ''){
				this.m += this.step
				this.initImgsArr(1, this.n, this.m);
				// 模拟每次请求的下一批新的图片的数据
				this.m += this.step
				this.n += this.step
			　  this.initImgsArr(2, this.n, this.m);
			} else {
				this.find(this.getword)
				this.findname = this.getword
			}
		}
	}
</script>

<style lang="scss">
	#test{
		height: 100vh;
	
	    .pullDown{
		  position: absolute;
		  left: 0;
		  width: 100%;
		  text-align: center;
	
		  p{
		    font-size: 14px;
		    padding: 20px 0;	
	        width: 100%;
		  }
	    }
	
	    .moveUpAnimate{
		  transition: 200ms ease all;
		  -webkit-transition: 200ms ease all;
	    }
	  }
</style>
