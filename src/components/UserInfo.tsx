import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../app/store";
import { logOutAsync } from "../routes/login/loginSlice";

export const UserInfo: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.login.user);

    const logout = async (event: any) => {
        dispatch(logOutAsync())
    }

    return (
        <>
            {
                user &&
                <span>
                    {user.userName}
                    &nbsp;
                    <button onClick={logout}>Log out</button>
                </span>
            }
            {
                !user &&
                <span>
                    <Link to="/login">Log in</Link>
                </span>
            }
        </>
    );

}