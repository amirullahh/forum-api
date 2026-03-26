# Forum API - Deployment Guide

Panduan lengkap untuk deploy Forum API dengan CI/CD, Rate Limiting, dan HTTPS.

## Prerequisites

- Server Ubuntu/Debian (EC2 atau VPS lainnya)
- Domain atau subdomain (misal: your-domain.dcdg.xyz)
- Node.js v22.x
- PostgreSQL 14+
- NGINX
- PM2 (untuk process management)

## Setup Server

### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js v22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install NGINX
sudo apt install -y nginx

# Install PM2 globally
sudo npm install -g pm2
```

### 2. Setup PostgreSQL Database

```bash
# Login ke PostgreSQL
sudo -u postgres psql

# Buat user dan database
CREATE USER developer WITH PASSWORD 'your-secure-password';
CREATE DATABASE forumapi;
CREATE DATABASE forumapi_test;
GRANT ALL PRIVILEGES ON DATABASE forumapi TO developer;
GRANT ALL PRIVILEGES ON DATABASE forumapi_test TO developer;
\q
```

### 3. Clone dan Setup Aplikasi

```bash
# Clone repository
cd ~
git clone https://github.com/your-username/forum-api.git
cd forum-api

# Install dependencies
npm install

# Copy dan edit environment variables
cp .env.example .env
nano .env

# Run migrations
npm run migrate up
```

### 4. Setup Environment Variables

Edit file `.env`:

```env
# HTTP SERVER
HOST=localhost
PORT=5000

# POSTGRES
PGHOST=localhost
PGUSER=developer
PGDATABASE=forumapi
PGPASSWORD=your-secure-password
PGPORT=5432

# TOKENIZE
ACCESS_TOKEN_KEY=your-secret-access-token-key-minimum-32-characters
REFRESH_TOKEN_KEY=your-secret-refresh-token-key-minimum-32-characters
ACCCESS_TOKEN_AGE=3000
```

### 5. Setup SSL Certificate dengan Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d your-domain.dcdg.xyz

# Test auto-renewal
sudo certbot renew --dry-run
```

### 6. Setup NGINX

```bash
# Copy NGINX configuration
sudo cp nginx.conf /etc/nginx/sites-available/forum-api

# Edit server_name dan SSL paths
sudo nano /etc/nginx/sites-available/forum-api

# Enable site
sudo ln -s /etc/nginx/sites-available/forum-api /etc/nginx/sites-enabled/

# Test NGINX configuration
sudo nginx -t

# Restart NGINX
sudo systemctl restart nginx
```

### 7. Start Application dengan PM2

```bash
# Start aplikasi
pm2 start src/app.js --name forum-api

# Save PM2 process list
pm2 save

# Setup PM2 startup script
pm2 startup
# Jalankan command yang diberikan oleh PM2

# Monitor aplikasi
pm2 logs forum-api
pm2 monit
```

## Setup GitHub Actions CI/CD

### 1. Setup GitHub Secrets

Di repository GitHub Anda, tambahkan secrets berikut (Settings > Secrets and variables > Actions):

**For CI (Optional - if using external test database):**
- `PGHOST` - Database host untuk testing
- `PGUSER` - Database user
- `PGPASSWORD` - Database password
- `PGDATABASE_TEST` - Test database name
- `PGPORT` - Database port (5432)
- `ACCESS_TOKEN_KEY` - JWT access token key
- `REFRESH_TOKEN_KEY` - JWT refresh token key

**For CD (Required):**
- `SSH_HOST` - IP address server Anda
- `SSH_USER` - SSH username (misal: ubuntu)
- `SSH_PRIVATE_KEY` - SSH private key (isi dari ~/.ssh/id_rsa)
- `SSH_PORT` - SSH port (default: 22)
- `APP_PATH` - Path aplikasi di server (misal: /home/ubuntu/forum-api)

### 2. Generate SSH Key untuk Deployment

Di local machine atau GitHub Actions:

