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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bitcoin className="w-12 h-12 text-orange-500" />
            <h1 className="text-4xl font-bold text-gray-800">
              Bitcoin Transaction Parser
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Decode and analyze Bitcoin transactions in real-time
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Raw Transaction Hex
          </label>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            placeholder="Paste raw Bitcoin transaction hex here..."
            value={rawHex}
            onChange={(e) => setRawHex(e.target.value)}
          />
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={parseTransaction}
              disabled={loading || !rawHex}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Decoding...
                </>
              ) : (
                <>
                  <Bitcoin className="w-5 h-5" />
                  Decode Transaction
                </>
              )}
            </button>
            
            <button
              onClick={loadSampleTransaction}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Load Sample
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
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
        <div className="text-center mt-12 text-gray-600 text-sm">
          <p>Built for Summer of Bitcoin 2026</p>
          <p className="mt-1">Powered by bitcoinjs-lib • Data from Blockstream API</p>
        </div>
      </div>
    </div>
  );
}

export default App;
