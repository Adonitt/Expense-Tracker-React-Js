import {Route, Routes} from 'react-router-dom';
import SignInSide from "../components/login/SignInSide.tsx";
import Dashboard from "../components/Dashboard.tsx";
import RegisterSide from "../components/register/RegisterSide.tsx";
import GuestRoute from "./GuestRoute.ts";
import PrivateRoute from "./PrivateRoute.tsx";

function RouterComponent() {

    return (

        <Routes>
            <Route path={"/login"} element={
                <GuestRoute>
                    <SignInSide/>
                </GuestRoute>}>
            </Route>
            <Route path={"/register"} element={
                <GuestRoute>
                    <RegisterSide/>
                </GuestRoute>
            }></Route>
            <Route path={"/"} element={
                <PrivateRoute>
                    <Dashboard/>
                </PrivateRoute>}>
            </Route>
            <Route path="*" element={<Dashboard/>}/>
        </Routes>
    )
}

export default RouterComponent;