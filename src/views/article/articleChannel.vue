<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel">添加分类</el-button>
    </template>
    
    <el-table :data="channelList" style="width: 100%" stripe v-loading="loading">
      <el-table-column label="序号" width="100" type="index" align="center"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称" align="center"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <!-- row是channelList的一项， $index 下标 -->
        <template #default="{ row, $index }">
          <el-button :icon="Edit" @click="onEditChannel(row, $index)" type="primary" plain>编辑</el-button>
          <el-button :icon="Delete" @click="onDelChannel(row, $index)" type="danger" plain>删除</el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="无数据"></el-empty>
      </template>
    </el-table>

    <channelEdit ref="dialog" @success="onSuccess"></channelEdit>
  </page-container>
</template>

<script setup>
  import { Edit, Delete } from '@element-plus/icons-vue'
  import { articleChannelService, articleDelChannelService } from '@/api/article.js'
  import channelEdit from './components/channelEdit.vue'
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'  

  const loading = ref(false)
  const channelList = ref([])
  const dialog = ref()

  const getChannelList = async() => {
    loading.value = true
    const res = await articleChannelService()
    channelList.value = res.data.data
    loading.value = false
  }
  getChannelList()

  const onEditChannel = (row) => {
    dialog.value.open(row)
  }

  const onDelChannel = async(row) => {
    await ElMessageBox.confirm('你确定要删除该分类吗？', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })
    await articleDelChannelService(row.id)
    ElMessage.success('删除成功！')
    getChannelList()
  }

  const onAddChannel = () => {
    dialog.value.open({})
  }

  const onSuccess = () => {
    getChannelList()
  }
</script>

<style lang="scss" scoped>
</style>