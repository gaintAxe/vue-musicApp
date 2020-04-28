import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// import Rank from '@/components/rank/Rank';
// import Recommend from '@/components/recommend/Recommend';
// import Search from '@/components/search/Search';
// import Singer from '@/components/singer/Singer';
// import SingerDetail from '@/components/singer/components/detail/Detail'
// import RecommendDetail from '@/components/recommend/components/detail/Detail'
// import RankDetail from '@/components/rank/components/detail/Detail'
Vue.use(Router)

const Recommend = (resolve) => {
  import('@/components/recommend/Recommend').then((module) => {
    resolve(module)
  })
}
const Rank = (resolve) => {
  import('@/components/rank/Rank').then((module) => {
    resolve(module)
  })
}
const Search = (resolve) => {
  import('@/components/search/Search').then((module) => {
    resolve(module)
  })
}
const Singer = (resolve) => {
  import('@/components/singer/Singer').then((module) => {
    resolve(module)
  })
}
const SingerDetail = (resolve) => {
  import('@/components/singer/components/detail/Detail').then((module) => {
    resolve(module)
  })
}
const RecommendDetail = (resolve) => {
  import('@/components/recommend/components/detail/Detail').then((module) => {
    resolve(module)
  })
}
const RankDetail = (resolve) => {
  import('@/components/rank/components/detail/Detail').then((module) => {
    resolve(module)
  })
}



export default new Router({
  routes: [
    {
      path: '/',
      name: 'Recommend',
      component: Recommend
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      children:[{
        path:':id',
        component:SingerDetail
      }]
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank,
      children:[{
        path:':id',
        component:RankDetail
      }]
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend,
      children:[{
        path:':id',
        component:RecommendDetail
      }]
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children:[{
        path:':id',
        component:SingerDetail
      }]
    }
  ]
})
