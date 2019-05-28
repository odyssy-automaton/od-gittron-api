const ethers = require("ethers");
const abi = require("../util/abi");

// const contractAddress = "0xfb6ff3d0eba6b8e69fceb04afe5f230611a34a36";
const contractAddress = "0x162d3e80d51f96240ae0a44ab3a5b1ea23920ce4";

// const provider = ethers.getDefaultProvider("rinkeby");
const provider = ethers.getDefaultProvider("homestead");
const contract = new ethers.Contract(contractAddress, abi, provider);

//bad
// const tokenId = "0x2c34e98d27a7053da84ff953bb4b5961";
//good
// const tokenId = "0x0cb5703b354910562118c21bb6f35ca7";
// const tokenId = "0x798773722ac61739a43030790d65fd06";
// const tokenId = "0xc667368e27eabc8ad8a58c6c865b467d";
// const tokenId = "0x45171961666f7aab9c22bc40326d3d59";
// const tokenId = "0x085a45c68b19887e88288894eea90418";
const tokenId = "0xc6b70f12494045ebc62bee55c7d41446";

const tester = async () => {
  try {
    const ownerOf = await contract.ownerOf(tokenId);
    console.log("ownerOf");
    console.log(ownerOf);
  } catch (err) {
    console.log("err");
    console.log(err);
  }
};

tester();
