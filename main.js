const readline = require('readline')
const fs = require('fs')
const rl = readline.createInterface(process.stdin, process.stdout)
const rp = require('request')
const cheerio = require('cheerio')
const options = require('./util').options
const getIMDBCharacters = require('./spider').getIMDBCharacters
const mapLimit = require("async/mapLimit")

function getTotalPage() {
    return new Promise(resolve => {
        resolve(83)
        rp(options(), (err, res, body) => {
            const $ = cheerio.load(body)
            resolve($('span.current-comment-page').eq(0).text())
        })
    })
}

async function start() {
    const totalPage = 83
    rl.setPrompt(`当前总页数为${totalPage},请输入你想抓取的页数（从末尾开始抓取）`)
    rl.prompt()
    rl.on('line', (answer) => {
        if (!Number.isInteger(Number.parseInt(answer)) || answer > totalPage || answer < 1) {
            console.log(`请输入1-${totalPage}之间的页数！`)
        } else {
            let pageArrs = []
            for (let i = Number.parseInt(answer); i <= totalPage; i++) {
                pageArrs.push(i)
            }
            mapLimit(pageArrs, 5, (pageArr, callback) => {
                console.log(`开始抓取第${pageArr}页`)
                getIMDBCharacters(pageArr, callback)
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