import React from 'react';
import type { OutputInfo } from '../types/transaction';
import { ArrowUpCircle, Copy } from 'lucide-react';
import { formatBTCValue } from '../utils/bitcoin';

interface OutputsListProps {
  outputs: OutputInfo[];
}

const OutputsList: React.FC<OutputsListProps> = ({ outputs }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'P2PKH': 'bg-blue-100 text-blue-700 border-blue-300',
      'P2SH': 'bg-purple-100 text-purple-700 border-purple-300',
      'P2WPKH': 'bg-green-100 text-green-700 border-green-300',
      'P2WSH': 'bg-teal-100 text-teal-700 border-teal-300',
      'P2TR': 'bg-orange-100 text-orange-700 border-orange-300',
      'Unknown': 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[type] || colors['Unknown'];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <ArrowUpCircle className="text-blue-500" />
        Transaction Outputs ({outputs.length})
      </h2>
      
      <div className="space-y-4">
        {outputs.map((output, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-blue-700">Output #{output.index}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(output.type)}`}>
                  {output.type}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-600 block mb-1">Value:</span>
                  <p className="text-lg font-bold text-green-600">{formatBTCValue(output.value)}</p>
                </div>
                
                <div>
                  <span className="text-xs text-gray-600 block mb-1">Recipient Address:</span>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono text-gray-800 break-all flex-1">{output.address}</p>
                    <button
                      onClick={() => copyToClipboard(output.address)}
                      className="p-1 hover:bg-blue-200 rounded"
                      title="Copy Address"
                    >
                      <Copy className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <span className="text-xs text-gray-600 block mb-1">Script Public Key (scriptPubKey):</span>
                  <pre className="text-xs font-mono text-gray-700 bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                    {output.scriptPubKey}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutputsList;
