<template>
    <div class="player" v-show="playlist.length" v-if="cursong">
        <Trans_fade name="opc" 
        
        >
            <div class="normal-player" v-show="fullScreen" >
                <div class="background">
                      <img width="100%" height="100%" :src="cursong.image" >
                      
                </div>
                
                <div class="top">
                    <div class="back" >
                        <i class="icon-back" @click="onclick_togglefullscreen"></i>
                    </div>
                    <h1 class="title" v-html="cursong.name" ></h1>
                    <h2 class="subtitle" v-html="cursong.singer"></h2>
                </div>


                <swiper :options="swiperOption" class="middle">
                  
                      
                    <swiper-slide  class="middle-l" ref="middleL">
                        
                          <Trans_fade js_animate="createKeyframe_ani" :elname="this.$refs.cdWrapper">
                            <div class="cd-wrapper" ref="cdWrapper" v-show="fullScreen ">
                                <div  class="cd" :class="cdclass">
                                    <img class="image" :src="cursong.image"  >
                                </div>
                            </div>
                            
                          </Trans_fade>
                          <div class="playing-lyric-wrapper" style="">
                              <div class="playing-lyric">
                                  {{curtxt}}
                              </div>
                            

                          </div>

                    </swiper-slide>
                    <swiper-slide class="middle-r" >
                        
                        <Scroll  :data="curLyric && curLyric.lines"  ref="lyricList" style="height:100%">
                            
                              <div class="lyric-wrapper">
                                <div v-if="curLyric">
                                    <p ref="lyricLine"
                                      class="text"
                                      :class="{'current':curlyricnum==ind}"
                                      v-for="(line,ind) in curLyric.lines" :key="ind">{{line.txt}}</p>
                                </div>
                              </div>
                              <!-- <div v-if="!curLyric">暂无歌词</div> -->
                            
                        </Scroll>
                        
                    </swiper-slide>
                    
                    <div class="swiper-pagination"  slot="pagination"></div>
             
                </swiper>


                <!-- <div class="middle">
                    <div class="middle-l" ref="middleL">
                      <Trans_fade js_animate="createKeyframe_ani" :elname="this.$refs.cdWrapper">
                        <div class="cd-wrapper" ref="cdWrapper" v-show="fullScreen ">
                            <div  class="cd" :class="cdclass">
                                <img class="image" :src="cursong.image"  >
                            </div>
                        </div>
                      </Trans_fade>
                    </div>
                    <Scroll  :data="curLyric && curLyric.lines"  class="middle-r" ref="lyricList">
                     
                      <div class="lyric-wrapper" >
                        <div v-if="curLyric">
                            <p ref="lyricLine"
                              class="text"
                              v-for="(line,ind) in curLyric.lines" :key="ind">{{line.txt}}</p>
                        </div>
                      </div>
                    
                    </Scroll>
                </div> -->
              
                <div class="bottom">
                      <!-- <div class="dot-wrapper">
                          <span class="dot" ></span>
                          <span class="dot" ></span>
                      </div> -->
                      <div class="progress-wrapper">
                          <span class="time time-l">{{nor_curtime(curTime)}}</span>
                          <div class="progress-bar-wrapper">
                              <Progressbar 
                                :percent="percent"
                                @getpercent="getpercent"> 
                                </Progressbar>
                          </div>
                          <span class="time time-r">{{nor_curtime(cursong.duration)}}</span>
                      </div>
                      <div class="operators">
                          <div class="icon i-left" :class="disable">
                              <i :class="iconMode" @click="changeMode"></i>
                          </div>
                          <div class="icon i-left" :class="disable">
                              <i @click="prev" class="icon-prev" ></i>
                          </div>
                          <div class="icon i-center" :class="disable">
                              <i @click="togglePlay" :class="playIcon"></i>
                          </div>
                          <div class="icon i-right" :class="disable">
                              <i  @click="next" class="icon-next" ></i>
                          </div>
                          <div class="icon i-right" :class="disable">
                              <i class="icon-not-favorite" ></i>
                          </div>
                      </div>
                </div>
                
            </div>
        </Trans_fade>
        <Trans_fade name="opc" >
            
                    <div   class="mini-player"  v-show="!fullScreen" @click="onclick_togglefullscreen"
                        @touchstart="miniplay_touchsrart"
                         @touchmove="miniplay_touchmove"
                          @touchend="miniplay_touchend"
                          ref="miniplayer" >
                           <!-- <swiper :options="swiperOption_mini"   > -->
            
                 
                  <!-- <swiper-slide  >  -->
                        <div class="icon" >
                              <img  width="40" height="40" :src="cursong.image" :class="cdclass_mini">
                        </div>
                        <div class="text">
                              <h2 class="name" v-html="cursong.name"></h2>
                              <p class="desc"  v-html="cursong.singer"></p>
                        </div>
                     <!-- </swiper-slide>
            
              </swiper>  -->
                        <div class="control">
                          <Procicle radius=32 :percent="curTime/cursong.duration" >
                              <i @click.stop="togglePlay" class="icon-mini" 
                              :class="miniplayIcon"></i>
                          </Procicle>
                        </div>
                        <div class="control" @click.stop="showplaylist">
                              <i class="icon-playlist"></i>
                        </div>
                    </div>
                  

                    


        </Trans_fade>
        <Playlist ref="playlist" :playlist="sequencelist" :iconMode="iconMode"
          @changeMode="changeMode"></Playlist>
          <!-- canplay 歌曲加载完成触发，error歌曲加载失败触发 timeupdate歌曲播放时会触发此事件-->
        <audio  ref="audio" :src="cursong.url" @canplay="ready" @error="error" @timeupdate="updatetime" @ended="end"></audio>
    </div>
