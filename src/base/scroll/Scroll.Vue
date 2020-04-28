<template>
    <div ref="wrapper" class="scrollwrapper">
        
        <slot> </slot>   
    </div>
</template>

<script>
// import {playlistMixin} from 'common/js/mixin.js'
import BScroll from 'better-scroll'
export default {
    // mixins:[playlistMixin],
    props:{
        probeType:{
            type:Number,
            defalut:1
        },
        click:{
            type:Boolean,
            defalut:false
        },data:{
            // type:Array,
            defalut:null
        },listenScroll:{
            type:Boolean,
            defalut:false
        },
        pullup:{
            type:Boolean,
            defalut:false
        }
    },
    data(){
        return {
            scroll:{a:1}
        }
    },
    methods:{
        _initScroll(){
            if(!this.$refs.wrapper){
                return 
            }
            // console.log('scroll',this.data);
            this.scroll=new BScroll(this.$refs.wrapper,{
                probeType:this.probeType,click:this.click
            });
            
            // if (this.listenScroll) {
            let me = this
            this.scroll.on('scroll',function(pos){
                // console.log(pos);
                me.$emit('scrollac', pos);
                //滚动让input失去焦点
                me.$emit('nofocus');
            })
            if(this.pullup){
                let me=this;
                this.scroll.on('scrollEnd',function(pos){
                    // console.log(pos);
                    if(me.scroll.y<=(me.scroll.maxScrollY+50)){
                        me.$emit('scrollend');
                    }
                    

                })
            }
            // }
        },
        enable(){
            this.scroll && scroll.enable();
        },
        disable(){
            this.scroll && this.scroll.disable()
        },
        //重新计算方法
        refresh(){
            // console.log(this.scroll);
            !this.scroll.a && this.scroll.refresh();
        },
        //滚动到一dom
        scrollTo(){
            this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments);
        },scrollToElement(){
            console.log(arguments);
            !this.scroll.a && this.scroll.scrollToElement.apply(this.scroll,arguments);
        },
        
        
    },mounted(){
        //延迟20毫秒执行确保dom加载完毕
        setTimeout(()=>{
            this._initScroll();
             //console.log( this.scroll);
              
        },20)
    },
    watch:{
        data(){
            setTimeout(()=>{
                this.refresh();
            },100)
        }
    }
}
</script>

<style lang="stylus" scoped>
    .scrollwrapper
        // position relative;
        // overflow :hidden
        // height:100%
        

</style>
