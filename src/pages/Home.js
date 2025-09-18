import { Link } from "react-router-dom";
import '../index.css'; /*import tailwind css*/
import './Home.css';
import StickyNavBar from "../components/home/sticky-nav"; /*sticky nav bar*/
import headerBackground from '../assets/backgrounds/HOMEPAGE_BACKGROUND.png'; /*header background*/
import scrollArrow from '../assets/icons/scroll-arrow-icon.svg' /*scroll icon for header*/

import Background from "../assets/join_a_game_bg.jpeg" /*background photo for join*/
import discord from '../assets/icons/discord-icon.svg' /*discord icon for join*/

import mailIcon from '../assets/icons/mail-icon.svg' /*mail icon for about*/
import instagramIcon from '../assets/icons/instagram-icon.svg' /*instagram icon for about*/
import twitchIcon from '../assets/icons/twitch-icon.svg' /*twitch icon for about*/
import linkedinIcon from '../assets/icons/linkedin-icon.svg' /*linkedin icon for about*/
import groupPhoto from '../assets/group_photo.jpg' /*group photo for about*/
import aboutBackground from '../assets/backgrounds/ABOUT_BACKGROUND.png' /*background for about*/

import dotPattern from '../assets/dot_overlay.svg' /*dot pattern for header, about, play, officers*/
import officerOne from '../assets/officer_portraits/AnshChavda.jpg' /* first officer portrait for officers */
import officerTwo from '../assets/officer_portraits/DavidPham.jpg' /* second officer portrait for officers */
import officerThree from '../assets/officer_portraits/DianeLazo.jpg' /* third officer portrait for officers */
import officersBackground from '../assets/backgrounds/OFFICERS_BACKGROUND.png' /* background for officers */
import eventPoster from '../assets/placeholder_event_poster.png'; /* event poster for play, to be replaced */
import Placeholder from '../assets/empty_event.png'

import React from 'react';
import EmblaCarousel from '../EmblaCarousel';
import eg from '../assets/valorant_sponsors/eg_sponsor.jpg'
import ifinikey from '../assets/valorant_sponsors/ifk_sponsor.png'
import  redbull from '../assets/valorant_sponsors/redbull_sponsor.png'
import tsm from '../assets/valorant_sponsors/tsm_sponsor.svg'
import msi from '../assets/valorant_sponsors/msi.png'
import com from '../assets/valorant_sponsors/com.png'
import razer from '../assets/valorant_sponsors/razer_sponsor.jpg'

import { useState, useEffect } from "react";
import { client, urlFor } from "../assets/sanityClient";
import { upcomingEvent } from "../assets/EventList";

function Home() {
    return (
      <div className="home">
        <HeaderSection /> 
        <div>
          {/* sticky nav bar */}
          <div className="sticky top-0 z-50 bg-transparent">
            <StickyNavBar />
          </div> 
          <JoinSection />
          <AboutSection />
          <PlaySection />
          <OfficersSection />
          <SponsorsSection />
       </div>
    </div>
    );
}

