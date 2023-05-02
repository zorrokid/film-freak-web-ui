import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { UserRoleSelect } from "./UserRoleSelect";
import { deleteUserAsync, getUsersAsync } from "../../state/slices/usersSlice";
import "./usersList.scss";

export const UsersList: React.FC = () => {
    const [role, setRole] = useState<string>("user");
    const dispatch = useDispatch<AppDispatch>();
    const users = useSelector((state: RootState) => state.users.users);

    const onSetRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const role = event.currentTarget.value;
        if (!role) return;
        setRole(event.currentTarget.value);
        dispatch(getUsersAsync(role));
    }

    const deleteUser = (userId: number) => {
        dispatch(deleteUserAsync(userId));
    }
    return (
        <div className="users-list">
            <div className="users-list-filters">
                <label>Select role</label>
                <UserRoleSelect selected={role} onChange={onSetRole} />
            </div>
            <div className="users-list-data">
                {
                    users.map((u, i) =>
                        <div key={u.userId} className="users-list-data-row">
                            {u.userName}
                            <button>Edit</button>
                            <button onClick={() => deleteUser(u.userId)}>Delete</button>
                        </div>
                    )
                }
            </div>
        </div>
    );
}