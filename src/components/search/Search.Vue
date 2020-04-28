<template>
    <div class="search">
        <div class="search-box-wrapper">
            <Searchbox @getQuery="getQueryaction" ref="searchbox" :isnofocus="isnofocus"></Searchbox>
           
        </div>
       
        <div  ref="shortcut"  class="shortcut-wrapper" v-show="!query">
             
            <Scroll class="shortcut" :data="shortcut" ref="shorecut"> 
                <div>
                    <div class="hot-key">
                    <h1 class="title">
                        热门搜索
                    </h1>
                    <ul>
                        <li class="item" v-for="(item,ind) in hotkey" :key="ind" @click="setquery(item.k)">
                            <span>{{item.k}}</span>
                        </li>
                    </ul>
                </div>
                <div class="search-history" v-if="history.length">
                    <h1 class="title">
                        <span class="text">搜索历史</span>
                        <span class="clear"  @click="delall">
                            <i class="icon-clear"></i>
                        </span>
                       
                    </h1>
                     <Searchlist :searches="history" @clickitem="setquery"
                        @delsearchhistory="delsearchhistory"></Searchlist>
                </div>
                </div>
            </Scroll>
        </div>
        
        <div class="search-result" v-show="query" ref="searchres">
            <suggest :query='query' @tosingerDetail="tosingerDetail" @nofocus="nofocus" @updatahistory="updatahistory"></suggest>
        </div>
        <Conform  text="是否清空所有搜索历史" confirmBtnText="清空" ref="conform"
            @cancel="cancel" @confirm="confirm"></Conform>
        <Trans_fade>
        <router-view></router-view>
        </Trans_fade>
    </div>
        
    
</template>

<script>
import Searchbox from '@/base/searchbox/Searchbox';//搜索框组件
import Scroll from '@/base/scroll/Scroll';//Scroll
import Searchlist from '@/base/searchlist/Searchlist';//Searchlist
import Suggest from '@/components/suggest/Suggest';//搜索结果组件
import Trans_fade from '@/base/trans/Trans_fade'
import {getHotKey} from 'api/search.js';//获取热门搜索相关函数
import {ERR_OK}  from 'api/config';//成功标志
import {playlistMixin} from 'common/js/mixin.js' //引入 当有小屏播放器时，底部留出60px
import Conform from '@/base/Conform' //引入弹窗组件
export default {
    name:'Search',
    components:{
        Searchbox,Suggest,Trans_fade,Searchlist,Scroll,Conform
    },mixins:[playlistMixin],//使用 当有小屏播放器时，底部留出60px
    data(){
        return {
            query:'',
            hotkey:[],
            isnofocus:false,
            //Conform:false,//弹窗是否显示
        }
    },computed:{
        history(){return this.$store.state.searchHistory},
        cursong(){
          return this.$store.getters.cursong;
        },
        shortcut() {
            return this.hotkey.concat(this.history,this.query)
        }
    },methods:{
        //更新history
        updatahistory(name){
               this.$store.dispatch('set_searchHistory_action',name);
        },
        //拖动滚动条时使搜索框失去焦点
        nofocus(){
            this.isnofocus=true;
        },
        //点击歌手打开详情页
        tosingerDetail(data){
            //[['singerv',item],['backname','search']]
            this.$store.dispatch('set_v_action',data);
                // this.$store.dispatch('actions_backname','singer');
                this.$router.push('/search/'+data[0][1].id);
        },
        //从搜索框组件获取query
        getQueryaction(newQuery){
            this.query=newQuery;
        },
        //ajax获取热搜
        _getHotKey(){
            getHotKey().then((res)=>{
                // console.log(res.data.hotkey);
                this.hotkey=res.data.hotkey.slice(0,10);
            })
        },
        //点击更改query
        setquery(k){
            this.query=k;
            this.$refs.searchbox.getparentquery(this.query);
        },
        //删除history的一个值
        delsearchhistory(item){
            let data=this.history;
            data=data.filter(function(v){
                return v!==item
            });
            this.$store.dispatch('set_searchHistory_action',data);
        },
        //删除全部
        delall(){
            this.$refs.conform.show();
        },
        //点击清空删除
        confirm(){
             this.$store.dispatch('set_searchHistory_action',[]);
        },
        //点击取消
        cancel(){

        },
        //重写 当有小屏播放器时，底部留出60px
        handlePlaylist(playlist){
            const bottom=playlist.length>0 ?'60px':'';
            this.$refs.searchres.style.bottom=bottom;
            // console.log( this.$refs.shortcut);
            this.$refs.shortcut.style.bottom=bottom;
            this.$refs.shorecut.refresh();
        },
    },created(){
        this._getHotKey();
    },watch:{
        
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%

      
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
