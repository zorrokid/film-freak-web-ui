import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../routes/login/loginSlice'
import usersReducer from '../routes/users/usersSlice'
import appReducer from './appSlice'
import importItemsReducer from '../routes/import/importSlice'

export const store = configureStore({
    reducer: {
        app: appReducer,
        login: loginReducer,
        users: usersReducer,
        importItems: importItemsReducer
    },
})

export type StoreType = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;