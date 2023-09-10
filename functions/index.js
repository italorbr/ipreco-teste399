const functions = require('firebase-functions');
const admin = require('firebase-admin');
const path = require('path');
const os = require('os');
const spawn = require('child-process-promise').spawn;
const fs = require('fs');

admin.initializeApp();

exports.gerarThumbnail = functions.storage.object().onFinalize(async (object) => {
  const fileBucket = object.bucket;
  const filePath = object.name;
  const contentType = object.contentType;
  const filename = path.basename(filePath);
  const dir = path.dirname(filePath);

  console.log(fileBucket, filePath, contentType);

  if(!contentType.startsWith("image/")) return console.log("nao eh imagem // comentar depois");

  if(filename.startsWith("thumb_"))
    return console.log("Imagem já está no formato thumbnail!");

  bucket = admin.storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), filename);
  const metadata = {
    contentType: contentType,
  }
  await bucket.file(filePath).download({destination: tempFilePath});
  console.log('imagem foi para: ', tempFilePath);

  const thumbFileName = `thumb_${filename}`;
  const thumbFilePath = path.join(dir, thumbFileName);
  await spawn('convert', [
    tempFilePath,
    "-thumbnail",
    "200x200>",
    tempFilePath
  ]);
  console.log("thumbnail criada aleluia");
  await bucket.upload(tempFilePath, {
    destination: thumbFilePath,
    metadata: metadata,
  }).then(() => {
    fs.unlinkSync(tempFilePath);
  })
});
  
  