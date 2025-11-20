# Slice Bridge Service

A robust cross-chain bridge service enabling seamless token transfers between BSC (Binance Smart Chain) and Lens Protocol networks. Built with TypeScript, Hono, Drizzle ORM, and BullMQ.

## 🔋 Features

- **Cross-Chain Bridge**: Transfer tokens between BSC and Lens networks
- **Event Listeners**: Real-time monitoring of blockchain events (Lock/Burn)
- **Queue System**: Robust job processing with BullMQ (Redis-backed) or in-memory fallback
- **Database Integration**: PostgreSQL with Drizzle ORM for reliable transaction tracking
- **RESTful API**: Clean HTTP endpoints for bridge operations
- **Docker Support**: Full containerization with Docker Compose
- **Health Monitoring**: Built-in health checks and monitoring endpoints

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   BSC Network   │    │  Bridge Service │    │  Lens Network   │
│                 │    │                 │    │                 │
│  Lock Tokens    │───▶│   Event         │───▶│   Mint Tokens   │
│  (Gateway)      │    │   Listeners     │    │   (Minter)      │
│                 │    │                 │    │                 │
│  Unlock Tokens  │◀───│   Queue         │◀───│   Burn Tokens   │
│  (Gateway)      │    │   Processor     │    │   (Wrapped)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Docker
- PostgreSQL database
- BSC and Lens RPC endpoints
- Redis (for production queue)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/tmh3101/slice-bridge-relayer.git
   cd slice-bridge-relayer
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   # Generate migration (if needed)
   pnpm run migrate:gen
   
   # Push schema to database
   pnpm run migrate:push
   ```

5. **Start development server**
   ```bash
   pnpm run dev
   ```

The service will start at `http://localhost:8787`

### 🏃‍♂️ Running from Source Code

#### Method 1: Development Mode (Recommended for Development)
```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env file with your actual configuration:
# - DATABASE_URL: Your PostgreSQL connection string
# - REDIS_URL: Your Redis connection (optional, will fallback to memory)
# - Blockchain RPC endpoints and contract addresses
# - RELAYER_PK: Private key for transaction signing

# 3. Set up database
pnpm run migrate:gen  # Generate migrations
pnpm run migrate:push # Apply to database

# 4. Start development server with hot reload
pnpm run dev
```

#### Method 2: Production Build
```bash
# 1. Build TypeScript to JavaScript
pnpm run build

# 2. Start production server
NODE_ENV=production npx tsx src/index.ts
```

#### Method 3: Direct TypeScript Execution
```bash
# Run directly with tsx (handles TypeScript + path aliases)
npx tsx src/index.ts
```

### 🔧 Build Process

The project uses TypeScript with custom path aliases (`@/*`). Build configuration:

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "outDir": "./dist",
    "rootDir": "./src",
    "target": "ES2022",
    "module": "ESNext",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

**Build commands:**
```bash
# TypeScript compilation
pnpm run build        # Compiles to ./dist folder

# Database operations
pnpm run migrate:gen   # Generate new migrations
pnpm run migrate:push  # Apply migrations to database
```

### 🐳 Docker Development & Deployment

#### Quick Start with Docker Compose

1. **Start with Docker Compose (recommended)**
   ```bash
   # Start all services (app + redis)
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   ```

2. **Access services**
   - Bridge API: http://localhost:8787/api
   - Health Check: http://localhost:8787/api/health

#### 🔨 Building with Docker

##### Method 1: Docker Compose Build
```bash
# Build the application
docker-compose build app

# Build without cache (clean build)
docker-compose build --no-cache app

# Build and start services
docker-compose up -d --build
```

##### Method 2: Manual Docker Build
```bash
# Build the Docker image
docker build -t slice-bridge-relayer .

# Run the container
docker run -d \
  --name slice-bridge-app \
  -p 8787:8787 \
  -e DATABASE_URL="your_database_url" \
  -e REDIS_URL="redis://localhost:6379" \
  slice-bridge-relayer
```

#### 🏗️ Docker Architecture

The project uses a lightweight Docker setup:

```yaml
services:
  # Redis for BullMQ queues (port 6380 to avoid conflicts)
  redis:
    image: redis:7-alpine
    ports: ["6380:6379"]
    
  # Main application
  app:
    build: .
    ports: ["8787:8787"]
    depends_on: [redis]
```

#### 🚀 Production Docker Deployment

##### Step 1: Prepare Environment
```bash
# 1. Copy and configure production environment
cp .env.example .env.production

# 2. Edit .env.production with production values:
# - DATABASE_URL: Production PostgreSQL connection
# - REDIS_URL: Production Redis connection  
# - All blockchain RPC endpoints and contract addresses
# - RELAYER_PK: Production private key (KEEP SECURE!)
```

##### Step 2: Deploy with Docker Compose
```bash
# Option A: Basic deployment
docker-compose up -d

# Option B: Production deployment with custom env
docker-compose --env-file .env.production up -d

# Option C: Scale workers (if needed)
docker-compose up -d --scale app=2
```

##### Step 3: Monitor and Maintain
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f app

# Monitor Redis service
docker-compose logs -f redis

# Restart services
docker-compose restart app

