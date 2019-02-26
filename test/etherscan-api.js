const EtherScanApi = require("../util/etherscan-api");

const tester = async () => {
  const api = new EtherScanApi();

  const testTx =
    "0x1f2cbcb3bce2cd2bc21aab22229cdb5b9b6c00771ddfbaa9f2a9cbe652fad345";

  try {
    const res = await api.getTransaction(testTx);
    const res2 = await api.getTransactionReceipt(testTx);

    console.log(res);
    console.log(res2);
    console.log(res2.result.status);

  } catch (err) {
    console.log(err);
  }
};

tester();

// 0x1 = success
// 0x0 = fail
// pending

//sample success

// { jsonrpc: '2.0',
//   id: 1,
//   result:
//    { blockHash: '0xd20f401abd41dbdf87215f422ffaee1a986a7e2452777ee35527e9595dd50274',
//      blockNumber: '0x34fe35',
//      contractAddress: null,
//      cumulativeGasUsed: '0x1325cc',
//      from: '0xe3c2fe8e0bd01a0869018022676b17b12de873fc',
//      gasUsed: '0x42c6e',
//      logs: [ [Object] ],
//      logsBloom: '0x04000000000000000000010000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000018000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000100000000000000000000000000000010000000000000000002000000000000000000000000000000000004000800000000000000000000000000000000000000000000000000000000008000004000000000000000',
//      status: '0x1',
//      to: '0xccd2ce257d9e076f4cc5b4642453b77196e5820e',
//      transactionHash: '0x1f2cbcb3bce2cd2bc21aab22229cdb5b9b6c00771ddfbaa9f2a9cbe652fad345',
//      transactionIndex: '0x7' } }
