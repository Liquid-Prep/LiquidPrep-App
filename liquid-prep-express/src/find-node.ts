const cp = require('child_process'),
exec = cp.exec;

let timer;
const argv: string = process.argv.slice(2).toString()
const port = argv ? argv : 3000;
console.log(port, argv)

const find = (name) => {
  exec(`ps -ef | grep "${name}"`, {maxBuffer: 1024 * 2000}, (err, stdout, stderr) => {
    if(!err) {
      const lines = stdout.split('\n')
      let found = false;
      lines.forEach((line, i) => {
        if(line.length > 0 && !line.match(/-ef|grep/) && !line.match(/grep node dist\/liquid-prep.js/)) {
          if(line.match(/node dist\/liquid-prep.js/)) {
            found = true;
          }
        } 
      })
      if(!found) {
        clearInterval(timer);
        console.log(`restarting node server here ${port}`)
        const child = exec(`node dist/liquid-prep.js --port=${port}`, (err, stdout, stderr) => {
        });
        child.stdout.pipe(process.stdout);
        child.on('data', (data) => {
          console.log(data)
        })
      }
      sleep(2000).then(() => {
        setCheckInterval(30000);
      })
    }
  })
}

const exist = (instance) => {
  return instance.cmd === 'node dist/liquid-prep.js';
}

const setCheckInterval = (ms) => {
  clearInterval(timer);
  timer = setInterval(() => {
    find('node dist/liquid-prep.js');
  }, ms);
};

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

find('node');
