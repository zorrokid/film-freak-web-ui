import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { UserRoleSelect } from "./UserRoleSelect";
import { deleteUserAsync, getUsersAsync } from "./usersSlice";
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
        <>
            <UserRoleSelect selected={role} onChange={onSetRole} />
            <div className="users-list__container">
                {
                    users.map((u, i) =>
                        <div key={u.userId} className="users-list__row">
                            <span className="users-list__column--name">{u.userName}</span>
                            <button>Edit</button>
                            <button onClick={() => deleteUser(u.userId)}>Delete</button>
                        </div>
                    )
                }
            </div>
        </>
    );
}