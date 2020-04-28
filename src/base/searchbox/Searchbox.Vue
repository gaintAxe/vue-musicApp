<template>
    <div class="search-box">
        <i class="icon-search">
            
        </i>
        <input type="text" class="box" :placeholder="placeholder" v-model="query" >
        <i class="icon-dismiss" v-show="query" @click="delquery">

        </i>
    </div>
</template>

<script>
import {debounce} from '@/common/js/util.js';//获取节流函数
export default {
    name:'Searchbox',
    props:{
        placeholder:{
            type:String,
            default:'搜索歌曲、歌手'
        },isnofocus:{
            default:false
        }
    },
    data(){
        return {
            query:''
        }
    },computed:{
        // query:{
        //     get(){
        //         return this.query;
        //     },set(newq){
        //          
        //          return newq;
        //     }
        // }
    },methods:{
        delquery(){
            this.query='';
        },
        getparentquery(q){
            this.query=q;
        }
        // ,keyupquery(){
        //     this.$emit('getQuery',this.query)
        // }
    },watch:{
        // query(newQuery){
        //     debounce
        //    this.$emit('getQuery',newQuery);
        // }
        isnofocus(newV){
            if(newV){
                //让input失去焦点
                var input = document.getElementsByClassName("box")[0];
                input.blur()
            }
        }
    },created(){
        this.$watch('query',debounce((newQuery)=>{
            this.$emit('getQuery',newQuery)
        },200))
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      outline: none;
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
