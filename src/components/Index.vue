<template>
<div class="bigbox">
  <el-row class="tac">
   <el-col>
     <el-menu
       default-active="2"
       class="el-menu-vertical-demo"
       @select="handleSelect">
          <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span slot="title">地图选择</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">精选记忆</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-document"></i>
            <span slot="title">个人中心</span>
          </el-menu-item>
          <el-menu-item @click="logout()" >
            <i class="el-icon-setting"></i>
            <span slot="title">登出</span>
          </el-menu-item>
     </el-menu>
   </el-col>
 </el-row>
 
  <div class="content">
    <div v-if="Flag === '1'">
		<mapp :gotomemory="gotomemory"></mapp>
    </div>
    <div v-if="Flag === '2'">
		<memory :getword="getword"></memory>
    </div>
    <div v-if="Flag === '3'">
		<userCenter></userCenter>
    </div>
  </div>
 
</div>
</template>

<script>
import mapp from './map.vue'
import memory from './memory.vue'
import userCenter from './userCenter.vue'
export default {
  name: 'ndex',
  components: {
	  mapp,
	  memory,
	  userCenter,
  },
  methods: {
    logout () {
      this.$store.dispatch('userLogout')
      this.$message({
        showClose: true,
        message: '登出成功',
        type: 'success'
      })
      localStorage.removeItem('User')
      localStorage.removeItem('UserName')
      localStorage.removeItem('userPhone')
      localStorage.removeItem('User_avatar')
    },
    handleSelect(key, keyPath) {
      this.Flag = key
    },
    chooseModule (moduleName) {
      this.$axios.post('/api/task/findTaskByTags',
        {
          tags: moduleName
        }).then((response) => {
        if (response.data.Status === 'right') {
          this.taskList = response.data.task_omitinfo
        } else {
          alert(response.data.Details)
        }
      })
        .catch((error) => {
          console.log(error)
        })
    },
    gotoDetails (id) {
      let type = 'published'
      this.$axios.post('/addHistory', {
        'task_id': id,
        'user_name': localStorage.getItem('UserName')
      }).then((response) => {
        console.log(response.data)
      })
        .catch((error) => {
          console.log(error)
        })
      this.$router.push({
        path: `/taskdetails/${type}/${id}`
      })
    },
	gotomemory(word){
		this.getword = word
		this.Flag = '2'
	},
    Init () {
      this.$axios.post('/api/task/latest').then((response) => {
        this.taskList = response.data.latest
      })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  data () {
    return {
      Flag: '2',
	  getword: ''
    }
  }
}
</script>

<style scoped>
  .bigbox {
    width: 100%;
  }
  .tac {
    float: left;
    width: 200px;
	margin-left:50px;
	margin-top:50px;
  }
  .tac span {
    font-size:20px;
  }
  .content {
    float: left;
    width: 1000px;
  }
</style>
