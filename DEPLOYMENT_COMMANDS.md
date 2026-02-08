# 🚀 Quick Deployment Commands Reference

## Pre-Deployment Setup

### 1. Initialize Git Repository (if not done)
```bash
git init
git add .
git commit -m "Initial commit - Summer of Bitcoin 2026"
```

### 2. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `bitcoin-tx-parser`
3. Description: "Bitcoin Transaction Parser - Summer of Bitcoin 2026"
4. Public repository
5. Do NOT initialize with README (we already have one)
6. Create repository

### 3. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/bitcoin-tx-parser.git
git branch -M main
git push -u origin main
```

## 🎯 Deployment Options

### ⭐ Option 1: Vercel (Recommended - Easiest)

#### Dashboard Method (No CLI needed)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project"
4. Import `bitcoin-tx-parser` repository
5. Click "Deploy" (all settings auto-detected)
6. Done! ✅

#### CLI Method
```bash
npm install -g vercel
vercel login
vercel --prod
```

Your URL: `https://bitcoin-tx-parser.vercel.app`

---

### 🌐 Option 2: Netlify

#### Dashboard Method
1. Go to https://app.netlify.com
2. Sign up with GitHub
3. "Add new site" → "Import an existing project"
4. Select `bitcoin-tx-parser` repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Deploy!

#### CLI Method
```bash
npm install -g netlify-cli
npm run build
netlify login
netlify deploy --prod --dir=dist
```

Your URL: `https://bitcoin-tx-parser.netlify.app`

---

### 📄 Option 3: GitHub Pages

#### Setup
```bash
npm install -D gh-pages
```

#### Update vite.config.ts (uncomment base line)
```typescript
base: '/bitcoin-tx-parser/',
```

#### Add to package.json scripts
```json
"deploy": "npm run build && gh-pages -d dist"
```

#### Deploy
```bash
npm run deploy
```

#### Enable on GitHub
1. Go to repository Settings → Pages
2. Source: `gh-pages` branch
3. Save

Your URL: `https://YOUR_USERNAME.github.io/bitcoin-tx-parser/`

---

## 🔄 Update Deployment (After Changes)

### For Vercel/Netlify (Auto-Deploy)
```bash
git add .
git commit -m "Your commit message"
git push origin main
```
*Deployment happens automatically!*

### For GitHub Pages (Manual)
```bash
npm run deploy
```

---

## ✅ Post-Deployment Checklist

After deployment, verify:

```bash
# Test locally before deploying
npm run build
npm run preview
# Visit http://localhost:4173
```

Visit your deployed URL and check:
- [ ] Page loads correctly
- [ ] Click "Load Sample" works
- [ ] Click "Decode Transaction" works
- [ ] All 6 sections appear
- [ ] Fee recommendations load
- [ ] No console errors (F12 to check)
- [ ] Mobile view works (resize browser)

---

## 📝 Update README with Live URL

After deployment, update README.md:

```markdown
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-app-url.vercel.app)
```

And in the Demo section:
```markdown
**Try it now**: [https://your-app-url.vercel.app](https://your-app-url.vercel.app)
```

Then commit and push:
```bash
git add README.md
git commit -m "Add live deployment URL"
git push origin main
```

---

## 🐛 Quick Troubleshooting

### Build Fails
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript Errors
```bash
npm run type-check
```

### Deployment Not Working
1. Check build logs on platform dashboard
2. Verify package.json scripts are correct
3. Ensure GitHub repository is public
4. Try a different deployment platform

---

## 🎉 You're All Set!

Your Bitcoin Transaction Parser is now live and ready for your Summer of Bitcoin submission!

**Next Steps:**
1. Test your live deployment thoroughly
2. Add the URL to your Summer of Bitcoin application
3. Share with the community!
4. Add to your resume/portfolio

---

## 📞 Need Help?

- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- GitHub Pages: https://pages.github.com

For deployment issues, check the full [DEPLOYMENT.md](DEPLOYMENT.md) guide.
