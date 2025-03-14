import { createBrowserRouter } from "react-router-dom";
import Home from '../Pages/Home'
import Login from '../Pages/Login'
import React from 'react'
import UserFeed from '../Pages/UserFeed'


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
        }
    ]);

  


export default router;