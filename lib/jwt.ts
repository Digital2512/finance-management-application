import jwt from 'jsonwebtoken';

interface payloadToken {
    userID: string;
    username: string;
}

export function signToken(payload: payloadToken, expiresInAmount: string){
    const JWT_SECRET = process.env.JWT_SECRET
    console.log('JWT: ', JWT_SECRET);
    return jwt.sign(payload, 
        JWT_SECRET!,
        {expiresIn: expiresInAmount}
    );
}

export function verifyToken(token: string){
    console.log('----------------------------------------------------------------------------------------------------------------------------------------------------');
    console.log('Verify Token: ' + token);
    const JWT_SECRET = process.env.JWT_SECRET
    console.log('JWT: ', JWT_SECRET);
    if(JWT_SECRET){
        return jwt.verify(token, JWT_SECRET!);
    }else{     
        console.log('JWT not found')
    }
}