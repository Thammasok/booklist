# Booklist Application

A modern, full-stack book tracking application that helps you organize and manage your personal library. Built with a React/Next.js frontend and a Node.js/TypeScript backend with MongoDB.

## 🚀 Features

- **Book Management**: Add, edit, and organize your book collection
- **Category System**: Categorize books with a flexible category system
- **User Authentication**: Secure signup and login with JWT
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with shadcn/ui for a beautiful, accessible interface

## 📁 Project Structure

```
booklist/
├── service/           # Backend service (Node.js/TypeScript/Express)
│   ├── src/           # Source code
│   └── ...           
└── web-app/          # Frontend application (Next.js/React)
    ├── src/          # Source code
    └── ...
```

## 🛠️ Prerequisites

- Node.js (v18 or later)
- npm or yarn
- MongoDB (local or Docker)
- Git

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/booklist.git
   cd booklist
   ```

2. **Set up the backend**
   ```bash
   cd service
   cp .env.example .env  # Update with your configuration
   npm install
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd ../web-app
   cp .env.local.example .env.local  # Update with your configuration
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3100
   - API Documentation: http://localhost:3100/api-docs

## 📚 Documentation

- [Service Documentation](./service/README.md) - Backend API documentation
- [Web App Documentation](./web-app/README.md) - Frontend documentation
- [API Documentation](http://localhost:3100/api-docs) (after starting the backend)

## 🙏 Acknowledgments

- Built with Next.js, React, Node.js, and MongoDB
- UI components provided by shadcn/ui
- Icons by Lucide React
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
   cd service
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
1. สร้างไฟล์ใหม่ใน `service/src/models/`
2. กำหนด Schema ด้วย Mongoose
3. สร้าง TypeScript interfaces ใน `service/src/types/`

### เพิ่ม Route ใหม่
1. สร้างไฟล์ใหม่ใน `service/src/routes/`
2. กำหนด routes และผูกกับ controller
3. นำเข้า routes ใน `app.ts`

### เพิ่ม Controller ใหม่
1. สร้างไฟล์ใหม่ใน `service/src/controllers/`
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
