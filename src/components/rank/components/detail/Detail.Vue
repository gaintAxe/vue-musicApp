<template>
    <div class="rankdetail">
        <Musiclist :songs="songs" :msgdata="_norsinger(rankv)" isrank=true></Musiclist>
    </div>
    
</template>

<script>
import {getSingerDetail,getSongVkey} from 'api/singer.js'
import {getMusicList} from '@/api/rank.js'
import Musiclist from '@/components/musiclist/Musiclist';
import {ERR_OK} from 'api/config.js'
import {createSong} from 'common/js/songs.js'
export default {
    name:'RankDetail',
    components:{Musiclist},
    data(){
        return {
            id: this.$route.params.id,
            rankv:this.$store.state.v.rankv,
            songs:[]
        }
    },
    computed:{
        

    },methods:{
        _norsinger(data){
            // console.log(data);
            if(!data){
                return {}
            }
            let obj={};
            obj.name=data.topTitle;
            obj.id=data.id;
            obj.avatar=data.picUrl;
            if(this.songs.length>0){
                obj.avatar=this.songs[0].image;
            }
            // console.log(obj);
            return obj;
        },
        _getranklist(){
             if(!this.rankv){
                 console.log(1);
                this.$router.push('/rank');
                return;
            }
            // console.log(this.rankv);
            getMusicList(this.id).then((res)=>{
                console.log('rank',res);
                if(res.code ===ERR_OK){
                    //console.log('res',res);
                    this.songs=this._norSongs(res.songlist);
                    // console.log(this.songs,this.singer);
                }
            })
        },
        _norSongs(list){
            let ret=[];
            //按in-count排序
            // list.sort(function(a,b){
            //     return b.in_count-a.in_count;
            // })
            console.log('list',list);
            list.forEach((item)=>{
                let {data}=item;
                // if(musicData.songid&&musicData.albummid){
                //     ret.push(createSong(musicData));
                // }
                getSongVkey(data.songmid).then((res) => {
                    // console.log(res);
                    

                    const vkey = res.data.items[0].vkey;
                    //console.log(res);
                    if (data.songid && data.albummid ) {
                        ret.push(createSong(data, vkey))
                    }
                })
            })

            return ret;
        }
    },created(){
        this._getranklist();
    }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
.rankdetail
    position fixed
    z-index:100
    top:0
    left:0
    right:0
    bottom:0
    background:$color-background

</style>
