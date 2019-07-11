require('dotenv').load();
const request = require('request');

const AssistantV2 = require('ibm-watson/assistant/v2');

//Assistant Credentials
var assistant = new AssistantV2({
    iam_apikey: 'yI0gFiP6jAXhVc2Ujzu8m_J878G03H5I5udH3hQoOEaA',
    workspace_id: 'ad400566-4c71-4db9-af65-b240bd427c28',
    url: 'https://gateway-wdc.watsonplatform.net/assistant/api/v1/workspaces/ad400566-4c71-4db9-af65-b240bd427c28/message',
    username: 'apikey',
    password: 'yI0gFiP6jAXhVc2Ujzu8m_J878G03H5I5udH3hQoOEaA',
    version: '2019-07-10'
});

var workspace = 'ad400566-4c71-4db9-af65-b240bd427c28';

exports.change_workspace = (req, res) => {
    if (req.body.newWorkspace) {
        workspace = req.body.newWorkspace
        res.status(200).json({
            err: false,
            workspace: workspace
        });
    } else {
        res.sendStatus(404).json({
            msg: 'Workspace_id not found (see your env file or put in configurations).'
        });
    }
}

exports.getWorkspace = () => {
    return workspace;
}

exports.message = (req, res) => {
    const input = (req.body.input != undefined) ? req.body.input : null;
    const context = (req.body.context != undefined) ? req.body.context : null;
    sendMessage(input, context)
        .then((conversationResponse) => {
            res.send(conversationResponse);
        })
        .catch((err) => {
            res.sendStatus(500);
        })
}

const sendMessage = (input, _context) => {
    return new Promise((resolve, reject) => {
        let context = (_context != null) ? _context : {};
        if (input != null) {
            assistant.message({
                workspace_id: workspace,
                input: {
                    'text': input.text
                },
                context: context
            }, function(err, res) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        } else {
            reject({
                err: true,
                msg: 'Input vazio'
            });
        }
    })
}

const sendMessageHTTP = (input, _context) => {
    return new Promise((resolve, reject) => {
        let context = (_context != null) ? _context : {};
        const rbody = {
            input: {
                text: input.text
            },
            context: context
        }
        if (input != null) {
            request({
                uri: process.env.SERVICE_ENDPOINT + "v1/workspaces/" + workspace + "/message?version=2018-09-20",
                body: JSON.stringify(rbody),
                method: 'POST',
                auth: {
                    user: "apikey",
                    pass: "yI0gFiP6jAXhVc2Ujzu8m_J878G03H5I5udH3hQoOEaA"
                },
                headers: {
                    "Content-Type": "application/json"
                },
                agentOptions: {
                    rejectUnauthorized: false
                }

            }, function(err, res) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(JSON.parse(res.body));
                }
            });
        } else {
            reject({
                err: true,
                msg: 'Input vazio'
            });
        }
    })
}