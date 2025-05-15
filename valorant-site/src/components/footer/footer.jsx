import React from 'react'
import logo from '../../assets/valorant_at_uw_logo.svg';
import { Link } from 'react-router-dom';

function Footer(){ 
    return (
        <footer className='bg-[#4C0080] text-white w-full h-16 px-4 py-2.5 flex justify-between items-center overflow-hidden'>
            <div><Link to={"/"}><img className="w-12 h-12 rounded" src={logo} alt='Logo' height={55} width={55}></img></Link></div>
            <p className="text-nowrap justify-start text-white text-sm md:text-2xl font-bold md:font-extrabold font-['DINish'] uppercase">COPYRIGHT © 2025 VALORANT AT UW</p>
        </footer>
    );
}

export default Footer 