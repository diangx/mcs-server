const cors = require('cors');
const express = require('express');
const http = require('http'); // HTTP 서버 생성
const WebSocket = require('ws'); // WebSocket 추가
const machineRoutes = require('./routes/machineRoutes');
const updateFirmwareRoutes = require("./routes/updateFirmware");
const { getAllDeviceInfo, updateTemperature } = require('./services/machineService');

const app = express();
const PORT = 3000;

// HTTP 서버 생성 (WebSocket 사용을 위해)
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // 📌 form-data 인식
app.use('/api/machines', machineRoutes);
app.use("/api/update-firmware", updateFirmwareRoutes); // 📌 추가

// WebSocket 연결 처리
wss.on('connection', (ws) => {
  const connectTime = new Date().toISOString();
  console.log(`✅ WebSocket 클라이언트 연결됨 [Time: ${connectTime}]`);

  const interval = setInterval(() => {
    updateTemperature(); // 모든 `device_info.json`의 온도 업데이트
  
    const allDevices = getAllDeviceInfo();  
    const groupedData = {};
  
    Object.values(allDevices).forEach(device => {
      const { name, temperature, effect, load } = device;
  
      if (!groupedData[name]) {
        groupedData[name] = { 
          totalTemperature: 0, 
          totalEffect: 0, 
          totalLoad: 0, 
          count: 0 
        };
      }
  
      groupedData[name].totalTemperature += temperature;
      groupedData[name].totalEffect += effect;
      groupedData[name].totalLoad += load;
      groupedData[name].count += 1;
    });
  
    // 평균 값 계산
    const avgMetrics = Object.keys(groupedData).map(name => ({
      name,
      avgTemperature: (groupedData[name].totalTemperature / groupedData[name].count).toFixed(2),
      avgEffect: (groupedData[name].totalEffect / groupedData[name].count).toFixed(2),
      avgLoad: (groupedData[name].totalLoad / groupedData[name].count).toFixed(2)
    }));

    let lastTemperature = 25.0; // 초기값 설정
    let lastHumidity = 60.0; // 초기값 설정
    
    function getRandomVariation(value, range = 2) {
      return (value + (Math.random() * range * 2 - range)).toFixed(2); // ±range 내 변동
    }
    
    const monthlyMetrics = {
      timestamps: Array.from({ length: 12 }, (_, i) => (i + 1).toString()), // 1~12월
      temperature: Array.from({ length: 12 }, () => getRandomVariation(lastTemperature, 2)), // ±2°C 변동
      humidity: Array.from({ length: 12 }, () => getRandomVariation(lastHumidity, 5)), // ±5% 변동
      currentTemperature: getRandomVariation(lastTemperature, 1), // ±1°C 변동
      currentHumidity: getRandomVariation(lastHumidity, 3) // ±3% 변동
    };
    
    // 업데이트된 마지막 값 저장
    lastTemperature = parseFloat(monthlyMetrics.currentTemperature);
    lastHumidity = parseFloat(monthlyMetrics.currentHumidity);

    // WebSocket을 통해 클라이언트로 전송
    ws.send(JSON.stringify({ status : { response: avgMetrics }, factory_status : { response: monthlyMetrics } }));
  }, 2500);  

  ws.on('close', () => {
    const disconnectTime = new Date().toISOString();
    console.log(`❌ WebSocket 클라이언트 연결 종료 [Time: ${disconnectTime}]`);
  });
});

// HTTP 서버 실행
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
