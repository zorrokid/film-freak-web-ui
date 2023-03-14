import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../routes/login/loginSlice'
import usersReducer from '../routes/users/usersSlice'
import appReducer from './appSlice'

export const store = configureStore({
    reducer: {
        app: appReducer,
        login: loginReducer,
        users: usersReducer,
    },
})

export type StoreType = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;