<template>
    <transition name="list-fade">
    <div class="playlist"  v-show="showflag">
      <div class="list-wrapper" >
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode" ></i>
            <span class="text"></span>
            <span class="clear" ><i class="icon-clear"></i></span>
          </h1>
        </div>
        <Scroll ref="listContent"  class="list-content" :data="truePlayL">
          <!-- <transition-group ref="list" name="list" tag="ul"> -->
              <ul ref="list">
            <li ref="listItem" class="item"  v-for="(v,index) in truePlayL" :key="v.id" @click="onclickPlaysong_p(index)"
                >
              <i class="current" :class="getCurIcon(v)"></i>
              <span class="text">{{v.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span  class="delete" @click.stop="del(v)">
                <i class="icon-delete"></i>
              </span>
            </li>
          <!-- </transition-group> -->
              </ul>
        </Scroll>
        <div class="list-operate">
          <div  class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div  class="list-close" @click="hide()">
          <span>关闭</span>
        </div>
      </div>
      <conform ref="confirm"  text="是否清空播放列表" confirmBtnText="清空"></conform>
      
    </div>
  </transition>
</template>

<script>
import Conform from '@/base/Conform' //引入弹窗组件
import Scroll from '@/base/scroll/Scroll';//Scroll
import {MODE_SEQ,MODE_ONE,MODE_RANDOM} from '@/store/mode-type.js';
export default {
    name:"Playlist",
    components:{
        Scroll,Conform
    },data(){
        return {
            showflag:false
        }
    },props:{
        playlist:{
            default:[]
        },iconMode:{}
    },
    computed:{
        truePlayL(){
            // if(this.$store.state.playData.mode==MODE_RANDOM){
            //     return this.$store.state.playData.randomlist
            // }
            return  this.playlist;
        },
        cursong(){
          return this.$store.getters.cursong;
        },
    },methods:{
        show(){
            this.showflag=true;
            
            setTimeout(() => {
                // console.log(this.$refs.listContent.scroll);
                this.$refs.listContent.refresh();
                this.scrollToCursong();
            }, 20);
           
        },hide(){
            this.showflag=false;
        },changeMode(){
            
            this.$emit('changeMode');
            this.scrollToCursong();
            
        },onclickPlaysong_p(index){
                //  console.log(songs[0],index);
                //设置play的全局数据
                let option=[
                    ['curindex',index],
                    ['playlist',this.$store.state.playData.sequencelist],
                   
                    ['playing',true]
            ]
            if(this.$store.state.playData.curindex==-1){
                    option.push(['fullscreen',true]);
            }
            this.$store.dispatch('set_playData_action',option);
        },
        //当前歌曲
        getCurIcon(v){
            if(this.cursong.id==v.id){
                return 'icon-play';
            }
            return ''
        },
        //滚动到当前歌曲
        scrollToCursong(){
            let index;
            this.truePlayL.forEach((v,k)=>{
                if(v.id==this.cursong.id){
                    index=k;
                }
            });
            console.log('index',index,this.$refs.listItem[index]);
            this.$refs.listContent.scrollToElement(this.$refs.list.children[index], 300);
        },
        //删除歌曲
        del(v){
            var pindex=-1,sindex=-1,rindex=-1;
            this.$store.state.playData.playlist.forEach((item,k)=>{
                    if(item.mid==v.mid){
                        pindex=k;
                    }
                });
                
                this.$store.state.playData.sequencelist.forEach((item,k)=>{
                    if(item.mid==v.mid){
                        sindex=k;
                    }
                })
            this.$store.dispatch('set_playData_action',[['playlist',this.$store.state.playData.playlist.filter((item)=>{
                    return v.mid!==item.mid;
                })],['sequencelist',this.$store.state.playData.sequencelist.filter((item)=>{
                    return v.mid!==item.mid;
                })]]);

            var curindex=this.$store.state.playData.curindex;
            console.log(pindex,sindex,curindex);
            if(curindex>pindex || curindex==this.$store.state.playData.playlist.length ){
                    this.$store.dispatch('set_playData_action',[['curindex',curindex-1]]);
            }
            if(this.$store.state.playData.playlist.length==0){
                    this.$store.dispatch('set_playData_action',[['playing',false]]);
            }
        }
    },watch:{
        cursong(){
            
             this.scrollToCursong();
        }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
