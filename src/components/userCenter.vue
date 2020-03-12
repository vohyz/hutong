<template>
	<div>
		<el-row>
			<el-col :span="4">
				<el-upload
				  class="avatar-uploader"
				  action="/api/tes"
				  :show-file-list="false"
				  :on-success="handleAvatarSuccess"
				  :before-upload="beforeAvatarUpload"
				  >
					<img v-if="src" :src="src" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon" style="line-height: 100px;"></i>
				</el-upload>
			</el-col>
			<el-col :span="8" style="text-align: left;font-size:24px">
				<el-row>
					{{userName}}
				</el-row>
				<el-row style="margin-top:50px">
					<el-col :span="8">
						<i class="el-icon-picture" style="color:#E16D00"></i>{{memory.length}}
					</el-col>
					<el-col :span="8">
						<i class="el-icon-star-off" style="color:#E16D00"></i>{{star.length}}
					</el-col>
				</el-row>
			</el-col>
		</el-row>
		<el-row>
			<el-card class="box-card">
				<el-row style="text-align: left;">
					<h4 style="margin:0">我的记忆</h4>
				</el-row>
				<div class="cardin" v-for="mem in memory" :key="mem[0]">
						<img 
						:src="'/api'+mem[3].split(' ')[0]" 
						@click="clickFn(mem[0])"
						style="width:200px;height:130px;border-radius: 6px;position:relative;cursor: pointer;">
						</img>
					<el-row>{{mem[1]}}</el-row>
				</div>
			</el-card>
		</el-row>
		<el-row>
			<el-card class="box-card">
				<el-row style="text-align: left;">
					<h4 style="margin:0">我的收藏</h4>
				</el-row>
				<div class="cardin" v-for="s in star" :key="s[0]" >
						<img
						:src="'/api'+s[2].split(' ')[0]" 
						@click="clickFn(s[0])"
						style="width:200px;height:130px;border-radius: 6px;position:relative;cursor: pointer;"
						@mouseover="on1(s[0],s)"
						>
						</img>
						<div v-if="flag == s[0]" 
						@mouseout="off1(s)"
						@click="clickFn(s[0])"
						style="width:200px;
						height:130px;
						border-radius: 6px;
						position:relative;
						left:0;top:-130px;
						background: rgba(0,0,0,0.3);
						color:#FFFFFF;
						font-size:16px;cursor: pointer;">
						<el-row style="padding:5px;" >作者：{{s[5]}}</el-row>
						<el-row style="padding:5px;">上传日期：{{dateFormat(s[3])}}</el-row>
						<el-row style="padding:5px;">所在地：{{s[4]}}</el-row>
						</div>
					<el-row :style="s[6]">{{s[1]}}</el-row>
				</div>
			</el-card>
		</el-row>
	</div>
</template>

<script>
	import moment from 'moment'
	export default {
		name: 'userCenter',
		data () {
			return {
				src: false,
				userName: '',
				userData: [],
				memory: [],
				star: [],
				flag : 0,
				sstyle: 'position:relative;top:0px;',
				n64: ''
			}
		},
		methods: {
			dateFormat(dateStr,pattern = "YYYY-MM-DD") {
			  return moment(dateStr).format(pattern);
			},
			clickFn(id){
				this.$router.push({
					path: `/memory/${id}`,
				})
			},
			off1(s){
				this.flag = -1
				s[6] = 'position:relative;top:0px;'
			},
			on1(flag,s){
				this.flag = flag
				s[6] = 'position:relative;top:-130px;'
			},
			init(){
				this.userName = localStorage.getItem('userName')
				this.$axios.post('/api/userCenter',
				{
					phone: localStorage.getItem('userPhone')
				}
				)
				  .then((response) => {
				    if (response.data.flag == 'success') {
						this.memory = response.data.memory
						this.star = response.data.star
						for(let i=0;i<this.star.length;i++){
							this.star[i].push('position:relative;top:0px;')
						}
				    } else {
				      this.$message.error({
				        message: '获取失败',
				        showClose: true,
				        type: 'error'
				      })
				    }
				})
			},
			handleAvatarSuccess (res, file) {
			  this.src = 'data:image/jpeg;base64,' + localStorage.getItem('User_avatar')
			  this.$axios.post('/api/avatar',
			  {
			  	phone: localStorage.getItem('userPhone'),
				avt: this.n64
			  }
			  )
			    .then((response) => {
			      if (response.data.flag == 'success') {
					  console.log('success')
			      } else {
			        this.$message.error({
			          message: '上传失败',
			          showClose: true,
			          type: 'error'
			        })
			      }
			  })
			},
			beforeAvatarUpload (file) {
			  const isJPG = file.type === 'image/jpeg'
			  const isLt2M = file.size / 1024 / 1024 < 2
			  if (!isJPG) {
			    this.$message.error('上传头像图片只能是 JPG 格式!')
			  }
			  if (!isLt2M) {
			    this.$message.error('上传头像图片大小不能超过 2MB!')
			  }
			  var reader = new FileReader()
			  reader.readAsDataURL(file)
			  reader.onload = (e)=> {
			    let imgFile = e.target.result
			    let arr = imgFile.split(',')
				this.n64 = arr[1]
			    localStorage.setItem('User_avatar', arr[1])
			  }
			  return isJPG && isLt2M
			}
		},
		created() {
			if(localStorage.getItem('User_avatar')){
			this.src = 'data:image/jpeg;base64,' + localStorage.getItem('User_avatar')}
			this.init()
		}
	}
</script>

<style>
	.cardin {
		width: 200px;
		height: 200px;
		text-align: left;
		margin: 5px;
		float: left;
	}
	.cardin>img{
		width:200px;
		height:130px;
		border-radius: 6px;
	}
	.avatar-uploader .el-upload {
	  border: 1px dashed #d9d9d9;
	  border-radius: 6px;
	  cursor: pointer;
	  position: relative;
	  overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
	  border-color: #409EFF;
	}
	.avatar-uploader-icon {
	  font-size: 28px;
	  color: #8c939d;
	  width: 110px;
	  height: 100px;
	  line-height: 100px;
	  text-align: center;
	}
	.avatar {
	  width: 100px;
	  height: 100px;
	  display: block;
	}
	.container {
	  width: 80%;
	  min-width:1005px;
	  margin: 0 auto;
	}
	.leftmenu {
	  float: left;
	  width: 200px;
	}
	.rightcontent {
	  float: left;
	  width: 750px;
	  margin-left:50px;
	}
	.block {
	  border-right: solid 1px #e6e6e6;
	  list-style: none;
	  position: relative;
	  margin: 0;
	  padding: 10px;
	  background-color: #FFF;
	}
	.userimg {
	  width: 160px;
	  margin: 0 auto;
	  border-radius: 5px;
	}
	.box-card {
	    width: 95%;
		margin:0 auto;
		
		margin-top: 10px
	}
</style>
