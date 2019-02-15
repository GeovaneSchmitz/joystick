var net = require('net');
var fs = require('fs');
const { spawn } = require('child_process');
var jsonFile = require('jsonfile')

var controllers = [];
var keymap = jsonFile.readFileSync("keymap.json");

controllers.client = []
controllers.available = function () {
  var list = {'1': true, '2':true, '3':true, '4':true};
  for(k in controllers.client ){
    list[controllers.client[k]] = false;
  }
  return list;
}
controllers.add = function (controller, id) {
  var available = true;
  for(k in this.client ){
  if(this.client[k]== controller){
      available = false;
    }
  }

  if (available) {
    this.client[id] = controller
    return true;
  } else {
    return false;
  }
}
controllers.disconnect = function (id) {
  delete this.client[id];
}

controllers.press = function (id, button) {
  key = keymap[this.client[id]][button]

  python.write(JSON.stringify({"type":"p","key":key}))
}
controllers.release = function (id, button) {
  key = keymap[this.client[id]][button]
  python.write(JSON.stringify({"type":"r","key":key}))
}

var python;

var sockPath = "keyboard.sock"


if (fs.existsSync(sockPath)) {
  fs.unlinkSync(sockPath);
}

var server = net.createServer(client => {
  const chunks = [];
  client.setEncoding('utf8');
  client.on('end', () => {
    python = undefined;
  });
  python = client


  client.on('data', chunk => {
    /*  console.log(`Got data: ${chunk}`);
     chunks.push(chunk)
 
     if (chunk.match(/\r\n$/)) {
         const { ping } = JSON.parse(chunks.join(''));
         client.write(JSON.stringify({ pong: ping }));
     } */
  });
});

server.on('listening', () => {
});
server.listen(sockPath);

function startpython(){
const pythonprocess = spawn('./controllers/main.py', [sockPath]);

pythonprocess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
  fs.writeFileSync('path-to-test.txt', 'stdout');
});

pythonprocess.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
  fs.writeFileSync('path-to-test.txt', 'stderr');
});

pythonprocess.on('close', (code) => {
  startpython()
});
}
startpython()





module.exports = controllers;
