import { Link } from "react-router-dom";
import logo from '../../assets/icons/valorant_at_uw_logo.svg';
import DropdownMenu from "./dropdown-menu";


function Header() {
    return (
        <header className="w-full h-16 relative bg-accent flex justify-center">
            <div className="w-full max-w-[90rem] flex justify-between px-4 items-center">
                <Link to="/">
                    <img className="w-12 h-center left-[0.875rem] top-[0.5rem] rounded-[51px]" src={logo} alt="Logo" />
                </Link>
                <nav aria-label="Main navigation">
                    <ul className="hidden sm:flex justify-end items-center gap-14 px-4" role="menubar">
                        <li role="none">
                            <Link to="/" role="menuitem" className="justify-start text-white text-2xl font-extrabold font-['DINish'] uppercase hover:text-yellow-200">
                                HOME
                            </Link>
                        </li>
                        <li role="none">
                            <Link to="/events" role="menuitem" className="justify-start text-white text-2xl font-extrabold font-['DINish'] uppercase hover:text-yellow-200">
                                EVENTS
                            </Link>
                        </li>
                        <li role="none">
                            <Link to="/officers" role="menuitem" className="justify-start text-white text-2xl font-extrabold font-['DINish'] uppercase hover:text-yellow-200">
                                OFFICERS
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="sm:hidden">
                    <DropdownMenu />
                </div>
            </div>
        </header>
    );
}

export default Header;