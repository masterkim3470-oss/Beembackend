const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const btoa = require("btoa");
const https = require("https");

const app = express();
const PORT = process.env.PORT || 3000;

// Beem OTP credentials
const API_KEY = "e38ad139292d1983";
const SECRET_KEY = "MzQyNDhlZTdmMTliYzNhOTFmOTY5ODExZTFkNGZmODM0MWIzNWUwZDBlY2VjMTUzNDM4ODIyZTZkNmExM2E1Yw==";
const APP_ID = "3824";

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: "https://otptest.onrender.com",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// -------------------- Request OTP --------------------
app.post("/request-otp", async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone number is required" });

    try {
        const response = await axios.post(
            "https://apiotp.beem.africa/v1/request",
            {
                appId: APP_ID,
                msisdn: phone
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Basic " + btoa(API_KEY + ":" + SECRET_KEY)
                },
                httpsAgent
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error("==== BEEM OTP REQUEST ERROR ====");
        if (err.response) {
            console.error("Status Code:", err.response.status);
            console.error("Headers:", err.response.headers);
            console.error("Data:", err.response.data);
        } else if (err.request) {
            console.error("No response received. Request:", err.request);
        } else {
            console.error("Error Message:", err.message);
        }
        console.error("Config:", err.config);
        console.error("================================");

        res.status(500).json({ 
            error: "Failed to request OTP", 
            details: err.response?.data || err.message 
        });
    }
});

// -------------------- Verify OTP --------------------
app.post("/verify-otp", async (req, res) => {
    const { pinId, pin } = req.body;
    if (!pinId || !pin) return res.status(400).json({ error: "pinId and pin are required" });

    try {
        const response = await axios.post(
            "https://apiotp.beem.africa/v1/verify",
            { pinId, pin },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Basic " + btoa(API_KEY + ":" + SECRET_KEY)
                },
                httpsAgent
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error("==== BEEM OTP VERIFY ERROR ====");
        if (err.response) {
            console.error("Status Code:", err.response.status);
            console.error("Headers:", err.response.headers);
            console.error("Data:", err.response.data);
        } else if (err.request) {
            console.error("No response received. Request:", err.request);
        } else {
            console.error("Error Message:", err.message);
        }
        console.error("Config:", err.config);
        console.error("================================");

        res.status(500).json({ 
            error: "Failed to verify OTP", 
            details: err.response?.data || err.message 
        });
    }
});

// -------------------- Test Route --------------------
app.get("/", (req, res) => {
    res.send("Beem OTP Server running on https://otptest.onrender.com");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
