const findProcess = require('find-process');
const cp = require('child_process'),
exec = cp.exec;

let timer;

const find = (name) => {
  findProcess('name', name, true)
  .then(function (list) {
    if(!list.find(exist)) {
      clearInterval(timer);
      let child = exec('node index.js', {maxBuffer: 1024 * 2000}, (err, stdout, stderr) => {
        console.log('restarting node server.js')
        console.log('there are %s node process(es)', list.length);
        sleep(5000).then(() => {
          setCheckInterval(10000);
        })
      });
      child.stdout.pipe(process.stdout);
      child.on('data', (data) => {
        console.log(data)
      })
    } 
  });
}

const exist = (instance) => {
  return instance.cmd === 'node index.js';
}

const setCheckInterval = (ms) => {
  timer = setInterval(() => {
    find('node');
  }, ms);
};

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

find('node');
