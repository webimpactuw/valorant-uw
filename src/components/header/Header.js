import { Link } from "react-router-dom";
<<<<<<< HEAD:valorant-site/src/components/header/Header.js
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
=======
import logo from '../../assets/valorant_at_uw_logo.svg';
import DropdownMenu from "./dropdown-menu";

function Header() {
    return (
        <div className="w-full h-16 relative bg-accent flex items-center justify-between px-4">
            <Link to="/"><img className="w-12 h-center left-[0.875rem] top-[0.5rem] absolute rounded-[51px]" src={logo} alt='Logo'/></Link>
            <div className="hidden sm:flex justify-end items-center gap-14 px-4">
                <div className="justify-start text-white text-2xl font-extrabold font-['DINish'] uppercase"><Link to="/">
                HOME
                </Link></div>
                <div className="justify-start text-white text-2xl font-extrabold font-['DINish'] uppercase"><Link to="/events">
                EVENTS
                </Link></div>
                <div className="justify-start text-white text-2xl font-extrabold font-['DINish'] uppercase"><Link to="/officers">
                OFFICERS
                </Link></div>
            </div>
            <div className="sm:hidden">
                <DropdownMenu/>
            </div>
        </div>
>>>>>>> a539af89 (fix project folder structure):src/components/header/Header.js
    );
}

export default Header;