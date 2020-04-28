<template>
  <div class="slider" ref="slider" >
    <div class="slider-group" ref="sliderGroup">
      <slot v-show="isshow"></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,k) in dots" :key="k" :class="{active:curPage===k}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
 import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom.js'
  export default {
    name:'BaseSlider',
    data(){
      return {
        dots:[],
        curPage:0,
        
      }
    },
    
    props:{
      loop:{//循环轮播
        type:Boolean,
        default:true,
      },
      autoPlay:{
        type:Boolean,
        default:true,
      },
      interval:{
        type:Number,
        default:4000
      },
      showcode:{
        type:String,
        default:''
      }
    },
    mounted:function(){
      setTimeout(()=>{
        
        this._setSliderWidth(false);
        this._initDots();
        this._initSlider();

        //自动播放
        if(this.autoPlay){
          this._play();
        }

        window.addEventListener('resize',()=>{
          if(!this.slider){
            return 
          }
          this._setSliderWidth(true);
        })
      },20)
    },
    methods:{
      _setSliderWidth(isR){
        //为轮播的图片的外容器指定宽度
        this.children = this.$refs.sliderGroup.children
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')
          // this.isshow=true;
          this.$emit('changshow',true);
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isR) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider(){
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop, // 循环
            threshold: 0.3,
            speed: 400 // 轮播间隔
          },
          click:true
           
        });
        //当this.slider生成时图片才会显示
        if(this.showcode!==''){
            this.$emit(this.showcode);
        }
        
        //better-scoll在滚动时会触发一个事件
        this.slider.on('scrollEnd',()=>{
          let pageI=this.slider.getCurrentPage().pageX;
          if(this.loop){
            //  pageI-=1;
          }
          this.curPage=pageI;

          if(this.autoPlay){
            clearTimeout(this.timer);
            
            this._play();
            // if(this.curPage==4){this.curPage=0}
          }
        })
      },
      _initDots(){
        this.dots=new Array(this.children.length);

      },
      _play(){
        let pageI=this.curPage+1;
        if(pageI==5){pageI=0}
        if(this.loop){
          // pageI+=1;
        }
        this.timer=setTimeout(()=>{
          
          this.slider.goToPage(pageI,0,400);
          //console.log(pageI,this.curPage);
         
        },this.interval)
      }
    },
    destroyed(){
      clearTimeout(this.timer);
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        // cursor pointer
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>