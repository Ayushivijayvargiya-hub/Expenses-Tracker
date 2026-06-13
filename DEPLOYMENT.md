# Deployment Guide for FinTrack

This guide covers deploying the FinTrack application to various platforms.

## Current Setup (Frontend Only with Mock Backend)

The current implementation uses LocalStorage for data persistence and includes:
- Complete React frontend
- Mock authentication service
- Mock API services
- All features working with local data

## Quick Deploy (Frontend Only)

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Follow the prompts:**
- Set up and deploy? Yes
- Which scope? Your account
- Link to existing project? No
- Project name? fintrack (or your choice)
- In which directory is your code? ./
- Want to override settings? No

4. **Production deployment:**
```bash
vercel --prod
```

### Option 2: Netlify

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Build the project:**
```bash
npm run build
```

3. **Deploy:**
```bash
netlify deploy
```

4. **Follow prompts:**
- Create & configure a new site
- Team: Your team
- Site name: fintrack (or your choice)
- Publish directory: dist

5. **Deploy to production:**
```bash
netlify deploy --prod
```

### Option 3: GitHub Pages

1. **Install gh-pages:**
```bash
npm install --save-dev gh-pages
```

2. **Add to package.json:**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/fintrack"
}
```

3. **Update vite.config.ts:**
```typescript
export default defineConfig({
  base: '/fintrack/', // Your repo name
  // ... rest of config
})
```

4. **Deploy:**
```bash
npm run deploy
```

## Full-Stack Deployment (With Real Backend)

### Prerequisites

To convert this to a full MERN stack application, you'll need to:

1. Create a Node.js/Express backend
2. Set up MongoDB database
3. Implement real JWT authentication
4. Connect frontend to backend APIs

### Backend Setup

#### 1. Create Backend Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── Budget.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── transactions.js
│   │   ├── budgets.js
│   │   └── analytics.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   ├── budgetController.js
│   │   └── analyticsController.js
│   └── server.js
├── .env
└── package.json
```

#### 2. Install Backend Dependencies

```bash
npm install express mongoose bcrypt jsonwebtoken express-validator cors dotenv cookie-parser
npm install --save-dev nodemon
```

#### 3. Environment Variables (.env)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.com
```

#### 4. Sample User Model (models/User.js)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### MongoDB Atlas Setup

1. **Create Account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up or log in

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose "Shared" (Free)
   - Select cloud provider and region
   - Create cluster

3. **Setup Database Access:**
   - Go to "Database Access"
   - Add new database user
   - Set username and password
   - Give user "Read and write to any database" permission

4. **Setup Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password

### Deploy Backend to Render

1. **Create account on Render:**
   - Go to https://render.com
   - Sign up/login

2. **Create Web Service:**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Or choose "Deploy from Git URL"

3. **Configure Service:**
   ```
   Name: fintrack-api
   Environment: Node
   Build Command: npm install
   Start Command: node src/server.js
   ```

4. **Add Environment Variables:**
   - Add all variables from .env file
   - Set NODE_ENV to production

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete

### Update Frontend for Backend

1. **Create API Configuration (src/config/api.ts):**

```typescript
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  auth: {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    profile: `${API_BASE_URL}/auth/profile`,
  },
  transactions: {
    base: `${API_BASE_URL}/transactions`,
    byId: (id: string) => `${API_BASE_URL}/transactions/${id}`,
  },
  budgets: {
    base: `${API_BASE_URL}/budgets`,
    byId: (id: string) => `${API_BASE_URL}/budgets/${id}`,
  },
  analytics: {
    dashboard: `${API_BASE_URL}/analytics/dashboard`,
    monthly: `${API_BASE_URL}/analytics/monthly`,
    yearly: `${API_BASE_URL}/analytics/yearly`,
  },
};
```

2. **Update Services to Use Real API:**

Replace mock API calls with actual Axios requests:

```typescript
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // For cookies
});

// Example: Update authService.ts
export const authService = {
  async login(data: LoginData) {
    const response = await api.post(API_ENDPOINTS.auth.login, data);
    return response.data;
  },
  // ... other methods
};
```

3. **Add Environment Variable:**

Create `.env` file in frontend root:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Deploy Updated Frontend

1. **Vercel:**
```bash
# Add environment variable
vercel env add VITE_API_URL

# Deploy
vercel --prod
```

2. **Netlify:**
```bash
# Deploy with environment variable
netlify deploy --prod
```

Then add environment variable in Netlify dashboard:
- Site settings → Environment variables
- Add: VITE_API_URL = your backend URL

## Environment-Specific Configuration

### Development
```env
VITE_API_URL=http://localhost:5000/api
```

### Production
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

## CORS Configuration (Backend)

Ensure your backend allows requests from your frontend:

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
```

## Security Best Practices

1. **Use HTTPS** in production
2. **Secure cookies** for JWT tokens
3. **Validate** all inputs
4. **Rate limiting** to prevent abuse
5. **Helmet.js** for security headers
6. **Environment variables** for secrets
7. **Input sanitization** to prevent XSS

## Testing Deployment

1. **Test authentication:**
   - Register new user
   - Login
   - Logout

2. **Test all features:**
   - Create transactions
   - Set budgets
   - View analytics
   - Generate reports

3. **Test on different devices:**
   - Desktop
   - Mobile
   - Tablet

## Monitoring

### Frontend (Vercel)
- Built-in analytics
- Error tracking
- Performance metrics

### Backend (Render)
- View logs in dashboard
- Set up health checks
- Monitor resource usage

## Troubleshooting

### Build Fails
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript errors

### API Connection Issues
- Verify CORS settings
- Check API URL in environment variables
- Ensure backend is running

### Database Connection Issues
- Verify MongoDB connection string
- Check network access settings
- Ensure database user has correct permissions

## Rollback

### Vercel
```bash
vercel rollback
```

### Netlify
- Go to Deploys
- Click on previous deployment
- Click "Publish deploy"

## Custom Domain

### Vercel
1. Go to project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Netlify
1. Go to site settings
2. Click "Domain management"
3. Add custom domain
4. Configure DNS

## Cost Estimation

### Free Tier Limits

**Vercel:**
- 100GB bandwidth/month
- Unlimited projects
- Automatic SSL

**Netlify:**
- 100GB bandwidth/month
- 300 build minutes/month
- Automatic SSL

**Render (Backend):**
- Free tier available
- 750 hours/month
- Spins down after inactivity

**MongoDB Atlas:**
- 512MB storage (Free)
- Shared cluster
- Suitable for development

## Support

For deployment issues:
- Vercel: https://vercel.com/support
- Netlify: https://www.netlify.com/support
- Render: https://render.com/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas

---

**Note**: The current application works completely with mock data and LocalStorage. Follow the full-stack deployment guide only if you want to set up a real backend with MongoDB.
