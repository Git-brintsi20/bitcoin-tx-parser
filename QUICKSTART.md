# 🚀 Quick Start Guide

Get the Bitcoin Transaction Parser running in 5 minutes!

## ⚡ Quick Setup

```bash
# Clone the repository
git clone https://github.com/Git-brintsi20/bitcoin-tx-parser.git
cd bitcoin-tx-parser

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

## 🧪 Test the App

1. Click **"Load Sample"** button to load a test transaction
2. Click **"Decode Transaction"** to see it parsed
3. Explore all 5 features:
   - ✅ Transaction Overview
   - ✅ Inputs/Outputs Analysis
   - ✅ Fee Calculator
   - ✅ Script Decoder
   - ✅ Transaction Visualizer

## 🎯 Try Your Own Transaction

Get a real Bitcoin transaction:
1. Go to [blockstream.info](https://blockstream.info)
2. Find any transaction
3. Copy the "Raw Transaction" hex
4. Paste into the app and decode!

## 📦 Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## 🌐 Deploy

### Vercel (Easiest)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🛠️ Project Structure

```
src/
├── components/         # React components
│   ├── TransactionOverview.tsx
│   ├── InputsList.tsx
│   ├── OutputsList.tsx
│   ├── FeeAnalysis.tsx
│   ├── ScriptDecoder.tsx
│   └── TransactionVisualizer.tsx
├── types/             # TypeScript types
├── utils/             # Helper functions
├── services/          # API calls
└── App.tsx            # Main app
```

## 🔥 Key Features Demo

### Feature 1: Transaction Decoder
```
Input:  Raw hex string
Output: TXID, version, size, weight, vsize
```

### Feature 2: Input/Output Analysis
```
Shows: Addresses, values (BTC + sats), script types
Types: P2PKH, P2SH, P2WPKH, P2WSH, P2TR
```

### Feature 3: Fee Calculator
```
Calculates: Total fee, fee rate (sat/vB)
Compares: Current mempool recommendations
Status: Low/Medium/High priority
```

### Feature 4: Script Decoder
```
Decodes: Bitcoin scripts → opcodes
Shows: OP_DUP, OP_HASH160, OP_CHECKSIG, etc.
Explains: What each operation does
```

### Feature 5: Transaction Visualizer
```
Visual: Interactive flow diagram
Shows: Inputs → TX → Outputs
Interactive: Drag, zoom, explore
```

## 💡 Tips

- **Sample Transaction**: Use the built-in sample to test all features
- **Real Transactions**: Get hex from blockstream.info or mempool.space
- **Script Learning**: Click "Show Decoded Opcodes" to learn Bitcoin scripts
- **Fee Analysis**: Compare your transaction fees with network recommendations

## 🎓 Learning Resources

This project teaches:
- Bitcoin transaction structure
- SegWit (Segregated Witness)
- Address types (Legacy, SegWit, Taproot)
- Bitcoin Script language
- Transaction fee mechanics

## 🐛 Troubleshooting

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port 5173 in use?**
Vite will automatically use next available port.

**API not working?**
Check console for CORS errors. APIs are public, no keys needed.

## 📱 Mobile Responsive

The app works on:
- 💻 Desktop (best experience)
- 📱 Mobile phones
- 🖥️ Tablets

## ⭐ Next Steps

1. ⭐ Star the repo on GitHub
2. 🚀 Deploy to Vercel/Netlify
3. 📸 Add screenshots to README
4. 🎨 Customize styles/colors
5. 🔧 Add new features

## 📞 Need Help?

- **Issues**: Open a GitHub issue
- **Questions**: Check existing issues
- **Contributions**: PRs welcome!

---

**Built for Summer of Bitcoin 2026** 🧡⚡

Ready to decode some transactions? Run `npm run dev` and start exploring!
