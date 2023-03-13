import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { UserRoleSelect } from "./UserRoleSelect";
import { getUsersAsync } from "./usersSlice";


export const UsersList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const users = useSelector((state: RootState) => state.users.users);
    const getUsers = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const role = event.target.value;
        dispatch(getUsersAsync(role));
    }
    return (
        <>
            <UserRoleSelect onSelect={getUsers} />
            <ul>
                {
                    users.map((u, i) =>
                        <li key={u.userId}>{u.userName}</li>
                    )
                }
            </ul>
        </>
    );
}