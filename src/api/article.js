import request from '@/utils/request'

// 获取文章分类
export const articleChannelService = () => request.get('/my/cate/list')

// 添加文章分类
export const articleAddChannelService = (data) => request.post('/my/cate/add', data)

// 编辑文章分类
export const articleEditChannelService = (data) => request.put('/my/cate/info', data)

// 删除文章分类
export const articleDelChannelService = (id) => request.delete('/my/cate/del', {
  params: { id }
})

// ---------------------

// 获取文章列表
export const articleGetService = (params) => request.get('/my/article/list', {
  params
})

// 添加文章
export const articlePubService = (data) => request.post('/my/article/add', data)

// 获取文章详情
export const articleDetailService = (id) => request.get('/my/article/info', {
  params: { id }
})

// 编辑文章
export const articleEditService = data => request.put('/my/article/info', data)

// 删除文章
export const articleDelService = (id) => request.delete('my/article/info', { 
  params: { id } 
})

