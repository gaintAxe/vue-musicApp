<template>
<div style="">
    <scroll class="rank" :data="rankdata" ref="ranklist" >
        <div class="toplist" v-show="rankdata.length">
            <ul v-for="v in rankdata" :key="v.id"  @click="onclick_todetail(v)" >
                <li class="item">
                    <div class="icon">
                        <img v-lazy="v.picUrl" alt="" width="100" height="100">
                    </div>
                    <ul class="songlist" >
                        <li class="song" v-for="(song,index) in v.songList" :key="index">
                            <span>{{index+1}}</span>
                            <span>{{song.songname}}-{{song.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="loading-container" v-show="!rankdata.length">
            <Loading></Loading>
        </div>
    </scroll>
    
    <Trans_fade name="translateTd" >
        <router-view></router-view>
    </Trans_fade>
</div>
</template>

<script>
import Loading from '@/base/loading/Loading'
import Scroll from '@/base/scroll/Scroll'
import {getTopList} from'@/api/rank.js';
import {ERR_OK} from 'api/config.js'
import {playlistMixin} from 'common/js/mixin.js'
import Trans_fade from '@/base/trans/Trans_fade'
export default {
    name:'Rank',
    mixins:[playlistMixin],
    components:{Scroll,Trans_fade,Loading},
    data(){
        return {
            rankdata:[]
        }
    },
    methods:{
        onclick_todetail(item){
            this.$store.dispatch('set_v_action',[['rankv',item],['backname','rank']]);
            // this.$store.dispatch('actions_backname','rank');
           this.$router.push('/rank/'+item.id);
        },
        _getTopList(){
            getTopList().then((res)=>{
                if(res.code==ERR_OK){
                    this.rankdata=res.data.topList;
                }
                // console.log(res);
            })
        },
        handlePlaylist(playlist){
            const bottom=playlist.length>0 ?'60px':'';
            // console.log(this.$refs.ranklist);
            this.$refs.ranklist.$el.style.bottom=bottom;
            // this.$refs.ranklist.refresh();
        }
    },
    created(){
        this._getTopList();
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    overflow: hidden
    .toplist
    //   height: 100%
      
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
.loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
