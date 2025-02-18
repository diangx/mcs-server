| 기능 | HTTP Method | Endpoint | `curl` 명령어 |
|------|------------|----------|--------------|
| **머신 생성 (5개 예제)** | `POST` | `/api/machines/generate` | ```curl -X POST http://localhost:3000/api/machines/generate -H "Content-Type: application/json" -d '{"count": 5}'``` |
| **전체 머신 리스트 조회** | `GET` | `/api/machines` | ```curl -X GET http://localhost:3000/api/machines``` |
| **모든 머신의 `device_info.json` 조회** | `GET` | `/api/machines/device_info` | ```curl -X GET http://localhost:3000/api/machines/device_info``` |
| **특정 머신의 `device_info.json` 조회 (`machine1`)** | `GET` | `/api/machines/device_info/machine1` | ```curl -X GET http://localhost:3000/api/machines/device_info/machine1``` |
| **모든 머신의 `product_info.json` 조회** | `GET` | `/api/machines/product_info` | ```curl -X GET http://localhost:3000/api/machines/product_info``` |
| **특정 머신의 `product_info.json` 조회 (`machine1`)** | `GET` | `/api/machines/product_info/machine1` | ```curl -X GET http://localhost:3000/api/machines/product_info/machine1``` |
| **모든 머신의 `production_and_charge.json` 조회** | `GET` | `/api/machines/production_and_charge` | ```curl -X GET http://localhost:3000/api/machines/production_and_charge``` |
| **특정 머신의 `production_and_charge.json` 조회 (`machine1`)** | `GET` | `/api/machines/production_and_charge/machine1` | ```curl -X GET http://localhost:3000/api/machines/production_and_charge/machine1``` |