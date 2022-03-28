const request = require("request");

const config = require("config");
const gsheets_URL1 = config.get("google.google_url1");
const spreadsheet_id = config.get("google.spreadsheet_id");
const gsheets_URL2 = config.get("google.google_url2");
const API_Key = config.get("google.gcpApp_APIKey");

console.log(`Our key: ${key}`);


exports.handler = function(event, context, callback) {
    const key = key;
    const url = gsheets_URL1+
        spreadsheet_id+
        gsheets_URL2+
        API_Key;

    request({
        json: true,
        url: url
    }, function (error, response, body) {
        if (error || response.statusCode !== 200) return

        let parsed = body.feed.entry.map( (entry) => {
        let columns = {
            "updated": entry.updated["$t"]
        }

        // Dynamically add all relevant columns from the Sheets to the response
        Object.keys( entry ).forEach( (key) => {
            if ( /gsx\$/.test(key) ) {
            let newKey = key.replace("gsx$", "");
            columns[newKey] = entry[key]["$t"];
            }
        });

        return columns;
        })

        callback(null, parsed);
    });
};
