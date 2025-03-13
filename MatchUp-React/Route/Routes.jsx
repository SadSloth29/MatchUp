import { createBrowserRouter } from "react-router-dom";
import Home from '../Pages/Home'
import Login from '../Pages/Login'
import React from 'react'


    const router=createBrowserRouter([
        {
            path: "/",
            element: <Home/>
        },
        {
            path: "/auth/:type",
            element: <Login/>
        }
    ]);

  


export default router;