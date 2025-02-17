// 랜덤 IP 생성 함수
function generateRandomIP() {
  const octet1 = Math.floor(Math.random() * 256);
  const octet2 = Math.floor(Math.random() * 256);
  return `192.168.${octet1}.${octet2}`;  // 예: 192.168.53.120
}

// 난이도 랜덤 선택 함수
function generateRandomDifficulty() {
  const difficulties = ["hard", "normal", "easy"];
  return difficulties[Math.floor(Math.random() * difficulties.length)];
}

// 랜덤 온도 생성 함수
function generateRandomTemperature() {
  return (Math.random() * 40 + 20).toFixed(1);  // 20.0 ~ 60.0 사이의 온도
}

function generateRandomNumber() {
  return Math.floor(Math.random() * 101); // 0부터 100까지의 정수 반환
}

// 요청에 맞는 머신 정보 반환하는 함수
function getMachineInfo(machineName) {
  return {
    machine: machineName,
    status: generateRandomDifficulty(),
    version: 'v1.0.1',
    ip: generateRandomIP(),
    temperature: generateRandomTemperature(),
    usage: generateRandomNumber(),
    energy: generateRandomNumber()
  };
}

// 모듈로 반환
module.exports = getMachineInfo;

