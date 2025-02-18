const fs = require('fs');
const path = require('path');
const moment = require('moment');

const basePath = path.join(__dirname, '../public/testdb');

function resetDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

function ensureDirectoryExistence(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 랜덤 MAC 주소 생성
function generateMacAddress() {
  return Array.from({ length: 6 }, () => 
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join(':');
}

// 랜덤 IPv4 주소 생성
function generateRandomIP() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
}

// 0~100 랜덤 숫자 생성
function getRandomNumber() {
  return Math.floor(Math.random() * 101);
}

const machineNames = [
  "Counter-Balance Forklift Type AGV",
  "Pallet Truck Type AGV",
  "High-mast Reach Forklift Type AGV"
];

const statusNames = [
  "warning", "error", "normal"
];

function generateMachines(machineCount) {
  resetDirectory(basePath);

  const endDate = moment(); // 오늘 날짜
  const startDate = moment().subtract(1, 'year'); // 1년 전 날짜
  const daysInYear = endDate.diff(startDate, 'days');

  for (let i = 1; i <= machineCount; i++) {
    const machineKey = `machine${i}`;
    let machineName = machineNames[Math.floor(Math.random() * machineNames.length)]
    let macaddress = generateMacAddress()
    const machineData = {
      deviceInfo: {
        name: machineName,
        macaddr: macaddress,
        version: 'v1.0.1',
        status: statusNames[Math.floor(Math.random() * statusNames.length)],
        ipaddr: generateRandomIP(),
        battery: getRandomNumber(),
        temperature: getRandomNumber(),
        effect: getRandomNumber(),
        load: getRandomNumber()
      },
      productionAndCharge: {},
      productInfo: []
    };

    for (let j = 0; j <= daysInYear; j++) {
      const date = startDate.clone().add(j, 'days').format('YYYY-MM-DD');
      const production = Math.floor(Math.random() * 50);  // 🔥 하루 생산량 (0~99개)
      const charge = parseFloat((Math.random() * 5).toFixed(2));

      machineData.productionAndCharge[date] = { production, charge, machineName };

      // 🔥 production 값만큼 반복해서 제품 데이터 추가 🔥
      for (let k = 0; k < production; k++) {
        machineData.productInfo.push({
          code: `HW${Math.floor(Math.random() * 100000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
          date: date,
          distance: String(Math.floor(Math.random() * 150) + 50),
          est_time: Math.floor(Math.random() * 1000) + 500,
          name: machineName,
          macaddress: macaddress
        });
      }
    }

    saveData(machineKey, 'device_info.json', machineData.deviceInfo);
    saveData(machineKey, 'production_and_charge.json', machineData.productionAndCharge);
    saveData(machineKey, 'product_info.json', machineData.productInfo);
  }
}


function saveData(machineKey, fileName, jsonData) {
  const dirPath = path.join(basePath, machineKey);
  ensureDirectoryExistence(dirPath);
  
  fs.writeFileSync(path.join(dirPath, fileName), JSON.stringify(jsonData, null, 2));
}

function getMachineList() {
  if (!fs.existsSync(basePath)) return [];
  return fs.readdirSync(basePath).filter(dir => fs.statSync(path.join(basePath, dir)).isDirectory());
}

function getMachineData() {
  if (!fs.existsSync(basePath)) return {};
  return getMachineList().reduce((acc, machine) => {
    const deviceInfoPath = path.join(basePath, machine, 'device_info.json');
    const productionPath = path.join(basePath, machine, 'production_and_charge.json');
    const productInfoPath = path.join(basePath, machine, 'product_info.json');

    acc[machine] = {};
    if (fs.existsSync(deviceInfoPath)) {
      acc[machine].device_info = JSON.parse(fs.readFileSync(deviceInfoPath, 'utf8'));
    }
    if (fs.existsSync(productionPath)) {
      acc[machine].production_and_charge = JSON.parse(fs.readFileSync(productionPath, 'utf8'));
    }
    if (fs.existsSync(productInfoPath)) {
      acc[machine].product_info = JSON.parse(fs.readFileSync(productInfoPath, 'utf8'));
    }

    return acc;
  }, {});
}

function getSingleMachineData(machineId) {
  const machinePath = path.join(basePath, machineId);
  if (!fs.existsSync(machinePath)) return null;

  const deviceInfoPath = path.join(machinePath, 'device_info.json');
  const productionPath = path.join(machinePath, 'production_and_charge.json');
  const productInfoPath = path.join(machinePath, 'product_info.json');

  const machineData = {};
  if (fs.existsSync(deviceInfoPath)) {
    machineData.device_info = JSON.parse(fs.readFileSync(deviceInfoPath, 'utf8'));
  }
  if (fs.existsSync(productionPath)) {
    machineData.production_and_charge = JSON.parse(fs.readFileSync(productionPath, 'utf8'));
  }
  if (fs.existsSync(productInfoPath)) {
    machineData.product_info = JSON.parse(fs.readFileSync(productInfoPath, 'utf8'));
  }

  return machineData;
}

function getAllDeviceInfo() {
  if (!fs.existsSync(basePath)) return {};
  return getMachineList().reduce((acc, machine) => {
    const filePath = path.join(basePath, machine, 'device_info.json');
    if (fs.existsSync(filePath)) {
      acc[machine] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return acc;
  }, {});
}

function getSingleDeviceInfo(machineId) {
  const filePath = path.join(basePath, machineId, 'device_info.json');
  return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : null;
}

function getAllProductInfo() {
  if (!fs.existsSync(basePath)) return {};
  return getMachineList().reduce((acc, machine) => {
    const filePath = path.join(basePath, machine, 'product_info.json');
    if (fs.existsSync(filePath)) {
      acc[machine] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return acc;
  }, {});
}

function getSingleProductInfo(machineId) {
  const filePath = path.join(basePath, machineId, 'product_info.json');
  return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : null;
}

function getAllProductChargeInfo() {
  if (!fs.existsSync(basePath)) return {};
  return getMachineList().reduce((acc, machine) => {
    const filePath = path.join(basePath, machine, 'production_and_charge.json');
    if (fs.existsSync(filePath)) {
      acc[machine] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return acc;
  }, {});
}

function getSingleProductChargeInfo(machineId) {
  const filePath = path.join(basePath, machineId, 'production_and_charge.json');
  return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : null;
}

function updateTemperature() {
  if (!fs.existsSync(basePath)) return;

  const machineList = fs.readdirSync(basePath).filter(dir => 
    fs.statSync(path.join(basePath, dir)).isDirectory()
  );

  machineList.forEach(machineId => {
    const filePath = path.join(basePath, machineId, 'device_info.json');

    if (fs.existsSync(filePath)) {
      let deviceInfo = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // ±1~2도 랜덤 변화 (최소 0도 보장)
      deviceInfo.temperature = Math.max(0, deviceInfo.temperature + Math.floor(Math.random() * 5) - 2);

      deviceInfo.effect = Math.max(0, deviceInfo.effect + Math.floor(Math.random() * 5) - 2);
      deviceInfo.load = Math.max(0, deviceInfo.load + Math.floor(Math.random() * 5) - 2);

      // 변경된 값을 다시 파일에 저장
      fs.writeFileSync(filePath, JSON.stringify(deviceInfo, null, 2));
    }
  });
}

module.exports = { 
  generateMachines, 
  getMachineList, 
  getMachineData, 
  getSingleMachineData, 
  getAllDeviceInfo, 
  getSingleDeviceInfo,
  getAllProductInfo,
  getSingleProductInfo,
  getAllProductChargeInfo,
  getSingleProductChargeInfo,
  updateTemperature
};
