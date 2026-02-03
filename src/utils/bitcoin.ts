import * as bitcoin from 'bitcoinjs-lib';

export function satoshisToBTC(satoshis: number): string {
  return (satoshis / 100000000).toFixed(8);
}

export function formatBTCValue(satoshis: number): string {
  const btc = satoshisToBTC(satoshis);
  return `${btc} BTC (${satoshis.toLocaleString()} sats)`;
}

export function getAddressType(script: Buffer, network = bitcoin.networks.bitcoin): string {
  try {
    const address = bitcoin.address.fromOutputScript(script, network);
    
    if (address.startsWith('1')) return 'P2PKH';
    if (address.startsWith('3')) return 'P2SH';
    if (address.startsWith('bc1q')) return 'P2WPKH';
    if (address.startsWith('bc1p')) return 'P2TR';
    
    return 'Unknown';
  } catch {
    if (script.length === 25 && script[0] === 0x76) return 'P2PKH';
    if (script.length === 23 && script[0] === 0xa9) return 'P2SH';
    if (script.length === 22 && script[0] === 0x00) return 'P2WPKH';
    if (script.length === 34 && script[0] === 0x00) return 'P2WSH';
    if (script.length === 34 && script[0] === 0x51) return 'P2TR';
    
    return 'Unknown';
  }
}

export function getOpcodeDescription(opcode: number): string {
  const descriptions: Record<number, string> = {
    0x76: 'OP_DUP - Duplicate the top stack item',
    0xa9: 'OP_HASH160 - Hash the top stack item with SHA-256 then RIPEMD-160',
    0x88: 'OP_EQUALVERIFY - Check if top two items are equal, fail if not',
    0xac: 'OP_CHECKSIG - Verify signature against public key',
    0x00: 'OP_0 - Push empty byte array',
    0x51: 'OP_1 - Push number 1',
    0x52: 'OP_2 - Push number 2',
    0x53: 'OP_3 - Push number 3',
    0x87: 'OP_EQUAL - Check if top two items are equal',
    0xae: 'OP_CHECKMULTISIG - Verify multiple signatures',
    0x63: 'OP_IF - Execute if top of stack is true',
    0x67: 'OP_ELSE - Execute if previous OP_IF was false',
    0x68: 'OP_ENDIF - End if statement',
    0x75: 'OP_DROP - Remove top stack item',
  };
  
  return descriptions[opcode] || `OPCODE 0x${opcode.toString(16).toUpperCase()}`;
}

export function getScriptType(script: Buffer): string {
  if (script.length === 25 && script[0] === 0x76 && script[1] === 0xa9 && script[23] === 0x88 && script[24] === 0xac) {
    return 'P2PKH (Pay to Public Key Hash)';
  }
  if (script.length === 23 && script[0] === 0xa9 && script[22] === 0x87) {
    return 'P2SH (Pay to Script Hash)';
  }
  if (script.length === 22 && script[0] === 0x00 && script[1] === 0x14) {
    return 'P2WPKH (Pay to Witness Public Key Hash)';
  }
  if (script.length === 34 && script[0] === 0x00 && script[1] === 0x20) {
    return 'P2WSH (Pay to Witness Script Hash)';
  }
  if (script.length === 34 && script[0] === 0x51 && script[1] === 0x20) {
    return 'P2TR (Pay to Taproot)';
  }
  
  return 'Custom Script';
}
