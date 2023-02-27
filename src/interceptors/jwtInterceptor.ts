import axios from "axios";
import { StoreType } from "../app/store";
import { clearToken, logOutAsync, setToken, setTokenRefreshStatus, TokenRefreshStatus } from "../features/login/loginSlice";
import { TokenModel } from "../services/loginService";

let store: StoreType;

export function initAxios(_store: StoreType) {
    store = _store;
    axios.interceptors.request.use(async (request) => {
        if (!request.url?.startsWith(process.env.REACT_APP_API_URL!)
            || request.url?.endsWith('refreshtoken')
            || request.url?.endsWith('login')
        )
            return request;
        const currentState = store.getState();
        let accessToken = currentState.login.token;
        const refreshToken = currentState.login.refreshToken;
        const expiration = currentState.login.expiration;
        if (currentState.login.tokenRefreshStatus === TokenRefreshStatus.processing
            || accessToken === undefined
            || expiration === undefined
            || refreshToken === undefined
        ) {
            return request;
        }
        const now = new Date();
        const exp = new Date(expiration);
        if (exp < now) {
            try {
                store.dispatch(setTokenRefreshStatus(TokenRefreshStatus.processing));
                const url = `${process.env.REACT_APP_API_URL}/refreshtoken`
                const response = await axios.post<TokenModel>(url, { accessToken, refreshToken });
                const tokenModel = response.data;
                store.dispatch(setToken(tokenModel));
                accessToken = tokenModel.token;
            } catch (error) {
                // TODO: handler error
                console.log(error);
                store.dispatch(logOutAsync());
            } finally {
                store.dispatch(setTokenRefreshStatus(TokenRefreshStatus.idle));
            }
        }

        request.headers.Authorization = `Bearer ${accessToken}`

        return request;
    });
}

