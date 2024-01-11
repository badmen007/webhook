import http from 'http'
import { spawn } from 'child_process'
import crypto from 'crypto'
const SECRET = "123456";
function sign(data) {
  return "sha1=" + crypto.createHmac("sha1", SECRET).update(data).digest("hex");
}

const server = http.createServer((req, res) => {
  console.log(req.url, req.method)
  if (req.url == '/webhook' && req.method == 'POST') {

    let buffers = [];
    req.on("data", function (data) {
      buffers.push(data);
    });
    req.on('end', function() {
      let body = Buffer.concat(buffers);
      let sig = req.headers["x-hub-signature"];
      let event = req.headers["x-github-event"];
      let id = req.headers["x-github-delivery"];
      if (sig !== sign(body)) {
        return res.end("Not Allowed");
      }
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ok: true }));

      if (event == "push") {
        let payload = JSON.parse(body);
        console.log(payload);
        let child = spawn("sh", [`./${payload.repository.name}.sh`]);
        let buffers = [];
        child.stdout.on("data", function (buffer) {
          buffers.push(buffer);
        });
      }
    })
  } else {
    res.end('Not Found')
  }
})

server.listen(4000, () => {
  console.log('server is running on 4000')
})
