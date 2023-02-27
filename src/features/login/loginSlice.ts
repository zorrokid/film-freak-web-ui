import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../models/user';
import { logIn, TokenModel } from '../../services/loginService';
import { getUser } from '../../services/userService';
import { getValue, getObject, storeValue, storeObject, removeItem } from '../../services/storageService';
import { JWT_TOKEN_EXPIRATION_KEY, JWT_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../consts/localStorageKeys';

enum LoginStatus {
    loading,
    idle
}

export enum TokenRefreshStatus {
    processing,
    idle
}


export interface LoginState {
    token: string | undefined;
    expiration: string | undefined;
    refreshToken: string | undefined;
    user?: User;
    status: LoginStatus;
    tokenRefreshStatus: TokenRefreshStatus;
}

const initialState: LoginState = {
    token: getValue(JWT_TOKEN_KEY) ?? undefined,
    expiration: getValue(JWT_TOKEN_EXPIRATION_KEY) ?? undefined,
    refreshToken: getValue(REFRESH_TOKEN_KEY) ?? undefined,
    status: LoginStatus.idle,
    tokenRefreshStatus: TokenRefreshStatus.idle,
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
        storeValue(JWT_TOKEN_KEY, loginResponse.tokenModel.token);
        storeValue(JWT_TOKEN_EXPIRATION_KEY, loginResponse.tokenModel.expiration);
        storeValue(REFRESH_TOKEN_KEY, loginResponse.tokenModel.refreshToken);
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
        removeItem(JWT_TOKEN_KEY);
        removeItem(JWT_TOKEN_EXPIRATION_KEY);
        removeItem(REFRESH_TOKEN_KEY);
    }
)

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<TokenModel>) => {
            state.token = action.payload.token;
            state.expiration = action.payload.expiration;
            state.refreshToken = action.payload.refreshToken;
        },
        clearToken: (state) => {
            state.token = undefined;
            state.expiration = undefined;
            state.refreshToken = undefined;
            state.user = undefined;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = undefined;
        },
        setTokenRefreshStatus: (state, action: PayloadAction<TokenRefreshStatus>) => {
            state.tokenRefreshStatus = action.payload;
        }
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
                state.refreshToken = payload.refreshToken;
            } else {
                state.token = undefined;
                state.expiration = undefined;
                state.refreshToken = undefined;
                state.user = undefined;
            }
        });
        builder.addCase(logInAsync.rejected, (state, { payload }) => {
            state.status = LoginStatus.idle;
            state.token = undefined;
            state.expiration = undefined;
            state.refreshToken = undefined;
            state.user = undefined;
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
            state.refreshToken = undefined;
        })
    }
})

export const { setToken, clearToken, setUser, clearUser, setTokenRefreshStatus } = loginSlice.actions;
export default loginSlice.reducer;