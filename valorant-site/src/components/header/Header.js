import { Link } from "react-router-dom";
import logo from '../../assets/valorant_at_uw_logo.svg';

function Header() {
    return (
        <div className="w-full h-16 relative bg-[#4C0080] overflow-hidden flex items-center justify-between px-14">
            <Link to="/"><img className="w-12 h-center left-[0.875rem] top-[0.5rem] absolute rounded-[51px]" src={logo}/></Link>
            <div className="flex justify-end items-center gap-14 px-4">
                <div className="justify-start text-white text-2xl font-extrabold font-['DINish'] uppercase"><Link to="/">HOME</Link></div>
                <div className="justify-start text-white text-2xl font-extrabold font-['DINish'] uppercase"><Link to="/events">EVENTS</Link></div>
                <div className="justify-start text-white text-2xl font-extrabold font-['DINish'] uppercase"><Link to="/officers">OFFICERS</Link></div>
            </div>
        </div>
    );
}

export default Header;