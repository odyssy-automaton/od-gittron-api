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

  async txStatus(txHash) {
    let err, response;

    if (txHash && txHash.length === 66) {
      const receipt = await this.getTransactionReceipt(txHash);
      console.log("receipt.result");
      console.log(receipt.result);

      if (receipt.result) {
        response = receipt.result.status === "0x1" ? "success" : "failed";
      } else {
        const tx = await this.getTransaction(txHash);
        console.log("tx");
        console.log(tx);

        response =
          tx.result && !tx.result.blockNumber ? "pending" : "not found";
      }
    } else {
      response = "invalid";
    }

    if (!response) {
      err = `error finding status of tx ${txHash}`;
    }

    return new Promise((res, rej) => {
      if (err) {
        console.log("tx statust err " + err);
        rej(err);
      } else {
        res(response);
      }
    });
  }

  getTransaction(txHash) {
    return this.api.proxy.eth_getTransactionByHash(txHash);
  }

  getTransactionReceipt(txHash) {
    return this.api.proxy.eth_getTransactionReceipt(txHash);
  }
}

module.exports = EtherScanApi;