function HeaderSection() {
  const scrollToJoin = () => {
    const button = document.getElementById("join");
    if (button) button.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section className="relative min-h-screen bg-no-repeat bg-cover bg-center flex items-center justify-center" style={{
      backgroundColor: '#F4F1EE',
      backgroundImage: `url(${headerBackground})`,
      backgroundSize: "co", }}
      aria-labelledby="header-section"
      >
      <div className="w-full max-w-[90rem]">
        <div className="w-full max-w-7xl mx-auto px-4 z-10">
          <div className="flex flex-col md:flex-row justify-center items-center gap-10">
            <h1 className="h-center text-[6rem] md:text-[7.75rem] lg:text-[8.25rem] leading-none font-black m-0 order-1 md:order-2 text-left font-anton-sc z-20" style={{color: "#4C0080"}}>
              VALORANT<br />AT UW
            </h1>
            <nav className="w-[85%] md:w-[275px] h-center order-2 md:order-1 mt-0" aria-label="Main site navigation">
              <ul className="flex flex-col items-start md:items-end justify-center space-y-4" role="menubar">
                <li role="none" className="font-DINish font-bold text-3xl lg:text-4xl relative group">
                  <a href="#join" role="menuitem" className="text-black no-underline tracking-[-0.03em] group-hover:text-[#D6CCF5] transition-colors duration-300" >JOIN A GAME</a>
                </li>
                <li role="none" className="font-DINish font-bold text-3xl lg:text-4xl relative group">
                  <a href="#about" role="menuitem" className="text-black no-underline tracking-[-0.03em] group-hover:text-[#D6CCF5] transition-colors duration-300" >ABOUT</a>
                </li>
                <li role="none" className="font-DINish font-bold text-3xl lg:text-4xl relative group">
                  <a href="#play" role="menuitem" className="text-black no-underline tracking-[-0.03em] group-hover:text-[#D6CCF5] transition-colors duration-300">WAYS TO PLAY</a>
                </li>
                <li role="none" className="font-DINish font-bold text-3xl lg:text-4xl relative group">
                  <a href="#officers" role="menuitem" className="text-black no-underline tracking-[-0.03em] group-hover:text-[#D6CCF5] transition-colors duration-300">OFFICERS</a>
                </li>
                <li role="none" className="font-DINish font-bold text-3xl lg:text-4xl relative group">
                  <a href="#sponsors" role="menuitem" className="text-black no-underline tracking-[-0.03em] group-hover:text-[#D6CCF5] transition-colors duration-300">SPONSORS</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <button
          onClick={scrollToJoin}
          aria-label="Scroll to Join Section"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 focus:outline-none"
        >
          <img
            src={scrollArrow}
            alt="scroll down"
            className="w-25 h-25 lg:h-30 lg:w-30 z-20"
          />
        </button>
      </div>
    </section>
  );
}

