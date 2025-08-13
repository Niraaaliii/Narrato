# 🚀 Narrato AI - Render Deployment Guide

## Quick Deploy Links

### Backend
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Frontend
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## 📋 Prerequisites

1. **Render Account** - Sign up at [render.com](https://render.com)
2. **API Keys** - You'll need:
   - Google Gemini API key
   - Deepgram API key
   - OpenAI API key (optional)

## 🔧 Backend Deployment Steps

### 1. Deploy Backend
1. Click the backend deploy button above
2. Connect your GitHub repository
3. Configure environment variables:
   ```
   GEMINI_API_KEY=your_google_gemini_key_here
   DEEPGRAM_API_KEY=your_deepgram_key_here
   OPENAI_API_KEY=your_openai_key_here
   ```
4. Deploy!

### 2. Update Frontend API URL
After backend deployment, update the frontend API URL:

1. Go to your deployed backend on Render
2. Copy the URL (e.g., `https://narrato-backend-xyz.onrender.com`)
3. Update `frontend/render.yaml`:
   ```yaml
   envVars:
     - key: VITE_API_URL
       value: https://your-backend-url.onrender.com
   ```

## 🎨 Frontend Deployment Steps

### 1. Deploy Frontend
1. Click the frontend deploy button above
2. Connect your GitHub repository
3. The build will automatically use the API URL from environment variables

## 🔍 Manual Deployment (Alternative)

### Backend Manual Setup
```bash
# 1. Create new Web Service on Render
# 2. Connect GitHub repo
# 3. Settings:
#    - Environment: Node
#    - Build Command: npm install
#    - Start Command: node index.js
#    - Environment Variables: Add your API keys
```

### Frontend Manual Setup
```bash
# 1. Create new Static Site on Render
# 2. Connect GitHub repo
# 3. Settings:
#    - Build Command: npm run build
#    - Publish Directory: dist
#    - Environment Variables: VITE_API_URL
```

## 🌐 Environment Variables Reference

### Backend (.env)
```bash
GEMINI_API_KEY=your_key_here
DEEPGRAM_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
PORT=10000  # Render sets this automatically
```

### Frontend (Environment Variables)
```bash
VITE_API_URL=https://your-backend-url.onrender.com
```

## 🎯 Post-Deployment Checklist

- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] API keys configured in backend
- [ ] Frontend API URL updated
- [ ] Test file upload functionality
- [ ] Verify audio generation works
- [ ] Check all audience types work

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Backend already has CORS configured
   - Ensure frontend URL is correct in environment variables

2. **API Key Issues**
   - Verify all API keys are correctly set in Render dashboard
   - Check API key permissions and billing

3. **Build Failures**
   - Ensure `package.json` has all required dependencies
   - Check Node.js version compatibility (use Node 18+)

4. **Memory Issues**
   - Large files might cause memory issues
   - Consider upgrading Render plan for more memory

## 📊 Performance Tips

1. **File Size Limits**
   - Keep presentations under 10MB for optimal performance
   - Backend processes first 5 slides to avoid rate limits

2. **Caching**
   - Consider implementing Redis for caching processed presentations

3. **CDN**
   - Use CDN for static assets (automatic with Render)

## 🔄 Continuous Deployment

Both services are configured for automatic deployments:
- Backend: Deploys on push to main branch
- Frontend: Deploys on push to main branch

## 📞 Support

If you encounter issues:
1. Check Render logs in the dashboard
2. Verify all environment variables
3. Test locally first with the same configuration
4. Check API service status pages

## 🎉 Success!

Once deployed, your Narrato AI will be available at:
- Frontend: `https://narrato-frontend-xyz.onrender.com`
- Backend: `https://narrato-backend-xyz.onrender.com`

Happy presenting! 🎤
