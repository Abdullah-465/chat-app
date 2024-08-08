import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export default function UserContextProvider ({ children }) {
    const [userName, setUserName] = useState(null);
    const [userID, setUserId] = useState(null);
    useEffect(()=>{
        axios.get('/profile').then((response)=>{
            return response.data;
        }).then((data)=>{
            setUserId(data.userId);
            setUserName(data.username);
        }).catch((error) => {
            console.error("Error fetching profile data:", error);
        });
    }, []); // Include userID and userName in the dependency array

    
    return (
        <UserContext.Provider value={{ userName, setUserName, userID, setUserId }}>
            {children}
        </UserContext.Provider>
    )
}


