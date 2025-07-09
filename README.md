# Booklist Application

This project is a full-stack application with a Node.js/TypeScript backend service and MongoDB database, all containerized with Docker Compose.

## Project Structure

```
booklist/
├── Service/                  # Backend service (Node.js/TypeScript/Express)
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript type definitions
│   │   └── app.ts           # Express app configuration and server entry point
│   ├── .env                 # Environment variables
│   ├── package.json         # Node.js dependencies and scripts
│   └── tsconfig.json        # TypeScript configuration
└── docker-compose.yml       # Docker Compose configuration
```

## Features

- **Backend Service**:
  - Built with Node.js, TypeScript, and Express
  - MongoDB with Mongoose ODM
  - Environment-based configuration
  - RESTful API endpoints
  - Error handling middleware
  - Request validation
  - CORS support

- **Database**:
  - MongoDB in a Docker container
  - Persistent data storage with Docker volumes
  - Secure authentication
  - Easy to scale

## ไฟล์ docker-compose.yml

ไฟล์ `docker-compose.yml` ประกอบด้วยส่วนสำคัญดังนี้:

```yaml
version: '3.8'  # ใช้เวอร์ชัน 3.8 ของ Docker Compose

services:
  mongodb:
    image: mongo:latest  # ใช้ MongoDB image เวอร์ชันล่าสุด
    container_name: mongodb  # ตั้งชื่อ container ว่า mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: root  # ตั้งชื่อผู้ใช้ root
      MONGO_INITDB_ROOT_PASSWORD: example  # ตั้งรหัสผ่าน
    ports:
      - "27017:27017"  # เปิดพอร์ต 27017 ของ host ไปยัง container
    volumes:
      - mongodb_data:/data/db  # เก็บข้อมูลไว้ใน volume ชื่อ mongodb_data
    restart: always  # รีสตาร์ทอัตโนมัติเมื่อ container หยุดทำงาน

volumes:
  mongodb_data:  # กำหนด volume สำหรับเก็บข้อมูล
    driver: local
```

## วิธีการใช้งาน

### ข้อกำหนดเบื้องต้น
- ติดตั้ง Docker และ Docker Compose บนเครื่องของคุณ
- Node.js (v18 ขึ้นไป) และ npm

### เริ่มต้นใช้งาน

1. **เริ่มต้นฐานข้อมูล MongoDB**:
   ```bash
   docker compose up -d mongodb
   ```
   คำสั่งนี้จะ:
   - ดึง MongoDB image จาก Docker Hub (ถ้ายังไม่มีในเครื่อง)
   - สร้างและรัน container ตามที่กำหนดในไฟล์ docker-compose.yml
   - เริ่มต้น MongoDB service

2. **ตั้งค่า Backend Service**:
   ```bash
   cd Service
   npm install
   cp .env.example .env  # สร้างไฟล์ .env จากตัวอย่าง
   ```
   แก้ไขไฟล์ `.env` ตามค่าที่ต้องการ

3. **รัน Backend Service**:
   - โหมดพัฒนา (development):
     ```bash
     npm run dev
     ```
   - โหมดผลิตภัณฑ์ (production):
     ```bash
     npm run build
     npm start
     ```

4. **ตรวจสอบการทำงาน**:
   - Backend API: `http://localhost:3100/health`
   - MongoDB: `mongodb://root:example@localhost:27017`

## API Endpoints

### สุขภาพระบบ (Health Check)
- `GET /health` - ตรวจสอบสถานะการทำงานของเซิร์ฟเวอร์

### หนังสือ (Books)
- `GET /api/v1/books` - ดึงรายการหนังสือทั้งหมด
- `GET /api/v1/books/:id` - ดึงข้อมูลหนังสือตาม ID
- `POST /api/v1/books` - สร้างหนังสือใหม่
- `PUT /api/v1/books/:id` - อัปเดตข้อมูลหนังสือ
- `DELETE /api/v1/books/:id` - ลบหนังสือ

## การพัฒนาต่อยอด

### เพิ่ม Model ใหม่
1. สร้างไฟล์ใหม่ใน `Service/src/models/`
2. กำหนด Schema ด้วย Mongoose
3. สร้าง TypeScript interfaces ใน `Service/src/types/`

### เพิ่ม Route ใหม่
1. สร้างไฟล์ใหม่ใน `Service/src/routes/`
2. กำหนด routes และผูกกับ controller
3. นำเข้า routes ใน `app.ts`

### เพิ่ม Controller ใหม่
1. สร้างไฟล์ใหม่ใน `Service/src/controllers/`
2. กำหนดฟังก์ชันสำหรับจัดการ request/response
3. เชื่อมต่อกับ service layer

### คำสั่งที่เกี่ยวข้อง

- **หยุด container**:
  ```bash
  docker compose down
  ```
  ข้อมูลจะยังคงอยู่เพราะใช้ volume

- **หยุดและลบ volume**:
  ```bash
  docker compose down -v
  ```
  คำเตือน: คำสั่งนี้จะลบข้อมูลทั้งหมดในฐานข้อมูล

- **ดู logs**:
  ```bash
  docker compose logs -f mongodb
  ```

## การปรับแต่ง

1. **เปลี่ยนชื่อผู้ใช้และรหัสผ่าน**:
   แก้ไขค่าในส่วน `environment` ของไฟล์ `docker-compose.yml`

2. **เปลี่ยนพอร์ต**:
   แก้ไขค่าในส่วน `ports` เช่น `"27018:27017"` เพื่อใช้พอร์ต 27018 บน host

3. **เพิ่ม environment variables**:
   สามารถเพิ่ม environment variables อื่นๆ ตามต้องการในส่วน `environment`

## หมายเหตุ

### ฐานข้อมูล
- ข้อมูลจะถูกเก็บไว้ใน Docker volume ชื่อ `mongodb_data`
- ควรเปลี่ยนรหัสผ่านเริ่มต้น (`example`) ก่อนนำไปใช้ในสภาพแวดล้อมจริง
- สามารถเข้าถึง MongoDB ได้ที่ `mongodb://root:example@localhost:27017`

### การพัฒนา
- ใช้ `npm run dev` สำหรับการพัฒนา โดยจะมี hot-reload
- ใช้ `npm run lint` เพื่อตรวจสอบคุณภาพโค้ด
- ใช้ `npm run format` เพื่อจัดรูปแบบโค้ดอัตโนมัติ

### ความปลอดภัย
- สำหรับการใช้งานจริง ควรพิจารณาใช้การจัดการความปลอดภัยเพิ่มเติม:
  - ใช้ HTTPS
  - ใช้ environment variables สำหรับข้อมูลลับ
  - ใช้ rate limiting
  - ใช้ helmet สำหรับการรักษาความปลอดภัยของ HTTP headers
  - ใช้ JWT สำหรับการยืนยันตัวตน

### การปรับขนาด
- สามารถ scale บริการได้โดยการเพิ่ม instances ของ backend service
- ใช้ MongoDB replica set สำหรับการใช้งานจริงที่มีความพร้อมใช้งานสูง
