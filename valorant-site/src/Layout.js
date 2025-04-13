import { Outlet, useLocation } from "react-router-dom";
import Footer from "./components/footer/footer";
import './Layout.css';
import Header from "./components/header/Header";

function Layout() {
    const location = useLocation();
    const showHeader = ["/events", '/officers'].includes(location.pathname);

    return (
        <div className="layout-container">
            {showHeader && <Header />}
            <main>
                <Outlet/>
            </main>
            <Footer />
        </div>
    );
}

export default Layout;