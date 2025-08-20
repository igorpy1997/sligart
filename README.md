# Sligart Studio - Portfolio & CRM Platform

A modern portfolio website with integrated CRM system for web development studio. Features a public portfolio showcase and private admin panel for managing projects, team members, and client requests.

## 🚀 Quick Start

### 1. Setup Caddy Configuration
```bash
bash setup_caddy.sh
```

### 2. Configure Environment
Create `.env.docker` file with your credentials:

```env
# Domain Configuration
NGROK_DOMAIN=your-domain.ngrok-free.app

# Database Configuration
PSQL_HOST=postgres
PSQL_PORT=5432
PSQL_USER=your_username
PSQL_PASSWORD=your_password
PSQL_DB=sligart

# Cloudflare R2 Storage Configuration
R2_ENDPOINT_URL=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://pub-your-bucket-id.r2.dev
```

**Note:** You'll need to:
- Register for Cloudflare R2 storage service
- Use your own domain or create a free ngrok tunnel
- Install `make` if not available on your system

### 3. Initialize Database
```bash
make upgrade-revision revision=head
```

### 4. Start All Services
```bash
make up
```

### 5. Create Admin User
```bash
bash create_admin.sh
```
Default credentials: `admin` / `admin123`

### 6. Access the Platform
- **Public Portfolio**: `https://your-domain.ngrok-free.app`
- **Admin Panel**: `https://your-domain.ngrok-free.app/admin`

## 📁 Project Structure

```
sligart/
├── app/
│   ├── server/           # FastAPI backend
│   └── migrations/       # Database migrations (Alembic)
├── frontend/
│   ├── frontend-app/     # Public portfolio (React)
│   └── sligart-admin/    # Admin panel (React Admin)
├── caddy/               # Reverse proxy configuration
└── docker-compose.yml   # Container orchestration
```

## 🛠 Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Primary database
- **SQLAlchemy** - ORM with async support
- **Alembic** - Database migrations
- **Pydantic** - Data validation
- **JWT** - Authentication & authorization

### Frontend
- **React 18** - Public portfolio interface
- **React Admin** - Administrative dashboard
- **Material-UI** - Component library
- **Framer Motion** - Smooth animations
- **Axios** - API communication

### Infrastructure
- **Docker** - Containerization
- **Caddy** - Reverse proxy with automatic HTTPS
- **Cloudflare R2** - File storage & CDN
- **Ngrok** - Development tunneling (optional)

### Key Features
- 🎨 **Modern Portfolio Design** - Responsive showcase with animations
- 👥 **Team Management** - Developer profiles with drag-&-drop ordering
- 📂 **Project Portfolio** - Multi-image galleries with categories
- 📧 **Contact Forms** - Client inquiry management
- 🔐 **Admin Dashboard** - Full CRUD operations for all entities
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🚀 **Performance Optimized** - Fast loading with image optimization

## 🔧 Development Commands

```bash
# Build and start all services
make up

# Stop all services
make down

# View logs
docker compose logs -f

# Frontend development (runs on :3000)
make frontend-dev

# Admin panel development (runs on :3001)
make admin-dev

# Database operations
make create-revision message="Your migration message"
make upgrade-revision revision=head
```

## 📋 Usage Flow

1. **Setup Infrastructure** - Configure domain, database, and storage
2. **Populate Content** - Add team members, projects, and technologies via admin
3. **Customize Design** - Modify themes and layouts in frontend components
4. **Deploy** - Use provided Docker setup for production deployment

Perfect for web development agencies, freelancers, or any tech team wanting a professional online presence with client management capabilities.

## 📖 Documentation

- API documentation available at `/docs` endpoint
- Admin panel includes built-in help and validation
- Frontend components are well-documented with JSDoc

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for **personal and educational use only**. Commercial use is strictly prohibited without explicit written permission from the author.

**Terms:**
- ✅ Personal projects and learning
- ✅ Portfolio demonstrations
- ✅ Educational purposes
- ❌ Commercial deployment
- ❌ Selling or redistributing
- ❌ Client projects without permission

For commercial licensing inquiries, please contact the project maintainer.