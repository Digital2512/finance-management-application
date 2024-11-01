import { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload } from "jsonwebtoken";
import { signToken, verifyToken } from "../lib/jwt";

export default function authMiddleware(payload, type){
    // console.log('----------------------------------------------------------------------------------------------------------------------------------------------------');
    // console.log(payload);
    if(type === 'sign'){
        const {userID, username, expiresInAmount} = payload;
        var signedToken = signToken({userID, username}, expiresInAmount)
        console.log('Signed Token: ' + signedToken);
        return signedToken;
    }else if(type === 'verify'){
        console.log('Token String: ' + payload);
        var tokenVerified = verifyToken(payload)
        console.log(tokenVerified);
        if(tokenVerified){
            console.log('Token Verified True');
            return true
        }else{
            console.log('Token Verified False');
            return false
        }
    }else{
        console.log('TOKEN ERROR')
    }
}