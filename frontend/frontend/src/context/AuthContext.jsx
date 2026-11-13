import { createContext,useEffect,useState } from "react";
import { jwtDecode } from "jwt-decode";
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext=createContext()

function decodeValidToken(token) {
    try {
        const decoded = jwtDecode(token)
        if (typeof decoded.exp !== "number" || decoded.exp * 1000 <= Date.now()) {
            return null
        }
        return decoded
    } catch {
        return null
    }
}

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null)
    useEffect(()=>{
        const token=localStorage.getItem("token")
        if (token) {
            const decode=decodeValidToken(token)
            if (decode) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setUser(decode)
            } else {
                localStorage.removeItem("token")
            }
            
        }
    }, [])
   

const logout=()=>{
    localStorage.removeItem("token")
    setUser(null)
    // window.location.href="/login"
}
const login=(token)=>{
    const decode=typeof token === "string" ? decodeValidToken(token) : null
    if (!decode) {
        throw new Error("The authentication token is invalid or expired.")
    }
    localStorage.setItem("token", token)
    setUser(decode)
}
 return (
        <AuthContext.Provider value={{ user, setUser ,logout,login}}>
            {children}
        </AuthContext.Provider>
    )
}