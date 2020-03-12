<template>
  <div id="app">
	    <el-row>
	      <el-col :span="24">
	        <div class="grid-content bg-purple-dark">
	          <div class="headline">
	            <!-- 路由跳转使用router-link比使用a要快很多很多 -->
	            <router-link to="/index"><img class="logo" src="./statics/logo.jpg"></router-link>
	            <router-link :to="loginlink" class="el-link" style="font-size:20px;margin-top:20px;" v-if="Flag">登录/注册</router-link>
	            <div class="time">{{timeNow}}</div>
	            <div class="city"><i class="el-icon-location" id="location"></i>上海</div>
	            <el-popover
	                ref="popover"
	                placement="bottom"
	                width="360"
	                trigger="click">
	                <el-table :data="gridData" height="235" @row-click="call">
	                  <el-table-column width="80" property="name" label="消息来源"></el-table-column>
	                  <el-table-column width="150" property="content" label="内容"></el-table-column>
	                  <el-table-column width="80" property="time" label="时间"></el-table-column>
	                  <el-table-column
	                        fixed="right"
	                        label="操作"
	                        width="50">
	                        <template slot-scope="scope">
	                          <el-button
	                            type="text"
	                            size="small">
	                            移除
	                          </el-button>
	                        </template>
	                      </el-table-column>
	                </el-table>
	              </el-popover>
	            <el-badge :value="notices" class="item" id="noticebox" style="padding: 0;margin: 20px;" :hidden="noticeflag">
	              <div class="box" style="cursor: pointer" v-popover:popover><i class="el-icon-bell" id="notice"></i></div>
	            </el-badge>
				<el-dialog
				  :visible.sync="dialogFormVisible"
				  :before-close="handleClose">
				  <chat v-if="chated" :aim_user="aim_user"></chat>
				</el-dialog>
	          </div>
	        </div>
	      </el-col>
	    </el-row>
	    <router-view/>
  </div>
</template>
<script>
import index from './components/Index.vue'
import login from './components/loginform.vue'
import chat from './components/chat.vue'
let moment = require('moment')
export default {
  name: 'App',
  data () {
    return {
		dialogFormVisible: false,
      Flag: true,
	  loginlink: '/login',
	  hellouseer: '',
	  timeNow: '',
	  gridData: [],
	  aim_user: '',
	  noticeflag: true,
	  user: '',
	  aim_user: '',
	  chated: false,
    }
  },
  sockets: {
    // 通信的name
    // 这里是监听connect事件
    connect: function () {
      this.id = this.$socket.id
      // alert('建立连接')
      console.log('我的id', this.user)
      this.$socket.emit('my_id', this.user)
    },
    disconnect: function () {
      console.log('断开连接')
    },
    reconnect: function () {
      console.log('重新连接')
      this.$socket.emit('conect')
    },
    server_response: function (data) {
      console.log('接收数据', data)
    },
    server_notice: function (data) {
      console.log('ddddddddddddddd', data)
      this.gridData.push(data)
    },
    send_message: function (data) {
      this.$socket.emit('message', data)
    }
  },
  components: {
    index: index,
    login: login,
	chat: chat
  },
  computed: {
    listenFlag () {
      return this.$store.state.isLogin
    },
    notices () {
      return this.gridData.length
    }
  },
  methods: {
	  call (row, column, cell, event) {
	    if (column.label === '操作') {
	      this.gridData.splice(row, 1)
	    } else if (row.name === '系统') {
	      console.log(1)
	    } else {
	      this.aim_user = row.name
	      this.chated = true
	      this.dialogFormVisible = true
	    }
	  },
	handleClose (done) {
	  let i = 0
	  for (; i < this.gridData.length;) {
	    if (this.gridData[i].name === this.aim_user) {
	      this.gridData.splice(i, 1)
	    } else {
	      i += 1
	    }
	  }
	  this.chated = false
	  this.dialogFormVisible = false
	  this.$socket.emit('my_aim', this.user + ' ' + this.$store.state.aim_user)
	}
  },
  watch: {
    listenFlag: function (thenew, theold) {
      if (theold === false && thenew === true) {
        this.Flag = false
		this.user = localStorage.getItem('UserName')
		this.$socket.connect()
      } else {
        this.Flag = true
		this.$socket.disconnect()
      }
    },
	notices: function (thenew, theold) {
	  if (thenew === 0) {
	    this.noticeflag = true
	  } else {
	    this.noticeflag = false
	  }
	}
  },
  mounted () {
    this.user = localStorage.getItem('UserName')
    let islogin = this.$store.state.isLogin
	this.timeNow = moment().utc().format('YYYY年MM月DD日') + ' ' + moment().utc().format('dddd')
    if (islogin === true) {
	  this.$socket.connect()
      this.Flag = false
    } else {
      this.Flag = true
	  this.$socket.disconnect()
    }
  }
}
</script>

<style>
 body{
     margin: 0;
     /*background-color: rgb(245,245,245);*/
   }
 #app {
   font-family: 'Avenir', Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   text-align: center;
   width: 100%;
   height:auto;
 }
 /*.el-row {*/
 /*  margin-bottom: 20px;*/
 /*  &:last-child {*/
 /*    margin-bottom: 0;*/
 /*  }*/
 /*}*/
 .el-col {
   border-radius: 4px;
 }
 .grid-content {
   background:#fff;
 }
 .headline {
   width:100%;
   height:70px;
   padding-top: 10px;
   padding-bottom: 10px;
   margin:0 auto;
 }
 .logo {
   height:95%;
   float:left;
   margin-left: 100px;
 }
 .el-link {
   padding:10px;
   font-size:20px;
   color: #E16D00;
   margin-top: 10px;
 }
 #location {
   font-size:24px;
   color:#E16D00;
   margin-top: 10px;
 }
 #notice {
   font-size:24px;
   color:#E16D00;
 }
 .city {
   float:right;
   padding:10px;
   font-size:20px;
   margin-left:40px;
 }
 #noticebox {
   float:right;
   font-size:20px;
   margin:10px;
 }
 .time {
   float:right;
   padding:10px;
   font-size:18px;
   margin-top: 12px;
 }
</style>
