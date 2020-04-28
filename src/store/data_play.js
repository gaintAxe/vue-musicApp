// let defaultcity={};
// try{
//     if(localStorage){
//         defaultcity=localStorage['v'];
//     }
// }catch(e){

// }

export default {
    state:{
        play:{}
    },
    actions:{
        actions_singer:function(ctx,c){
            ctx.commit('mutations_play',c);
        }
    },
    mutations:{
        mutations_play:function(state,c){
            state.play=c;
            // try {
            //     localStorage['sid']=c;
            // }catch (e){}
        }
    }
}