import { useState } from "react";

interface TokenResponse {
    token: string,
    expiration: Date
}

interface LoginFormProps {

}
export const LoginForm: React.FC<LoginFormProps> = props => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const submit = async () => {
        const url = "https://localhost:5054/api/login";
        const options: RequestInit = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                userName,
                password
            })
        };
        const response = await fetch(url, options);

        if (response.ok){
            const token: TokenResponse = JSON.parse(await response.json());
            console.log(token); 
        }

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