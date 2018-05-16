const cheerio = require('cheerio')
const rp = require('request')
const md5 = require('./util').md5
const base64_decode = require('./util').base64_decode
const chr = require('./util').chr
const ord = require('./util').ord
const options = require('./util').options

const CODEJSLINKURI = 'http://cdn.jandan.net/static/min/d5ede23626d328724a5765b23e13b6f7GomImiDH.11102335.js'

const getEcode = () => {
    return new Promise((resolve, reject) => {
        rp.get(CODEJSLINKURI, (erroe, res, body) => {
            resolve(body.match(/(jandan_load_img)(.+?)(\(e,")(.+?)("\))(.+?)(var\sa=)/u)[4])
        })
    })
}

const encode = function (m, r) {
    var r = r ? r : ""
    var q = 4;
    r = md5(r);
    var o = md5(r.substr(0, 16));
    var n = md5(r.substr(16, 16));
    var l = m.substr(0, q);
    var c = o + md5(o + l);
    var k;
    m = m.substr(q);
    k = base64_decode(m)
    var h = new Array(256);
    for (var g = 0; g < 256; g++) {
        h[g] = g
    }
    var b = new Array();
    for (var g = 0; g < 256; g++) {
        b[g] = c.charCodeAt(g % c.length)
    }
    for (var f = g = 0; g < 256; g++) {
        f = (f + h[g] + b[g]) % 256;
        tmp = h[g];
        h[g] = h[f];
        h[f] = tmp
    }
    var t = "";
    k = k.split("");
    for (var p = f = g = 0; g < k.length; g++) {
        p = (p + 1) % 256;
        f = (f + h[p]) % 256;
        tmp = h[p];
        h[p] = h[f];
        h[f] = tmp;
        t += chr(ord(k[g]) ^ (h[(h[p] + h[f]) % 256]))
    }
    return 'http:' + t.substr(26)
}

module.exports.getIMDBCharacters = async (page,callback) => {
    const code = await getEcode()
    rp(options(page), (error, res, body) => {
        const $ = cheerio.load(body)
        let txt = ''
        const imgArr = $('span.img-hash').map((idx, ele) => {
            return encode(ele.children[0].data, code)
        })
        imgArr.map((idx, ele) => {
            if(ele){
                txt += ele + '\n'
            }
        })
        callback(null,txt)
    })
}