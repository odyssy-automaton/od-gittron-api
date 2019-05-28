"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const crypto = require("crypto");

const uuidRand = function() {
  return crypto.randomBytes(16).toString("hex");
};

const allBots = function() {
  const params = {
    TableName: process.env.DYNAMODB_TABLE
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

const addRecord = function(params) {
  return new Promise((res, rej) => {
    dynamoDb.put(params, function(err, data) {
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

const disableBot = function(tokenId, ghid) {
  const timestamp = new Date().getTime();

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      tokenId: tokenId,
      ghid: ghid
    },
    ExpressionAttributeValues: {
      ":disabled": true,
      ":updatedAt": timestamp
    },
    UpdateExpression: "SET disabled = :disabled, updatedAt = :updatedAt",
    ReturnValues: "ALL_NEW"
  };

  return new Promise((res, rej) => {
    dynamoDb.update(params, function(err, data) {
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

const updateBot = function(params) {
  return new Promise((res, rej) => {
    dynamoDb.update(params, function(err, data) {
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
  uuidRand,
  allBots,
  getByTokenId,
  addRecord,
  disableBot,
  updateBot
};
