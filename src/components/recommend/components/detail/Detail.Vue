<template>
    <div class="recommendDetail">这是recommenddetail
        <Musiclist :songs="songs" :msgdata="_norsinger(msgdata)" :author="author"></Musiclist>
        
    </div>
</template>

<script>
import {getSongVkey} from 'api/singer.js'//根据mid获取歌曲vkey
import {getSongList} from '@/api/recommend.js'//根据歌单id获取歌曲列表
import Musiclist from '@/components/musiclist/Musiclist';//图片加songlist组件
import {ERR_OK} from 'api/config.js' //请求成功标志
import {createSong} from 'common/js/songs.js' //获得 格式化化歌曲列表的函数
export default {
    name:'RecommendDetail',
    data(){
        return {
            id: this.$route.params.id,
            msgdata:this.$store.state.v.recommendv,
            songs:[]
        }
    },
    computed:{
        author(){
            // return this.$store.state.recommendv.creator.name;
        }
    },
    components:{Musiclist},
    methods:{
        _norsinger(data){
            // console.log(data);
            let obj={};
            obj.name=data.dissname;
            obj.id=data.dissid;
            obj.avatar=data.imgurl;
            
            // console.log(obj);
            return obj;
        },
        _getsonglist(){
             if(!this.msgdata.dissid){
                console.log(1);
                this.$router.push('/recommend');
                return;
            }
            getSongList(this.msgdata.dissid).then((res)=>{
                // console.log(res.data.cdlist[0].songlist);
                this.songs=this._norSongs(res.data.cdlist[0].songlist);
            })
        },
        _norSongs(list){
            let ret=[];
            list.forEach((item)=>{
                let {musicData}=item;
                // console.log(item);
                // if(musicData.songid&&musicData.albummid){
                //     ret.push(createSong(musicData));
                // }
                getSongVkey(item.songmid).then((res) => {
                    // console.log(res);
                    const vkey = res.data.items[0].vkey;
                    //console.log(res);
                    if (item.songid && item.albummid ) {
                        ret.push(createSong(item, vkey))
                    }
                })
            })
            return ret;
        }
    }
    ,created(){
        
            this._getsonglist();
        
    },
    mounted(){
        // console.log(this.msgdata)
       
    }
    
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.recommendDetail
    position fixed
    z-index:100
    top:0
    left:0
    right:0
    bottom:0
    background:$color-background

</style>
