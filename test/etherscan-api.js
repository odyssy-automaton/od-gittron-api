const EtherScanApi = require("../util/etherscan-api");

const tester = async () => {
  const api = new EtherScanApi();

  const testTx =
    // "0x9492fa4ee290e83c433bf9d6a438d319a4302d223a7c90c797b6e19c3e9b4129";
    // "0xd1a4ac4506a34598a88f08ed243a0643e8ce1e8224be0c262ce875d14f9ee34f";
    // "0xaef7ab1c077c083c54725d5f32e4375ebcc3eed4ff073dc63a2b885333c2eaa8";
    // "0xb876a7c9bd93e610d8eda4fa8a1d42cda224fa0da0abc66f4806fb3c20ad2c50";
    // "0x13acdc85a353ba8f12c7ef4452945082283dbd66a1c251d068631713d4a6d454";
    // "0x57b0c160297936cb30ea80363c904959ec93dac520b4eba5fc4fbe287ee4565d";
    // "0x8ff2ccfeada1acca8de8525401cf161fd71479f76b643a369e313cab70682768";
    "0x6dd6cdf7cbfe75b6b168a13bedecc4ef8ed44a4d367cfcd2e226b3267f3481f3";
  // null;

  try {
    const res = await api.txStatus(testTx);
    console.log("res");
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

tester();
