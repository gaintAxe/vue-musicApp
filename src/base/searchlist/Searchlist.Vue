<template>
  <!-- //搜索历史列表 -->
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li  class="search-item"  v-for="(item) in searches" :key="item" @click="clickitem(item)">
            <span class="text">{{item}}</span>
            <span class="icon" >
            <i class="icon-delete" @click.stop="delsearchhistory(item)"></i>
            </span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
        clickitem(item){
            console.log(item)
            this.$emit('clickitem',item);
        },
        delsearchhistory(item){
            this.$emit('delsearchhistory',item);
        }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>