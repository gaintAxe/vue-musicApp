<template>
    <div class="singer" ref="singerlist">
        <!-- listview 歌手列表 -->
        <Listview :data="singers" @onclick_todetail_singer="onclick_todetail_singer"></Listview> 
         <Trans_fade name="translateTd" >
             <router-view></router-view>   
             <!-- detail 歌手详情切换 -->
         </Trans_fade>
    </div>
</template>

<script>
import {playlistMixin} from 'common/js/mixin.js'
import {getSingerList} from 'api/singer.js'
import {ERR_OK} from 'api/config.js'
import Singer from 'common/js/singer'
import Listview from 'base/listview/Listview'
import Trans_fade from '@/base/trans/Trans_fade'
const HOT_NAME='热门';
const HOT_SINGER_LEN=10;
export default {
    name:'Singer',
    mixins:[playlistMixin],
    data(){
       return {
            singers:[]
       }
    },
    components:{
        Listview,Trans_fade
    },
    created(){
        this._getSingerList();
    },
    methods:{
        onclick_todetail_singer(v){
            this.$store.dispatch('set_v_action',[['singerv',v],['backname','singer']]);
            // this.$store.dispatch('actions_backname','singer');
            this.$router.push('/singer/'+v.id);
        },
        _getSingerList(){
            getSingerList().then((res)=>{
                // if(res.code===ERR_OK){
                    // console.log('singer',res)
                    this.singers=res.data.list
                    this.singers=this._normalizeSinger(this.singers);
                // }
            })
        },
        //格式化singer
        _normalizeSinger(list){
            let map={
                hot:{
                    title:HOT_NAME,
                    items:[]
                }
            }
            list.forEach((item,index)=>{
                if(index<HOT_SINGER_LEN){
                  map.hot.items.push(new Singer({
                      id:item.Fsinger_mid,
                      name:item.Fsinger_name
                  }))
                }
                const key=item.Findex;
                if(!map[key]){
                    map[key]={
                        title:key,
                        items:[]
                    }
                }
                map[key].items.push(new Singer({
                      id:item.Fsinger_mid,
                      name:item.Fsinger_name
                  }))
            })

            let hot=[];
            let ret=[];
            for(let key in map){
                let val=map[key]
                if(val.title.match(/[a-zA-Z]/)){
                    ret.push(val);
                }else if(val.title===HOT_NAME){
                    hot.push(val);
                }
            }
            ret.sort((a,b)=>{
                return a.title.charCodeAt(0)-b.title.charCodeAt(0);
            });
            return hot.concat(ret);
            // return map;
        },
        handlePlaylist(playlist){
            const bottom=playlist.length>0 ?'60px':'';
            this.$refs.singerlist.style.bottom=bottom;
            // this.$refs.singerlist.refresh();
        }
    }
}
</script>

<style lang="stylus" scoped>
 .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
