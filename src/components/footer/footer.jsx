import React from 'react'
import logo from '../../assets/icons/valorant_at_uw_logo.svg';
import { Link } from 'react-router-dom';
import discord from '../../assets/icons/discord-icon.svg';
import email from '../../assets/icons/mail-icon.svg';
import twitch from '../../assets/icons/twitch-icon.svg';
import instagram from '../../assets/icons/instagram-icon.svg';
import linkedin from '../../assets/icons/linkedin-icon.svg';

function Footer(){ 
    return (
        <footer className='bg-[#4C0080] text-white w-full h-16 px-4 py-2.5 flex justify-between items-center overflow-hidden'>
            <div><Link to={"/"}><img className="w-12 h-12 rounded" src={logo} alt='Logo' height={55} width={55}></img></Link></div>
            {/*<p className="text-nowrap justify-start text-white text-sm md:text-2xl font-bold md:font-extrabold font-['DINish'] uppercase">COPYRIGHT © 2025 VALORANT AT UW</p>*/}
            <div className='flex flex-row items-center gap-4 px-4'>
                <Link to="https://www.linkedin.com/company/valorant-uw/" target='_blank' rel='noopener noreferrer'>
                    <img src={linkedin} alt="linkedin" className='w-6 h-6 lg:w-8 lg:h-8'/>
                </Link>
                <Link to="https://discord.com/invite/CBGmfamqvk" target='_blank' rel='noopener noreferrer'>
                    <img src={discord} alt="discord" className='w-6 h-6 lg:w-8 lg:h-8'/>
                </Link>
                <Link to="mailto:valorant@uw.edu" target='_blank' rel='noopener noreferrer'>
                    <img src={email} alt="email" className='w-6 h-6 lg:w-8 lg:h-8'/>
                </Link>
                <Link to="https://www.twitch.tv/wgavalorant" target='_blank' rel='noopener noreferrer'>
                    <img src={twitch} alt="twitch" className='w-6 h-6 lg:w-8 lg:h-8'/>
                </Link>
                <Link to="https://www.instagram.com/valorant_uw/" target='_blank' rel='noopener noreferrer'>
                    <img src={instagram} alt="instagram" className='w-5 h-5 lg:w-7 lg:h-7'/>
                </Link>
            </div>
        </footer>
    );
}

export default Footer 