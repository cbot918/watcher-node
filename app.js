const http = require('http')
const fs = require('fs')
const path = require('path')

// 路徑到您想監聽的文件
const filePath = path.join(__dirname, 'text.txt')

const server = http.createServer((req, res) => {
    if (req.url === '/events') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        })

        // 立即讀取並發送txt文件的內容
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            const formattedData = data.replace(/\n/g, '\\n');
            res.write(`data: ${formattedData}\n\n`)
        })

        // 監聽文件變化
        fs.watchFile(filePath, (curr, prev) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(err)
                    return
                }
                // 將連續的換行符號替換為一個換行符號，然後發送整個文件的內容
                const formattedData = data.replace(/\n/g, '\\n');
                res.write(`data: ${formattedData}\n\n`)
            })
        })

        req.on('close', () => {
            res.end()
        })
    } else {
        res.end('Not found')
    }
})

server.listen(3000, () => {
    console.log('SSE server running at http://localhost:3000')
})
