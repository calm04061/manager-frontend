import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: resolve => require(['@/views/dashboard/Index'], resolve),
      children: [
        {
          name: 'Dashboard',
          path: '',
          component: resolve => require(['@/views/dashboard/Dashboard'], resolve),
        },
        {
          name: '财务平台表单',
          path: 'finance/platform/:type?/:id?',
          component: resolve => require(['@/views/finance/platform'], resolve),
        },
        {
          name: '平台账号表单',
          path: 'finance/account/:type?/:id?',
          component: resolve => require(['@/views/finance/account'], resolve)
        },
        {
          name: '流水记录',
          path: 'finance/finance/:type?/:id?',
          component: resolve => require(['@/views/finance/finance'], resolve)
        },
        {
          name: '账号列表',
          path: 'account/account/:type?/:id?',
          component: resolve => require(['@/views/account/account'], resolve)
        }, {
          name: '我',
          path: 'account/info',
          component: resolve => require(['@/views/account/info'], resolve)
        }, {
          name: '文件系统配置',
          path: 'config/fs/:type/:id?',
          component: resolve => require(['@/views/config/fs'], resolve)
        }, {
          name: '任务管理',
          path: 'task/:type?/:id?/:taskType?',
          component: resolve => require(['@/views/task/task'], resolve)
        },
      ],
    },
  ],
})
