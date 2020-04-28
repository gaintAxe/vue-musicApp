//洗牌函数
export function shuffle(arr){
    let list=[];
    for(let i=0;i<arr.length;i++){
        list.push(arr[i]);
    }
    // console.log('list',list);
    for(let i=0;i<list.length;i++){
        let j=getRandomInt(0,list.length);
        // console.log(j);
        let t=list[i];
        list[i]=list[j];
        list[j]=t;
    }
    return list;
}

//返回一个随机数
function getRandomInt(min,max){
    return Math.floor(Math.random()*(max-min)+min);
}

//节流函数

export function debounce(func,delay){
    let timer
    return function(...args){
        if(timer){
            clearTimeout(timer);
        }
        timer=setTimeout(()=>{
            func.apply(this,args);
        },delay)
    }
}