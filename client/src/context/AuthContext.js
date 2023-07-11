import { createContext, useReducer } from "react"
let IntialState = {
    user: JSON.parse(window.sessionStorage.getItem('user')) || null,
    loading: false,
    error: null
}

export const AuthContext = createContext(IntialState);

const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                loading: true,
                error: null
            }
        case "LOGIN_FAILURE":
            return {
                user: null,
                loading: false,
                error: action.payload
            }
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                loading: false,
                error: false
            }
        case "LOGOUT":
            return {
                user: null,
                loading: false,
                error: null
            }
        default:
            return IntialState
    }
}


export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, IntialState);
    return (
        <AuthContext.Provider value={
            {
                user: state.user,
                loading: state.loading,
                error: state.error,
                dispatch
            }
        }>
            {children}
        </AuthContext.Provider>
    )
}