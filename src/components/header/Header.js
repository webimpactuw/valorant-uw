import { Link } from "react-router-dom";
import logo from '../../assets/icons/valorant_at_uw_logo.svg';
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
    );
}

export default Header;