# Update and redeploy
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### 🎯 Docker Development Workflow

```bash
# 1. Development workflow
git clone https://github.com/goby35/slice-bridge-relayer.git
cd slice-bridge-relayer
cp .env.example .env  # Configure your local settings

# 2. Start development environment
docker-compose up -d redis  # Start Redis first
pnpm install && pnpm run dev  # Run app locally with hot reload

# 3. Test in container environment
docker-compose up -d  # Test full containerized setup

# 4. Monitor services
docker-compose logs -f  # Monitor all services
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `8787` | No |
| `NODE_ENV` | Environment | `development` | No |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` | No |
| `USE_REDIS` | Force Redis usage | `false` | No |
| `LENS_CHAIN_ID` | Lens chain ID | `37111` | No |
| `LENS_MINTER_ADDRESS` | Bridge minter contract | - | Yes |
| `LENS_WRAPPED_ADDRESS` | Wrapped token contract | - | Yes |
| `BSC_CHAIN_ID` | BSC chain ID | `97` | No |
| `BSC_POOL_ADDRESS` | Bridge pool contract | - | Yes |
| `BSC_TOKEN_ADDRESS` | Token contract on BSC | - | Yes |
| `RELAYER_PK` | Private key for transactions | - | Yes |

### Queue Configuration

The service automatically chooses the appropriate queue adapter:

- **BullMQ (Redis)**: Used when `REDIS_URL` is provided or `USE_REDIS=true`
- **In-Memory**: Development fallback when Redis is unavailable

## 📡 API Endpoints

### Health Check
```http
GET /health
```

## 🔄 Bridge Flow

### BSC → Lens (Lock & Mint)
1. User locks tokens on BSC Gateway contract
2. Event listener detects `Locked` event
3. Job queued for processing
4. Service mints equivalent tokens on Lens

### Lens → BSC (Burn & Unlock)
1. User burns wrapped tokens on Lens
2. Event listener detects `Burned` event  
3. Job queued for processing
4. Service unlocks original tokens on BSC

## 🗄️ Database Schema

### Bridge Jobs
Tracks all cross-chain transactions with status monitoring:

```sql
CREATE TABLE bridge_jobs (
  id SERIAL PRIMARY KEY,
  direction VARCHAR(12) NOT NULL,
  src_chain_id BIGINT NOT NULL,
  dst_chain_id BIGINT NOT NULL,
  token_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  amount NUMERIC(78, 0) NOT NULL,
  src_tx_hash TEXT,
  src_nonce BIGINT,
  dst_tx_hash TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  error TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

## 🚢 Production Deployment

### Docker Compose (Recommended)

For detailed Docker deployment instructions, see the **[🐳 Docker Development & Deployment](#-docker-development--deployment)** section above.

**Quick deployment:**
```bash
# 1. Prepare environment
cp .env.example .env.production
# Configure production values

# 2. Deploy with Docker Compose
docker-compose --env-file .env.production up -d

# 3. Monitor logs
docker-compose logs -f app
```

### Manual Deployment

1. **Build application**
   ```bash
   pnpm run build
   ```

2. **Start production server**
   ```bash
   NODE_ENV=production npx tsx src/index.ts
   ```

### Environment-Specific Deployment

#### Development
```bash
# Local development with hot reload
pnpm run dev
```

#### Staging/Testing
```bash
# Using Docker with staging environment
docker-compose --env-file .env.staging up -d
```

#### Production
```bash
# Production deployment
docker-compose --env-file .env.production up -d
```

## 🧪 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm migrate:gen` | Generate database migration |
| `pnpm migrate:push` | Apply migration to database |

### Code Structure

```
src/
├── api/          # HTTP endpoints and routing
├── abis/         # Smart contract ABIs
├── clients/      # Blockchain clients (BSC, Lens)
├── core/         # Environment and logging
├── db/           # Database schemas and utilities
├── lib/          # Shared utilities and types
├── listeners/    # Blockchain event listeners
├── processor/    # Bridge job processors
├── queues/       # Queue adapters and management
└── workers/      # Background workers
```

## 🔒 Security Considerations

- **Private Key Management**: Store `RELAYER_PK` securely
- **Database Security**: Use strong passwords and connection encryption
- **Rate Limiting**: Implement API rate limiting for production
- **Access Control**: Restrict database and Redis access
- **Network Security**: Use VPNs or private networks for infrastructure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Queue not processing jobs**
   - Check Redis connection
   - Verify `REDIS_URL` configuration
   - Check worker startup logs

2. **Database connection failed**
   - Verify `DATABASE_URL` format
   - Check PostgreSQL server status
   - Run database migrations

3. **Blockchain RPC errors**
   - Check RPC endpoint availability
   - Verify network connectivity
   - Confirm contract addresses

4. **Transaction failures**
   - Check relayer account balance
   - Verify private key permissions
   - Monitor gas prices

### Docker Issues

1. **Container build failures**
   ```bash
   docker-compose build --no-cache
   ```

2. **Permission issues**
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

3. **Port conflicts**
   - Check if ports 6379, 8787 are available
   - Modify ports in docker-compose.yml

### Support

For support, please open an issue on GitHub or contact the development team.

---

🌟 **Happy Bridging!** 🌟
