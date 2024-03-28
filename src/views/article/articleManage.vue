<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button @click="onAddArticle" type="primary">添加文章</el-button>
    </template>
    <!-- 表单 -->
    <el-form inline>
      <el-form-item label="文章分类:">
        <!-- label展示给用户看的，value是提交给后台的 -->
        <channelSelect v-model="params.cate_id"></channelSelect>
      </el-form-item>
      <el-form-item label="发布状态:">
        <el-select style="width: 240px" v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="onSearch">搜索</el-button>
        <el-button plain @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row, $index }">
          <el-button :icon="Edit" @click="onEditArticle(row, $index)" type="primary" plain>编辑</el-button>
          <el-button :icon="Delete" @click="onDelArticle(row, $index)" type="danger" plain>删除</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="无数据"></el-empty>
      </template>
    </el-table>


    <!-- 分页 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      :page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 30px; justify-content: right;"
    />

    <articleEdit ref="articleEditRef" @success="onSuccess"></articleEdit>
  </page-container>
</template>

<script setup>
  import { Edit, Delete } from '@element-plus/icons-vue'
  import channelSelect from './components/channelSelect.vue'
  import { ref } from 'vue'
  import { articleGetService, articleDelService } from '@/api/article'
  import { formatTime } from '@/utils/format.js'
  import articleEdit from './components/articleEdit.vue'

  const loading = ref(false)
  const articleList = ref([])
  const total = ref(0)
  const params = ref({
    pagenum: 1,
    pagesize: 5,
    cate_id: '',
    state: ''
  })

  const getArticleList = async() => {
    loading.value = true
    const res = await articleGetService(params.value)
    articleList.value = res.data.data
    total.value = res.data.total
    loading.value = false
  }
  getArticleList()

  const onSizeChange = (size) => {
    params.value.pagenum = 1
    params.value.pagesize = size
    getArticleList()
  }

  const onCurrentChange = (page) => {
    params.value.pagenum = page
    getArticleList()
  }

  const articleEditRef = ref()
  const onAddArticle = () => {
    articleEditRef.value.open({})
  }

  const onEditArticle = (row) => {
    articleEditRef.value.open(row)
  }

  const onDelArticle = async(row) => {
    await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    await articleDelService(row.id)
    ElMessage.success('删除成功！')
    getArticleList()
  }  

  const onSearch = () => {
    params.value.pagenum = 1
    getArticleList()
  }

  const onReset = () => {
    params.value.pagenum = 1
    params.value.cate_id = ''
    params.value.state = ''
    getArticleList()
  }

  const onSuccess = (type) => {
    if (type === 'add') {
      const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
      params.value.pagenum = lastPage
    }
    getArticleList()
  }
</script>

<style lang="scss" scoped>
</style>