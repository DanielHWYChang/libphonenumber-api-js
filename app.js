const express = require('express');
const app = express();
const fs = require('fs');
const util = require('util');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const multer = require('multer');
const upload = multer({
  dest: 'uploads/' // this saves your file into a directory called "uploads"
});

var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
  res.send('Running.');
});

app.get('/api/phonenumbers/parse/text/:string', function(req, res) {
  var stringToParse = req.params.string;
  var returnedNumbers = [];
  returnedNumbers = stringtophonenum(stringToParse);
  res.send(returnedNumbers);
});

app.get('/api/phonenumbers/parse/file', (req, res) => {
  res.sendFile(__dirname + '/upload.html');
});

app.post('/api/phonenumbers/parse/file', upload.single('file-to-upload'), (req, res) => {

  fs.readFile(req.file.path, function(err, content) {
    if(err) {
      res.status(500).send(err);
      return;
    }

    var numbers = content.toString().split('\n')
    var arrayOfNumbers = stringtophonenum(numbers);
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(arrayOfNumbers);



    res.status(200).send(arrayOfNumbers);
  });
});




app.listen(port);


function stringtophonenum(string) {
  var arrayOfNumbers = []
  try{

  string.toString().split(',').forEach( str=>{
  var number = phoneUtil.parse(str, 'CA')
  if(phoneUtil.isValidNumber(number)){
      arrayOfNumbers.push(phoneUtil.format(number, PNF.NATIONAL))
    }
  })
  }catch(error){
        // console.log(error)
  }

  arrayOfNumbers = removeDuplicates(arrayOfNumbers);
  return arrayOfNumbers;
}

function removeDuplicates(arr){
    var unique_array = []
    for(var i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}
