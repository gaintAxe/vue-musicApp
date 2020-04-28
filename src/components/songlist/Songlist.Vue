<template>
    <div class="song-list">
        <ul>
            <li @click="onclick_playsong(songs,ind)"
            v-for="(song,ind) in songs" 
            :key="song.id"
            class="item">
                <div class="rank" v-show="isrank">
                  <span :class="getRankcls(ind)">{{getRanktext(ind)}}</span>
                </div>
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getdesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name:'Songlist',
    props:{
        songs:{
            type:Array,
            default:[]
        },isrank:{
          default:false
        }
    },
    methods:{
        getdesc(song){
            return  `${song.singer}-${song.album}`
        },
        onclick_playsong(songs,index){
          this.$emit('onclickPlaysong',songs,index);
        },
        getRankcls(ind){
          if(ind<=2){
            return `icon icon${ind}`;
          }else{
            return `text`;
          }
        },getRanktext(ind){
          if(ind>2){
            return ind+1;
          }
        }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>
