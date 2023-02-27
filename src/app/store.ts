import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../features/login/loginSlice'


export const store = configureStore({
    reducer: {
        login: loginReducer,
    },
})

export type StoreType = typeof store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;