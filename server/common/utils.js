const config = require("../config");
const axios = require("axios");

exports.getIndexerData = (path) => {
  const fetchConfig = {
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${config.env.unisatApiKey}`,
    },
  };

  const url = `${config.env.unisatApiUrl}${path}`;

  return axios(url, fetchConfig);
};
