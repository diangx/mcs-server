const fs = require('fs');
const moment = require('moment');

// 1년치 데이터 생성 함수
function generateMachineData() {
  const machines = {
    machine1: {
      productionAndCharge: {},
      productInfo: []
    },
    machine2: {
      productionAndCharge: {},
      productInfo: []
    },
    machine3: {
      productionAndCharge: {},
      productInfo: []
    }
  };

  const startDate = moment('2024-01-01');
  const endDate = moment('2024-12-31');
  const daysInYear = endDate.diff(startDate, 'days');

  const generateProductInfo = (machine, date) => {
    const productCount = Math.floor(Math.random() * 5) + 1;  // 하루에 1~5개의 물품 생산

    let productInfo = [];

    for (let i = 0; i < productCount; i++) {
      const productCode = `HW${Math.floor(Math.random() * 100000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
      const distance = Math.floor(Math.random() * 150) + 50; // 50~200 사이의 거리
      const estTime = Math.floor(Math.random() * 1000) + 500; // 예상시간 500~1500 사이
      productInfo.push({
        code: productCode,
        date: date,
        distance: String(distance),
        est_time: estTime,
        device: machine
      });
    }
    return productInfo;
  };

  for (let i = 0; i <= daysInYear; i++) {
    const date = startDate.clone().add(i, 'days').format('YYYY-MM-DD');

    // 생산량과 충전량을 랜덤으로 생성
    const production1 = Math.floor(Math.random() * 100);
    const chargeNum1 = Math.random() * 5;

    const production2 = Math.floor(Math.random() * 100);
    const chargeNum2 = Math.random() * 5;

    const production3 = Math.floor(Math.random() * 100);
    const chargeNum3 = Math.random() * 5;

    // productionAndCharge 데이터 추가
    machines.machine1.productionAndCharge[date] = { production: production1, charge: chargeNum1 };
    machines.machine2.productionAndCharge[date] = { production: production2, charge: chargeNum2 };
    machines.machine3.productionAndCharge[date] = { production: production3, charge: chargeNum3 };

    // productInfo 생성
    machines.machine1.productInfo.push(...generateProductInfo('machine1', date));
    machines.machine2.productInfo.push(...generateProductInfo('machine2', date));
    machines.machine3.productInfo.push(...generateProductInfo('machine3', date));
  }

  return machines;
}

const data = generateMachineData();

// production_and_charge.json 파일 저장
fs.writeFile('public/machine1/production_and_charge.json', JSON.stringify(data.machine1.productionAndCharge, null, 2), (err) => {
  if (err) {
    console.error('machine1 production_and_charge 파일 저장 오류:', err);
  } else {
    console.log('machine1 production_and_charge 파일이 성공적으로 생성되었습니다.');
  }
});

fs.writeFile('public/machine2/production_and_charge.json', JSON.stringify(data.machine2.productionAndCharge, null, 2), (err) => {
  if (err) {
    console.error('machine2 production_and_charge 파일 저장 오류:', err);
  } else {
    console.log('machine2 production_and_charge 파일이 성공적으로 생성되었습니다.');
  }
});

fs.writeFile('public/machine3/production_and_charge.json', JSON.stringify(data.machine3.productionAndCharge, null, 2), (err) => {
  if (err) {
    console.error('machine3 production_and_charge 파일 저장 오류:', err);
  } else {
    console.log('machine3 production_and_charge 파일이 성공적으로 생성되었습니다.');
  }
});

// product_info.json 파일 저장
fs.writeFile('public/machine1/product_info.json', JSON.stringify(data.machine1.productInfo, null, 2), (err) => {
  if (err) {
    console.error('machine1 product_info 파일 저장 오류:', err);
  } else {
    console.log('machine1 product_info 파일이 성공적으로 생성되었습니다.');
  }
});

fs.writeFile('public/machine2/product_info.json', JSON.stringify(data.machine2.productInfo, null, 2), (err) => {
  if (err) {
    console.error('machine2 product_info 파일 저장 오류:', err);
  } else {
    console.log('machine2 product_info 파일이 성공적으로 생성되었습니다.');
  }
});

fs.writeFile('public/machine3/product_info.json', JSON.stringify(data.machine3.productInfo, null, 2), (err) => {
  if (err) {
    console.error('machine3 product_info 파일 저장 오류:', err);
  } else {
    console.log('machine3 product_info 파일이 성공적으로 생성되었습니다.');
  }
});
