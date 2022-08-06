// ./src/index.js
// importing the dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");
const path = require("path");

// defining the Express app
const app = express();

// defining an array to work as the database (temporary solution)
const ads = [{ title: "Hello, world (again)!" }];

app.use(express.json());

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

// defining an endpoint to return all ads
app.get("/", (req, res) => {
  /*
  fs.readFile("./src/bevis.docx", "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    fs.writeFile("src/nyfil.docx", "Hei", "utf8", function (err) {
      if (err) return console.log(err);
    });
  });
  */

  // Load the docx file as binary content
  const content = fs.readFileSync(
    path.resolve(__dirname, "bevis.docx"),
    "binary"
  );

  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
  doc.render({
    name: "Magnar",
    maskinNr: "8000",
    maskinType: "Volvo 240",
    dato: "07.08.2022",
  });

  const buf = doc.getZip().generate({
    type: "nodebuffer",
    // compression: DEFLATE adds a compression step.
    // For a 50MB output document, expect 500ms additional CPU time
    compression: "DEFLATE",
  });

  // buf is a nodejs Buffer, you can either write it to a
  // file or res.send it with express for example.
  fs.writeFileSync(path.resolve(__dirname, "output.docx"), buf);
});

// starting the server
app.listen(3001, () => {
  console.log("listening on port 3001");
});
