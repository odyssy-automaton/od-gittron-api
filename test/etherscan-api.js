const EtherScanApi = require("../util/etherscan-api");

const tester = async () => {
  const api = new EtherScanApi();

  const testTx =
    "0x9492fa4ee290e83c433bf9d6a438d319a4302d223a7c90c797b6e19c3e9b4129";
  // "0xd1a4ac4506a34598a88f08ed243a0643e8ce1e8224be0c262ce875d14f9ee34f";
  // "0xaef7ab1c077c083c54725d5f32e4375ebcc3eed4ff073dc63a2b885333c2eaa8";
  // "0xb876a7c9bd93e610d8eda4fa8a1d42cda224fa0da0abc66f4806fb3c20ad2c50";
  // null;

  try {
    const res = await api.txStatus(testTx);
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

tester();
