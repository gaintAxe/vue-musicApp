import Vue from 'vue';
import Vuex from 'vuex';
// import data_singer from './data_singer'
// import createLogger from 'vuex/dist/logger'//日志

Vue.use(Vuex);
// const debug=process.env.NODE_ENV!=='prodection';
import {MODE_SEQ,MODE_ONE,MODE_RANDOM} from './mode-type.js'

export default new Vuex.Store({
    state:{
     
        playData:{
            playing:false//播放状态
            ,fullscreen:false//播放器展开和收起
            ,playlist:[]//当前播放列表列表
            ,sequencelist:[]//原始列表
            ,mode:MODE_SEQ//播放模式0列表循环1单曲循环2随机播放
            ,curindex:-1//当前播放的索引
            ,randomlist:[]//随机队列
        },
        v:{
            singerv:{},
            recommendv:{},
            rankV:{},
            backname:''
        },
        searchHistory:localStorage['searchHistory']?localStorage['searchHistory'].split(","):[]
       
        
    },
    actions:{
        set_playData_action:function(ctx,c){
            ctx.commit('set_playData_mutations',c);
        }, 
        set_v_action:function(ctx,c){
            ctx.commit('set_v_mutations',c);
        },
        set_searchHistory_action:function(ctx,c){
            ctx.commit('set_searchHistory_mutations',c);
        },
       
    },
    mutations:{
        set_playData_mutations:function(state,c){
            //c的格式  [['curIndex',-1],[],[]]
            for(let v in c){
                state.playData[c[v][0]]=c[v][1];
            }
        }, 
        set_v_mutations:function(state,c){
            //c的格式  [['curIndex',-1],[],[]]
            for(let v in c){
                state.v[c[v][0]]=c[v][1];
            }
        },
        set_searchHistory_mutations:function(state,c){
            //c的格式  [['curIndex',-1],[],[]]
                // console.log(c);
                if(c instanceof Array){
                    console.log('shuz')
                    //传入一个数组
                    state.searchHistory=c;
                    // console.log(state.searchHistory);
                    localStorage['searchHistory']=c;
                }else{

                
                let history=state.searchHistory;
                history=history.filter(function(v){
                    return v!==c;
                });
                if(history.length+1>15){
                    history.pop();
                    
                }history.unshift(c);
                
                console.log(history);
               
                state.searchHistory=history;
                // console.log(state.searchHistory);
                localStorage['searchHistory']=history;
               }
                
          
        }
       
    },getters: {
        cursong: state => {
          return state.playData.playlist[state.playData.curindex]
        }
      }
});

