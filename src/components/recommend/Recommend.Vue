<template>
    <div class="recommend" ref="recommendlist">
        <Scroll ref="scroll" class="recommend-content" :data="disclist">
          <div>
            <div class="slider-wrapper" v-if="recommendsilder.length ">


              <!-- <slider  @changeshow_p="changeshow_p" showcode="changeshow_p">
                <div v-for="item in recommendsilder" :key="item.id" v-show="isshow">
                  <a :href="item.linkUrl">
                    <img  class="needsclick" @load="loadImage" :src="item.picUrl" alt="">
                  </a>
                </div>
              </slider> -->
              <div class="wrapper">
              <swiper :options="swiperOption" v-if="recommendsilder.length">
            <!-- slides -->
                 
              <swiper-slide  v-for="item in recommendsilder" :key="item.id">
                  <a :href="item.linkUrl">
                    <img  class="swiper-img"  :src="item.picUrl" alt="">
                  </a>
              </swiper-slide>
              <!-- <swiper-slide>I'm Slide 3</swiper-slide>
              <swiper-slide>I'm Slide 4</swiper-slide>
              <swiper-slide>I'm Slide 5</swiper-slide>
              <swiper-slide>I'm Slide 6</swiper-slide>
              <swiper-slide>I'm Slide 7</swiper-slide> -->
              <!-- Optional controls -->
              <div class="swiper-pagination"  slot="pagination"></div>
              <!-- <div class="swiper-button-prev" slot="button-prev"></div>
              <div class="swiper-button-next" slot="button-next"></div> -->
              <!-- <div class="swiper-scrollbar"   slot="scrollbar"></div> -->
              </swiper>
              </div>

            </div>
            <div class="recommend-list">
              
                <h1 class="list-title">热门歌单推荐</h1>
                <ul>
                  <li v-for="item in disclist" :key="item.dissid" class="item"
                    @click="onclick_todetail(item)">
                    <div class="icon">
                      <img width="60" height="60" v-lazy="item.imgurl" alt="">
                    </div>
                    <div class="text">
                      <h2 class="name" v-html="item.dissname"></h2>
                      <p class="desc" v-html="item.creator.name"></p>
                    </div>
                  </li>

                </ul>
            </div>
          </div>
          <div class="loading-container" v-show="!disclist.length">
            <Loading></Loading>
          </div>
        </Scroll>
        <Trans_fade name="translateTd" >
              <router-view></router-view>
        </Trans_fade>
    </div>
</template>

<script>
import Scroll from '@/base/scroll/Scroll' //自己封装的滑动组件
import {getRecommend,getDiscList} from 'api/recommend'; //获得api中的获取图片方法，获取歌单方法
import {ERR_OK} from 'api/config'//请求成功标志
// import Slider from '@/base/slider/Slider'
import Loading from '@/base/loading/Loading'//loading组件
import Trans_fade from '@/base/trans/Trans_fade'//动画组件
import {playlistMixin} from 'common/js/mixin.js' //引入 当有小屏播放器时，底部留出60px
export default {
    name:'Recommend',
    mixins:[playlistMixin],//使用 当有小屏播放器时，底部留出60px
    created:function(){
        this._getRecommend();
        this._getDiscList();
    },
    components:{
        Scroll,Loading,Trans_fade
    },
    data(){
      return {
        recommendsilder:[],//五张图片的数组
        disclist:[],//30歌单的数组
        // isshow:false,
        swiperOption:{
                pagination:'.swiper-pagination',
                loop:true//轮播循环
                 ,autoplay:2000,
                autoplayDisableOnInteraction : false,
            },//轮播组件参数
      }
    },
    methods:{
        //获取五张图片
        _getRecommend(){
            getRecommend().then((res)=>{
                    if(res.code ===ERR_OK){
                      console.log(res.data.slider);
                        this.recommendsilder=res.data.slider;
                    }
            })
        },
        //获取30个歌单
        _getDiscList(){
          getDiscList().then((res)=>{
                    if(res.code ===ERR_OK){
                      console.log(res);
                         this.disclist=res.data.list;
                         
                    }
                   
            })
        },
        //重写 当有小屏播放器时，底部留出60px
        handlePlaylist(playlist){
            const bottom=playlist.length>0 ?'60px':'';
            this.$refs.recommendlist.style.bottom=bottom;
            // this.$refs.scroll.refresh();
        },
        //点击歌单去详情页
        onclick_todetail(item){
          this.$store.dispatch('set_v_action',[['recommendv',item],['backname','recommend']]);
          // this.$store.dispatch('actions_backname','recommend');
           this.$router.push('/recommend/'+item.dissid);
        }
        // loadImage(){
        //   if(!this.checkLoaded){
        //       this.$refs.scroll.refresh();
        //       this.checkLoaded=true;
        //   }
          
        // },changeshow_p:function(){
        //   console.log(1);
        //   this.isshow=true;
        //   this.$refs.scroll.refresh();
        // }
    }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
.wrapper >>> .swiper-pagination-bullet-active
        width: 20px
        border-radius: 5px
        background: $color-text-ll


.recommend
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  .recommend-content
    height: 100%
    overflow: hidden
    .slider-wrapper
      
      position: relative
      width: 100%
      overflow: hidden
      
    .recommend-list
      .list-title
        height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
      .item
        display: flex
        box-sizing: border-box
        align-items: center
        padding: 0 20px 20px 20px
        .icon
          flex: 0 0 60px
          width: 60px
          padding-right: 20px
        .text
          display: flex
          flex-direction: column
          justify-content: center
          flex: 1
          line-height: 20px
          overflow: hidden
          font-size: $font-size-medium
          .name
            margin-bottom: 10px
            color: $color-text
          .desc
            color: $color-text-d
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
.wrapper
    // width:100%
    height:0
    overFlow:hidden
    padding-bottom 40.00%;
    // background:#eee
    .swiper-img 
        width:100%
</style>
