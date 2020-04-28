<template>
<div>
    <transition :name="name" v-if="name && !jsanimate">
        <slot ></slot>
    </transition> 
     <transition  v-if="jsanimate"
        @before-enter="before_enter"
        @enter="enter"
        @after-enter="after_enter"

        @before-leave="before_leave"
        @leave="leave"
        @after-leave="after_leave"
     >
        <slot ></slot>
    </transition> 
</div>
</template>

 

<script>
import animations from 'create-keyframe-animation';

import {prefixStyle} from 'common/js/dom';

const transform=prefixStyle('transform');//浏览器兼容
export default {
    name:'Trans_fade',
    data(){
        return {}
    },
    props:{
        name:{
            type:String,
            default:'translateTd'
        },
        js_animate:{
            type:String,
            default:''
            
        },
        elname:{
            
            defalut:''
        }
    },
    computed:{
        jsanimate(){
            if(!this.js_animate){
                return false
            }
            return (this.js_animate);
        }
    },
    methods:{
        _getPostAndScale(){
                const targetWidth = 40
                const paddingLeft = 40
                const paddingBottom = 30
                const paddingTop = 80
                const width = window.innerWidth * 0.8
                const scale = targetWidth / width
                const x = -(window.innerWidth / 2 - paddingLeft)
                const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
                return {
                x,
                y,
                scale
                }
        },
        before_enter(el,done){
            if(this.jsanimate===false){
                return;
            }else{
                 setTimeout(() => {
                     
                 }, 1000);
            }
        },
        enter(el,done){
            if(this.jsanimate===false){
                return;
            }else{
                if(this.jsanimate=='createKeyframe_ani'&&this.elname){
                    // console.log(this.jsanimate,'e',el);
                    const {x,y,scale}=this._getPostAndScale();

                    let animation={
                        0: {
                            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
                        },
                        60: {
                            transform: `translate3d(0,0,0) scale(1.1)`
                        },
                        100: {
                            transform: `translate3d(0,0,0) scale(1)`
                        }
                    }

                    animations.registerAnimation({
                        name:'move',
                        animation,
                        presets:{
                            duration:400,
                            easing:'linear'
                        }
                    });
                    // console.log(this.elname);
                    animations.runAnimation(this.elname,'move',done);
                }
            }
            
        },
        after_enter(el){
            if(this.jsanimate===false){
                return;
            }else{
                if(this.jsanimate=='createKeyframe_ani'&&this.elname){
                    animations.unregisterAnimation('move');
                    this.elname.style[transform]='';
                 }
            }
        },
        before_leave(el){
            // console.log(2);
            if(this.jsanimate===false){
                return;
            }else{
                //  console.log(this.jsanimate,'b_l');
            }
        },
        leave(el,done){
            if(this.jsanimate===false){
                return;
            }else{
                if(this.jsanimate=='createKeyframe_ani'&&this.elname){
                    this.elname.style.transition="all .4s";
                    const {x,y,scale}=this._getPostAndScale();
                    this.elname.style[transform]=`translate3d(${x}px,${y}px,0) scale(${scale})`;
                    this.elname.addEventListener('transitionend',done);
                }
            }
            
        },
        after_leave(el){
            if(this.jsanimate===false){
                return;
            }else{
                //  console.log(this.jsanimate,'a-L');
            }
        }
        
    }
}
</script>

<style lang="stylus" scoped>
.translateTd-enter-active, .translateTd-leave-active
    transition all .5s
.translateTd-enter, .translateTd-leave-to
    transform:translate3d(100%,0,0)


.opc-enter,.opc-leave-to
    opacity: 0

.opc-enter-active,.opc-leave-active
    transition: opacity 0.4s



</style>
