import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home/home' // 欢迎页
import search from '@/components/search/search' // 搜索歌曲
import iconfont from '@/components/iconfont/iconfont'
import rankingList from '@/components/ranking/rankingList' // 排行榜list
import rankingDatail from '@/components/ranking/rankingDatail' // 排行榜list
import Recommend from '@/components/Recommend/Recommend' // 推荐页
import musicPlay from '@/components/musicplay/musicPlay' // 播放器界面
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: home,
      meta: {
        title: '逸心丿-音乐',
        show: false
      }
    },
    
    {
      path: '/search',
      name: 'search',
      component: search,
      meta: {
        title: '搜索',
        show: true
      }
    },
    {
      path: '/iconfont',
      name: 'iconfont',
      component: iconfont
    },
    {
      path: '/rankingList',
      name: 'rankingList',
      component: rankingList,
      meta:{
        title: '逸心丿音乐',
        show: true
      }
    },
    {
      path: '/rankingDatail',
      name: 'rankingDatail',
      component: rankingDatail,
      meta:{
        title: '逸心丿音乐 -排行榜',
        show: false
      }
    },
    {
      path: '/Recommend',
      name: 'Recommend',
      component: Recommend,
      meta:{
        title: '推荐音乐',
        show: true
      }
    },
    {
      path: '/musicPlay',
      name: 'musicPlay',
      component: musicPlay,
      meta:{
        title: '逸心丿音乐',
        show: false
      }
    },
  ]
})