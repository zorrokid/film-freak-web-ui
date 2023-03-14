import axios from "axios";
import { UserAddModel } from "../../models/userAddModel";
import { ResponseModel } from "../../models/response";
import { UserListModel } from "../../models/userListModel";

export interface UsersResponse extends ResponseModel {
    users?: UserListModel[];
}

export interface AddUserResponse extends ResponseModel {
    userId?: number;
}

export interface AddUserResult {
    status: number;
    userId?: number;
    errors: string[];
}

export interface ErrorResponse {
    code: string;
    description: string;
}

const usersUrl = `${process.env.REACT_APP_API_URL}/users`;
export const getUsers = async (role: string): Promise<UsersResponse> => {
    const response = await axios.get(`${usersUrl}/${role}`);
    return {
        status: response.status,
        users: response.data,
    }
}

export const postAddUserAsync = async (user: UserAddModel): Promise<AddUserResult | undefined> => {
    var response = axios.post<AddUserResponse | ErrorResponse[]>(usersUrl, user)
        .then((response) => {
            return {
                status: response.status,
                userId: (response.data as AddUserResponse).userId,
                errors: []
            };
        })
        .catch((err) => {
            const status = err.response.status;
            if (status === 400 && err.response.data as ErrorResponse[]) {
                const errors = (err.response.data as ErrorResponse[])
                    .map(e => e.description);
                return {
                    status,
                    errors
                };
            }
            if (status === 409) {
                return {
                    status,
                    errors: ["User already exists."],
                }
            }
        });
    return response;
}