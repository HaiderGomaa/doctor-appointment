import { createContext,useEffect,useState } from "react";
import { jwtDecode } from "jwt-decode";
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext=createContext()
export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null)
    useEffect(()=>{
        const token=localStorage.getItem("token")
        if (token) {
            // Simulate fetching user data based on token
            const decode=jwtDecode(token)
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(decode)
            
        }
    }, [])
   

const logout=()=>{
    localStorage.removeItem("token")
    setUser(null)
    // window.location.href="/login"
}
const login=(token)=>{
    localStorage.setItem("token", token)
    const decode=jwtDecode(token)
    setUser(decode)
}
 return (
        <AuthContext.Provider value={{ user, setUser ,logout,login}}>
            {children}
        </AuthContext.Provider>
    )
}