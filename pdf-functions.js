const axios = require("axios");
const pdfPoppler = require("pdf-poppler");
const fs = require("fs").promises;

const pdfPath = "./temp.pdf";

const downloadPdf = async (pdfUrl) => {
  const response = await axios.get(pdfUrl, { responseType: "arraybuffer" });
  await fs.writeFile(pdfPath, Buffer.from(response.data));
};

const convertPdf = async () => {
  await pdfPoppler.convert(pdfPath, { format: 'png', out_dir: 'output' });
  const dataUrls = [];
try{  
  const files = await fs.readdir('.');
  const filteredFiles = files.filter(file => file.endsWith('.png'));

  for (const file of filteredFiles) {
    const imageData = await fs.readFile(file);
    const dataUrl = `data:image/png;base64,${imageData.toString('base64')}`;
    dataUrls.push(dataUrl);
    await fs.unlink(file);
  }
  await fs.unlink(pdfPath);
  return dataUrls;
} catch(err){
  console.log('CONVERT_PDF',err);
}

}


module.exports = { downloadPdf, convertPdf }