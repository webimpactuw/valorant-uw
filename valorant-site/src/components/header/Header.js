import { Link } from "react-router-dom";
import './Header.css';
import logo from '../../assets/valorant_at_uw_logo.svg';

function Header() {
    return (
        <header className="header">
            <div><Link to="/"><img src={logo} alt='Logo' height={55} width={55}></img></Link></div>
            <div className="directory">
                <Link to="/">HOME</Link>
                <Link to="/events">EVENTS</Link>
                <Link to="/officers">OFFICERS</Link>
            </div>
        </header>
    );
}

export default Header;