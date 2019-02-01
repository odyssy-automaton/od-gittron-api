"use strict";

const AWS = require("aws-sdk");

var lambda = new AWS.Lambda({
  region: "us-east-1"
});

module.exports.generateSvg = (event, context, callback) => {
  console.log(event);

  const payload = {
    svgs: [
      "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Arms--1.svg",
      "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Body--1.svg",
      "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Legs--1.svg",
      "https://s3.amazonaws.com/odyssy-assets/bots/Gittron__Head--1.svg"
    ],
    name: "test123",
    timeout: 1000
  };

  lambda.invoke(
    {
      FunctionName: "od-sls-svgflatr-dev-phantomsvgflatr",
      Payload: JSON.stringify(payload, null, 2)
    },
    function(error, data) {
      if (error) {
        console.log(error);
        // context.done("error", error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { "Content-Type": "text/plain" },
          body: "no robot."
        });
      }

      console.log(data);
      if (data.Payload) {
        console.log(data.Payload);
        const response = {
          statusCode: 200,
          body: JSON.stringify(data.Payload)
        };
        callback(null, response);
      }
    }
  );
};
