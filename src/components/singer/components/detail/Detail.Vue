<template>
    <div class="singer-detail">
            <Musiclist :songs="songs" :msgdata="singer"></Musiclist>
            <!-- {{singer}} -->
    </div>
</template>

<script>
import {getSingerDetail,getSongVkey} from 'api/singer.js'//获取歌手详情(包含歌手的歌曲列表)根据mid获取歌曲vkey
import Musiclist from '@/components/musiclist/Musiclist';//图片加songlist组件
import {ERR_OK} from 'api/config.js' //请求成功标志
import {createSong} from 'common/js/songs.js'//获得 格式化化歌曲列表的函数时
export default {
    name:'SingerDateil',
    data(){
        return {
            id: this.$route.params.id,
            singer:this.$store.state.v.singerv,
            backname:this.$store.state.v.backname,
            songs:[]
        }
    },
    components:{Musiclist},
    methods:{
        _getDetail(){
            if(!this.singer.id){
                this.$router.push('/'+this.backname);
                return;
            }
            getSingerDetail(this.singer.id).then((res)=>{
                if(res.code ===ERR_OK){
                    //console.log('res',res);
                    this.songs=this._norSongs(res.data.list);
                    console.log(this.songs,this.singer);
                }
                
            })
        },
        _norSongs(list){
            let ret=[];
            list.forEach((item)=>{
                let {musicData}=item;
                // if(musicData.songid&&musicData.albummid){
                //     ret.push(createSong(musicData));
                // }
                getSongVkey(musicData.songmid).then((res) => {
                    // console.log(res);
                    const vkey = res.data.items[0].vkey;
                    //console.log(res);
                    if (musicData.songid && musicData.albummid ) {
                        ret.push(createSong(musicData, vkey))
                    }
                })
            })
            // console.log(ret);
            return ret;
        }
    },created(){
        this._getDetail();
    }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.singer-detail
    position fixed
    z-index:100
    top:0
    left:0
    right:0
    bottom:0
    background:$color-background

// .translateTd-enter-active, .translateTd-leave-active
//     transition all 1s
// .translateTd-enter, .translateTd-leave-to
//     transform:translate3d(100%,0,0)

// .translateTd-enter-to, .translateTd-leave
//     transform:translate3d(0%,0,0)
</style>
