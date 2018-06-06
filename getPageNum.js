const cheerio = require('cheerio')
const rp = require('request-promise')
const fs = require('fs')
let arrPage = []
let logoPageArr = []

function getLogoFirstPage() {
    logoPageArr = fs.readFileSync('page.txt', 'utf-8').split(',')
    return logoPageArr[0]
}

function getPage(page) {
    let option = options(page)
    request(option, logoPageArr[0])
}

function request(options, logoIndex) {
    return new Promise((resolve, reject) => {
        rp(options)
            .then(($) => {
                if ($('.previous-comment-page').length > 0) {
                    const page = $('.previous-comment-page').attr('href').match(/(.*)-(\d+)#comments/u)[2]
                    if (logoPageArr.includes(page)) {
                        return
                    }
                    if (page === logoIndex) {
                        arrPage.pop()
                        for (let i = arrPage.length - 1; i >= 0; i--) {
                            logoPageArr.unshift(arrPage[i])
                        }
                        fs.writeFileSync('page.txt', logoPageArr)
                        return
                    }
                    arrPage.push(page)
                    setTimeout(() => {
                        resolve(getPage(page))
                    }, 1000)
                } else {
                    console.log(arrPage.toString())
                    fs.writeFileSync('page.txt', arrPage)
                    return
                }
            })
            .catch((err) => {
                console.log('err', arrPage.toString())
                fs.writeFileSync('page.txt', arrPage)
                reject(err)
            })
    })
}

function options(page) {
    const url = page ? `http://jandan.net/ooxx/page-${page}` : 'http://jandan.net/ooxx/'
    return {
        uri: url,
        transform(body) {
            return cheerio.load(body)
        },
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36'
        }
    }
}

module.exports=function () {
    return new Promise(resolve => {
        getLogoFirstPage()
        getPage()
        resolve()
    })
}