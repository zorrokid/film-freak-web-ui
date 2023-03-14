import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { UserRoleSelect } from "./UserRoleSelect";
import { getUsersAsync } from "./usersSlice";

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
    return (
        <>
            <UserRoleSelect selected={role} onChange={onSetRole} />
            <ul>
                {
                    users.map((u, i) =>
                        <li key={`${i}_${u.userId}`}>{u.userName}</li>
                    )
                }
            </ul>
        </>
    );
}