export interface TransactionInfo {
  txid: string;
  version: number;
  locktime: number;
  size: number;
  weight: number;
  vsize: number;
  inputCount: number;
  outputCount: number;
}

export interface InputInfo {
  txid: string;
  vout: number;
  scriptSig: string;
  sequence: number;
  witness?: string[];
  value?: number;
  prevAddress?: string;
}

export interface OutputInfo {
  index: number;
  value: number;
  scriptPubKey: string;
  address: string;
  type: string;
}

export interface FeeInfo {
  totalInput: number;
  totalOutput: number;
  fee: number;
  feeRate: number;
  feePercentage: number;
  recommendedFees?: {
    fastestFee: number;
    halfHourFee: number;
    hourFee: number;
  };
  status: 'low' | 'medium' | 'high';
}

export interface ScriptOpcode {
  opcode: string;
  data?: string;
  description: string;
}

export interface ScriptInfo {
  raw: string;
  type: string;
  opcodes: ScriptOpcode[];
  explanation: string;
}
