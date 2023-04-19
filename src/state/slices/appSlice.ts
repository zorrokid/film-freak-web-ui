import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
    redirectRoute: string | undefined;
}

const initialState: AppState = {
    redirectRoute: undefined,
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setRoute: (state, action: PayloadAction<string>) => {
            state.redirectRoute = action.payload;
        },
        clearRoute: (state) => {
            state.redirectRoute = undefined;
        }
    }
});

export const { setRoute, clearRoute } = appSlice.actions;
export default appSlice.reducer;