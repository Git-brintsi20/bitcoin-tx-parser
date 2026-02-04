import React, { useState } from 'react';
import type { InputInfo } from '../types/transaction';
import { ArrowDownCircle, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { formatBTCValue } from '../utils/bitcoin';

interface InputsListProps {
  inputs: InputInfo[];
}

const InputsList: React.FC<InputsListProps> = ({ inputs }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <ArrowDownCircle className="text-orange-500" />
        Transaction Inputs ({inputs.length})
      </h2>
      
      <div className="space-y-4">
        {inputs.map((input, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-orange-700">Input #{index}</span>
                <button
                  onClick={() => toggleExpand(index)}
                  className="text-orange-600 hover:text-orange-800"
                >
                  {expandedIndex === index ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-gray-600 block mb-1">Previous TXID:</span>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono text-gray-800 break-all flex-1">{input.txid}</p>
                    <button
                      onClick={() => copyToClipboard(input.txid)}
                      className="p-1 hover:bg-orange-200 rounded"
                      title="Copy TXID"
                    >
                      <Copy className="w-4 h-4 text-orange-600" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-600 block mb-1">Output Index (vout):</span>
                    <p className="text-sm font-semibold text-gray-800">{input.vout}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600 block mb-1">Sequence:</span>
                    <p className="text-sm font-mono text-gray-800">{input.sequence.toString(16).toUpperCase()}</p>
                  </div>
                </div>
                
                {input.value !== undefined && (
                  <div>
                    <span className="text-xs text-gray-600 block mb-1">Value:</span>
                    <p className="text-sm font-semibold text-green-600">{formatBTCValue(input.value)}</p>
                  </div>
                )}
                
                {input.prevAddress && (
                  <div>
                    <span className="text-xs text-gray-600 block mb-1">Previous Address:</span>
                    <p className="text-sm font-mono text-gray-800 break-all">{input.prevAddress}</p>
                  </div>
                )}
              </div>
            </div>
            
            {expandedIndex === index && (
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <div className="mb-3">
                  <span className="text-xs text-gray-600 block mb-1">Script Signature (scriptSig):</span>
                  <pre className="text-xs font-mono text-gray-700 bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                    {input.scriptSig || 'Empty (SegWit)'}
                  </pre>
                </div>
                
                {input.witness && input.witness.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-600 block mb-1">Witness Data:</span>
                    <div className="space-y-1">
                      {input.witness.map((w, i) => (
                        <pre key={i} className="text-xs font-mono text-gray-700 bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                          {w}
                        </pre>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputsList;
