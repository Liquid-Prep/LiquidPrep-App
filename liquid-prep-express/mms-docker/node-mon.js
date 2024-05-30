const cp = require('child_process'),
exec = cp.exec;

let timer;

const find = (name) => {
  exec(`ps -ef | grep "${name}"`, {maxBuffer: 1024 * 2000}, (err, stdout, stderr) => {
    if(!err) {
      const lines = stdout.split('\n')
      let found = false;
      lines.forEach((line, i) => {
        if(line.length > 0 && !line.match(/-ef|grep/) && !line.match(/grep node index.js/)) {
          if(line.match(/node index.js/)) {
            found = true;
          }
        } 
      })
      if(!found) {
        clearInterval(timer);
        console.log('restarting node server here')
        const child = exec('node index.js', (err, stdout, stderr) => {
        });
        child.stdout.pipe(process.stdout);
        child.on('data', (data) => {
          console.log(data)
        })
      }
      sleep(2000).then(() => {
        setCheckInterval(8000);
      })
    }
  })
}

const setCheckInterval = (ms) => {
  clearInterval(timer);
  timer = setInterval(() => {
    find('node index.js');
  }, ms);
};

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

find('node');
