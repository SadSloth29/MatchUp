import { createBrowserRouter } from "react-router-dom";
import Home from '../Pages/Home'
import Login from '../Pages/Login'
import React from 'react'
import UserFeed from '../Pages/UserFeed'
import ProtectedRoute from "../Components/protectedroute";
import UserProfile from "../Pages/userprofile";
import SettingsAuth from "../Components/SettingsAuth";
import Settings from "../Pages/Settings";
import ShowFollowBlocked from "../Components/ShowFollowBlocked";
import Texts from "../Pages/Texts";
import Matches from "../Pages/Matches";
import MatchRec from "../Components/MatchRec";



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
            
        },
        {
            path: "/list/:type",
            element: <ShowFollowBlocked />,
        },
        {
            path: "/texts/:username",
            element: <Texts/>
        },
        {
            path: "/matches/:username",
            element: <Matches/>
        },
        {
            path: "/matches/recommended/:username",
            element: <MatchRec/>
        }
    ]);

  


export default router;