import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../models/user';
import { logIn, TokenModel } from '../../services/loginService';
import { getUser } from '../../services/userService';
import { getValue, getObject, storeValue, storeObject, removeItem } from '../../services/storageService';

enum LoginStatus {
    loading,
    idle
}

export interface LoginState {
    token: string | undefined;
    expiration: Date | undefined;
    user?: User;
    status: LoginStatus;
}

const initialState: LoginState = {
    token: getValue("token") ?? undefined,
    expiration: getObject<Date>("expiration") ?? undefined,
    status: LoginStatus.idle,
}

export interface LoginParams {
    userName: string;
    password: string;
}

export const logInAsync = createAsyncThunk<TokenModel, LoginParams>(
    'login/login',
    async (loginParams: LoginParams, thunkApi: any) => {
        const loginResponse = await logIn(loginParams.userName, loginParams.password);
        if (loginResponse.status !== 200 || loginResponse.tokenModel === undefined) {
            return thunkApi.rejectWithValue("Log in failed");
        }
        storeValue('token', loginResponse.tokenModel.token);
        storeObject('expiration', loginResponse.tokenModel.expiration);
        return loginResponse.tokenModel;
    }
)

export const getUserAsync = createAsyncThunk<User, string>(
    'login/getUser',
    async (token: string, thunkApi: any) => {
        const userResponse = await getUser(token);
        if (userResponse.status !== 200) {
            return thunkApi.rejectWithValue("Fetching user failed");
        }
        return userResponse.user;
    }
)

export const logOutAsync = createAsyncThunk(
    'login/logout',
    async () => {
        removeItem("token");
        removeItem("expiration");
    }
)

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<TokenModel>) => {
            state.token = action.payload.token;
            state.expiration = action.payload.expiration;
        },
        clearToken: (state) => {
            state.token = undefined;
            state.expiration = undefined;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = undefined;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logInAsync.pending, (state) => {
            state.status = LoginStatus.loading;
        });
        builder.addCase(logInAsync.fulfilled, (state, { payload }) => {
            state.status = LoginStatus.idle;
            if (payload) {
                state.token = payload.token;
                state.expiration = payload.expiration;
            } else {
                state.token = '';
                state.expiration = new Date();
            }
        });
        builder.addCase(logInAsync.rejected, (state, { payload }) => {
            state.status = LoginStatus.idle;
            state.token = '';
            state.expiration = new Date();
        });
        builder.addCase(getUserAsync.pending, (state) => {
            state.status = LoginStatus.loading;
        });
        builder.addCase(getUserAsync.fulfilled, (state, { payload }) => {
            state.status = LoginStatus.idle;
            state.user = payload;
        });
        builder.addCase(getUserAsync.rejected, (state, { payload }) => {
            state.status = LoginStatus.idle;
            state.user = undefined;
        });
        builder.addCase(logOutAsync.fulfilled, (state) => {
            state.status = LoginStatus.idle;
            state.user = undefined;
            state.token = undefined;
            state.expiration = undefined;
        })
    }
})

export const { setToken, clearToken, setUser, clearUser } = loginSlice.actions;
export default loginSlice.reducer;