<template>

  <div class="music-list">
      <div class="back">
          <i class="icon-back"
            @click="onclick_back"
          >

          </i>
      </div>
      <h1 class="title" v-html="msgdata.name"></h1>
      <p>{{author}}</p>
      <div class="bg-image" :style="bgStyle" ref="bgimg">
          <div class="play-wrapper">
            <div class="play" v-show="songs.length>0" ref="playBtn" @click="randomplay">
              <i class="icon-play"></i>
              <span class="text">随机播放全部</span>
            </div>
          </div>
          <div class="filter" ref="filr">
             
          </div>
      </div>
      <!-- <div class="bg-layer" ref="layer"> </div> -->
          <scroll :data="songs" class="list"
          ref="list"
          @scrollac="onScrollYwatch"
          :probeType="probeType"
          >
            <div class="song-list-wrapper" ref="songlist">
              <Songlist :songs="songs" @onclickPlaysong="onclickPlaysong_p" :isrank="isrank"></Songlist>
            </div>
            <div class="loading-container" v-show="!songs.length">
              <Loading></Loading>
            </div>
           </scroll>
     
      
  </div>
     


</template>

<script type="text/ecmascript-6">
  import Songlist from '@/components/songlist/Songlist'
  import Scroll from 'base/scroll/Scroll'
  import {getcss,prefixStyle} from 'common/js/dom.js'
  import Loading from 'base/loading/Loading';

  import {MODE_SEQ,MODE_ONE,MODE_RANDOM} from '@/store/mode-type.js';
  import {shuffle} from 'common/js/util.js';

  import {playlistMixin} from 'common/js/mixin.js'
  const TRANSFORM=prefixStyle('transform');
  const RZV_HEIGHT=40;
  export default {
        name:'Musiclist',
        mixins:[playlistMixin],
        data(){
          return {
            probeType:3,scrollY:-1,
            imageHeight:'',minimgtransY:'',
            randomlist:[]
          }
        },
        props:{
          songs:{},
          msgdata:{},
          author:{
            defalut:''
          },
          isrank:{
            default:false
          }
        }
        ,components:{Songlist,Scroll,Loading}
        ,computed:{
          bgStyle(){
            return `background-image:url(${this.msgdata.avatar})`
          },
          backname(){
            return this.$store.state.v.backname;
          }
        }
        ,methods:{
            onclick_back(){
                this.$router.push('/'+this.backname)
            },
            onScrollYwatch(pos){
              // console.log(pos.y);
                this.scrollY=pos.y;
            },
            onclickPlaysong_p(songs,index){
                //  console.log(songs[0],index);
                //设置play的全局数据
                let option=[
                      ['curindex',index],
                      ['playlist',songs],
                      ['sequencelist',songs],
                      ['playing',true]
                ]
                if(this.$store.state.playData.curindex==-1){
                      option.push(['fullscreen',true]);
                }
                this.$store.dispatch('set_playData_action',option);
                
                //console.log(this.$store.state.playData.curindex,this.$store.state.playData.sequencelist);
            },
            randomplay(){
              this.randomlist=shuffle(this.songs);
              
              let option=[
                      ['curindex',0],
                      ['playlist',this.randomlist],
                      ['sequencelist',this.songs],
                      ['playing',true],
                      ['mode',MODE_RANDOM]
                ]
                if(this.$store.state.playData.curindex==-1){
                      option.push(['fullscreen',true]);
                }
                this.$store.dispatch('set_playData_action',option);

            },
            handlePlaylist(playlist){
                const bottom=playlist.length>0 ?'60px':'';
                this.$refs.list.$el.style.bottom=bottom;
                this.$refs.list.refresh();
            }
        }
        ,mounted(){
            this.imageHeight=this.$refs.bgimg.clientHeight;
            this.minimgtransY=-this.imageHeight+RZV_HEIGHT;
            this.$refs.list.$el.style.top=`${this.$refs.bgimg.clientHeight}px`
        },
        watch:{
            scrollY(newY,preY){
                //向上黑色板向上
                    // let tranY=Math.max(this.minimgtransY,newY)
                    // console.log(newY,this.minimgtransY);
                    // this.$refs.layer.style['transform']=`translate3d(0,${tranY}px,0)`;
                    
                    //getcss(this.$refs.layer,TRANSFORM,`translate3d(0,${tranY}px,0)`);

                //向下图片放大
                    let scale=1;
                    const percent=Math.abs(newY/this.imageHeight);
                    console.log(percent);
                    if(newY>0){
                      scale+=percent;
                      //this.$refs.bgimg.style['transform']=`scale(${scale})`
                      getcss(this.$refs.bgimg,TRANSFORM,`scale(${scale})`);
                    }
                //向上高速模糊 手机端有效
                    let blur=0;
                    if(newY<=0){
                      blur=Math.min(20*percent,20);
                      //backdrop-filter 高斯模糊的css属性
                      // this.$refs.filr.style['backdrop-filter']=`blur(${blur}px)`;
                      getcss(this.$refs.filr,'backdrop-filter',`blur(${blur}px)`);
                    }
                //上边留白
                let zIndex=0;
                
                if (newY < this.minimgtransY ) {
                  zIndex = 10
                  this.$refs.bgimg.style.paddingTop = 0
                  this.$refs.bgimg.style.height = `${RZV_HEIGHT}px`
                  this.$refs.playBtn.style.display = 'none'
                    
                } else {
                  this.$refs.bgimg.style.paddingTop = '70%'
                  this.$refs.bgimg.style.height = 0  
                  this.$refs.playBtn.style.display = ''
                }
                this.$refs.bgimg.style.zIndex = zIndex
                  
              },
              randomlist(newV){
                  this.$store.dispatch('set_playData_action',[['randomlist',newV]]);
              }
        }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play

          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      // z-index:100
      // transform:translate3d(0,0px,0)
      // overflow hidden
      position: relative
      height: 100%
      background: $color-background
    .list
      // overflow:hidden
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      
      .song-list-wrapper
        background: $color-background
        z-index:1000
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 25%
        transform: translateY(-50%)
</style>