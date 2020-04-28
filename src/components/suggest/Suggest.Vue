<template>

    <Scroll class="suggest" :data="result" :pullup='pullup' @scrollend='scrollend' ref="suggest"
        @nofocus="nofocus">
        <ul class="suggest-list">
             
            <li class="suggest-item" 
                v-for="(item,k) in result" :key="k" @click="onclick_sinOrsong(item)">
                <div class="icon"><i :class="getIconCls(item)"></i></div>
                <div class="name">
                    <p class="text" v-html="getDisplayname(item)"></p>
                </div>
            </li> <Loading title=""  v-show="!isok && result.length!==0"></Loading>
        </ul>
        <div class="loading-container" v-show="result.length==0">
           <Loading title=""  ></Loading>
        </div>
        <div class="no-result-wrapper"
                v-if=" isok==true && hasMore==false && result.length!==0 && result[1].length==0 ">
             <Nores title="没有结果" ></Nores>
        </div>
    </Scroll>
    
       
</template>

<script>
import Loading from '@/base/loading/Loading';
import Scroll from '@/base/scroll/Scroll'
import Nores from 'base/noresult/Noresult'

import {search} from 'api/search.js' //得到api中的请求函数
import {ERR_OK} from 'api/config' //请求成功标志
// import {filterSinger} from 'common/js/songs.js'//获得函数--获取歌手名称（可能有多个歌手
import {createSong} from 'common/js/songs.js';//获得 格式化化歌曲列表的函数
import {getSongVkey} from 'api/singer.js'//根据mid获取歌曲vkey
import Singer from 'common/js/singer'//获取singer类方法

import {qvkey} from 'common/js/vkey';
const TYPE_SINGER='singer'
export default {
    name:'Suggest',
    props:{
        query:{
            type:String,
            default:''
        },showdinger:{
            default:true
        }

    },components:{
        Scroll,Loading,Nores
    },data(){
        return {
            page:1,
            result:[],
            pullup:true,isok:true,
            hasMore:true,
            perpage:20,
            
           
        }
    },computed:{
        cursong(){
          return this.$store.getters.cursong;
        }
    },
    watch:{
        query(){
            this.result=[];
            this.hasMore=true;
            this.page=1;
            this._search();
            this.$refs.suggest.scrollTo(0,0);
        },
        result(res){
            // if(!res){return}
            if(res[1] && res[1].length==0 ){
                this.nores=true;
            }else{
                this.nores=false;
            }
        }
    },methods:{
        //滚动让input失去焦点
        nofocus:function(){
            this.$emit('nofocus');
        },
        //判断歌手进入歌手详情页 点击
        onclick_sinOrsong(item){
            //console.log(item);
            if(item.type=='singer'){
                //为歌手
                //保存至localstorage
                this.$emit('updatahistory',item.singername);
                const singer = new Singer({
                    id: item.singermid,
                    name: item.singername
                })
                // console.log(item);
                this.$emit('tosingerDetail',[['singerv',singer],['backname','search']]);
            }else{
                //为歌曲
                //查找是否已经由此歌曲
                if(this.cursong && item.id==this.cursong.id){
                    return;
                }
                //保存至localstorage
                this.$emit('updatahistory',item.name);
                
                getSongVkey(item.mid).then((res) => {
                        let  vkey = res.data.items[0].vkey;
                        console.log(res);
                        if(!vkey){
                            vkey=qvkey;
                        }
                        item.url=`http://dl.stream.qqmusic.qq.com/C400${item.mid}.m4a?fromtag=38&guid=5931742855&vkey=${vkey}`;
                        //console.log(item);
                        let index=0,flag=0;
                        let songs=this.$store.state.playData.playlist;
                        for(let i=0;i<songs.length;i++){
                            if(songs[i].id==item.id){
                                index=i;
                                flag=1;
                                break;
                            }
                        }
                        if(!flag){
                            songs.unshift(item);
                            index=0;
                        }
                        
                        let option=[
                            ['curindex',index],
                            ['playlist',songs],
                            ['sequencelist',songs],
                                ['randomlist',songs],
                            ['playing',true]
                        ]
                        if(this.$store.state.playData.curindex==-1){
                            option.push(['fullscreen',true]);
                        }
                        this.$store.dispatch('set_playData_action',option);
                })

                
            }
        },
        //请求搜索结果
        _search(){
            if(!this.isok){
                return;
            }
            if(!this.hasMore){
                return;
            }
            let showdinger;
            if(this.result.length==0){
                showdinger=this.showdinger;
            }else{
                showdinger=false;
            }
            this.isok=false;
            search(this.query,this.page,showdinger,this.perpage).then((res)=>{
                
                let objstr=res.slice(9,-1);
                // console.log(JSON.parse(objstr));
                res=JSON.parse(objstr);
                //console.log(res);
                if(res.code==ERR_OK){
                        this._checkMore(res.data);
                        this.result=this.result.concat(this._norRes(res.data));
                        this.isok=true;
                        
                    
                   
                }

            })
        },
        //格式res
        _norRes(data){
            let ret = []
            if (data.zhida && data.zhida.singerid) {
                ret.push({...data.zhida, ...{type: TYPE_SINGER}})
            }
            if (data.song) {
            ret = ret.concat(this._norSongs(data.song.list))
            }
            return ret
        },
        //格式化歌曲
         _norSongs(list){
            let ret = []
            list.forEach((musicData) => {
                if (musicData.songid && musicData.albummid) {
                    ret.push(createSong(musicData));
                }
            })
            //console.log(ret);
            return ret
            // var ret=[];
            // // console.log(ret);
            // let len=0;
            // list.forEach((item,index)=>{
            //     getSongVkey(item.songmid).then((res) => {
            //         // console.log(res);
            //         const vkey = res.data.items[0].vkey;
            //         //console.log(res);
            //         if (item.songid && item.albummid ) {
            //             var obj={};
            //             var songobj=createSong(item,vkey);
            //             obj= Object.assign(songobj,obj,{type:'song'});
            //             ret.push(obj);
            //             //  console.log(ret);
            //             // ret.forEach((item)=>{
            //             //     item['type']='song'
                            
            //             // })
                        
            //             if(index==list.length-1){
            //                 console.log('length',list.length,ret.length,ret);
            //                 return ret;
            //             }
                        
            //         }
            //     })
            // })
            // // ret.length=len;
            
           
            
        },
        //根据歌手或歌曲返回不同的样式
        getIconCls(item){
            if (item.type === TYPE_SINGER) {
            return 'icon-mine'
            } else {
            return 'icon-music'
            }
        },
        //根据歌手或歌曲返回不同的内容
        getDisplayname(item){
            if (item.type === TYPE_SINGER) {
            return item.singername
            } else {
            return `${item.name}-${item.singer}`
            }
        },
        //滚动到底部加载更多
        scrollend(){
            // console.log(1);
            this.page++;
            this._search();
        },
        //是否有更多
        _checkMore(data) {
            const song = data.song
            if (!song.list.length || (song.curnum + song.curpage * this.perpage) > song.totalnum) {
            this.hasMore = false
            }
      }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    background:$color-background
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
 .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
