import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'


//获取歌词
export function getLyric(mid) {
    const url = '/api/lyric'
    const data = Object.assign({}, commonParams, {
      songmid: mid,
      platform: 'yqq',
      hostUin: 0,
      needNewCode: 0,
      pcachetime: +new Date(),
      format: 'json',
      g_tk: 67232076
    })
  
    return axios.get(url, {
      params: data
    }).then((res) => {
        //  console.log(res);
        
        return Promise.resolve(res.data)
    })
  }