</template>

<script>
import Trans_fade from 'base/trans/Trans_fade';
import Progressbar from '@/components/player/components/progressbar/Progressbar'
import Procicle from '@/components/player/components/procicle/Procicle'

import {MODE_SEQ,MODE_ONE,MODE_RANDOM} from '@/store/mode-type.js';

import {shuffle} from 'common/js/util.js';

import Lyric from 'lyric-parser'

import Scroll from '@/base/scroll/Scroll';
import {prefixStyle} from 'common/js/dom';

import Playlist from '@/components/playlist/Playlist';//播放列表组件

const transform=prefixStyle('transform');
const SCREENWidth=window.screen.width;

export default {
    name:'Player',
    components:{Trans_fade,Progressbar,Procicle,Scroll,Playlist},
    data(){
      return {
           swiperOption:{
                pagination:'.swiper-pagination',
                // loop:true//轮播循环
            },
            swiperOption_mini:{
                pagination:'.swiper-pagination',
                loop:true//轮播循环
            },
            songReady:false,//只有songReady==true时才能点击下一首
            code:0//标志位代表当前下一首还是上一首 0上 1下
            ,curTime:0//当前时间
            ,curLyric:null,
            curlyricnum:0,//当前歌曲
            curtxt:''
            
      }
    },mounted(){
        
    },
    computed:{
        randomlist(){
          return this.$store.state.playData.randomlist;
        },
        fullScreen(){
          return this.$store.state.playData.fullscreen;
        },
        sequencelist(){
          return this.$store.state.playData.sequencelist
        },
         playlist(){
          return this.$store.state.playData.playlist
        },
        playing(){
          return this.$store.state.playData.playing
        },
        cursong(){
          return this.$store.getters.cursong;
        }, curindex(){
          return this.$store.state.playData.curindex;
        },
        //根据播放状态判断class
        playIcon(){
            return this.playing?'icon-pause':'icon-play';
        },
        miniplayIcon(){
            return this.playing?'icon-pause-mini':'icon-play-mini';
        },
        cdclass(){
            return this.playing?'play':'play pause';
        },
        cdclass_mini(){
            return this.playing?'play':'play pause';
        },
        disable(){
            return this.songReady?'':'disable'
        },
        percent(){
          return this.curTime/this.cursong.duration;

        },
        mode(){
          return this.$store.state.playData.mode;
        },
        iconMode(){

          return this.mode==MODE_SEQ?'icon-sequence':((this.mode==MODE_ONE)?'icon-loop':'icon-random');
        }
        
    },methods:{
        //显示playlist
        showplaylist(){
          this.$refs.playlist.show();
        },
        //更改随机队列
        setrandomlist(newV){
           this.$store.dispatch('set_playData_action',[['randomlist',newV]]);
        },
        //点击大小屏
        onclick_togglefullscreen(){
            // console.log(this.fullScreen);
            this.$store.dispatch('set_playData_action',[
                     ['fullscreen',!this.fullScreen],
                 ]);
        }, 
        //更改playing状态， watch监听playing来play() 或 pause()
        togglePlay(){
            let code=this.$store.state.playData.playing;
            this.$store.dispatch('set_playData_action',[
                     ['playing',!code],
            ]);
            if(this.curLyric){
                this.curLyric.togglePlay();
            }
            
        },
        //将curindex++ 超出范围修正
        next(){
            this.code=1;
            if(!this.songReady){
              return;
            }
            let index=this.curindex+1;
            let len=this.playlist.length;
            if(index>len-1){
              index=0
            }
            this.$store.dispatch('set_playData_action',[
                     ['curindex',index],
            ]);
            // console.log(this.curindex);
            this.songReady=false;
            this._updatePlaylist();//更新播放队列
        },
        //将curindex-- 超出范围修正
        prev(){
            this.code=0;
            if(!this.songReady){
              return;
            }
            let index=this.curindex;
            let len=this.playlist.length;
            index-=1;
            if(index<0){
              index=len-1;
            }
            this.$store.dispatch('set_playData_action',[
                     ['curindex',index],
            ]);
            // console.log(this.curindex);
             this.songReady=false;
             this._updatePlaylist();//更新播放队列
        },
        //只有next prev 或歌曲播放完毕才更新播放队列 为了不影响当前播放的歌曲
        _updatePlaylist(){
            //判断当前mode 为随机则将playlist=randomlist
            
            if(this.mode===MODE_RANDOM){
               this.$store.dispatch('set_playData_action',[
                  ['playlist',this.randomlist],
              ]);
            }else{
                this.$store.dispatch('set_playData_action',[
                  ['playlist',this.sequencelist],
                ]);
            }
            if(this.playlist.length==1){
                this.curTime=0;
                this.$refs.audio.play();
            }
             this._initlyric();
        },
        end(){
            this._updatePlaylist();
            setTimeout(()=>{
              if(this.mode==MODE_ONE){
                // this.curTime=0;
                this.$refs.audio.play();
                return;
              }
              this.songReady=true;
              this.next();
            },1000)
        },
        //歌曲加载完毕后将标识符songReady=true next和prev会判断songReady是否为true,再更改curindex
        ready(){
            this.songReady=true;
        },
        //歌曲加载失败后下一首或上一首(由code判断)
        error(){
            // console.log('error',this.curindex);
            this.songReady=true;
            if(this.code==0){
                this.prev();
            }else{
                this.next();
            }
            
        },
        //歌曲播放时会触发此事件，得到当前播放事件
        updatetime(e){
            //e.target.currentTime可读写，可以修改属性来实现更改当前歌曲时间
            this.curTime=e.target.currentTime;
            // console.log(this.curTime,this.cursong.duration);
            // console.log(this.curTime);
        },
        //格式化时间
        nor_curtime(interval){
            interval=interval | 0;
            let minute=interval/60 |0;
            let second=interval%60;
            
            return `${this._pad(minute)}:${this._pad(second)}`;
        },
        //补位函数
        _pad(num,n=2){
          let len=num.toString().length;
          while(len<n){
            num='0'+num;
            len++;
          }
          return num;
        },
        
        //从子组件中获得百分比,并更新播放进度
        getpercent(newP){
            // console.log(newP);
            const curtime=newP*this.cursong.duration
            this.$refs.audio.currentTime=curtime;
            
            if(this.playing==false){
                this.togglePlay()
            }

            if(this.curLyric){
              this.curLyric.seek(curtime*1000);
            }
            
        },
        //更改播放模式
        changeMode(){
            this.$store.dispatch('set_playData_action',[
                  ['mode',(this.mode+1)%3],
              ]);
            
            if(this.mode ===MODE_RANDOM ){
                this.setrandomlist(shuffle(this.sequencelist))    
            }else{
                this.setrandomlist(this.sequencelist)
            }
            //随机对应到循序
        },
        //歌词运行时会触发此函数,高亮，显示当前歌词 传入行号 内容
        handlelyric({lineNum,txt}){
            this.curlyricnum=lineNum;//高亮
            this.curtxt=txt;
            if(lineNum>5){
              let lineEl=this.$refs.lyricLine[lineNum-5];
              this.$refs.lyricList.scrollToElement(lineEl,1000);
            }else{
              this.$refs.lyricList.scrollTo(0,0,1000);
            }
        },
        //滑动mini-player 下一首上一首
        //@touchstart="miniplay_touchsrart" @touchmove="miniplay_touchmove"  @touchsend="miniplay_touchend"
        miniplay_touchsrart(e){
            this.touch.init=true;
            this.touch.timecode=true;
            this.touch.startX=e.touches[0].pageX;//开始的位置
        },
        miniplay_touchmove(e){
            if(!this.touch.init){
              return;
            }
            // console.log(this.touch.startX,e.touches[0].pageX);
            
            let ActualX=e.touches[0].pageX-this.touch.startX;
            this.songReady=true;
            if(ActualX<0 && this.touch.timecode){
              
              // console.log(SCREENWidth);
              this.next();
              
            }else if(ActualX>=0 && this.touch.timecode){
              this.prev();
            }
            this.touch.timecode=false;
            console.log(this.curindex);
        },
        miniplay_touchend(){},
        _initlyric(){
          //初始化lyric插件 歌词play
                if(this.curLyric){
                    this.curLyric.stop();
                }
                if(!this.cursong.lyric){
                  this.curtxt='暂无歌词';
                  this.curLyric='暂无歌词';
                  return;
                }
                this.curLyric=new Lyric(this.cursong.lyric,this.handlelyric);
                // console.log(this.curLyric);
                 this.curtxt=this.curLyric.lines[0].txt
                
                if(this.playing){
                  this.curLyric.play();
                }
                // console.log(this.curLyric);
              
        }
    },
    created(){
      this.touch={};
    },
    watch:{
        //当cursong更改时就play()
        cursong(newY){
          if(!newY){return;}
          setTimeout(()=>{
            // console.log(this.$refs);
             
              this.$store.dispatch('set_playData_action',[
                     ['playing',true]
                 ]); 
              this.$refs.audio.play();
              this._initlyric();
          },1000)
        },
        //palying=true==>play()
        playing(newv){
            this.$nextTick(()=>{
                let aud=this.$refs.audio;
                newv==true?aud.play():aud.pause();

                 
                
                
            });
            
        },
        sequencelist(n,p){
            //换歌手时同时更新随机列表
            //console.log(1);
           
             this.setrandomlist(shuffle(this.sequencelist))
        },
        
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
.normal-player >>> .swiper-pagination-bullet-active
        width: 20px
        border-radius: 5px
        background: $color-text-ll

.normal-player >>> .swiper-pagination-bullet
        background:white
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .text
            position: absolute;
            left: 10%;
            top: 100%;
            width:80%;
            height:100px;
            text-align:center;
            line-height:100px;    
            color: rgba(255,255,255,0.5);
            font-size: 14px;
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height:382px;
          overflow: hidden
          .lyric-wrapper
            // height:382px;
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
     
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      // &.mini-enter-active, &.mini-leave-active
      //   transition: all 0.4s
      // &.mini-enter, &.mini-leave-to
      //   opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
.opc-enter,.opc-leave-to
    .top
        transform: translate3d(0, -100px, 0)
    .bottom
        transform: translate3d(0, 100px, 0)
.opc-enter-active,.opc-leave-active
    .top, .bottom
            transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
