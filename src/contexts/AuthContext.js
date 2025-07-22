'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { api, APIError } from '@/lib/api'

const AuthContext = createContext()

// Auth reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null,
            }
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
                error: null,
            }
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false }
        case 'CLEAR_ERROR':
            return { ...state, error: null }
        case 'UPDATE_USER':
            return { ...state, user: { ...state.user, ...action.payload } }
        default:
            return state
    }
}

// Initial state
const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
    error: null,
}

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState)

    // Check for existing auth on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem('auth_token')
                const user = localStorage.getItem('auth_user')

                if (token && user) {
                    // Verify token is still valid
                    try {
                        const response = await api.getProfile()
                        dispatch({
                            type: 'LOGIN_SUCCESS',
                            payload: {
                                user: response.user,
                                token,
                            },
                        })
                    } catch (error) {
                        // Token invalid, clear storage
                        localStorage.removeItem('auth_token')
                        localStorage.removeItem('auth_user')
                        dispatch({ type: 'LOGOUT' })
                    }
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false })
                }
            } catch (error) {
                dispatch({ type: 'SET_LOADING', payload: false })
            }
        }

        initAuth()
    }, [])

    const login = async (email, password) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true })
            dispatch({ type: 'CLEAR_ERROR' })

            const response = await api.login(email, password)

            // Store token and user data
            localStorage.setItem('auth_token', response.token)
            localStorage.setItem('auth_user', JSON.stringify(response.user))

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    user: response.user,
                    token: response.token,
                },
            })

            return response
        } catch (error) {
            const errorMessage = error instanceof APIError 
                ? error.message 
                : 'Login failed. Please try again.'
            
            dispatch({ type: 'SET_ERROR', payload: errorMessage })
            throw error
        }
    }

    const register = async (userData) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true })
            dispatch({ type: 'CLEAR_ERROR' })

            const response = await api.register(userData)

            // Store token and user data
            localStorage.setItem('auth_token', response.token)
            localStorage.setItem('auth_user', JSON.stringify(response.user))

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    user: response.user,
                    token: response.token,
                },
            })

            return response
        } catch (error) {
            const errorMessage = error instanceof APIError 
                ? error.message 
                : 'Registration failed. Please try again.'
            
            dispatch({ type: 'SET_ERROR', payload: errorMessage })
            throw error
        }
    }

    const logout = () => {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        dispatch({ type: 'LOGOUT' })
    }

    const updateUser = (userData) => {
        const updatedUser = { ...state.user, ...userData }
        localStorage.setItem('auth_user', JSON.stringify(updatedUser))
        dispatch({ type: 'UPDATE_USER', payload: userData })
    }

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' })
    }

    const value = {
        ...state,
        login,
        register,
        logout,
        updateUser,
        clearError,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
} 