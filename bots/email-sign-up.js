"use strict";
require("dotenv").config();

const { addRecord } = require("../util/dyanamo-queries");

module.exports.emailSignUp = async (event, context) => {
  const timestamp = new Date().getTime();
  const reqData = JSON.parse(event.body);

  console.log(reqData);

  try {
    const params = {
      TableName: process.env.DYNAMODB_USER_TABLE,
      Item: {
        address: reqData.walletAddress,
        email: reqData.email,
        createdAt: timestamp
      }
    };

    await addRecord(params);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": process.env.ORIGIN
      },
      body: JSON.stringify(params.Item)
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": process.env.ORIGIN
      },
      body: error
    };
  }
};
