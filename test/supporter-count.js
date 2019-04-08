const { supporterCount } = require("../bots/supporter-count");

const tester = async () => {
  const botId = "0x3502c19ee6d9656301b005dfa028bbf3";
  // const botId = "0xfa145d550027aa68d1167a8d3218afac";

  const event = {
    pathParameters: {
      tokenId: botId
    }
  };

  try {
    const res = await supporterCount(event, {});
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

tester();
