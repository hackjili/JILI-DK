let currentPin="";

async function login(){
  const pin=document.getElementById("pinInput").value;
  const res=await fetch("/checkPin",{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify({pin})});
  const data=await res.json();
  const msg=document.getElementById("msg");
  if(data.success){
    msg.style.color="green"; msg.textContent="✅ Unlocked!";
    currentPin=data.pin;
    document.getElementById("lockScreen").classList.add("hidden");
    document.getElementById("mainContent").classList.remove("hidden");
  } else {
    msg.style.color="red"; msg.textContent=data.message+(data.attempts?` (${data.attempts}/5)`:"");
  }
}

async function adminUpdate(){
  const adminPass=document.getElementById("adminPass").value;
  const pin=document.getElementById("newPin").value;
  const ip=document.getElementById("resetIP").value;

  if(pin){
    const res=await fetch("/updatePin",{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify({pin,adminPass})});
    const data=await res.json();
    alert(data.success?"✅ PIN updated":"❌ Admin password incorrect");
  }
  if(ip){
    const res=await fetch("/resetIP",{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify({ip,adminPass})});
    const data=await res.json();
    alert(data.success?`✅ IP ${ip} reset`:"❌ Admin password incorrect or invalid IP");
  }
}

setInterval(async ()=>{
  const res=await fetch("/currentPin");
  const data=await res.json();
  if(currentPin && currentPin!==data.pin){
    alert("⚠️ PIN updated, please re-login!");
    location.reload();
  }
  currentPin=data.pin;
},3000);

const luckyLines=[
  "🔥 ভাগ্যের দরজা খোলা! বড় বাজি ধরুন 💰✨",
  "🌟 আজকের দিন Spin করুন 🥳🎉",
  "💎 সাহসী হোন, ধনী হতে পারেন 😍"
];
const normalLines=[
  "⏳ শান্ত থাকুন, ছোট বাজি যথেষ্ট 🙂",
  "🌼 ধীরে চলুন, অভিজ্ঞতা অর্জন করুন 🌸"
];

function generateNormalKey(){ 
  const base="0123456789TANVIR"; 
  let s=""; 
  for(let i=0;i<6;i++) s+=base.charAt(Math.floor(Math.random()*base.length)); 
  return "T4N-V1R-"+s;
}

function generateLuckyKey(){ 
  const symbols=["৳","$"]; 
  const symbol=symbols[Math.floor(Math.random()*symbols.length)]; 
  const number=Math.floor(Math.random()*90+10); 
  return "T4N-V1R-"+symbol+number;
}

function updateClock(){
  const now=new Date(); 
  const min=now.getMinutes(); 
  const sec=now.getSeconds();
  const clock=document.getElementById("clock");
  const tinyTime=document.getElementById("tinyTime");
  const status=document.getElementById("status");
  const timerCard=document.getElementById("timerCard");

  if(!clock || !status || !timerCard) return;

  let isLucky=(min%2===1 && sec>=40)||(min%2===0 && sec<40);
  const lastDigitMin=min%10;
  const displayTime=`${lastDigitMin}:${String(sec).padStart(2,"0")}`;

  if(isLucky){
    clock.textContent=generateLuckyKey();
    tinyTime.textContent=displayTime;
    timerCard.className="timer-card bg-pink-500";
    status.textContent=luckyLines[Math.floor(Math.random()*luckyLines.length)];
    status.className="mt-2 text-lg font-bold text-white animate-pulse-scale";
  } else {
    clock.textContent=generateNormalKey();
    tinyTime.textContent=displayTime;
    timerCard.className="timer-card bg-gray-400";
    status.textContent=normalLines[Math.floor(Math.random()*normalLines.length)];
    status.className="mt-2 text-red-500";
  }
}

setInterval(updateClock,2000);
updateClock();
