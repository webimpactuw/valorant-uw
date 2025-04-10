import { Outlet } from "react-router-dom";
import Footer from "./components/footer/footer";
import './Layout.css';

function Layout() {
    return (
        <div className="layout-container">
            <Outlet/>
            <Footer />
        </div>
    );
}

export default Layout;