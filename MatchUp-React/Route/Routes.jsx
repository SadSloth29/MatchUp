import { createBrowserRouter } from "react-router-dom";
import Home from '../Pages/Home'
import Login from '../Pages/Login'
import React from 'react'
import UserFeed from '../Pages/UserFeed'
import ProtectedRoute from "../Components/protectedroute";
import UserProfile from "../Pages/userprofile";
import SettingsAuth from "../Components/SettingsAuth";
import Settings from "../Pages/Settings";


    const router=createBrowserRouter([
        {
            path: "/",
            element: <Home/>
        },
        {
            path: "/:type",
            element: <Login/>
        },
        {
            path: "/users/:username",
            element: <UserFeed/>
            
        },
        {
            path: "/profile/:username",
            element: <UserProfile/>
        },
        {
            path: "/settings/:username",
            element: <Settings/>,
            
        }
    ]);

  


export default router;