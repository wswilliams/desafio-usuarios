const http = require('http')
const cors = require('cors')
const express = require('express')
const path = require("path");

const app = express()

app.use(cors());

app.use(express.json())

app.use(
  express.static(path.join(__dirname, "../dist/crud-estudantes"))
);

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../dist/crud-estudantes/index.html")
  );
});

  const port = 3001
  app.set("port", port)
  const server = http.createServer(app)
  server.listen(port)