const express = require("express");
const cors = require("cors");
const imgToPDF = require('image-to-pdf');
const {convertPdf, downloadPdf} = require('./pdfFunctions')

const app = express();
app.use(express.json({limit: '100mb'}));
app.use(cors());


app.get("/pdfToImages", async (req, res) => {
  const pdfUrl = req.headers["pdf-url"];
  try{
  if(!pdfUrl) { 
    res.status(400).json({ status: 'error', message: 'Invalid PDF URL' });
   }
  await downloadPdf(pdfUrl);
  const dataUrls = await convertPdf();
  return res.json({status: 'ok', dataUrls});
  }
  catch(err){
   console.log('/pdfToImages', err);
   return res.status(400).json({status: 'error', message: err.message})
  }
});


app.post('/imagesToPdf', async(req,res)=>{

 try{  
  const {dataUrls} = req.body;
  const pdfBuffer = await imgToPDF(dataUrls, imgToPDF.sizes.A4);
  pdfBuffer.pipe(res);

} catch(err) {
  console.log('/imagesToPdf', err);
}
})

app.listen(3001, () => {
  console.log("server started");
});
