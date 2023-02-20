import { useState } from "react";
import { User } from "../../models/user";
import { logIn } from "../../services/login-service";
import { getUser } from "../../services/user-service";



interface LoginFormProps {

}


export const LoginForm: React.FC<LoginFormProps> = props => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");
    const [user, setUser] = useState<User | undefined>(undefined);
    const submit = async (event: any) => {
        event.preventDefault();
        const tokenResponse = await logIn(userName, password);
        if (!tokenResponse.tokenModel){
            // TODO: handler error
            console.log(`No token, status ${tokenResponse.status}`);
            return;
        }
        setToken(tokenResponse.tokenModel.token);
        const userResponse = await getUser(tokenResponse.tokenModel.token);
        if (!userResponse.user) {
            // TODO: handler error
            console.log(`No user, status ${userResponse.status}`);
            return;
        }
        setUser(userResponse.user);
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