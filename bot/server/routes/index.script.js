/**
 * Created by vinistig on 1/31/17.
 */
(function () {
    "use strict";

    var watsonRoutes = require("./partials/watsonHandler");

    // module.exports = function (app, upload, text_to_speech, speech_to_text, conversation, FileHandler, fs, io, gpio, robotController) {
	module.exports = function (app, upload, text_to_speech, speech_to_text, conversation, FileHandler, fs, io) {
        watsonRoutes(app, upload, text_to_speech, speech_to_text, conversation, FileHandler, fs);
        // socketRoutes(io, gpio, robotController);
        app.get("/", function (req, res) {
            return res.status(200).render("demo.html", {
                user: req.user || ""
            });
        });
    };

}());
