<template>
  <div id="app">

    <app-header></app-header>
    <app-tabs></app-tabs>
    <keep-alive>
      <router-view></router-view>
      <!-- recommend search rank singer 切换 -->
    </keep-alive>
    <Trans_fade name="opc">
        <AppPlayer></AppPlayer>
        
    </Trans_fade>
  </div>
</template>

<script>
import AppHeader from '@/components/header/Header'//引入头logo组件
import AppTabs from '@/components/tabs/Tabs'//引入切换组件
import AppPlayer from '@/components/player/Player'//引入播放器组件

import Trans_fade from 'base/trans/Trans_fade';
export default {
  name: 'App',
  components:{
    AppHeader,AppTabs,AppPlayer,Trans_fade
  }
}
</script>

<style lang="stylus" scoped>


</style>
