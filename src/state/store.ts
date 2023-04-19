import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './slices/loginSlice'
import usersReducer from './slices/usersSlice'
import appReducer from './slices/appSlice'
import importItemsReducer from './slices/importSlice'
import releasesReducer from './slices/releasesSlice'
import editReleaseReducer from './slices/editReleaseSlice'

export const store = configureStore({
    reducer: {
        app: appReducer,
        login: loginReducer,
        users: usersReducer,
        importItems: importItemsReducer,
        releases: releasesReducer,
        editRelease: editReleaseReducer,
    },
})

export type StoreType = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;