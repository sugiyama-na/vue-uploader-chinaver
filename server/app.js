const { v4: uuid } = require('uuid');
const rimraf = require('rimraf')
const fs = require('fs')
const express = require("express");
const bodyParser = require('body-parser');
const multer = require('multer')
const fileUpload = require('express-fileupload');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(fileUpload());

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, access_token, Content-Length, X-Requested-With, Content-Disposition',
  )

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.sendStatus(200)
  } else {
    next()
  }
}
app.use(allowCrossDomain)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 保存したいパス
    cb(null, './uploads')
  }
  ,
  filename: function (req, file, cb) {
    // アップロードしたときのファイル名で保存
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

const server = app.listen(5000, function(){
  console.log("Node.js is listening to PORT:" + server.address().port);
});

app.post("/api/post", upload.single('file'), function(req, res, next){
  console.log('## /api/post ##')
  // console.log(req)

  console.log(req.body)
  res.send('post end')
});

app.post("/api/upload", function(req, res, next){
  console.log(req.body)
  if ( req.body.phase === 'start' ) {
    const session_id = uuid()
    const max_size = 1 * 1024
    rimraf.sync(`./uploads/${session_id}`)
    fs.mkdirSync(`./uploads/${session_id}`)
    return res.json({
      status: 'success',
      data: {
        start_offset: 0,
        end_offset: max_size,
        session_id
      }
    })
  }

  if ( req.body.phase === 'upload' ) {
    return res.send({ status: 'success' })
  }

  if ( req.body.phase === 'finish' ) {
    return res.send({ status: 'success' })
  }
})