<template>
    <div class="progress-bar" 
        ref="progressBar" 
        @click="progressclick">
        <div class="bar-inner">
            <div class="progress" 
                ref="progress">
            </div>
            <div class="progress-btn-wrapper" 
                ref="progressBtn"
                @touchstart.prevent="progressTouchstart" 
                @touchmove.prevent="progressTouchmove" 
                @touchend.prevent="progressTouchend" >
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
import {prefixStyle} from 'common/js/dom';
const proBtnWidth=16;
const transform=prefixStyle('transform');
export default {
    name:'Progressbar',
    props:{
        percent:{
            type:Number,
            defalut:0
        }
    },
    watch:{
        percent(newP){
            if(newP>=0){
                const barWidth=this.$refs.progressBar.clientWidth-proBtnWidth-20;
                const offsetWidth=newP*barWidth;
                // console.log(offsetWidth);
                this._offset(offsetWidth);

            }
        }
    },
    methods:{
        _offset(offsetWidth){
            this.$refs.progress.style.width=   `${offsetWidth}px`;
            this.$refs.progressBtn.style[transform]=`translate3d(${offsetWidth}px,0,0)`;
        },
        _computedPercent(offsetWidth){
            let newP=offsetWidth/(this.$refs.progressBar.clientWidth-proBtnWidth-20);
            this.$emit('getpercent',newP);//抛出百分比
        },
        progressTouchstart(e){
            this.touch.initiated=true;
            this.touch.startX=e.touches[0].pageX;//开始的位置
            this.touch.left=this.$refs.progress.clientWidth;//进度条以滚动的宽度
            // console.log(this.touch.startX,this.touch.left);
        },
        progressTouchmove(e){
            
            if(!this.touch.initiated){
                return
            }
            const deltaX=e.touches[0].pageX-this.touch.startX;//进度条移动的距离
            //offsetWidth>0 && <进度条末端到屏幕左侧的距离
            //this.touch.left+deltaX 为进度条移动后的宽度
            const offsetWidth=Math.min(this.$refs.progressBar.clientWidth-proBtnWidth/2-20,Math.max(0,this.touch.left+deltaX));
            
            // console.log(this.$refs.progressBar.clientWidth-proBtnWidth/2-20);
            this._offset(offsetWidth);//更改进度条样式
            //计算移动后的时长 抛出
            this._computedPercent(offsetWidth);
            
        },
        progressTouchend(e){
            this.touch.initiated=false;
        },
        progressclick(e){
            //点到按钮时不做操作
            //使点击事件只在进度条上有效
            // console.log(e.target.className);
            if(e.target.className=='progress-btn' || e.target.className=='progress-btn-wrapper'){
                return;
            }
            if(e.target.className=='bar-inner' || e.target.className=='progress'){
            let offsetWidth=e.offsetX-8
            // console.log(e.offsetX);
            this._offset(offsetWidth);
            //计算 抛出
            this._computedPercent(offsetWidth);
            }
            
        }
    },
    created(){
        this.touch={};
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    padding: 10px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
