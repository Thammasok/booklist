# Booklist Application

A modern, full-stack book tracking application that helps you organize and manage your personal library. Built with a React/Next.js frontend and a Node.js/TypeScript backend with MongoDB.

## 🚀 Features

- **Book Management**: Add, edit, and organize your book collection
- **Category System**: Categorize books with a flexible category system
- **User Authentication**: Secure signup and login with JWT
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with shadcn/ui for a beautiful, accessible interface
- **Docker Support**: Easy setup with Docker and Docker Compose
- **RESTful API**: Well-documented endpoints for integration

## 📁 Project Structure

```
booklist/
├── service/           # Backend service (Node.js/TypeScript/Express)
│   ├── src/           # Source code
│   └── ...           
├── web-app/          # Frontend application (Next.js/React)
│   ├── src/          # Source code
│   └── ...
└── booklist_app/     # Flutter mobile application
    └── ...
```

## 🛠️ Prerequisites

- Node.js (v18 or later)
- npm or yarn
- MongoDB (local or Docker)
- Git
- Docker (optional, for containerized deployment)

## 🚀 Getting Started

### Option 1: Local Development (Without Docker)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Thammasok/booklist.git
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

### Option 2: Docker Setup

1. **Start MongoDB with Docker**
   ```bash
   docker compose up -d mongodb
   ```
   This will:
   - Pull MongoDB image from Docker Hub (if not already present)
   - Create and run a container as defined in docker-compose.yml
   - Start the MongoDB service

2. **Set up the backend service**
   ```bash
   cd service
   npm install
   cp .env.example .env  # Create .env file from example
   ```
   Update the `.env` file with your configuration

3. **Run the backend service**
   - Development mode:
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm run build
     npm start
     ```

4. **Verify the setup**
   - Backend API: `http://localhost:3100/health`
   - MongoDB: `mongodb://root:example@localhost:27017`

## 📚 API Documentation

### Health Check
- `GET /health` - Check server status

### Books
- `GET /api/v1/books` - Get all books
- `GET /api/v1/books/:id` - Get book by ID
- `POST /api/v1/books` - Create a new book
- `PUT /api/v1/books/:id` - Update a book
- `DELETE /api/v1/books/:id` - Delete a book

## 🛠 Development

### Adding a New Model
1. Create a new file in `service/src/models/`
2. Define the schema using Mongoose
3. Create TypeScript interfaces in `service/src/types/`

### Adding New Routes
1. Create a new file in `service/src/routes/`
2. Define routes and connect to controllers
3. Import routes in `app.ts`

### Adding New Controllers
1. Create a new file in `service/src/controllers/`
2. Implement request/response handling
3. Connect to the service layer

## 🐳 Docker Commands

- **Stop containers** (data preserved in volumes):
  ```bash
  docker compose down
  ```

- **Stop and remove volumes** (warning: deletes all database data):
  ```bash
  docker compose down -v
  ```

- **View logs**:
  ```bash
  docker compose logs -f mongodb
  ```

## ⚙️ Configuration

1. **Change credentials**:
   Update values in the `environment` section of `docker-compose.yml`

2. **Change ports**:
   Modify the `ports` section (e.g., `"27018:27017"` to use port 27018 on host)

3. **Add environment variables**:
   Add any additional environment variables as needed

## 📝 Notes

### Database
- Data is stored in a Docker volume named `mongodb_data`
- Change the default password (`example`) before using in production
- MongoDB is accessible at `mongodb://root:example@localhost:27017`

### Development
- Use `npm run dev` for development with hot-reload
- Use `npm run lint` for code quality checks
- Use `npm run format` for code formatting

### Security
For production use, consider additional security measures:
- Enable HTTPS
- Implement rate limiting
- Use environment variables for sensitive data
- Keep dependencies updated
- Implement proper CORS policies

## 📚 Documentation

- [Service Documentation](./service/README.md) - Backend API documentation
- [Web App Documentation](./web-app/README.md) - Frontend documentation
- [Flutter App Documentation](./booklist_app/README.md) - Mobile app documentation
- [API Documentation](http://localhost:3100/api-docs) (after starting the backend)

## 🙏 Acknowledgments

- Built with Next.js, React, Node.js, and MongoDB
- UI components provided by shadcn/ui
- Icons by Lucide React
- Use environment variables for sensitive data
- Implement rate limiting
- Use helmet for HTTP header security
- Use JWT for authentication

### Scaling
- สามารถ scale บริการได้โดยการเพิ่ม instances ของ backend service
- ใช้ MongoDB replica set สำหรับการใช้งานจริงที่มีความพร้อมใช้งานสูง