function JoinSection() {
  return (
    <section
      id="join"
      className="w-full flex justify-center"
      aria-labelledby="join-heading"
    >
      <div
        className="w-full relative bg-cover bg-center bg-no-repeat h-[90vh]"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundSize: "cover",
          backgroundColor: "rgba(0,0,0,.6)",
          backgroundBlendMode: "darken",
        }}
      >
        <div className="absolute inset-0 bg-purple-950/20 z-5" />
        <article className="flex flex-col items-center justify-center h-full py-16 z-10 relative" aria-label="Join a Game">
          <h2 id="join-heading" className="text-accent-alt text-center text-5xl lg:text-7xl font-normal font-['Anton_SC'] uppercase leading-tight mb-8 z-5">
            JOIN A GAME
          </h2>
          <div className="relative w-full flex justify-center">
            <div className="relative w-full max-w-xs md:max-w-md lg:w-[494px]">
              <Link
                to="https://discord.com/invite/CBGmfamqvk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join Valorant at UW Discord server"
                className="block w-full"
              >
                <button
                  type="button"
                  className="w-full p-1 bg-white outline outline-2 outline-offset-[-2px] outline-accent inline-flex justify-center items-center gap-5 group"
                  tabIndex={0}
                >
                  <span className="flex-1 self-stretch py-3 bg-accent flex justify-center items-center gap-5 group-hover:bg-lavender transition-colors duration-300">
                    {/* Inline SVG for Discord icon with hover color */}
                    <span className="w-8 h-6 lg:w-10 lg:h-7 relative overflow-hidden flex-shrink-0">
                      <img src={discord} alt="Discord Logo"/>
                    </span>
                    <span className="whitespace-nowrap text-text-alt text-xl md:text-2xl lg:text-3xl font-extrabold font-['DINish'] text-white uppercase">
                      VALORANT @ UW
                    </span>
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function AboutSection({ about }) {
  return (
    <section 
      id="about"
      className="relative w-full pb-24 lg:pb-16 bg-accent-dark bg-no-repeat bg-cover bg-center px-6 lg:px-24 pt-24 overflow-hidden flex justify-center" style={{
      backgroundImage: `url(${aboutBackground})`,
      backgroundSize: "cover"}}
      aria-labelledby="about-section"
    >
      <div className="w-full max-w-[90rem]">
        {/* left half: text */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 z-10 relative">
          <div className="w-full lg:w-[680px] flex flex-col justify-start items-start gap-2">
            <h2 className="text-left text-5xl lg:text-7xl text-accent-alt font-normal font-anton-sc uppercase leading-tight">
              About the Club
            </h2>
            <h3 className="text-left text-xl lg:text-2xl uppercase text-white font-bold font-dinish">
              What do we do? 
            </h3>
            <p className="text-left text-white font-medium font-dinish text-base lg:text-xl">
              This organization is a community of people who enjoy Valorant. 
              As one of UW's largest single video game communities, we cater to both competitive and casual players. 
              We host events such as simple and competitive tournaments, watch parties, coaching workshops, and more! 
              We welcome anyone who would like to play with other gamers from the school to improve or just have a good time. 
              This is the place to come if you're interested in anything Valorant-related.
            </p>
            {/* Social links*/}
            <nav>
              <ul className='hidden lg:inline-flex justify-start items-center gap-5 mt-10 relative z-10'>
                <li>
                  <Link to="https://www.linkedin.com/company/valorant-uw/" target='_blank' rel='noopener noreferrer'>
                      <img src={linkedinIcon} alt="linkedin" className='w-8 h-8 lg:w-10 lg:h-10'/>
                  </Link>
                </li>
                <li>
                  <Link to="https://discord.com/invite/CBGmfamqvk" target='_blank' rel='noopener noreferrer'>
                      <img src={discord} alt="discord" className='w-8 h-8 lg:w-10 lg:h-10'/>
                  </Link>
                </li>
                <li>
                  <Link to="mailto:valorant@uw.edu" target='_blank' rel='noopener noreferrer'>
                      <img src={mailIcon} alt="email" className='w-8 h-8 lg:w-10 lg:h-10'/>
                  </Link>
                </li>
                <li>
                  <Link to="https://www.twitch.tv/wgavalorant" target='_blank' rel='noopener noreferrer'>
                      <img src={twitchIcon} alt="twitch" className='w-8 h-8 lg:w-10 lg:h-10'/>
                  </Link>
                </li>
                <li>
                  <Link to="https://www.instagram.com/valorant_uw/" target='_blank' rel='noopener noreferrer'>
                      <img src={instagramIcon} alt="instagram" className='w-8 h-8 lg:w-10 lg:h-10'/>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          {/* right half: group image */}
          <figure className="p-2.5 w-full lg:w-[50%] outline outline-2 outline-offset-[-2px] outline-stone-200/60">
            <img 
              src={groupPhoto} 
              alt="Valorant club group" 
              className="w-full h-auto lg:h-80 object-cover object-center border-4"
            />
          </figure>
        </div>
        
        {/* Social media links appear below image on mobile */}
        <nav>
          <ul className='flex lg:hidden justify-center sm:items-center gap-5 mt-10 mb-8 relative z-10'>
            <li>
              <Link to="https://www.linkedin.com/company/valorant-uw/" target='_blank' rel='noopener noreferrer'>
                  <img src={linkedinIcon} alt="linkedin" className='w-8 h-8'/>
              </Link>
            </li>
            <li>
              <Link to="https://discord.com/invite/CBGmfamqvk" target='_blank' rel='noopener noreferrer'>
                  <img src={discord} alt="discord" className='w-8 h-8'/>
              </Link>
            </li>
            <li>
              <Link to="mailto:valorant@uw.edu" target='_blank' rel='noopener noreferrer'>
                  <img src={mailIcon} alt="email" className='w-8 h-8'/>
              </Link>
            </li>
            <li>
              <Link to="https://www.twitch.tv/wgavalorant" target='_blank' rel='noopener noreferrer'>
                  <img src={twitchIcon} alt="twitch" className='w-8 h-8'/>
              </Link>
            </li>
            <li>
              <Link to="https://www.instagram.com/valorant_uw/" target='_blank' rel='noopener noreferrer'>
                  <img src={instagramIcon} alt="instagram" className='w-8 h-8'/>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}

function PlaySection({ play }) {

  const [upcomingEvent, setUpcomingEvent] = useState(null);

  useEffect(() => {
    const date = new Date().toISOString()
          
    client.fetch(`*[_type == "events" && formattedDate > $now] | order(_formattedDate asc)[0]`, { now: date })
      .then(data => setUpcomingEvent(data))
      .catch(err => console.log(err));
  }, [])

  return (
    <section 
      id="play"
      className="w-full flex justify-center relative bg-off-white overflow-hidden"
      aria-labelledby="play-section"
    >
      <div className="w-full max-w-[90rem]">
        <img src={dotPattern} alt="play section dot pattern overlay" className="absolute z-0 top-[59px] left-[65px] h-[788px] object-cover object-left"/>
        <div className="w-full flex justify-between items-center lg:items-start lg:flex-row flex-col lg:py-16 lg:px-24 px-6 py-[72px] text-left z-10 gap-5 md:gap-10 lg:gap-0">
          {/* Left half of section */}
          <div className="lg:h-full flex flex-col w-[85%] lg:w-[50%] lg:mr-12 flex-shrink-0 gap-5 lg:gap-0">
            {/* Section header */}
            <div className="flex flex-col lg:gap-4 gap-2">
              <h2 className="text-left text-5xl lg:text-7xl text-accent font-normal font-anton-sc uppercase leading-tight">
                Ways to Play
              </h2>
              <h3 className="uppercase font-bold text-2xl text-lavender font-dinish">
                Events & More
              </h3>
            </div>
            {/* Three info lines */}
            <ul className="divide-y-2 divide-accent flex flex-grow flex-col justify-center text-accent-dark whitespace-nowrap pt-12">
              {/* Play line */}
              <li className="flex items-center py-6">
                <div className="flex items-center md:w-1/2 gap-5 lg:gap-7 mr-6 md:mr-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" fill="none" className="w-9 h-9 lg:w-14 lg:h-14">
                    <path d="M8 8L24.6667 53L33 34.1377L53 28.2096L8 8Z" stroke="#3B0361" stroke-width="3" stroke-linejoin="round"/>
                  </svg>
                  <h4 className="uppercase font-bold font-dinish text-3xl lg:text-[40px] hidden md:block">Play</h4>
                </div>
                <div className="flex flex-col md:w-1/2 text-base lg:text-xl gap-2.5">
                  <h4 className="uppercase font-bold font-dinish text-3xl md:hidden">Play</h4>
                  <div className="flex flex-row items-center gap-2">
                    <p>Tournaments</p> 
                    <div className=" w-1 h-1 bg-accent-dark flex-shrink-0"/>
                    <p>10-Mans</p>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <p>Esports</p> 
                    <div className=" w-1 h-1 bg-accent-dark flex-shrink-0"/>
                    <p>Looking for groups</p>
                  </div>
                </div>
              </li>
              {/* Train line */}
              <li className="flex items-center py-6">
                <div className="flex items-center md:w-1/2 gap-5 lg:gap-7 mr-6 md:mr-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" fill="none" className="w-9 h-9 lg:w-14 lg:h-14">
                    <path d="M51 28.5H42M15 28.5H6M28.5 15V6M28.5 51V42M46.5 28.5C46.5 38.4411 38.4411 46.5 28.5 46.5C18.5589 46.5 10.5 38.4411 10.5 28.5C10.5 18.5589 18.5589 10.5 28.5 10.5C38.4411 10.5 46.5 18.5589 46.5 28.5ZM35.25 28.5C35.25 32.2279 32.2279 35.25 28.5 35.25C24.7721 35.25 21.75 32.2279 21.75 28.5C21.75 24.7721 24.7721 21.75 28.5 21.75C32.2279 21.75 35.25 24.7721 35.25 28.5Z" stroke="#3B0361" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <h4 className="uppercase font-bold font-dinish text-3xl lg:text-[40px] hidden md:block">Train</h4>
                </div>
                <div className="flex flex-col md:w-1/2 text-base lg:text-xl gap-2.5">
                  <h4 className="uppercase font-bold font-dinish text-3xl md:hidden">Train</h4>
                  <div className="flex flex-row items-center gap-2">
                    <p>Workshops</p> 
                    <div className=" w-1 h-1 bg-accent-dark flex-shrink-0"/>
                    <p>VOD review</p>
                  </div>
                </div>
              </li>
              {/* Bond line */}
              <div className="flex items-center py-6">
                <div className="flex items-center md:w-1/2 gap-5 lg:gap-7 mr-6 md:mr-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" fill="none" className="w-9 h-9 lg:w-14 lg:h-14">
                    <path d="M28.5 6C34.1279 12.1613 37.3262 20.1571 37.5 28.5C37.3262 36.8429 34.1279 44.8387 28.5 51M28.5 6C22.8721 12.1613 19.6738 20.1571 19.5 28.5C19.6738 36.8429 22.8721 44.8387 28.5 51M28.5 6C16.0736 6 6 16.0736 6 28.5C6 40.9264 16.0736 51 28.5 51M28.5 6C40.9264 6 51 16.0736 51 28.5C51 40.9264 40.9264 51 28.5 51M7.12504 21.75H49.875M7.125 35.25H49.875" stroke="#3B0361" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <h4 className="uppercase font-bold font-dinish text-3xl lg:text-[40px] hidden md:block">Bond</h4>
                </div>
                <div className="flex flex-col md:w-1/2 text-base lg:text-xl gap-2.5">
                  <h4 className="uppercase font-bold font-dinish text-3xl md:hidden">Bond</h4>
                  <div className="flex flex-row items-center gap-2">
                    <p>Socials</p> 
                    <div className=" w-1 h-1 bg-accent-dark flex-shrink-0"/>
                    <p>Watch parties</p>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <p>Tournament Pick'Ems</p> 
                  </div>
                </div>
              </div>
            </ul>
          </div>
          {/* Right half of section */}
          <div className="flex flex-col lg:gap-8 gap-5 font-dinish lg:mx-6 w-[85%] md:w-[410px] lg:w-auto">
            <h3 className="uppercase font-bold text-3xl lg:text-[40px] text-accent-dark leading-none">Upcoming Events</h3>
            {/* Next event box - text and image to be replaced with database events */}
            <div className="md:w-full lg:w-[494px] bg-[#E2DCE8] border-2 border-lavender p-5 gap-5 flex flex-col">
              <img src={upcomingEvent?.img ? urlFor(upcomingEvent.img).auto('format').url() : Placeholder} alt={upcomingEvent?.altDescription ?? 'No upcoming events'} className="w-full h-auto block bg-white overflow-hidden object-cover object-top" />
              <div>
                <div className="font-extrabold text-xl lg:text-2xl text-accent uppercase">{upcomingEvent?.title ?? 'No upcoming events'}</div>
                <p className="text-base lg:text-xl">{upcomingEvent?.timeDescription ?? ''}</p>
              </div>
            </div>
            {/* Button to events page */}
            <Link to="/events">
              <div className="group border-accent hover:border-lavender border-2 p-[2px] w-full lg:w-[334px] relative z-1">
                <div className="p-2 bg-accent group-hover:bg-lavender text-off-white uppercase font-bold text-2xl text-center py-2.5">View More Events</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function OfficersSection({ officers }) {

  const [president, setPresident] = useState(null);
  const [officersList, setOfficersList] = useState(null)

  useEffect(() => {
    const date = new Date().toISOString()
          
    client.fetch(`*[_type == "teams" && name match "President"]`, { now: date })
      .then(data => setPresident(data[0].officers[0]))
      .catch(err => console.log(err));
    
    client.fetch(`*[_type == "teams" && name match "Marketing + Outreach"]`, { now: date })
      .then(data => {
        console.log(data)
        setOfficersList(data[0].officers)
      })
      .catch(err => console.log(err));
  }, [])

  console.log(president);
  console.log(officersList);

  return (
    <section
    id="officers" 
    className="w-full flex justify-center relative bg-lavender-light overflow-hidden"
    >
      <div className="relative w-full max-w-[90rem] flex justify-center">
        <img src={officersBackground} alt="Officers section background. Large text saying 'lead'." className="absolute z-20 w-[1440px] h-[568px] object-cover object-left"/>
        <img src={dotPattern} alt="play section dot pattern overlay" className="absolute z-0 top-[58px] left-[71px] w-[942px] h-[788px] object-cover object-left opacity-60"/>
        <div className="w-full lg:h-[568px] lg:px-24 lg:py-24 px-6 py-[72px] z-30 flex flex-col items-center lg:flex-row lg:justify-between text-left gap-12 lg:gap-14">
          {/* Left section */}
          <div className="flex flex-col lg:justify-between gap-9 lg:gap-0 h-full w-[85%] md:w-[410px] lg:w-auto">
            {/* Info text */}
            <div className="flex flex-col gap-3">
              <h2 className="text-left text-5xl lg:text-7xl text-accent font-normal font-anton-sc uppercase leading-tight">Officers</h2>
              <h3 className="uppercase font-bold text-2xl text-accent-dark font-dinish">Who are we?</h3>
              <p className="text-base lg:text-xl text-accent-dark font-medium">Our officers are the backbone of our organization, managing the club, hosting events, and creating a space that anyone feels welcome to join.</p>
            </div>
            {/* Officers page button */}
            <Link to="/officers">
              <div className="group border-accent hover:border-lavender border-2 p-[2px] lg:w-[334px] w-full">
                <div className="p-2 bg-accent group-hover:bg-lavender text-off-white uppercase font-bold text-2xl text-center py-2.5">Meet the Squad</div>
              </div>
            </Link>
          </div>
          {/* Three officer images */}
          <ul className="relative h-[216px] md:h-[289px] w-[297px] md:w-[410px] lg:h-full lg:w-[617px] flex-shrink-0 lg:mx-6">
            <li>
              <figure className="absolute border-lavender border-2 p-1 lg:p-[10px] box-border overflow-hidden z-10 top-0 left-0">
                <img src={officersList?.[0]?.image ? urlFor(officersList?.[0]?.image).auto('format').url() : Placeholder} alt={officersList?.[0]?.name ? `Portrait of ${officersList?.[0]?.name}` : 'Placeholder image'} className="object-cover object-center h-[120px] md:h-[166px] lg:h-[232px] w-[120px] md:w-[166px] lg:w-[232px]" />
              </figure>
            </li>
            <li>
              <figure className="absolute border-lavender border-2 p-1 lg:p-[10px] box-border overflow-hidden z-20 left-[84px] md:left-[105px] lg:left-[166px] bottom-0">
                <img src={president?.image ? urlFor(president.image).auto('format').url() : Placeholder} alt={president?.name ? `Portrait of ${president.name}` : 'Placeholder image'} className="object-cover object-center h-[120px] md:h-[166px] lg:h-[232px] w-[120px] md:w-[166px] lg:w-[232px]" />
              </figure>
            </li>
            <li>
              <figure className="absolute border-lavender border-2 p-1 lg:p-[10px] box-border overflow-hidden z-10 top-0 right-0">
                <img src={officersList?.[1]?.image ? urlFor(officersList?.[1]?.image).auto('format').url() : Placeholder} alt={officersList?.[1]?.name ? `Portrait of ${officersList?.[1]?.name}` : 'Placeholder image'} className="object-cover object-center h-[120px] md:h-[166px] lg:h-[232px] w-[120px] md:w-[166px] lg:w-[232px]" />
              </figure>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function SponsorsSection({ sponsors }) {
  const OPTIONS = {loop: true, draggable: false}
const SLIDES = [eg,ifinikey,redbull,tsm,msi,com,razer]
  return (
      <section 
        id="sponsors"
        className="w-full min-h-[550px] py-24 bg-off-white overflow-hidden relative flex flex-col items-center">
        <div class="w-full px-6 flex flex-col justify-start items-start gap-3.5 max-w-[90rem] px-24">
          <h2 className="text-left text-5xl lg:text-7xl text-accent font-normal font-anton-sc uppercase leading-tight">
            Sponsors
          </h2>
          <h3 className="text-left text-xl lg:text-2xl text-lavender font-bold font-['DINish'] uppercase">
            Current and Past 
          </h3>
        </div>
        <div className="w-full my-8">
        <EmblaCarousel slides={SLIDES} options={OPTIONS} />
        </div>
    </section>
  );    
}

export default Home;