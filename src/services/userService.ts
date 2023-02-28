import axios from "axios";
import { ResponseModel } from "../models/response";
import { User } from "../models/user";

export interface UserResponse extends ResponseModel {
    user?: User;
}

export async function getUser(token: string): Promise<UserResponse> {
    const url = `${process.env.REACT_APP_API_URL}/user`
    const response = await axios.get<User>(url);
    const status = response.status;
    if (response.status === 200) {
        const user: User = response.data;
        return {
            status,
            user
        }
    }
    return { status };
}