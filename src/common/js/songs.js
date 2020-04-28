import {getLyric} from '@/api/song';
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

import {qvkey}  from './vkey.js'
export default class Songs{
    constructor({id,mid,singer,name,album,duration,image,url}){
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }


    getLyric () {
      if (this.lyric) {
        return Promise.resolve(this.lyric)
      }
      //这里用Promsie返回，同样的道理：后面调用这个方法，方便进一步操作数据，同2中的promsie
      return new Promise((resolve, reject) => {
        getLyric(this.mid).then((res) => {
          // console.log(res);
          if (res.code === ERR_OK) {
            //返回数据的是 base64 的字符串，需要解码，这里用到了第三方库: js-base64
            
            if(res.lyric){
              this.lyric = Base64.decode(res.lyric);
            }
            
             
            resolve(this.lyric)
          } else {
            // reject(new Error('no lyric'))
            
              this.lyric=`暂无歌词`
              // console.log(this.lyric)
          }
          // console.log(this.name,this.lyric);
        })
      })
    }

}

export function createSong(musicData,vkey){
    // console.log(musicData);
    //DD6B899929E12549D3CE508488636D64285892AA3DBA44C7198D7CB5F9215C911ACB4D90F5FC2ADCC0CCA30F6C59844A23E51F5EE7564722
    let url;
    if(vkey==''){
      vkey=qvkey;
      
    }
    let song=new Songs({
      id: musicData.songid,
      mid: musicData.songmid,
      singer: filterSinger(musicData.singer),
      name: musicData.songname,
      album: musicData.albumname,
      duration: musicData.interval,
      image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
      url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?fromtag=38&guid=5931742855&vkey=${vkey}`
    });
    song.getLyric();
    return song;
}

//获取歌手名称（可能有多个歌手）
export function filterSinger(singer) {
    let ret = []
    if (!singer) {
      return ''
    }
    singer.forEach((s) => {
      ret.push(s.name)
    })
    return ret.join('/')
  }


