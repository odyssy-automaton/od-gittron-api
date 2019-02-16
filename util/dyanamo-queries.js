"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const crypto = require("crypto");

const uuidRand = function() {
  return crypto.randomBytes(16).toString("hex");
};

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

const disableToken = function(tokenId, ghid) {
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

const updateToken = function(params) {
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

const deleteToken = function(tokenId, ghid) {
  const deleteParams = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      tokenId: tokenId,
      ghid: ghid
    }
  };

  return new Promise((res, rej) => {
    dynamoDb.delete(deleteParams, function(err, data) {
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
  uuidRand,
  getByTokenId,
  disableToken,
  updateToken,
  deleteToken
};
