/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

// const fs = require("fs");
// const path = require("path");
// const neatCSV = require("neat-csv");

module.exports = async (on, config) => {
  // import neatCsv from "neat-csv";
  // const neatCsv = require("neat-csv");
  // const fs = require("fs");
  // const path = require("path");
  // const filename = path.join("beer_data", "Dominiczeq7_pk_export.csv");
  // const text = fs.readFileSync(filename, "utf8");
  // const csv = await neatCsv(text);
  // config.env.usersList = text;
  // return config;

  on("task", {
    csvToJson(data) {
      var lines = data.split("\r\n");
      var result = [];
      var headers = lines[0].split(";");
      for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var current_line = lines[i].split(";");

        if (current_line == "") break;
        for (var j = 0; j < headers.length; j++) {
          obj[headers[j]] = current_line[j];
        }
        result.push(obj);
      }

      return result;
    },
  });
};
