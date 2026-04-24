import {Route, Routes} from 'react-router-dom';
import SignInSide from "../components/login/SignInSide.tsx";
import Dashboard from "../components/Dashboard.tsx";
import RegisterSide from "../components/register/RegisterSide.tsx";
import GuestRoute from "./GuestRoute.ts";
import PrivateRoute from "./PrivateRoute.tsx";
import OAuthSuccess from '../components/login/OAuthSuccess.tsx';
import {UsersList} from "../components/users/UsersList.tsx";
import MainGrid from "../components/dashboard/MainGrid.tsx";
import {TransactionsList} from "../components/transactions/TransactionsList.tsx";
import {DebtsList} from "../components/debts/DebtsList.tsx";
import ResetPassword from "../components/login/ResetPassword.tsx";

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

                <Route index element={<MainGrid/>}/>
                <Route path="users" element={<UsersList/>}/>
                <Route path="transactions" element={<TransactionsList/>}/>
                <Route path="debts" element={<DebtsList/>}/>
            </Route>
            <Route path="/oauth-success" element={<OAuthSuccess/>}/>
            <Route path="/reset-password" element={<ResetPassword/>}/>
            <Route path="*" element={<Dashboard/>}/>
        </Routes>
    )
}

export default RouterComponent;