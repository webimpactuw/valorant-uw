import { Outlet } from "react-router-dom";
import Footer from "./components/footer/footer";
import './Layout.css';

function Layout() {
    return (
        <div className="layout-container">
            <main>
                <Outlet/>
            </main>
            <Footer />
        </div>
    );
}

export default Layout;