import { useState } from 'react';
import * as bitcoin from 'bitcoinjs-lib';
import { Loader2, AlertCircle, Bitcoin } from 'lucide-react';
import TransactionOverview from './components/TransactionOverview';
import InputsList from './components/InputsList';
import OutputsList from './components/OutputsList';
import FeeAnalysis from './components/FeeAnalysis';
import ScriptDecoder from './components/ScriptDecoder';
import TransactionVisualizer from './components/TransactionVisualizer';
import type { TransactionInfo, InputInfo, OutputInfo, FeeInfo } from './types/transaction';
import { getAddressType } from './utils/bitcoin';
import { fetchAllInputValues, fetchRecommendedFees } from './services/api';

function App() {
  const [rawHex, setRawHex] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transactionInfo, setTransactionInfo] = useState<TransactionInfo | null>(null);
  const [inputs, setInputs] = useState<InputInfo[]>([]);
  const [outputs, setOutputs] = useState<OutputInfo[]>([]);
  const [feeInfo, setFeeInfo] = useState<FeeInfo | null>(null);
  const [selectedScript, setSelectedScript] = useState<Buffer | null>(null);
  const [scriptTitle, setScriptTitle] = useState('');

  const parseTransaction = async () => {
    setLoading(true);
    setError('');
    setTransactionInfo(null);
    setInputs([]);
    setOutputs([]);
    setFeeInfo(null);
    setSelectedScript(null);

    try {
      // Remove whitespace and validate hex
      const cleanHex = rawHex.replace(/\s/g, '');
      if (!/^[0-9a-fA-F]+$/.test(cleanHex)) {
        throw new Error('Invalid hex format. Please enter valid hexadecimal characters.');
      }

      // Parse transaction
      const tx = bitcoin.Transaction.fromHex(cleanHex);
      const buffer = Buffer.from(cleanHex, 'hex');

      // Extract transaction info
      const txInfo: TransactionInfo = {
        txid: tx.getId(),
        version: tx.version,
        locktime: tx.locktime,
        size: buffer.length,
        weight: tx.weight(),
        vsize: tx.virtualSize(),
        inputCount: tx.ins.length,
        outputCount: tx.outs.length,
      };
      setTransactionInfo(txInfo);

      // Parse inputs
      const parsedInputs: InputInfo[] = tx.ins.map((input) => ({
        txid: Buffer.from(input.hash).reverse().toString('hex'),
        vout: input.index,
        scriptSig: Buffer.from(input.script).toString('hex'),
        sequence: input.sequence,
        witness: input.witness.map((w) => Buffer.from(w).toString('hex')),
      }));
      setInputs(parsedInputs);

      // Parse outputs
      const parsedOutputs: OutputInfo[] = tx.outs.map((output, index) => {
        let address = 'Unable to decode';
        try {
          address = bitcoin.address.fromOutputScript(output.script, bitcoin.networks.bitcoin);
        } catch {
          // Try testnet
          try {
            address = bitcoin.address.fromOutputScript(output.script, bitcoin.networks.testnet);
          } catch {
            address = 'Non-standard output';
          }
        }

        return {
          index,
          value: Number(output.value),
          scriptPubKey: Buffer.from(output.script).toString('hex'),
          address,
          type: getAddressType(Buffer.from(output.script)),
        };
      });
      setOutputs(parsedOutputs);

      // Fetch input values and calculate fees
      const inputRefs = parsedInputs.map(inp => ({ txid: inp.txid, vout: inp.vout }));
      const inputValues = await fetchAllInputValues(inputRefs);
      
      // Update inputs with values
      const updatedInputs = parsedInputs.map((input, index) => ({
        ...input,
        value: inputValues[index] || undefined,
      }));
      setInputs(updatedInputs);

      // Calculate fee info
      const totalInput = inputValues.reduce((sum: number, val) => sum + (val || 0), 0);
      const totalOutput = parsedOutputs.reduce((sum, out) => sum + out.value, 0);
      const fee = totalInput - totalOutput;
      const feeRate = fee / txInfo.vsize;
      const feePercentage = (fee / totalInput) * 100;

      // Fetch recommended fees
      const recommendedFees = await fetchRecommendedFees();
      
      // Determine fee status
      let status: 'low' | 'medium' | 'high' = 'medium';
      if (recommendedFees) {
        if (feeRate < recommendedFees.hourFee) status = 'low';
        else if (feeRate >= recommendedFees.halfHourFee) status = 'high';
      }

      const feeData: FeeInfo = {
        totalInput,
        totalOutput,
        fee,
        feeRate,
        feePercentage,
        recommendedFees: recommendedFees || undefined,
        status,
      };
      setFeeInfo(feeData);

      // Set first output script for decoder
      if (parsedOutputs.length > 0) {
        setSelectedScript(Buffer.from(tx.outs[0].script));
        setScriptTitle('Script Decoder - Output #0');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse transaction');
      console.error('Parse error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleTransaction = () => {
    // Sample Bitcoin testnet transaction
    const sample = '02000000000101a3b2c1d4e5f6071829384a5b6c7d8e9f0011223344556677889900aabbccddee0000000000fdffffff02a0860100000000001976a91489abcdefabcdefabcdefabcdefabcdef89abcdef88ac40420f00000000001600141234567890abcdef1234567890abcdef1234567802473044022012345678901234567890123456789012345678901234567890123456789012340220abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef012102abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef00000000';
    setRawHex(sample);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-4 animate-fade-in">
            <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg">
              <Bitcoin className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              Bitcoin Transaction Parser
            </h1>
          </div>
          <p className="text-gray-700 text-xl font-medium">
            Decode and analyze Bitcoin transactions in real-time
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-orange-200/50">
          <label className="block text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
            Raw Transaction Hex
          </label>
          <textarea
            className="w-full h-36 p-4 border-2 border-gray-300 rounded-xl font-mono text-sm focus:ring-4 focus:ring-orange-400 focus:border-orange-500 transition-all bg-gray-50 hover:bg-white shadow-inner"
            placeholder="Paste raw Bitcoin transaction hex here..."
            value={rawHex}
            onChange={(e) => setRawHex(e.target.value)}
          />
          
          <div className="flex gap-4 mt-6">
            <button
              onClick={parseTransaction}
              disabled={loading || !rawHex}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-lg">Decoding...</span>
                </>
              ) : (
                <>
                  <Bitcoin className="w-6 h-6" />
                  <span className="text-lg">Decode Transaction</span>
                </>
              )}
            </button>
            
            <button
              onClick={loadSampleTransaction}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              <span className="text-lg">Load Sample</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5 mb-8 flex items-start gap-3 shadow-lg animate-shake">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-900 text-lg">Error</p>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {transactionInfo && (
          <>
            <TransactionOverview info={transactionInfo} />
            
            {inputs.length > 0 && <InputsList inputs={inputs} />}
            
            {outputs.length > 0 && <OutputsList outputs={outputs} />}
            
            {feeInfo && <FeeAnalysis feeInfo={feeInfo} />}
            
            {selectedScript && <ScriptDecoder script={selectedScript} title={scriptTitle} />}
            
            {inputs.length > 0 && outputs.length > 0 && (
              <TransactionVisualizer inputs={inputs} outputs={outputs} />
            )}
          </>
        )}

        {/* Footer */}
        <div className="text-center mt-16 text-gray-700">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/50">
            <p className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
              Built for Summer of Bitcoin 2026
            </p>
            <p className="text-sm">
              Powered by <span className="font-semibold">bitcoinjs-lib</span> • Data from <span className="font-semibold">Blockstream API</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
