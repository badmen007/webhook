import http from 'http'

const server = http.createServer((req, res) => {
  console.log(req.url, req.method)
  if (req.url == '/webhook' && req.method == 'POST') {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true }));
  } else {
    res.end('Not Found')
  }
})

server.listen(4000, () => {
  console.log('server is running on 4000')
})
