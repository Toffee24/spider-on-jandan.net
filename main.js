const readline = require('readline')
const fs = require('fs')
const cheerio = require('cheerio')
const options = require('./util').options
const rp = require('request')
const rl = readline.createInterface(process.stdin, process.stdout)
const getIMDBCharacters = require('./spider').getIMDBCharacters
const mapLimit = require("async/mapLimit")

pageArr = []

function getTotalPage() {
    return new Promise(resolve => {
        rp(options(), (err, res, body) => {
            const $ = cheerio.load(body)
            const total = Number.parseInt($('span.current-comment-page').eq(0).text().replace(/[\[\]]/, ''))
            resolve(total)
        })
    })
}

async function start() {
    const totalPage = await getTotalPage()
    rl.setPrompt(`当前总页数为${totalPage},请输入你想抓取的页数（从需要抓取的页数开始向后抓取）`)
    rl.prompt()
    rl.on('line', (answer) => {
        if (!Number.isInteger(Number.parseInt(answer)) || Number.parseInt(answer) > totalPage || Number.parseInt(answer) < 1) {
            console.log(`请输入1-${totalPage}之间的页数！`)
        } else {
            let pageArrs = []
            for (let i = Number.parseInt(answer); i <= totalPage; i++) {
                pageArrs.push(i)
            }
            mapLimit(pageArrs, 5, (item, callback) => {
                console.log(`开始抓取第${item}页`)
                getIMDBCharacters(item, callback)
            }, (error, result) => {
                fs.writeFileSync('url.txt', result.join(''))
                rl.close()
            })
        }
    })
    rl.on('close', () => {
        process.exit(0)
    })
}

start()