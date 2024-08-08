import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext.jsx";

const RegisterAndLoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginOrRegitser, setIsLoginOrRegitser] = useState("Register");
    const { userName, setUserName: setLoggedInUser,userID, setUserId } = useContext(UserContext);

    const usernameHandler = (event) => {
        setUsername(event.target.value);
    }
    const passwordHandler = (event) => {
        setPassword(event.target.value);
    }

    async function userSubmitHandler(e) {
        e.preventDefault();
        const url = isLoginOrRegitser === 'Register' ? 'register':'login';
        try {
            const { data } = await axios.post(url, { username, password });
            setLoggedInUser(username);
            setUserId(data.id);
        } catch (error) {
            console.error("Error registering user:", error);
        }
    }

    
    return (
        <div className="bg-blue-50 h-screen flex items-center">
            <form className="w-64 mx-auto mb-12" onSubmit={userSubmitHandler}>
                <input value={username} onChange={usernameHandler} type="text" className="block w-full p-2 rounded-sm mb-2 border" placeholder="username" />
                <input value={password} onChange={passwordHandler} type="password" className="block w-full p-2 rounded-sm mb-2 border" placeholder="password" />
                <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded-sm">
                    {isLoginOrRegitser === "Register" ? "Register":"Login"}
                </button>
                <div className="text-center mt-2">
                    {isLoginOrRegitser === "Register" && 
                    (<div>
                        Already a member? <button onClick={() => setIsLoginOrRegitser("Login")}> Login here</button>
                    </div>)
                    }
                    {isLoginOrRegitser === "Login" && 
                    (<div>
                        Don't have an account? <button onClick={() => setIsLoginOrRegitser("Register")}> Register</button>
                    </div>)
                    }
                </div>
            </form>
        </div>
    );
}

export default RegisterAndLoginForm;
