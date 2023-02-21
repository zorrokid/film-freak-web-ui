import { ResponseModel } from "../models/response";
export interface TokenModel {
    token: string,
    expiration: Date
}

export interface LoginResponse extends ResponseModel {
    tokenModel?: TokenModel;
}

export async function logIn(userName: string, password: string) : Promise<LoginResponse> {
    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
            userName,
            password
        }),
    };
    const url = `${process.env.REACT_APP_API_URL}/login`
    const response = await fetch(url, options);
    const status = response.status;

    if (response.ok){
        const tokenModel = await response.json();
        return {
            status,
            tokenModel
        }
    } 

    return { status };
}