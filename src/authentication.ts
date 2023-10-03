import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

export interface UserInfo {
    user_id: string;
    company_id: string;
}

export interface Authentication {
    /**
     * Authenticates the user from the jwt token in the authentication
     * header
     * 
     * @param token The JWT
     * @returns The user id
     * @throws error if could not authentication 
     */
    authenticate(token: string): UserInfo;
}

declare global {
    namespace Express {
        interface Request {
            user_id: string,
            company_id: string
        }
    }
}

export function makeAuthenticate(auth: Authentication) {
    return function authenticate(request: Request, response: Response, next: NextFunction): void {
        try {
            if (!request.headers.authorization) {
                throw new Error('Missing authorization header');
            }
    
            const token = request.headers.authorization.split(' ');
            if (token.length != 2 || token[0] != 'Bearer') {
                throw new Error('Authorization header not in proper format');
            }

            const auth_info = auth.authenticate(token[1]);
            request.user_id = auth_info.user_id;
            request.company_id = auth_info.company_id;
            next();
        }
        catch (e) {
            response.sendStatus(401);
        }
    }
}

export class JwtAuthentication implements Authentication {
    readonly SECRET = "wis^45qW#Ih%5R%_h/(hcNL,qt;T%,VE9b6m[C>nZXX[3K-|`jZc4jPDYA1ta[Y";

    authenticate(token: string): UserInfo {
        const payload = jwt.verify(token, this.SECRET); 

        if (typeof payload === 'string') {
            throw new Error('Invalid token content');
        }

        return { 
            user_id: payload['user_id'],
            company_id: payload['company_id']
        };
    }

    create_token(info: UserInfo): string {
        return jwt.sign(info, this.SECRET);
    }
}