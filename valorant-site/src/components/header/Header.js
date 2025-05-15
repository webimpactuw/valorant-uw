import { Link } from "react-router-dom";
import logo from '../../assets/valorant_at_uw_logo.svg';

function Header() {
    return (
        <div className="w-full h-16 relative bg-[#4C0080] overflow-hidden flex items-center justify-between px-14">
            <Link to="/"><img className="w-12 h-center left-[0.875rem] top-[0.5rem] absolute rounded-[51px]" src={logo} alt='Logo'/></Link>
            <div className="flex justify-end items-center gap-14 px-4">
                <div className="justify-start text-white text-2xl font-extrabold font-['DINish'] uppercase"><Link to="/">
                <span className="hidden sm:inline">HOME</span></Link></div>
                <div className="justify-start text-white text-2xl font-extrabold font-['DINish'] uppercase"><Link to="/events">
                <span className="hidden sm:inline">EVENTS</span></Link></div>
                <div className="justify-start text-white text-2xl font-extrabold font-['DINish'] uppercase"><Link to="/officers">
                <span className="hidden sm:inline">OFFICERS</span></Link></div>
            </div>
            <div className="w-8 h-8 relative sm:hidden overflow-hidden">
                <div className="w-8 h-8 left-0 top-0 absolute"></div>
                <div className="w-6 h-0 left-[5.67px] top-[8.50px] absolute outline outline-2 outline-offset-[-1px] outline-white"></div>
                <div className="w-6 h-0 left-[5.67px] top-[17px] absolute outline outline-2 outline-offset-[-1px] outline-white"></div>
                <div className="w-6 h-0 left-[5.67px] top-[25.50px] absolute outline outline-2 outline-offset-[-1px] outline-white"></div>
            </div>
        </div>
    );
}

export default Header;