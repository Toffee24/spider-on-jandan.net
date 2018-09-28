const cheerio = require('cheerio')
const rp = require('request')
const md5 = require('./util').md5
const base64_decode = require('./util').base64_decode
const chr = require('./util').chr
const ord = require('./util').ord
const options = require('./util').options
const Url = require('./orm')

const getCodeLinkUrl = () => {
  return new Promise(resolve => {
    rp(options(), (error, res, body) => {
      resolve('http:' +
          body.match(/(\/\/cdn\.jandan\.net\/static\/min\/)(.*)(.js)/u)[0]
      )
    })
  })
}

const getEcode = (CODEJSLINKURI) => {
  return new Promise((resolve) => {
    rp.get(CODEJSLINKURI, (erroe, res, body) => {
      resolve(body.match(
          /(jandan_load_img)(.+?)(\(e,")(.+?)("\))(.+?)(var\sa=)/u)[4])
    })
  })
}

const encode = function(n, t) {
  t = t ? t : ''
  let e = 0
  let r = 4
  let l
  t = md5(t)
  let d = n
  let p = md5(t.substr(0, 16))
  let o = md5(t.substr(16, 16))
  let m = n.substr(0, r)
  let c = p + md5(p + m)
  n = n.substr(r)
  l = base64_decode(n)
  let k = new Array(256)
  for (let h = 0; h < 256; h++) {
    k[h] = h
  }
  let b = new Array()
  for (let h = 0; h < 256; h++) {
    b[h] = c.charCodeAt(h % c.length)
  }
  for (let g = h = 0; h < 256; h++) {
    g = (g + k[h] + b[h]) % 256
    tmp = k[h]
    k[h] = k[g]
    k[g] = tmp
  }
  let u = ''
  l = l.split('')
  for (let q = g = h = 0; h < l.length; h++) {
    q = (q + 1) % 256
    g = (g + k[q]) % 256
    tmp = k[q]
    k[q] = k[g]
    k[g] = tmp
    u += chr(ord(l[h]) ^ (k[(k[q] + k[g]) % 256]))
  }
  u = base64_decode(d)
  return 'http:' + u
}

function replace_url(url) {
  return url.replace(/(http.+\/\/.+)(\/.+\/)(.+\..+)/, '$1/large/$3')
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

module.exports.getIMDBCharacters = async (page, callback) => {
  const link = await getCodeLinkUrl()
  const code = await getEcode(link)
  let txt = ''
  const imgArr = await (() => {
    return new Promise(resolve => {
      rp(options(page), (error, res, body) => {
        const $ = cheerio.load(body)
        const $imgItem = Array.from(
            $('.commentlist').children('li').filter('[id]'))
        let imgArr = []
        $imgItem.forEach((ele, idx) => {
          const imgHashEle = $(ele).find('span.img-hash')
          const imgLength = imgHashEle.length
          const jandanVote = $(ele).find('.jandan-vote')
          const oo = Number.parseInt(
              jandanVote.find('.tucao-like-container span').text())
          const xx = Number.parseInt(
              jandanVote.find('.tucao-unlike-container span').text())
          for (let i = 0; i < imgLength; i++) {
            let obj = {
              xx: xx,
              oo: oo,
            }
            const url = replace_url(encode(imgHashEle.eq(i).text(), code))
            obj.url = url
            imgArr.push(obj)
          }
        })
        imgArr.map((ele, idx) => {
          if (ele) {
            txt += ele.url + '\n'
          }
        })
        resolve(imgArr)
      })
    })
  })()
  for (let e of imgArr) {
    await Url.findOne({
      where: {
        pic_url: e.url,
      },
    }).then(result => {
      if (result) {
        result.update({
          oo: e.oo,
          xx: e.xx,
          pic_url: e.url,
        })
      }
      else {
        Url.create({
          pic_url: e.url,
          oo: e.oo,
          xx: e.xx,
        })
      }
    })
  }
  callback(null, txt)
}
