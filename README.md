# Bitcoin Transaction Parser & Analyzer

A powerful web application that decodes and analyzes Bitcoin transactions in real-time. Think of it as "Google Translate" for Bitcoin transactions - paste raw hex data and see it decoded into human-readable format with detailed analysis.

![Bitcoin Transaction Parser](https://img.shields.io/badge/Bitcoin-Transaction%20Parser-orange?style=for-the-badge&logo=bitcoin)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Features

### 🔍 **Raw Transaction Decoding**
- Parse raw Bitcoin transaction hex format
- Display Transaction ID (TXID)
- Show version, locktime, size, and weight
- Calculate virtual size (vSize) for SegWit transactions
- Count inputs and outputs

### 📊 **Input/Output Analysis**
- Detailed breakdown of all transaction inputs
- Previous transaction references (TXID and vout)
- Script signatures and witness data
- Value tracking for each input (fetched from blockchain)
- Complete output information including:
  - Recipient addresses
  - BTC values (displayed in both BTC and satoshis)
  - Output types (P2PKH, P2SH, P2WPKH, P2WSH, P2TR)
  - Script public keys

### 💰 **Fee Calculator**
- Automatic fee calculation (inputs - outputs)
- Fee rate computation (sat/vByte)
- Fee percentage of total transaction value
- Real-time comparison with mempool recommended fees
- Color-coded fee status (low/medium/high)
- Live mempool data integration

### 🔧 **Bitcoin Script Interpreter**
- Decode scriptPubKey and scriptSig
- Human-readable opcode display
- Educational tooltips explaining each operation
- Automatic script type detection
- Support for all major script types:
  - P2PKH (Pay to Public Key Hash)
  - P2SH (Pay to Script Hash)
  - P2WPKH (Pay to Witness Public Key Hash - SegWit)
  - P2WSH (Pay to Witness Script Hash)
  - P2TR (Pay to Taproot)

### 🎨 **Transaction Visualization**
- Interactive flow diagram showing transaction structure
- Visual representation of inputs → transaction → outputs
- Value labels on all connections
- Color-coded nodes by type
- Zoom and pan controls for complex transactions

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS for modern, responsive UI
- **Bitcoin Library**: bitcoinjs-lib for transaction parsing
- **HTTP Client**: Axios for API requests
- **Visualization**: ReactFlow for transaction diagrams
- **Icons**: Lucide React
- **Build Tool**: Vite for fast development and optimized builds
- **APIs**: 
  - Blockstream.info API (blockchain data)
  - Mempool.space API (fee recommendations)

## Installation

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm or yarn package manager

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Git-brintsi20/bitcoin-tx-parser.git
cd bitcoin-tx-parser
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Basic Usage

1. **Paste Transaction Hex**: Copy a raw Bitcoin transaction in hexadecimal format and paste it into the text area
2. **Click "Decode Transaction"**: The app will parse and analyze the transaction
3. **Explore Results**: Scroll through the comprehensive analysis including:
   - Transaction overview
   - Input details
   - Output breakdown
   - Fee analysis
   - Script decoding
   - Visual flow diagram

### Using the Sample Transaction

Click the "Load Sample" button to load a pre-filled sample transaction and see how the parser works.

### Example Transaction Hex

Here's a sample Bitcoin testnet transaction you can try:

```
02000000000101a3b2c1d4e5f6071829384a5b6c7d8e9f0011223344556677889900aabbccddee0000000000fdffffff02a0860100000000001976a91489abcdefabcdefabcdefabcdefabcdef89abcdef88ac40420f00000000001600141234567890abcdef1234567890abcdef1234567802473044022012345678901234567890123456789012345678901234567890123456789012340220abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef012102abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef00000000
```

## Project Structure

```
bitcoin-tx-parser/
├── src/
│   ├── components/
│   │   ├── TransactionOverview.tsx    # Transaction metadata display
│   │   ├── InputsList.tsx              # Input breakdown component
│   │   ├── OutputsList.tsx             # Output breakdown component
│   │   ├── FeeAnalysis.tsx             # Fee calculation and analysis
│   │   ├── ScriptDecoder.tsx           # Bitcoin script interpreter
│   │   └── TransactionVisualizer.tsx   # Flow diagram visualization
│   ├── types/
│   │   └── transaction.ts              # TypeScript interfaces
│   ├── utils/
│   │   └── bitcoin.ts                  # Bitcoin utility functions
│   ├── services/
│   │   └── api.ts                      # Blockchain API integration
│   ├── App.tsx                         # Main application component
│   └── index.css                       # Global styles with Tailwind
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## API Integration

### Blockstream API
Used to fetch input values from previous transactions:
- Endpoint: `https://blockstream.info/api/tx/{txid}`
- No authentication required
- Free tier available

### Mempool.space API
Used to fetch recommended fee rates:
- Endpoint: `https://mempool.space/api/v1/fees/recommended`
- Provides real-time fee estimates for different confirmation priorities
- No authentication required

## Features Breakdown

### Feature 1: Transaction Decoder ✅
Decodes raw hex into structured transaction data with all essential metadata.

### Feature 2: Input/Output Analysis ✅
Provides comprehensive breakdown of every input and output, including address types and values.

### Feature 3: Fee Calculator ✅
Calculates fees automatically and compares with current network recommendations.

### Feature 4: Script Interpreter ✅
Decodes Bitcoin scripts with educational explanations of each opcode.

### Feature 5: Transaction Visualization ✅
Interactive visual representation of transaction flow using React Flow.

## Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will auto-detect Vite and configure build settings
4. Deploy!

## Contributing

This project was built for Summer of Bitcoin 2026. Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Learning Resources

- [Bitcoin Developer Guide](https://developer.bitcoin.org/devguide/)
- [bitcoinjs-lib Documentation](https://github.com/bitcoinjs/bitcoinjs-lib)
- [Bitcoin Script Wiki](https://en.bitcoin.it/wiki/Script)
- [Understanding Bitcoin Transactions](https://learnmeabitcoin.com/technical/transaction)

## License

MIT License - feel free to use this project for learning and development.

## Author

Built with ❤️ for Summer of Bitcoin 2026

## Acknowledgments

- Summer of Bitcoin program for the opportunity
- Bitcoin Core developers for the protocol
- bitcoinjs-lib maintainers for the excellent library
- Blockstream and Mempool.space for free API access

---

**Note**: This application works with both Bitcoin mainnet and testnet transactions. The parser automatically detects the network based on address format.
