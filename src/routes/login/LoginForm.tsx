import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../state/store";
import { useRedirect } from "../../hooks/useRedirect";
import { logInAsync } from "../../state/slices/loginSlice";

export const LoginForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const redirect = useRedirect();

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const submit = async (event: any) => {
        event.preventDefault();
        dispatch(logInAsync({ userName, password }));
        navigate("/");
    }

    return (
        <form onSubmit={submit}>
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