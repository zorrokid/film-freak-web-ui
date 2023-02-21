import { ResponseModel } from "../models/response";
import { User } from "../models/user";

export interface UserResponse extends ResponseModel
{
    user?: User;
}

export async function getUser(token: string) : Promise<UserResponse> {
    console.log(token)
    const options: RequestInit = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`
        },
    };
    const url = `${process.env.REACT_APP_API_URL}/user`
    const response = await fetch(url, options);
    const status = response.status;

    if (response.ok){
        const user: User = await response.json();
        return {
            status,
            user 
        }
    } 

    return { status };
}