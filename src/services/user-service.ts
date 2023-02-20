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
        // TODO: onko tarpeen?
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`
        },
        // TODO: onko tarpeen
        credentials: 'include',
    };
    const url = `${process.env.REACT_APP_API_URL}user`
    const response = await fetch(url, options);
    const status = response.status;

    if (response.ok){
        const user: User = await response.json();
        console.log(JSON.stringify(user))
        return {
            status,
            user 
        }
    } 

    return { status };
}