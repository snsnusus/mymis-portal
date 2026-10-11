// server.js: OTP endpoints only (ADR-0008, until OTP is rebuilt in mymis-api).
// Chat and presence moved to mymis-chat-service.
const express = require('express');
const cors = require('cors');
const { sendOtp, verifyOtp } = require('./contactController');

// 4100, not 4000: port 4000 belongs to mymis-chat-service.
const PORT = 4100;

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/contacts/send-otp', sendOtp);
app.post('/api/contacts/verify-otp', verifyOtp);

app.listen(PORT, () => {
  console.log(`OTP server running on http://localhost:${PORT}`);
});
