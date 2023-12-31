const express = require("express");
const cors = require("cors");
const imgToPDF = require("image-to-pdf");
const { downloadPdf, convertPdf } = require("./pdf-functions");
const dotenv = require('dotenv')

const app = express();
dotenv.config();
app.use(express.json({ limit: "100mb" }));
app.use(cors());

app.get("/pdfToImages", async (req, res) => {
  const pdfUrl = req.headers["pdf-url"];
  try {
    if (!pdfUrl) {
      return res.status(400).json({ status: "error", message: "Invalid PDF URL" });
    }
    await downloadPdf(pdfUrl);
    const dataUrls = await convertPdf();
    return res.json({ status: "ok", dataUrls });
  } catch (err) {
    console.log("/pdfToImages", err);
    return res.status(400).json({ status: "error", message: err.message });
  }
});


app.post("/imagesToPdf", async (req, res) => {
  try {
    const { dataUrls } = req.body;
    const pdf = await imgToPDF(dataUrls, imgToPDF.sizes.A4);

    res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    pdf.pipe(res);
  } catch (err) {
    console.error("/imagesToPdf", err);
    res.status(500).send('Internal Server Error');
  }
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("server started");
});
