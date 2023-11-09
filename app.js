const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv").config();
const app = express();

const AIRTABLE_URL = "https://api.airtable.com/v0";
const BASE_ID = dotenv.parsed.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = "todolist";
const SORT_BY_LAST_MODIFIED_TIME = "?sort%5B0%5D%5Bfield%5D=lastModifiedTime&sort%5B0%5D%5Bdirection%5D=asc";
const PORT = dotenv.parsed.PORT || 3000;

const fullUrl = `${AIRTABLE_URL}/${BASE_ID}/${AIRTABLE_TABLE_NAME}${SORT_BY_LAST_MODIFIED_TIME}`;

app.use(express.json());
app.use(cors());
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.get("/status", (request, response) => {
    const status = {
        "Status": "Running"
    };
    response.send(status);
});

app.get("/items", (request, response) => {
    axios.get(fullUrl, {
        headers: {
            "Authorization": `Bearer ${dotenv.parsed.AIRTABLE_API_KEY}`
        }
    }).then(res => response.send(res.data["records"] ?? [])).catch(err => console.log(err));
});

app.post("/items", (request, response) => {
    axios.post(fullUrl, request.body, {
        headers: {
            "Authorization": `Bearer ${dotenv.parsed.AIRTABLE_API_KEY}`,
            "Content-Type": "application/json"
        }
    }).then(res => response.send(res.data)).catch(err => console.log(err));
});