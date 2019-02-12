var esApi = require("etherscan-api");

class EtherScanApi {
  constructor() {
    this.apiKey = process.env.ETHERSCAN_API_KEY;
    this.api = esApi.init(this.apiKey, "rinkeby", "3000");
  }

  getTransaction(txHash) {
    return this.api.proxy.eth_getTransactionByHash(txHash);
  }

  getTransactionReceipt(txHash) {
    return this.api.proxy.eth_getTransactionReceipt(txHash);
  }
}

module.exports = EtherScanApi;
