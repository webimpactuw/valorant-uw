import { Link } from "react-router-dom";
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div>LOGO</div>
            <div className="directory">
                <Link to="/">HOME</Link>
                <Link to="/events">EVENTS</Link>
                <Link to="/officers">OFFICERS</Link>
            </div>
        </header>
    );
}

export default Header;