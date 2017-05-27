/**
 * Created by vinistig.
 */
(function () {
    "use strict";

    var watsonConversation = require("watson-developer-cloud/conversation/v1"),
        conversationInstance = new watsonConversation(require("../configs/wcsConfig"));

    module.exports = function (conversationCredentials) {
        return {
            "sendMessage": function (options) {
                return new Promise(function (resolve, reject) {
                    if (!options) {
                        return reject("Can not proceed without options object");
                    }
                    options.workspace_id = "dff81550-522f-4db5-8683-426e3ae9e6a4";
                    conversationInstance.message(options, function (err, response) {
                        if (err) {
                            console.log(err);
                            return reject(err);
                        } else {
                            return resolve(response);
                        }
                    });
                });
            }
        };
    };

}());
