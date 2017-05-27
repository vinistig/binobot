var firebase = require('/home/gcfabri/Workspace/binobot/firebase.js');

/**
 * Created by danielabrao on 2/10/17.
 */
(function () {
    "use strict";

    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    module.exports = function (app, upload, watsonTextToSpeech, watsonSpeechToText, watsonConversation, FileHandler, fs) {
        app.post("/convertAudioToText", upload.single("audio"), function (req, res) {
            FileHandler.saveFile("test", req.file).then(function (filePath) {
                watsonSpeechToText.convertAudioToText(filePath).then(function (data) {
                    FileHandler.deleteFile(filePath).then(function () {
                        var msg;
                        try {
                            msg = data.results[0].alternatives[0].transcript;
                        } catch (e) {
                            msg = "Invalid";
                        }
                        watsonConversation.sendMessage({
                            "input": {
                                "text": msg
                            },
                            "context": {},
                            "workspace_id": "dff81550-522f-4db5-8683-426e3ae9e6a4"
                        }).then(function (conversationData) {
                            if (conversationData.context.oficina == true && conversationData.context.oficina != undefined) {
                                firebase.getTodasOficinas(function (result) {
                                    console.log(result);
                                    watsonTextToSpeech.convertTextToAudio({
                                        "fileName": "converted",
                                        "textMessage": conversationData.output.text[0] + "..." + result.join(',')
                                    }).then(function (ttsData) {
                                        return res.status(200).send({
                                            "tts": ttsData,
                                            "stt": data.results,
                                            "conversation": conversationData
                                        });
                                    });
                                });
                            } else if (conversationData.context.guincho == true && conversationData.context.guincho != undefined) {
                                firebase.getAllGuinchos(function (result) {
                                    console.log(result);
                                    watsonTextToSpeech.convertTextToAudio({
                                        "fileName": "converted",
                                        "textMessage": conversationData.output.text[0] + "..." + "Nome da oficina..." + result[0].nome + "..." + "e telefone" + "..." + result[0].telefone
                                    }).then(function (ttsData) {
                                        return res.status(200).send({
                                            "tts": ttsData,
                                            "stt": data.results,
                                            "conversation": conversationData
                                        });
                                    });
                                });
                            } else if (conversationData.context.proximas == true && conversationData.context.proximas != undefined) {
                                firebase.getOficinasProximasPorLocalizacao([-23.6514766, -46.66594859999998], 15, function (result) {
                                    console.log(result);
                                    watsonTextToSpeech.convertTextToAudio({
                                        "fileName": "converted",
                                        "textMessage": conversationData.output.text[0] + "..." + "Estas sao as oficinas mais proximas..." + result[0].nome + "..." + "e telefone" + "..." + result[0].telefone
                                    }).then(function (ttsData) {
                                        return res.status(200).send({
                                            "tts": ttsData,
                                            "stt": data.results,
                                            "conversation": conversationData
                                        });
                                    });
                                });
                            } else if (res.status(500)) {
                                watsonTextToSpeech.convertTextToAudio({
                                    "fileName": "converted",
                                    "textMessage": "Não entendi, fale novamente"
                                }).then(function (ttsData) {
                                    return res.status(200).send({
                                        "tts": ttsData,
                                        "stt": data.results,
                                        "conversation": conversationData
                                    });
                                }, function (err) {
                                    console.log(err);
                                    return res.status(500).send(err);
                                });
                            } else {
                                watsonTextToSpeech.convertTextToAudio({
                                    "fileName": "converted",
                                    "textMessage": conversationData.output.text[0]
                                }).then(function (ttsData) {
                                    return res.status(200).send({
                                        "tts": ttsData,
                                        "stt": data.results,
                                        "conversation": conversationData
                                    });
                                }, function (err) {
                                    console.log(err);
                                    return res.status(500).send(err);
                                });
                            }
                        }, function (err) {
                            console.log(err);
                            return res.status(500).send(err);
                        });
                    }, function (err) {
                        return res.status(500).send(err);
                    });
                }, function (err) {
                    console.log(err);
                    return res.status(500).send(err);
                });
            }, function (err) {
                return res.status(500).send(err);
            });
        });

        app.post("/convertTextToAudio", function (req, res) {
            watsonTextToSpeech.convertTextToAudio({
                "fileName": "converted",
                "textMessage": req.body.textMessage
            }).then(function (data) {
                return res.status(200).send(data);
            }, function (err) {
                console.log(err);
                return res.status(500).send(err);
            });
        });

        app.post("/askWatson", function (req, res) {
            var context;
            if (!req.query.question && !req.body.question) {
                return res.status(403).send("Can not proceed without question property");
            }

            if (req.body.context) {
                try {
                    context = JSON.parse(req.body.context);
                } catch (e) {
                    context = req.body.context;
                }
            } else {
                context = {};
            }

            watsonConversation.sendMessage({
                "input": {
                    "text": req.body.question
                },
                "context": context
            }).then(function (data) {
                return res.status(200).send(data);
            }, function (err) {
                console.log(err);
                return res.status(500).send(err);
            });
        });

        app.get("/downloadAudio", function (req, res) {
            if (!req.query.filePath || !req.query.fileName) {
                return res.status(500).send("Can not proceed without file name and path");
            }
            //
            setTimeout(function () {
                try {
                    fs.unlinkSync(req.query.filePath);
                } catch (e) {
                    console.log(e);
                }
            }, 3000);
            res.setHeader("content-Type", "audio/wav");
            res.setHeader("Content-Disposition", ["attachment;filename=/", req.query.fileName + ".wav"].join(""));
            return res.download(req.query.filePath);
        });

    };

}());