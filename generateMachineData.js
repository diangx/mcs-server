const fs = require('fs');
const moment = require('moment');

// 1년치 데이터 생성 함수
function generateMachineData() {
  const machines = {
    machine1: {},
    machine2: {},
    machine3: {}
  };

  const startDate = moment('2024-01-01');
  const endDate = moment('2024-12-31');
  const daysInYear = endDate.diff(startDate, 'days');

  for (let i = 0; i <= daysInYear; i++) {
    const date = startDate.clone().add(i, 'days').format('YYYY-MM-DD');

    const production1 = Math.floor(Math.random() * 100);
    const chargeNum1 = Math.random() * 5;

    const production2 = Math.floor(Math.random() * 100);
    const chargeNum2 = Math.random() * 5;

    const production3 = Math.floor(Math.random() * 100);
    const chargeNum3 = Math.random() * 5;

    machines.machine1[date] = { production: production1, charge: chargeNum1 };
    machines.machine2[date] = { production: production2, charge: chargeNum2 };
    machines.machine3[date] = { production: production3, charge: chargeNum3 };
  }

  return machines;
}

const data = generateMachineData();

fs.writeFile('public/machine1/production_and_charge.json', JSON.stringify(data.machine1, null, 2), (err) => {
  if (err) {
    console.error('machine1 파일 저장 오류:', err);
  } else {
    console.log('machine1 파일이 성공적으로 생성되었습니다.');
  }
});

fs.writeFile('public/machine2/production_and_charge.json', JSON.stringify(data.machine2, null, 2), (err) => {
  if (err) {
    console.error('machine2 파일 저장 오류:', err);
  } else {
    console.log('machine2 파일이 성공적으로 생성되었습니다.');
  }
});

fs.writeFile('public/machine3/production_and_charge.json', JSON.stringify(data.machine3, null, 2), (err) => {
  if (err) {
    console.error('machine3 파일 저장 오류:', err);
  } else {
    console.log('machine3 파일이 성공적으로 생성되었습니다.');
  }
});