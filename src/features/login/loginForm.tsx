import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { getUserAsync, logInAsync } from "./loginSlice";

interface LoginFormProps {

}

export const LoginForm: React.FC<LoginFormProps> = props => {
    const dispatch = useDispatch<AppDispatch>();
    const token = useSelector((state: RootState) => state.login.token);
    const user = useSelector((state: RootState) => state.login.user);

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        dispatch(getUserAsync(token));
    }, [token]);

    const submit = async (event: any) => {
        event.preventDefault();
        dispatch(logInAsync({ userName, password }));
    }
    return (
        user
            ? <span>{user.userName}</span>
            : <form onSubmit={submit}>
                <label>User name:
                    <input type="text"
                        value={userName}
                        onChange={(event) => setUserName(event.target.value)}
                    />
                </label>
                <label>Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
    );
}