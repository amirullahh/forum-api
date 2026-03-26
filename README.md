# Forum API

RESTful API untuk aplikasi forum diskusi dengan fitur lengkap: authentication, threads, comments, replies, dan likes. Dibangun dengan Express.js, PostgreSQL, dan menerapkan Clean Architecture.

## 🚀 Features

### Core Features
- ✅ **User Management** - Register, login, logout
- ✅ **Thread Management** - Buat dan lihat thread diskusi
- ✅ **Comment System** - Komentar pada thread dengan soft delete
- ✅ **Reply System** - Balasan komentar dengan soft delete
- ✅ **Like System** - Like/unlike komentar (fitur opsional)

### Security & Performance
- 🔒 **JWT Authentication** - Access dan refresh token
- 🛡️ **Rate Limiting** - 90 requests/minute untuk /threads endpoints
- 🔐 **HTTPS Support** - SSL/TLS configuration dengan NGINX
- 🚦 **DDoS Protection** - Rate limiting pada NGINX level

### DevOps & Quality
- 🔄 **CI/CD Pipeline** - GitHub Actions untuk testing dan deployment
- 🧪 **100% Test Coverage** - Comprehensive unit, integration, dan functional tests
- 📊 **Clean Architecture** - Domain-driven design dengan dependency injection
- 🎯 **ESLint** - Code quality dan consistency

## 📋 Requirements

- **Node.js** v22.x (LTS)
- **PostgreSQL** 14+
- **npm** v10+

## 🛠️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/amirullahh/forum-api.git
cd forum-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

```bash
# Create PostgreSQL databases
createdb forumapi
createdb forumapi_test

# Or using psql
psql -U postgres
CREATE DATABASE forumapi;
CREATE DATABASE forumapi_test;
```

### 4. Environment Configuration

Create `.env` file:

```env
# HTTP SERVER
HOST=localhost
PORT=5000

# POSTGRES
PGHOST=localhost
PGUSER=your-db-user
PGDATABASE=forumapi
PGPASSWORD=your-db-password
PGPORT=5432

# POSTGRES TEST
PGHOST_TEST=localhost
PGUSER_TEST=your-db-user
PGDATABASE_TEST=forumapi_test
PGPASSWORD_TEST=your-db-password
PGPORT_TEST=5432

# TOKENIZE
ACCESS_TOKEN_KEY=your-secret-key-minimum-32-characters
REFRESH_TOKEN_KEY=your-secret-key-minimum-32-characters
ACCCESS_TOKEN_AGE=3000
```

Create `.test.env` file:

```env
# POSTGRES TEST
PGHOST=localhost
PGUSER=your-db-user
PGDATABASE=forumapi_test
PGPASSWORD=your-db-password
PGPORT=5432
```

### 5. Run Database Migrations

```bash
# Production
npm run migrate up

# Test
npm run migrate:test up
```

### 6. Start Application

```bash
# Development (with auto-reload)
npm run start:dev

# Production
npm start
```

Application will run on http://localhost:5000

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Test Coverage Results
- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

## 📚 API Documentation

### Base URL
- Local: `http://localhost:5000`
- Production: `https://your-domain.dcdg.xyz`

### Endpoints

#### Authentication
- `POST /users` - Register user baru
- `POST /authentications` - Login
- `PUT /authentications` - Refresh access token
- `DELETE /authentications` - Logout

#### Threads
- `POST /threads` - Buat thread baru (authenticated)
- `GET /threads/{threadId}` - Get thread detail dengan comments dan replies

#### Comments
- `POST /threads/{threadId}/comments` - Tambah komentar (authenticated)
- `DELETE /threads/{threadId}/comments/{commentId}` - Hapus komentar (authenticated, owner only)
- `PUT /threads/{threadId}/comments/{commentId}/likes` - Toggle like komentar (authenticated)

#### Replies
- `POST /threads/{threadId}/comments/{commentId}/replies` - Tambah balasan (authenticated)
- `DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}` - Hapus balasan (authenticated, owner only)

### Rate Limiting
- **Endpoint**: `/threads` dan semua sub-path
- **Limit**: 90 requests per minute per IP
- **Response**: HTTP 429 (Too Many Requests) jika melebihi limit

### Testing dengan Postman
1. Import collection dari folder `Forum API V2 Test`
2. Import environment dari file yang sama
3. Jalankan dengan Collection Runner
4. Pastikan semua test passed (kecuali yang [optional])

## 🏗️ Architecture

Proyek ini menggunakan **Clean Architecture** dengan pembagian layer:

```
src/
├── Applications/          # Application business rules
│   ├── security/         # Security interfaces
│   └── use_case/         # Use cases / interactors
├── Commons/              # Shared utilities
│   └── exceptions/       # Custom exceptions
├── Domains/              # Enterprise business rules
│   ├── authentications/  # Auth entities & repository
│   ├── comment_likes/    # Comment likes entities
│   ├── comments/         # Comment entities & repository
│   ├── replies/          # Reply entities & repository
│   ├── threads/          # Thread entities & repository
│   └── users/            # User entities & repository
├── Infrastructures/      # Frameworks & drivers
│   ├── database/         # Database configuration
│   ├── http/             # HTTP server & middleware
│   ├── repository/       # Repository implementations
│   └── security/         # Security implementations
└── Interfaces/           # Interface adapters
    └── http/             # HTTP handlers & routes
```

## 🚀 Deployment

Lihat [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) untuk panduan lengkap deployment dengan:
- ✅ NGINX configuration untuk HTTPS dan rate limiting
- ✅ GitHub Actions CI/CD pipeline
- ✅ PM2 process management
- ✅ SSL/TLS dengan Let's Encrypt
- ✅ Security best practices

### Quick Deploy Checklist

1. ✅ Setup server (Ubuntu/Debian dengan Node.js, PostgreSQL, NGINX)
2. ✅ Clone repository dan install dependencies
3. ✅ Setup environment variables
4. ✅ Run database migrations
5. ✅ Configure NGINX dengan SSL
6. ✅ Start aplikasi dengan PM2
7. ✅ Setup GitHub Actions secrets
8. ✅ Test CI/CD pipeline
9. ✅ Verify dengan Postman collection

## 📝 Scripts

```bash
npm start              # Start production server
npm run start:dev      # Start development server with auto-reload
npm test              # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run migrate       # Run database migrations
npm run migrate:test  # Run test database migrations
npm run lint          # Run ESLint
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt dengan salt rounds
- **Rate Limiting** - Prevent DDoS attacks
- **HTTPS/TLS** - Encrypted communication
- **Input Validation** - Prevent injection attacks
- **Authorization** - Resource ownership verification
- **SQL Injection Prevention** - Parameterized queries

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Code Quality Guidelines
- ✅ Follow ESLint configuration
- ✅ Write tests untuk semua fitur baru
- ✅ Maintain test coverage > 99%
- ✅ Follow Clean Architecture principles
- ✅ Write clear commit messages

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Dicoding Indonesia - Expert Backend Developer Submission

## 🙏 Acknowledgments

- Dicoding Indonesia untuk kurikulum dan guideline
- Express.js team
- PostgreSQL community
- Clean Architecture by Robert C. Martin

## 📞 Support

Jika ada pertanyaan atau issue:
1. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. Review existing GitHub Issues
3. Create new issue dengan detail lengkap

---

**⭐ Star repository ini jika bermanfaat!**
