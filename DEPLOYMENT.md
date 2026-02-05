# Deployment Guide - Bitcoin Transaction Parser

## Quick Deploy to Vercel (Recommended)

### Option 1: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your repository: `Git-brintsi20/bitcoin-tx-parser`
4. Vercel will auto-detect the Vite configuration
5. Click "Deploy"
6. Your app will be live in ~2 minutes! 🎉

### Option 2: Deploy via CLI
```bash
npm install -g vercel
vercel login
vercel
```

## Deploy to Netlify

### Via Netlify Dashboard
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select `bitcoin-tx-parser`
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

### Via CLI
```bash
npm install -g netlify-cli
npm run build
netlify login
netlify deploy --prod --dir=dist
```

## Deploy to GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

# Update vite.config.ts to add base: '/bitcoin-tx-parser/'

npm run deploy
```

## Environment Variables

No environment variables needed! All APIs used are public and free:
- Blockstream.info API
- Mempool.space API

## Build Configuration

The project uses:
- **Vite** for bundling
- **TypeScript** with strict mode
- **TailwindCSS** with PostCSS
- **ReactFlow** for visualization

## Performance Optimizations

Already included:
- Code splitting with React.lazy (if needed)
- Production build minification
- Tree shaking
- CSS purging with TailwindCSS

## Post-Deployment Checklist

- [ ] Test transaction parsing with sample data
- [ ] Verify API calls to Blockstream work
- [ ] Check mempool.space fee recommendations load
- [ ] Test on mobile devices
- [ ] Add your deployed URL to README.md
- [ ] Take screenshots for README
- [ ] Share on social media!

## Troubleshooting

### Build fails with Node version error
The project works with Node 20.18.0 despite warnings. If issues persist, upgrade to Node 20.19+ or 22.12+.

### API CORS errors
Blockstream and Mempool.space APIs support CORS. If you encounter issues, ensure you're using HTTPS in production.

### Large bundle size
The bundle is ~476KB (152KB gzipped) due to bitcoinjs-lib. This is expected and acceptable for this use case.

## Monitoring

After deployment, monitor:
- API response times (Blockstream can be slow sometimes)
- Error rates for transaction parsing
- User analytics (add Google Analytics if desired)

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Netlify
1. Go to Domain Settings
2. Add custom domain
3. Follow DNS configuration

## Updates and Maintenance

To push updates:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel/Netlify will auto-deploy on push to main branch!

## Support

For issues, create a GitHub issue or reach out to the Summer of Bitcoin community.

## Next Steps

1. Deploy your app
2. Add the live URL to your Summer of Bitcoin application
3. Take screenshots and add to README
4. Share with the community!

---

**Estimated deployment time:** 5-10 minutes  
**Cost:** $0 (all platforms offer free tier)
