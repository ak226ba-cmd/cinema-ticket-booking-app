
import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'

const PORT = process.env.PORT || 3000

const contentTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript'
}

const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname

    const files = {
      '/': 'index.html',
      '/style.css': 'style.css',
      '/script.js': 'script.js'
    }

    const filename = files[pathname]

    if (!filename) {
      res.writeHead(404)
      res.end('Page not found')
      return
    }

    const filePath = join(process.cwd(), 'public', filename)
    const content = await readFile(filePath)

    res.writeHead(200, {
      'Content-Type': contentTypes[extname(filename)]
    })

    res.end(content)
  } catch (error) {
    console.error(error)
    res.writeHead(500)
    res.end('Internal server error')
  }
})

server.listen(PORT, () => {
  console.log(`Cinema app running at http://localhost:${PORT}`)
})
