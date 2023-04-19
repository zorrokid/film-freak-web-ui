import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { useRedirect } from "../../hooks/useRedirect";
import { UserRoleSelect } from "./UserRoleSelect";
import { addUserAsync } from "../../state/slices/usersSlice";

export interface UserFormProps {
    userId?: number;
}

export const UserForm: React.FC = (props: UserFormProps) => {
    const errors = useSelector((state: RootState) => state.users.errors);
    const dispatch = useDispatch<AppDispatch>();
    useRedirect();
    const [role, setRole] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRole(event.target.value);
    }

    const submit = async (event: any) => {
        event.preventDefault();
        dispatch(addUserAsync({ userName, password, email, role }));
    }

    return (
        <>
            {
                errors && <ul>
                    {errors.map((err, i) => <li key={`i_${err}`}>{err}</li>)}
                </ul>
            }
            <form onSubmit={submit}>
                <UserRoleSelect onChange={onSelect} />
                <label>User name:
                    <input type="text"
                        value={userName}
                        onChange={(event) => setUserName(event.target.value)} />
                </label>
                <label>Password:
                    <input type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)} />
                </label>
                <label>Email:
                    <input type="text"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)} />
                </label>
                <button type="submit">Submit</button>
            </form>
        </>
    );
}