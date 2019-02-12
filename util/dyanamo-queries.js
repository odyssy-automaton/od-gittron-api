"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const tokenCount = function() {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Select: "COUNT"
  };

  return new Promise((res, rej) => {
    dynamoDb.scan(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        rej(err);
      } else {
        console.log("Success", data);
        res(data);
      }
    });
  });
};

const getByTokenId = function(tokenId) {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: "tokenId = :hkey",
    ExpressionAttributeValues: {
      ":hkey": tokenId
    }
  };

  return new Promise((res, rej) => {
    dynamoDb.query(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        rej(err);
      } else {
        console.log("Success", data);
        res(data);
      }
    });
  });
};

module.exports = {
  tokenCount,
  getByTokenId
};
