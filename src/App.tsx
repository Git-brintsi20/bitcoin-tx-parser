import { useState } from 'react';
import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
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
    // Real Bitcoin mainnet transaction (simple P2PKH)
    const sample = '0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704000000004847304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901ffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000';
    setRawHex(sample);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-orange-600 rounded-3xl shadow-2xl">
              <Bitcoin className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-6xl font-black text-white drop-shadow-2xl">
              Bitcoin Transaction Parser
            </h1>
          </div>
          <p className="text-white text-2xl font-bold drop-shadow-lg">
            🔍 Decode and analyze Bitcoin transactions in real-time
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-8 border-4 border-orange-600">
          <label className="block text-lg font-black text-orange-600 mb-4 uppercase tracking-wider">
            📥 Raw Transaction Hex
          </label>
          <textarea
            className="w-full h-40 p-5 border-4 border-orange-300 rounded-2xl font-mono text-base focus:ring-4 focus:ring-orange-500 focus:border-orange-600 transition-all bg-orange-50"
            placeholder="Paste raw Bitcoin transaction hex here..."
            value={rawHex}
            onChange={(e) => setRawHex(e.target.value)}
          />
          
          <div className="flex gap-6 mt-8">
            <button
              onClick={parseTransaction}
              disabled={loading || !rawHex}
              className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-black text-xl py-5 px-10 rounded-2xl transition-all flex items-center justify-center gap-4 shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transform"
            >
              {loading ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span>Decoding...</span>
                </>
              ) : (
                <>
                  <Bitcoin className="w-8 h-8" />
                  <span>Decode Transaction</span>
                </>
              )}
            </button>
            
            <button
              onClick={loadSampleTransaction}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xl py-5 px-10 rounded-2xl transition-all shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transform"
            >
              <span>📝 Load Sample</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-4 border-red-500 rounded-2xl p-6 mb-8 flex items-start gap-4 shadow-2xl">
            <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-black text-red-900 text-2xl">❌ Error</p>
              <p className="text-red-800 text-lg font-semibold">{error}</p>
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
        <div className="text-center mt-16">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-orange-600">
            <p className="text-2xl font-black text-orange-600 mb-3">
              ☀️ Built for Summer of Bitcoin 2026
            </p>
            <p className="text-lg font-bold text-gray-700">
              Powered by <span className="text-orange-600">bitcoinjs-lib</span> • Data from <span className="text-blue-600">Blockstream API</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
