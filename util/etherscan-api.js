var esApi = require("etherscan-api");

class EtherScanApi {
  constructor() {
    this.apiKey = process.env.ETHERSCAN_API_KEY;

    if (process.env.ORIGIN === "*") {
      this.api = esApi.init(this.apiKey, "rinkeby", "3000");
    } else {
      this.api = esApi.init(this.apiKey);
    }
  }

  getTransaction(txHash) {
    return this.api.proxy.eth_getTransactionByHash(txHash);
  }

  getTransactionReceipt(txHash) {
    return this.api.proxy.eth_getTransactionReceipt(txHash);
  }
}

module.exports = EtherScanApi;
