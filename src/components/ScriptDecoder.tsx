import React, { useState } from 'react';
import * as bitcoin from 'bitcoinjs-lib';
import { Code2, Info } from 'lucide-react';
import { getOpcodeDescription, getScriptType } from '../utils/bitcoin';

interface ScriptDecoderProps {
  script: Buffer;
  title: string;
}

const ScriptDecoder: React.FC<ScriptDecoderProps> = ({ script, title }) => {
  const [showDetails, setShowDetails] = useState(false);

  const decompiled = bitcoin.script.decompile(script);
  const scriptType = getScriptType(script);
  const scriptHex = script.toString('hex');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Code2 className="text-purple-500" />
        {title}
      </h2>
      
      <div className="mb-4">
        <span className="text-sm font-semibold text-purple-600 block mb-2">Script Type:</span>
        <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold inline-block">
          {scriptType}
        </span>
      </div>
      
      <div className="mb-4">
        <span className="text-sm font-semibold text-gray-700 block mb-2">Raw Script (Hex):</span>
        <pre className="text-xs font-mono text-gray-700 bg-gray-50 p-3 rounded border border-gray-200 overflow-x-auto">
          {scriptHex}
        </pre>
      </div>
      
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mb-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
      >
        <Info className="w-4 h-4" />
        {showDetails ? 'Hide' : 'Show'} Decoded Opcodes
      </button>
      
      {showDetails && decompiled && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Decoded Operations:</h3>
          <div className="space-y-3">
            {decompiled.map((op, index) => {
              if (typeof op === 'number') {
                const opcodeName = bitcoin.script.toASM([op]);
                const description = getOpcodeDescription(op);
                
                return (
                  <div key={index} className="bg-white p-3 rounded border border-gray-300">
                    <div className="flex items-start gap-3">
                      <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-xs font-mono">
                        {index}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 font-mono">{opcodeName}</p>
                        <p className="text-sm text-gray-600 mt-1">{description}</p>
                      </div>
                    </div>
                  </div>
                );
              } else if (Buffer.isBuffer(op)) {
                return (
                  <div key={index} className="bg-white p-3 rounded border border-gray-300">
                    <div className="flex items-start gap-3">
                      <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-mono">
                        {index}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">DATA</p>
                        <pre className="text-xs font-mono text-gray-700 bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                          {Buffer.from(op).toString('hex')}
                        </pre>
                        <p className="text-sm text-gray-600 mt-1">
                          Push {op.length} bytes onto the stack
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Script Explanation
            </h4>
            <p className="text-sm text-gray-700">
              {scriptType === 'P2PKH (Pay to Public Key Hash)' && 
                'This is a standard Pay-to-Public-Key-Hash script. It requires the spender to provide a signature and public key that hashes to the specified address.'}
              {scriptType === 'P2SH (Pay to Script Hash)' && 
                'This is a Pay-to-Script-Hash script. The actual spending conditions are hidden behind a hash and revealed when spending.'}
              {scriptType === 'P2WPKH (Pay to Witness Public Key Hash)' && 
                'This is a native SegWit script. It provides the same functionality as P2PKH but with lower fees and better malleability protection.'}
              {scriptType === 'P2WSH (Pay to Witness Script Hash)' && 
                'This is a native SegWit script hash. Similar to P2SH but uses SegWit for better efficiency.'}
              {scriptType === 'P2TR (Pay to Taproot)' && 
                'This is a Taproot script, the latest Bitcoin script type providing enhanced privacy and flexibility.'}
              {scriptType === 'Custom Script' && 
                'This is a custom script with unique spending conditions defined by the script operations.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptDecoder;
