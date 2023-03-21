import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { AppDispatch, RootState } from "../app/store";
import { UserInfo } from "../components/UserInfo";
import { getUserAsync } from "./login/loginSlice";

export const Root: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const token = useSelector((state: RootState) => state.login.token);
    const user = useSelector((state: RootState) => state.login.user);
    useEffect(() => {
        if (token && !user) {
            dispatch(getUserAsync(token));
        }
    }, [token, user]);
    return (
        <>
            <div id="header">
                <UserInfo />
            </div>
            <div id="sidebar">
                <ul>
                    <li><Link to="/">Index</Link></li>
                    {
                        user && user.isAdmin &&
                        <>
                            <li><Link to="/users">Users</Link></li>
                            <li><Link to="/add-user">Add User</Link></li>
                            <li><Link to="/import">Import</Link></li>
                        </>
                    }
                    {
                        user &&
                        <>
                            <li><Link to="/releases">Releases</Link></li>
                            <li><Link to="/collection">Collection</Link></li>
                        </>
                    }
                    {
                        !user &&
                        <>
                            <li><Link to="/login">Log In</Link></li>
                        </>
                    }
                </ul>
            </div>
            <div id="content">
                <Outlet />
            </div>
        </>
    );
}

