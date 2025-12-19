import RouterComponent from "./router/RouterComponent.tsx";
import {ToastContainer} from "react-toastify";

export default function App() {
    return <>
        <RouterComponent/>
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={localStorage.getItem('mui-mode')}
        />
    </>

}
