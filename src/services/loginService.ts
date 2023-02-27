import axios from "axios";
import { ResponseModel } from "../models/response";
export interface TokenModel {
    token: string,
    expiration: string,
    refreshToken: string,
}

export interface LoginResponse extends ResponseModel {
    tokenModel?: TokenModel;
}

export async function logIn(userName: string, password: string): Promise<LoginResponse> {
    /*const options: RequestInit = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
            userName,
            password
        }),
    };*/
    const url = `${process.env.REACT_APP_API_URL}/login`
    //const response = await fetch(url, options);
    const response = await axios.post<TokenModel>(url, { userName, password });
    const status = response.status;

    if (response.status === 200) {
        const tokenModel = response.data;

        return {
            status,
            tokenModel
        }
    }

    return { status };
}