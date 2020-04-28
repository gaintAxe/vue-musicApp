import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'
//获取热门搜索
export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

//获取搜索结果
export function search(query, page, zhida=1,perpage) {
  //query 搜索关键词 page 页数  zhida 是否包含歌手
  //https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp
  const url = '/search'

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
     perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
