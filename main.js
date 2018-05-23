const readline = require('readline')
const fs = require('fs')
const rl = readline.createInterface(process.stdin, process.stdout)
const getIMDBCharacters = require('./spider').getIMDBCharacters
const mapLimit = require("async/mapLimit")
pageArr = []

function getTotalPage() {
    pageArr = fs.readFileSync('page.txt', 'utf-8').split(',').reverse()
    pageArr.push('')
    return pageArr.length
}

function start() {
    const totalPage = getTotalPage()
    rl.setPrompt(`当前总页数为${totalPage},请输入你想抓取的页数（从1开始抓取）`)
    rl.prompt()
    rl.on('line', (answer) => {
        if (!Number.isInteger(Number.parseInt(answer)) || answer > totalPage || answer < 1) {
            console.log(`请输入1-${totalPage}之间的页数！`)
        } else {
            let pageArrs = []
            for (let i = Number.parseInt(answer) - 1; i < totalPage; i++) {
                pageArrs.push(pageArr[i])
            }
            mapLimit(pageArrs, 5, (item, callback) => {
                console.log(`开始抓取第${pageArr.indexOf(item)+1}页`)
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