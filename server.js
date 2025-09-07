const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'data.json');
let data = { pin: process.env.INITIAL_PIN || "5673", adminPass: process.env.ADMIN_PASS || "admin123", ipAttempts: {} };

// Load existing data
if(fs.existsSync(DATA_FILE)){
  try { data = JSON.parse(fs.readFileSync(DATA_FILE)); } catch(e){ console.log("Data file corrupt, using defaults."); }
}

// Save function
function saveData(){ fs.writeFileSync(DATA_FILE, JSON.stringify(data, null,2)); }

// ====== Routes ======

// Check PIN & rate-limit per IP
app.post('/checkPin', (req,res)=>{
  const {pin} = req.body;
  const ip = req.ip;
  data.ipAttempts[ip] = data.ipAttempts[ip] || 0;

  if(data.ipAttempts[ip] >= 5) return res.json({success:false,message:"❌ Max attempts reached",attempts:5});

  if(pin === data.pin){
    data.ipAttempts[ip] = 0;
    saveData();
    return res.json({success:true,pin:data.pin});
  } else {
    data.ipAttempts[ip]++;
    saveData();
    return res.json({success:false,message:"❌ Wrong PIN, try again",attempts:data.ipAttempts[ip]});
  }
});

// Admin update PIN
app.post('/updatePin',(req,res)=>{
  const {adminPass,pin} = req.body;
  if(adminPass !== data.adminPass) return res.json({success:false});
  if(pin) data.pin=pin;
  saveData();
  res.json({success:true});
});

// Admin reset IP
app.post('/resetIP',(req,res)=>{
  const {adminPass,ip} = req.body;
  if(adminPass !== data.adminPass || !ip) return res.json({success:false});
  data.ipAttempts[ip]=0;
  saveData();
  res.json({success:true});
});

// Current PIN for live check
app.get('/currentPin',(req,res)=>{
  res.json({pin:data.pin});
});

app.listen(PORT,()=>{ console.log(`Server running on port ${PORT}`); });
