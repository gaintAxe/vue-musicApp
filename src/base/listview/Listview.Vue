<template>
    <scroll class="listview" 
    :data="data" 
    ref="listview" 
    :listenScroll="listenS" 
    :probeType="probeType"
    @scrollac="scroll">
        <ul>
            <li v-for="group in data" ref="listgroup" :key="group.title" class="list-group" >
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li v-for="item in group.items " 
                        :key="item.id" 
                        class="list-group-item"
                        @click="onclick_todetail(item)"
                    >
                        <img v-lazy="item.avatar" alt="" class="avatar" >
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortcuttouch" @touchmove.stop.prevent="onShortcuttouchmove">
            <ul>
                <li v-for="(v,k) in shortcutList" :key="k" class="item" :data-index="k" ref="shortcut" :class="{'current':curindex==k}">{{v}}</li>
            </ul>
        </div>
        <div 
        class="list-fixed" 
        v-show="!fixedTitle==''"
         ref="listfixed">
            <h1 class="fixed-title" >{{fixedTitle}}</h1>
        </div>
        <div class="loading-container" v-show="!data.length">
            <Loading></Loading>
        </div>
    </scroll>  
</template>

<script>
import Scroll from 'base/scroll/Scroll'
import {getData,addClass} from 'common/js/dom';
import Loading from '@/base/loading/Loading'

const ANCHOR_HEIGHT=20;
const TITLE_HEIGHT=30;
export default {
    name:'Listview',
    created(){
        //在这创造数据，不会被监听
        this.touch={};
        this.listHeight=[];
        this.probeType=3;
    },
    data(){
        return {
            listenS:true
            ,scrollY:-1//当前滚动的位置
            ,curindex:0//根据scrollY计算下标
            ,diff:-1//置顶标题下限与移动标题上限之差
        }
    },
    props:{
        data:{
            type:Array,
            default:[],
        }
    },
    computed:{
        shortcutList(){
            return this.data.map((group)=>{
                return group.title.substr(0,1);
            })
        },
        fixedTitle(){
            console.log(this.scrollY)
            if(this.scrollY>0){
                return '';
            }
            
            return this.data[this.curindex] ?this.data[this.curindex].title:''
        }
    },components:{
        Scroll,Loading
    }
    ,methods:{
        onclick_todetail(v){
            // console.log(v);
           
            this.$emit('onclick_todetail_singer',v);
        },
        //点击事件
        onShortcuttouch(e){
            let anchorIndex=getData(e.target,'index');
            let firstTouch=e.touches[0];
            this.touch.y1= firstTouch.pageY;
            this.touch.anchorIndex=anchorIndex;
            this._scrollToE(anchorIndex);
           
        }
        //手指移动事件
        ,onShortcuttouchmove(e){
            let firstTouch=e.touches[0];
            this.touch.y2=firstTouch.pageY;
            let delta=(this.touch.y2-this.touch.y1)/ANCHOR_HEIGHT|0;//|0 向下取整
            let anchorIndex=Number(this.touch.anchorIndex)+Number(delta);
           
            this._scrollToE(anchorIndex); 
           

        }
        //滚动
        ,_scrollToE(index){
            this.$refs.listview.scrollToElement(this.$refs.listgroup[index],0)
        }
        //实时获取scrollY
        ,scroll(pos){
            
            this.scrollY=pos.y;
            // console.log('scrollY',this.scrollY);
        }
        //计算group高度 循环计算
        ,_calculateHeight(){
            this.listHeight=[];
            const list=this.$refs.listgroup;
            let height=0;
            this.listHeight.push(height);
            for(let i=0;i<list.length;i++){
                let item=list[i];
                height+=item.clientHeight;
                this.listHeight.push(height);
            }
            // console.log(this.listHeight);
        }
    }
    ,watch:{
        data(){
            setTimeout(() => {
                this._calculateHeight();
            }, 20);
        },
        //当滚动高度发生变化时，计算当前字母,计算diff以实现标题动画
        scrollY(newY){
            const listHeight=this.listHeight;
            for(let i=0;i<listHeight.length;i++){
                
                let height1=listHeight[i];
                let height2=listHeight[i+1];
                if((-newY)>=height1 && (-newY)<=height2){
                    this.curindex=i;
                    this.diff=height2+newY;
                    // console.log('diff',this.diff);
                    if((-newY)==height2){
                        this.curindex=i+1
                    }
                    // console.log(this.curindex)
                    return;
                }
                
            }
            
            this.curindex=0;
        },
        diff(diff){
            // console.log(diff);
            let fixedtop=(diff<TITLE_HEIGHT &&diff>0)?diff-TITLE_HEIGHT:-2;
            console.log(fixedtop);
            
            this.$refs.listfixed.style.transform=`translate3d(0,${fixedtop}px,0)`;
            this.$refs.listfixed.style.top=fixedtop+'px';
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 10px
      border-radius: 10px
      text-align: center
      //background: $color-background-d
      font-family: Helvetica
      .item
        padding: 4px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: -2px
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

