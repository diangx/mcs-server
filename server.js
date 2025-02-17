const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');  // WebSocket 모듈 추가
const getMachineInfo = require('./utils/generateInfo');  // 랜덤 머신 정보 생성 함수

const app = express();
const port = 3000;

// HTTP 서버 생성
const server = http.createServer(app);

// WebSocket 서버 생성 (HTTP 서버에 연결)
const wss = new WebSocket.Server({ server });

// CORS 설정 (모든 출처에서 접근 가능)
app.use(cors());

// 기존의 static 파일 제공 API
app.use('/api/machine1_Data', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'machine1/production_and_charge.json'));
});

app.use('/api/machine2_Data', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'machine2/production_and_charge.json'));
});

app.use('/api/machine3_Data', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'machine3/production_and_charge.json'));
});

// 머신 정보를 요청할 때마다 랜덤 IP와 온도 정보를 반환하는 API 
// 아래 웹소켓 연결로 변경
// app.use('/api/status/:machineName', (req, res) => {
//   const machineName = req.params.machineName;
//   const machineInfo = getMachineInfo(machineName);
//   res.json(machineInfo);
// });

// 웹소켓 연결 관리
wss.on('connection', (ws) => {
  console.log('새로운 클라이언트가 연결되었습니다.');

  // 3초마다 데이터를 클라이언트에게 전송
  const sendMachineData = () => {
    const machine1Data = getMachineInfo("Counter-Balance Forklift Type AGV");
    const machine2Data = getMachineInfo("Pallet Truck Type AGV");
    const machine3Data = getMachineInfo("High-mast Reach Forklift Type AGV");

    const payload = {
      machine1: machine1Data,
      machine2: machine2Data,
      machine3: machine3Data
    };

    ws.send(JSON.stringify(payload));
  };

  const interval = setInterval(sendMachineData, 1500);

  // 클라이언트 연결 종료 시 인터벌 정리
  ws.on('close', () => {
    console.log('클라이언트 연결이 종료되었습니다.');
    clearInterval(interval);
  });
});

// 서버 실행
server.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
