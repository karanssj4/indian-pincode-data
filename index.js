const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

// const data =  fs.readFileSync(path.join(__dirname, 'res/test.csv'), { encoding : 'utf8'});
const data =  fs.readFileSync(path.join(__dirname, 'res/all_india_pin_code.csv'), { encoding : 'utf8'});
const result = [];




csv({
    colParser:{
      "officeType": "omit",
      "Deliverystatus": "omit",
      "name":function(item, head, resultRow, row , colIdx){
            /*
                item - "1970-01-01"
                head - "birthday"
                resultRow - {name:"Joe"}
                row - ["Joe","1970-01-01"]
                colIdx - 1
            */
            // return new Date(item);
            return item.replace(/ (B|S|H).O/g, "")
        }
    }
}).fromString(data)
.on('json', (json) => {
  result.push(json);
})
.on('done', () => {
  fs.writeFileSync('res/pincodeData.min.json', JSON.stringify(result));
  fs.writeFileSync('res/pincodeData.pretty.json', JSON.stringify(result, null, 1));
  console.log('end');
})
.preFileLine((fileLineString, lineIdx)=>{
  if (lineIdx === 1){
    const beforeRow = 'officename,pincode,officeType,Deliverystatus,divisionname,regionname,circlename,Taluk,Districtname,statename';
    const afterRow = 'name,pin,officeType,Deliverystatus,division,region,circle,tsluk,district,state';
    return fileLineString.replace(beforeRow, afterRow);
  }
    return fileLineString;
})
