const crypto = require('crypto')
const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

module.exports.md5 = function (s) {
    const m = crypto.createHash('md5')
    return m.update(s).digest('hex')
}

module.exports.base64_decode = function (g) {
    var j = String(g).replace(/[=]+$/, "")
    if (j.length % 4 == 1) {
        throw new a("'atob' failed: The string to be decoded is not correctly encoded.")
    }
    for (var i = 0, h, e, d = 0, f = ""; e = j.charAt(d++); ~e && (h = i % 4 ? h * 64 + e : e,
    i++ % 4) ? f += String.fromCharCode(255 & h >> (-2 * i & 6)) : 0) {
        e = c.indexOf(e)
    }
    return f
}

module.exports.chr = function (a) {
    return String.fromCharCode(a)
}

module.exports.ord = function (a) {
    return a.charCodeAt()
}

module.exports.time = function () {
    var a = new Date().getTime()
    return parseInt(a / 1000)
}

module.exports.options = (pageNum) => {
    return {
        uri: pageNum ? `http://jandan.net/ooxx/page-${pageNum}#comments` : 'http://jandan.net/ooxx',
        method: 'get',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Upgrade-Insecure-Requests': 1,
            'Host': 'jandan.net',
            'Referer': 'http://jandan.net/'
        }
    }
}