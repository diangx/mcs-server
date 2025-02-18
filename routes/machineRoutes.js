const express = require('express');
const {
  generateMachines,
  getMachineList,
  getMachineData,
  getSingleMachineData,
  getAllDeviceInfo,
  getSingleDeviceInfo,
  getAllProductInfo,
  getSingleProductInfo,
  getAllProductChargeInfo,
  getSingleProductChargeInfo
} = require('../services/machineService');

const router = express.Router();

/**
 * 머신 개수 입력받아 데이터 생성
 * curl -X POST http://localhost:3000/api/machines/generate -H "Content-Type: application/json" -d '{"count": 5}'
 */
router.post('/generate', (req, res) => {
  const { count } = req.body;
  if (!count || count < 1) {
    return res.status(400).json({ error: "유효한 숫자를 입력하세요." });
  }

  try {
    generateMachines(count);
    res.json({ message: `${count}개의 머신이 생성되었습니다.` });
  } catch (error) {
    res.status(500).json({ error: '머신 생성 실패', details: error.message });
  }
});

/**
 * 전체 머신 리스트 조회
 * curl -X GET http://localhost:3000/api/machines
 */
router.get('/', (req, res) => {
  try {
    const machineList = getMachineList();
    res.json(machineList);
  } catch (error) {
    res.status(500).json({ error: '머신 리스트 조회 실패', details: error.message });
  }
});


/**
 * 모든 머신의 device_info.json 조회
 * curl -X GET http://localhost:3000/api/machines/device_info
 */
router.get('/device_info', (req, res) => {
  try {
    const deviceInfo = getAllDeviceInfo();
    res.json(deviceInfo);
  } catch (error) {
    res.status(500).json({ error: 'device_info 조회 실패', details: error.message });
  }
});

/**
 * 특정 머신의 device_info.json 조회
 * curl -X GET http://localhost:3000/api/machines/device_info/machine1
 */
router.get('/device_info/:machineId', (req, res) => {
  const machineId = req.params.machineId;

  try {
    const deviceInfo = getSingleDeviceInfo(machineId);
    if (!deviceInfo) {
      return res.status(404).json({ error: '해당 머신의 device_info 데이터가 없습니다.' });
    }
    res.json(deviceInfo);
  } catch (error) {
    res.status(500).json({ error: 'device_info 조회 실패', details: error.message });
  }
});

/**
 * 모든 머신의 product_info.json 조회
 * curl -X GET http://localhost:3000/api/machines/product_info
 */
router.get('/product_info', (req, res) => {
  try {
    const productInfo = getAllProductInfo();
    res.json(productInfo);
  } catch (error) {
    res.status(500).json({ error: '모든 머신의 product_info 조회 실패', details: error.message });
  }
});

/**
 * 특정 머신의 product_info.json 조회
 * curl -X GET http://localhost:3000/api/machines/product_info/machine1
 */
router.get('/product_info/:machineId', (req, res) => {
  const machineId = req.params.machineId;

  try {
    const productInfo = getSingleProductInfo(machineId);
    if (!productInfo) {
      return res.status(404).json({ error: '해당 머신의 product_info 데이터가 없습니다.' });
    }
    res.json(productInfo);
  } catch (error) {
    res.status(500).json({ error: 'product_info 조회 실패', details: error.message });
  }
});




/**
 * 모든 머신의 production_and_charge.json 조회
 * curl -X GET http://localhost:3000/api/machines/production_and_charge
 */
router.get('/production_and_charge', (req, res) => {
  try {
    const productInfo = getAllProductChargeInfo();
    res.json(productInfo);
  } catch (error) {
    res.status(500).json({ error: '모든 머신의 production_and_charge 조회 실패', details: error.message });
  }
});

/**
 * 특정 머신의 production_and_charge.json 조회
 * curl -X GET http://localhost:3000/api/machines/production_and_charge/machine1
 */
router.get('/production_and_charge/:machineId', (req, res) => {
  const machineId = req.params.machineId;

  try {
    const productInfo = getSingleProductChargeInfo(machineId);
    if (!productInfo) {
      return res.status(404).json({ error: '해당 머신의 production_and_charge 데이터가 없습니다.' });
    }
    res.json(productInfo);
  } catch (error) {
    res.status(500).json({ error: 'production_and_charge 조회 실패', details: error.message });
  }
});


/* =============================================== */

/**
 * 모든 머신의 데이터 조회
 * curl -X GET http://localhost:3000/api/machines/data
 */
router.get('/data', (req, res) => {
  try {
    const machines = getMachineData();
    res.json(machines);
  } catch (error) {
    res.status(500).json({ error: '머신 데이터 조회 실패', details: error.message });
  }
});

/**
 * 특정 머신의 데이터 조회
 * curl -X GET http://localhost:3000/api/machines/data/machine1
 */
router.get('/data/:machineId', (req, res) => {
  const machineId = req.params.machineId;

  try {
    const machineData = getSingleMachineData(machineId);
    if (!machineData) {
      return res.status(404).json({ error: '해당 머신 데이터가 없습니다.' });
    }
    res.json(machineData);
  } catch (error) {
    res.status(500).json({ error: '머신 데이터 조회 실패', details: error.message });
  }
});


module.exports = router;
