<template>
  <div>
    <el-form :model="newform">
      <el-form-item label="标题" :label-width="formLabelWidth">
        <el-input v-model="newform.title" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="上传时间" :label-width="formLabelWidth">
      <el-date-picker
        v-model="newform.time"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期">
      </el-date-picker>
      </el-form-item>
      <el-form-item label="地点" :label-width="formLabelWidth">
        <el-cascader
          ref="cascaderAddr"
          v-model="newform.place"
          :options="options"
          :props="props"
          :show-all-levels="false"
          clearable>
        </el-cascader>
      </el-form-item>
      <el-form-item label="封面图" :label-width="formLabelWidth">
        <el-upload
          action="#"
          ref="fengmian"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview1"
          :auto-upload="false"
          :on-change="fileChange1"
          :limit="count">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible1">
          <img width="100%" :src="dialogImageUrl1" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="正文" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6}"
          placeholder="请输入正文"
          v-model="newform.content">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="upload()">确 定</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'newMemory',
    props: {
      close: {
        type: Function,
        default: null
      },
    },
    data() {
      return {
        dialogImageUrl1: '',
        dialogVisible1: false,
        formLabelWidth: '120px',
		props: { multiple: false },
        count: 5,
        newform: {
          title: '',
          time: '',
		  pics: [],
		  place: 1,
          content: '',
        },
		options: [{
		  value: 1,
		  label: '虹口区',
		  children: [{
		    value: 2,
		    label: '瑞庆里'
		  }, {
		    value: 3,
		    label: '麦加里'
		  }, {
		    value: 4,
		    label: '浙兴里'
		  }, {
		    value: 5,
		    label: '兴业北里'
		  }, {
		    value: 6,
		    label: '德兴里'
		  }, {
		    value: 7,
		    label: '兴业坊'
		  }, {
		    value: 8,
		    label: '永安里'
		  }, {
		    value: 9,
		    label: '公益坊'
		  }, {
		    value: 10,
		    label: '三多里'
		  }]
		}, {
		  value: 11,
		  label: '静安区',
		  children: [{
		    value: 12,
		    label: '同福里'
		  }]
		}, {
		  value: 13,
		  label: '黄浦区',
		  children: [{
		    value: 14,
		    label: '瑞康里'
		  }]
		}, {
		  value: 15,
		  label: '杨浦区'
		}]
      };
    },
    methods: {
      handlePictureCardPreview1(file) {
        this.dialogImageUrl1 = file.url;
        this.dialogVisible1 = true;
      },
      fileChange1(file) {
        this.newform.pics.push(file.raw);
      },
      upload () {
        let form = new FormData();
		
		let nodes = this.$refs['cascaderAddr'].getCheckedNodes()
		let i = 0
		let places = []
		for (i = 0; i < nodes.length; i++) {
		  places.push(nodes[i].pathLabels)
		}
		
		for(let i=0;i<this.newform.pics.length;i++){
			form.append('imgs',this.newform.pics[i])
		}
        form.append('content', this.newform.content);
        form.append('title', this.newform.title);
		form.append('place', places);
        form.append('updatetime', this.newform.time);
		form.append('userphone', localStorage.getItem('userPhone'));
        this.$axios.post('/api/uploadM',form,{headers: {'Content-Type': 'multipart/form-data;boundary=-----------------------------264141203718551'}})
          .then((response) => {
            if (response.data.flag == 'success') {
              this.$message.success({
                message: '上传成功',
                showClose: true,
                type: 'success'
              })
              this.close()
            } else {
              this.$message.error({
                message: '上传失败',
                showClose: true,
                type: 'error'
              })
            }
          },
          (response) => {
            this.$message.error({
              message: '上传失败',
              showClose: true,
              type: 'error'
            })
          }
          )
        }
    }
  }
</script>
