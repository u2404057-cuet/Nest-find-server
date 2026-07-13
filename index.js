const express = require("express");
const cors = require("cors");
require("dotenv").confic();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
    res.send("SCIC server");
})

app.listen(port, () => {
    console.log(`SCIC server is running on port ${port}`);
});