const { initToken } = require("../tokens/init-token");

const req = {
  body: JSON.stringify({
    repo: "go-ethereum",
    repoOwner: "ethereum",
    tokenType: "base"
  })
};

const tester = async () => {
  const res = await initToken(req, null);
  console.log(res);
};

tester();
