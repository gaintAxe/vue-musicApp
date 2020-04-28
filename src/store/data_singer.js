// let defaultcity={};
// try{
//     if(localStorage){
//         defaultcity=localStorage['v'];
//     }
// }catch(e){

// }

export default {
    state:{
        singerv:''
    },
    actions:{
        actions_singer:function(ctx,c){
            ctx.commit('mutations_singer',c);
        }
    },
    mutations:{
        mutations_singer:function(state,c){
            state.singerv=c;
            // try {
            //     localStorage['sid']=c;
            // }catch (e){}
        }
    }
}