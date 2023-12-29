const axios = require("axios");
const pdfPoppler = require("pdf-poppler");
const fs = require("fs");

const convertPdf = async () => {
  await pdfPoppler.convert("./temp.pdf", { format: "png", out_dir: "output" });
  const dataUrls = [];

  try {
    const files = await fs.readdir(".");
    const filteredFiles = files.filter(file => /\.png$/.test(file));

    for (const file of filteredFiles) {
      const imageData = await fs.readFile(file);
      const dataUrl = `data:image/png;base64,${imageData.toString("base64")}`;
      dataUrls.push(dataUrl);
      await fs.unlink(file);
    }
    await fs.unlink("./temp.pdf");
    return dataUrls;
  } catch (err) {
    console.log("CONVERT_PDF", err);
  }
};

const downloadPdf = async (pdfUrl) => {
  const response = await axios.get(pdfUrl, { responseType: "arraybuffer" });
  await fs.writeFile("./temp.pdf", Buffer.from(response.data));
};

module.exports = { convertPdf, downloadPdf };
