<template>
	<div style="width:1000px;height:auto;margin:30px auto;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
		<div class="title" style="width:1000px;height:60px;margin:0 auto;padding-top:10px">
			<el-row>
			  <h4 style="margin: 0px;">{{mData[0]}}</h4>
			</el-row>
			<el-row>
				<el-col :span="8">
					<div style="float:left;padding:5px;margin-left:30px">
						来自：<span style="color:#E16D00;">{{mData[3]}} </span> 
					<span style="color:#999999;font-size:14px;margin-left:10px"> {{dateFormat(time)  }}</span>
					
					</div>
				</el-col>
				<el-col :span="8">
					<el-tag v-for="place in mData[2].split(',')" :key="place" style="margin-left:3px">{{place}}</el-tag>
				</el-col>
				<el-col :span="8">
					<div style="float:left;padding:5px;margin-left:30px;font-size:24px;color:#E16D00">
						<i class="el-icon-star-on" style="cursor: pointer;" @click="offStar" v-if="star"></i>
						<i class="el-icon-star-off" style="cursor: pointer;" @click="onStar" v-else></i>
					</div>
				</el-col>
				</el-row>
			
		</div>
		<div class="pic" style="width:100%;border-bottom:1px solid rgba(0,0,0,.1);border-top:1px solid rgba(0,0,0,.1);">
			<div v-for="url in picurls" :key="url" style="width:100%">
				<el-image  
				:src="url" 
				:preview-src-list="picurls"
				lazy>
				</el-image>
			</div>
		</div>
		<div class="zhengwen" style="text-align:left;width:100%;border-bottom:1px solid rgba(0,0,0,.1);border-top:1px solid rgba(0,0,0,.1);text-indent: 2em;">
			<div style="text-align:left;width:80%;margin:20px auto;">{{mData[4]}}</div>
			
		</div>
		<div class="comment">
			<el-row v-for="comment in comments" :key="comment[2]" 
			style="border-bottom:1px solid rgba(0,0,0,.1);padding:15px;padding-top:5px;padding-bottom:10px;width:80%;margin:0 auto">
				<el-row>
					<el-col :span="2" style="text-align:left">
						<span style="color:#E16D00;font-size:14px;"><i class="el-icon-user"></i>{{comment[0]}}</span>
					</el-col>
					<el-col :span="5" style="text-align:left">
						<span style="color:#999999;font-size:14px;">{{dateFormat(comment[2])  }}</span>
					</el-col>
				</el-row>
				<div style="text-align: left;margin-top:9px;font-size:18px">{{comment[1]}}</div>
			</el-row>
			<div style="width:80%; height:auto;margin:0 auto">
				<el-input 
				  v-model="input"
				  type="textarea"
				  :rows="2"
				  placeholder="请输入内容">
				</el-input>
				<div style="width:98%;height:40px">
					<el-button @click="send" style="float:right;width:90px;height:40px;" type="success">发送</el-button>
					<el-button @click="reindex" style="float:right;width:90px;height:40px;margin-right:10px;" type="primary" plain>返回</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import moment from 'moment'
	
	export default {
		name: 'memoryDetails',
		data(){
		   return {
			    mData: [],
				time: '',
				picurls: [],
				flag: true,
				input: '',
				comments: [],
				star: false
			}
		},
		methods: {
			onStar(){
				this.$axios.post('/api/onS',
				{
					idd: this.$route.params.id,
					phone: localStorage.getItem('userPhone')
				}
				)
				  .then((response) => {
				    if (response.data.flag == 'success') {
					   this.star = true
					   this.$socket.emit('getstar', this.$route.params.id + ' ' + this.mData[3])
					   this.$message.success({
					     message: '已收藏',
					     showClose: true,
					     type: 'success'
					   })
				    } else {
				      console.log("star load failed")
				    }
				  },
				  (response) => {
				    console.log("star load failed")
				  }
				  )
			},
			offStar(){
				this.$axios.post('/api/offS',
				{
					idd: this.$route.params.id,
					phone: localStorage.getItem('userPhone')
				}
				)
				  .then((response) => {
				    if (response.data.flag == 'success') {
					   this.star = false
					   this.$message.success({
					     message: '取消收藏',
					     showClose: true,
					     type: 'success'
					   })
				    } else {
				      console.log("star load failed")
				    }
				  },
				  (response) => {
				    console.log("star load failed")
				  }
				  )
			},
			 dateFormat(dateStr,pattern = "YYYY-MM-DD") {
			   return moment(dateStr).format(pattern);
			 },
			send(){
				this.$axios.post('/api/sendComment',
				{
					idd: this.$route.params.id,
					comment: this.input,
					phone: localStorage.getItem('userPhone')
				}
				)
				  .then((response) => {
				    if (response.data.flag == 'success') {
				       this.$message.success({
				         message: response.data.details,
				         showClose: true,
				         type: 'success'
				       })
					   this.loadC()
					   this.$socket.emit('gettask', this.$route.params.id + ' ' + this.mData[3])
				    } else {
				      this.$message.error({
				        message: response.data.details,
				        showClose: true,
				        type: 'error'
				      })
				    }
				  },
				  (response) => {
				    this.$message.error({
				      message: '发送失败',
				      showClose: true,
				      type: 'error'
				    })
				  }
				  )
			},
			reindex(){
				this.$router.go(-1)
			},
			loadS(){
				this.$axios.post('/api/getS',
				{
					idd: this.$route.params.id,
					phone: localStorage.getItem('userPhone')
				}
				)
				  .then((response) => {
				    if (response.data.flag == 'true') {
					   this.star = true
				    } else {
				      this.star = false
				    }
				  },
				  (response) => {
				    console.log("star load failed")
				  }
				  )
			},
			loadC(){
				this.$axios.post('/api/getC',
				{
					idd: this.$route.params.id
				}
				)
				  .then((response) => {
				    if (response.data.flag == 'success') {
					   this.comments = response.data.comments
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
			loadM(){
				this.$axios.post('/api/getMD',
				{
					idd: this.$route.params.id
				}
				)
				  .then((response) => {
				    if (response.data.flag == 'success') {
				       this.mData = response.data.content
					   this.time = this.mData[5]
					   let temp = this.mData[1].split(' ')
					   for(let i=0;i<temp.length;i++){
						   if( temp[i].length>0){
							   this.picurls.push('/api'+temp[i])
						   }
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
		mounted() {
			this.loadM()
			this.loadC()
			this.loadS()
		}
	}
</script>

<style>
	
</style>