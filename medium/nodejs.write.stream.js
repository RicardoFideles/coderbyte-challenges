const https = require('https');
const fs = require('fs');
const crypto = require('crypto');
const OUTPUT_FILE_NAME = 'output.txt';

const createHashFromFile = filePath => new Promise(resolve => {
    const hash = crypto.createHash('sha1');
    fs.createReadStream(filePath).on('data', data => hash.update(data)).on('end', () => resolve(hash.digest('hex')));
}); 

const countAges = json => new Promise(resolve => {
    let stream = '';
    stream = fs.createWriteStream(OUTPUT_FILE_NAME);
    let count = 0;
    let dataJson = json.data;
    let dataArray = dataJson.split(',');
    for (let i = 0; i < dataArray.length; i++) {
      let element = dataArray[i];
      if(element.indexOf('age=') !== -1) {
        let age = element.split('=');
        if(parseInt(age[1]) == 32) {
          let keyObj= dataArray[i-1];
          let key = keyObj.split('=');
          stream.write(key[1]+"\n")
          count++;
        }
      }
    }
    resolve(count);
})

https.get('https://coderbyte.com/api/challenges/json/age-counting', (resp) => {
  
  let data = '';

  resp.on('data', (chunk) => {
    data+=chunk;
  })
  resp.on('end', () => {
    let json = JSON.parse(data.toString());
    
    (async () => {
        await countAges(json);
        console.log(await createHashFromFile(OUTPUT_FILE_NAME));
    })();
  })  
});