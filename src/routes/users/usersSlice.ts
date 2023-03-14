import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserAddModel } from "../../models/userAddModel";
import { LoadingStatus } from "../../models/enums";
import { postAddUserAsync, getUsers } from "./usersService";
import { UserListModel } from "../../models/userListModel";
import { setRoute } from "../../app/appSlice";

export interface UsersState {
    users: UserListModel[];
    status: LoadingStatus;
    errors: string[];
}

const initialState: UsersState = {
    users: [],
    status: LoadingStatus.idle,
    errors: []
}

export const getUsersAsync = createAsyncThunk<UserListModel[], string, { rejectValue: string }>(
    'users/getUsersAsync',
    async (role: string, thunkApi) => {
        const usersResponse = await getUsers(role);
        if (usersResponse.status !== 200 || !usersResponse.users) {
            return thunkApi.rejectWithValue("Fetching users failed");
        }
        return usersResponse.users;
    }
);

export const addUserAsync = createAsyncThunk<UserListModel, UserAddModel, { rejectValue: string[] }>(
    'users/addUserAsync',
    async (user: UserAddModel, thunkApi) => {

        const res = await postAddUserAsync(user);
        if (res === undefined) return thunkApi.rejectWithValue(["Add user response was undefined."]);
        if (res.status >= 400) {
            return thunkApi.rejectWithValue(res.errors);
        }
        const listModel: UserListModel = {
            userId: res.userId!,
            userName: user.userName,
            role: user.role,
        };

        thunkApi.dispatch(addUser(listModel));
        thunkApi.dispatch(setRoute('/users'))

        return listModel;
    }
)

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<UserListModel>) => {
            state.users.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUsersAsync.pending, (state) => {
            state.status = LoadingStatus.loading;
        });
        builder.addCase(getUsersAsync.rejected, (state) => {
            state.status = LoadingStatus.idle;
            state.users = [];
        });
        builder.addCase(getUsersAsync.fulfilled, (state, { payload }) => {
            state.status = LoadingStatus.idle;
            state.users = payload;
        });
        builder.addCase(addUserAsync.pending, (state) => {
            state.status = LoadingStatus.loading;
        });
        builder.addCase(addUserAsync.rejected, (state, { payload }) => {
            state.status = LoadingStatus.idle;
            state.errors = payload ?? [];
        });
        builder.addCase(addUserAsync.fulfilled, (state, { payload }) => {
            state.status = LoadingStatus.idle;
        });
    },
})

export const { addUser } = usersSlice.actions;
export default usersSlice.reducer;