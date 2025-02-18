const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// 📌 기기 정보가 저장된 폴더 경로
const deviceInfoPath = path.join(__dirname, "../public/testdb");

/** 📌 펌웨어 버전 업데이트 API */
router.post("/", async (req, res) => {
  try {
    const { macAddress, fileName } = req.body;

    if (!macAddress || !fileName) {
      return res.status(400).json({ message: "MAC address and fileName are required." });
    }

    // 📌 파일명에서 버전 추출 (앞에 `v` 추가)
    const regex = /(cf|pt|hrf)_agv_v?(\d+\.\d+\.\d+)\.img/;
    const match = fileName.match(regex);

    if (!match) {
      return res.status(400).json({ message: "Invalid file format. Example: cf_agv_v1.0.2.img" });
    }

    const version = `v${match[2]}`; // 📌 앞에 `v` 붙이기 (`vX.X.X`)

    // 📌 MAC 주소가 포함된 `machineX` 찾기
    let foundMachine = null;

    fs.readdirSync(deviceInfoPath).forEach(machine => {
      const deviceFile = path.join(deviceInfoPath, machine, "device_info.json");
      if (fs.existsSync(deviceFile)) {
        const data = JSON.parse(fs.readFileSync(deviceFile, "utf-8"));
        if (data.macaddr === macAddress) {
          foundMachine = { machine, path: deviceFile, data };
        }
      }
    });

    if (!foundMachine) {
      return res.status(404).json({ message: "MAC address not found in database." });
    }

    // 📌 버전 업데이트
    foundMachine.data.version = version;
    fs.writeFileSync(foundMachine.path, JSON.stringify(foundMachine.data, null, 2));

    console.log(`🔄 Firmware updated for ${foundMachine.machine} to version ${version}`);

    return res.json({
      message: `Firmware version updated to ${version} for MAC: ${macAddress} (Machine: ${foundMachine.machine})`,
      updatedDevice: foundMachine.data
    });

  } catch (error) {
    console.error("Error in updateFirmware:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
