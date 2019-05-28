"use strict";

const { getContactByAddress } = require("../util/dyanamo-queries");

module.exports.getContact = async (event, context) => {
  try {
    const getRes = await getContactByAddress(event.pathParameters.address);
    const contact = getRes.Items[0];

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": process.env.ORIGIN
      },
      body: JSON.stringify(contact)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": process.env.ORIGIN
      },
      body: err
    };
  }
};
