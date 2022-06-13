import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
const cors = require("cors")({origin: true});
const StreamChat = require("stream-chat").StreamChat;



const serverStreamCliente = StreamChat.getInstance(
    "xcxwgh3qsqxw",
    "3rwwtpwtgwgank3hay8jr4ufwckhtjrkc5wvd793wh62a3xm5k3seztve4xprvn8"
);


admin.initializeApp();

export const createStreamUser = functions.https.onRequest((request, response) => {

    cors(request, response, async () => {
        const {user} = request.body;
        
        if(!user) {
            throw new functions.https.HttpsError("failed-precondition", "Bad-request")
        } else {
            try {
                
                await serverStreamCliente.upsertUser({
                    id: user.uid,
                    name: user.displayName,
                    email: user.email
                });
                response.status(200).send({message: "user created"})
            } catch (error) {
                throw new functions.https.HttpsError("aborted", "Could not create")
                
            }
        
        }
    })
});

export const createStreamToken = functions.https.onRequest((request, response) => {

    cors(request, response, async () => {
        const {user} = request.body;
        console.log(request.body);
        if(!user) {
            throw new functions.https.HttpsError("failed-precondition", "Bad-request")
        } else {
            try {
                const token = await serverStreamCliente.createToken(user);
                response.status(200).send({token})
            } catch (error) {
                console.log(error);
                throw new functions.https.HttpsError("aborted", "Could not create")
            }
        
        }
    })
});

