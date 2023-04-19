import axios from "axios";
import { StoreType } from "../state/store";
import { logOutAsync, setTokenAsync, setTokenRefreshStatus, TokenRefreshStatus } from "../state/slices/loginSlice";
import { TokenModel } from "../services/loginService";

let store: StoreType;

export function initAxios(_store: StoreType) {
    store = _store;
    axios.interceptors.request.use(async (request) => {
        if (!request.url?.startsWith(process.env.REACT_APP_API_URL!)
            || request.url?.endsWith('refreshtoken')
            || request.url?.endsWith('login')
        ) return request;

        const currentState = store.getState();
        let accessToken = currentState.login.token;
        request.headers.Authorization = `Bearer ${accessToken}`
        return request;
    });

    axios.interceptors.response.use((response) => response,
        async (error) => {
            const originalConfig = error.config;
            const url = originalConfig.url;
            if (error.response && error.response.status === 401
                && url.startsWith(process.env.REACT_APP_API_URL!)
                && !(url.endsWith('refreshtoken') || url.endsWith('login'))
            ) {
                const currentState = store.getState();
                const accessToken = currentState.login.token;
                const refreshToken = currentState.login.refreshToken;
                if (!accessToken || !refreshToken) {
                    return Promise.reject(error);
                }
                try {
                    // refresh expired token
                    store.dispatch(setTokenRefreshStatus(TokenRefreshStatus.processing));
                    const url = `${process.env.REACT_APP_API_URL}/refreshtoken`
                    const response = await axios.post<TokenModel>(url, { accessToken, refreshToken });
                    const tokenModel = response.data;
                    store.dispatch(setTokenAsync(tokenModel));
                    error.config.headers['Authorization'] = `Bearer ${tokenModel.token}`;
                    // invoke the api call with fresh token
                    return axios(error.config);
                } catch (error) {
                    // TODO: handler error
                    store.dispatch(logOutAsync());
                } finally {
                    store.dispatch(setTokenRefreshStatus(TokenRefreshStatus.idle));
                }
            } else {
                return Promise.reject(error);
            }
        }
    );
}

