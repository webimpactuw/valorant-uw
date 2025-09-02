import React from 'react'
import logo from '../../assets/icons/valorant_at_uw_logo.svg';
import { Link } from 'react-router-dom';
import discord from '../../assets/icons/discord-icon.svg';
import email from '../../assets/icons/mail-icon.svg';
import twitch from '../../assets/icons/twitch-icon.svg';
import instagram from '../../assets/icons/instagram-icon.svg';
import linkedin from '../../assets/icons/linkedin-icon.svg';

/* Contains link information for creating links */
const links = {
    "LinkedIn": {
        link: "https://www.linkedin.com/company/valorant-uw/",
        img: linkedin
    },
    "Discord": {
        link: "https://discord.com/invite/CBGmfamqvk",
        img: discord
    },
    "Email": {
        link: "mailto:valorant@uw.edu",
        img: email
    },
    "Twitch": {
        link: "https://www.twitch.tv/wgavalorant",
        img:twitch
    },
    "Instagram": {
        link:"https://www.instagram.com/valorant_uw/",
        img: instagram
    }
}

function Footer(){ 
    return (
        <footer className='bg-[#4C0080] text-white w-full h-16 px-4 py-2.5 flex justify-center'>
            <div className="w-full max-w-[90rem] flex justify-between items-center overflow-hidden">
                <div><Link to={"/"}><img className="w-12 h-12 rounded" src={logo} alt='Logo'></img></Link></div>
                {/*<p className="text-nowrap justify-start text-white text-sm md:text-2xl font-bold md:font-extrabold font-['DINish'] uppercase">COPYRIGHT © 2025 VALORANT AT UW</p>*/}
                <nav aria-label="Social media">
                    <ul className='flex flex-row items-center gap-4 px-4' role="menubar">
                        {/* Creates links from all the items in the links object */}
                        {Object.entries(links).map(([name, {link, img}]) => {
                            return (
                                <li role = "none">
                                    <Link to={link} target='_blank' rel='noopener noreffer' role="menuitem" className="group">
                                        <img src={img} alt={`${name} logo`}/>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </div>
        </footer>
    );
}

export default Footer 