```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github-actions

# Copy public key ke server
ssh-copy-id -i ~/.ssh/github-actions.pub user@your-server-ip

# Copy private key content untuk GitHub Secret
cat ~/.ssh/github-actions
```

### 3. Test CI/CD

**Test CI:**
1. Buat branch baru: `git checkout -b test-ci`
2. Buat perubahan kecil
3. Push dan create Pull Request ke main
4. GitHub Actions akan otomatis run tests

**Test CD:**
1. Merge PR ke main branch
2. GitHub Actions akan otomatis deploy ke server

## Verification Checklist

### ✅ Aplikasi Running
```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs forum-api

# Test local endpoint
curl http://localhost:5000/health
```

### ✅ HTTPS Working
```bash
# Test HTTPS
curl https://your-domain.dcdg.xyz/health

# Check SSL certificate
openssl s_client -connect your-domain.dcdg.xyz:443 -servername your-domain.dcdg.xyz
```

### ✅ Rate Limiting Active
```bash
# Test rate limiting (should get 429 after 90 requests)
for i in {1..95}; do
  curl -w "\n%{http_code}\n" https://your-domain.dcdg.xyz/threads/test-123
done
```

### ✅ GitHub Actions Running
1. Check Actions tab di GitHub repository
2. Verify CI runs on Pull Requests
3. Verify CD runs on push to main

## Testing dengan Postman

1. Import collection dari folder `Forum API V2 Test`
2. Update environment variable:
   - `base_url`: https://your-domain.dcdg.xyz
3. Run collection dengan Collection Runner
4. Semua tests harus passed (kecuali yang [optional])

## Monitoring

### PM2 Monitoring
```bash
pm2 monit              # Real-time monitoring
pm2 logs forum-api     # View logs
pm2 restart forum-api  # Restart app
```

### NGINX Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/forum-api-access.log

# Error logs
sudo tail -f /var/log/nginx/forum-api-error.log
```

### Database Monitoring
```bash
# Login to PostgreSQL
sudo -u postgres psql forumapi

# Check connections
SELECT * FROM pg_stat_activity;

# Check database size
SELECT pg_size_pretty(pg_database_size('forumapi'));
```

## Troubleshooting

### Aplikasi Tidak Start
```bash
# Check PM2 logs
pm2 logs forum-api --lines 100

# Check environment variables
pm2 env forum-api

# Restart aplikasi
pm2 restart forum-api
```

### NGINX Error
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart NGINX
sudo systemctl restart nginx
```

### Database Connection Error
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection from application
psql -h localhost -U developer -d forumapi

# Reset password if needed
sudo -u postgres psql
ALTER USER developer PASSWORD 'new-password';
```

### GitHub Actions Deployment Failed
1. Check Actions logs di GitHub
2. Verify SSH connection: `ssh user@your-server-ip`
3. Check SSH_PRIVATE_KEY secret format (must include header/footer)
4. Verify APP_PATH exists on server

## Maintenance

### Update Aplikasi
```bash
cd ~/forum-api
git pull origin main
npm install
npm run migrate up
pm2 restart forum-api
```

### Backup Database
```bash
# Backup
pg_dump -U developer forumapi > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
psql -U developer forumapi < backup_file.sql
```

### Update SSL Certificate
```bash
# Renew certificate (auto-renewal biasanya sudah aktif)
sudo certbot renew

# Restart NGINX
sudo systemctl reload nginx
```

## Security Best Practices

1. ✅ Selalu gunakan HTTPS
2. ✅ Keep dependencies updated: `npm audit fix`
3. ✅ Use strong passwords untuk database
4. ✅ Rotate JWT keys secara berkala
5. ✅ Monitor logs secara rutin
6. ✅ Setup firewall (UFW):
```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

## Support

Jika ada masalah, check:
1. Application logs: `pm2 logs forum-api`
2. NGINX logs: `/var/log/nginx/`
3. PostgreSQL logs: `/var/log/postgresql/`
4. GitHub Actions logs: Repository > Actions tab
