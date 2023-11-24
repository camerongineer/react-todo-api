const express = require("express");
const cors = require("cors");
const axios = require("axios");
const index = express();
require("dotenv").config();

const AIRTABLE_URL = "https://api.airtable.com/v0";
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = "todolist";
const SORT_BY_LAST_MODIFIED_TIME = "?sort%5B0%5D%5Bfield%5D=lastModifiedTime&sort%5B0%5D%5Bdirection%5D=asc";
const PORT = process.env.PORT || 3000;

const fullUrl = `${AIRTABLE_URL}/${BASE_ID}/${AIRTABLE_TABLE_NAME}${SORT_BY_LAST_MODIFIED_TIME}`;

index.use(express.json());
index.use(cors());
index.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

index.get("/status", (request, response) => {
    const status = {
        "Status": "Running"
    };
    response.send(status);
});

index.get("/items", (request, response) => {
    axios.get(fullUrl, {
        headers: {
            "Authorization": `Bearer ${process.env.AIRTABLE_API_KEY}`
        }
    }).then(res => response.send(res.data["records"] ?? [])).catch(err => console.log(err));
});

index.post("/item", (request, response) => {
    const addItemUrl = `${AIRTABLE_URL}/${BASE_ID}/${AIRTABLE_TABLE_NAME}`;
    
    const data = {
        "fields": {
            "title": request.body.title
        }
    };
    
    axios.post(addItemUrl, data, {
        headers: {
            "Authorization": `Bearer ${process.env.AIRTABLE_API_KEY}`,
            "Content-Type": "application/json"
        }
    }).then(res => response.send(res.data)).catch(err => console.log(err));
});


index.delete("/item/:id", (request, response) => {
    const id = request.params.id;
    const deleteUrl = `${AIRTABLE_URL}/${BASE_ID}/${AIRTABLE_TABLE_NAME}/${id}`;
    
    axios.delete(deleteUrl, {
        headers: {
            "Authorization": `Bearer ${process.env.AIRTABLE_API_KEY}`,
            "Content-Type": "application/json"
        }
    }).then(res => response.send(res.data)).catch(err => console.log(err));
});
