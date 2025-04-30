import { Link } from "react-router-dom";
import '../index.css'; /*import tailwind css*/
import './Home.css';
import StickyNavBar from "../components/sticky-nav"; /*sticky nav bar*/
import scrollArrow from '../assets/scroll-arrow-icon.svg' /*scroll icon for header*/
import Background from "../assets/join_a_game_bg.jpeg" /*background photo for join*/
import discord from '../assets/Discord-Symbol-White.svg' /*discord icon for join*/
import dotPattern from '../assets/dot_overlay.svg' /*dot pattern for header, about, play, officers*/

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
    /*overlay design*/
    <section className="relative h-screen flex items-center" style={{ backgroundColor: '#F4F1EE' }}>
      <div 
        className="absolute w-[1528px] h-[500px] left-[-279px] bottom-[-121px] font-DINish font-black text-[500px] leading-[500px] uppercase z-0"
        style={{
          color: '#F4F1EE',
          WebkitTextStroke: '3px rgba(121, 105, 81, 0.1)',
          textTransform: 'uppercase',
        }}
      >
        AT UW
      </div>
      <div 
        className="absolute w-[1239px] h-[500px] left-[367px] top-[-162px] font-DINish font-black text-[500px] leading-[500px] uppercase z-0"
        style={{
          color: '#F4F1EE',
          WebkitTextStroke: '3px rgba(121, 105, 81, 0.1)',
          textTransform: 'uppercase',
        }}
      >
        VALO
      </div>
      <img
        src={dotPattern}
        alt="dot pattern overlay"
        className="
          absolute
          w-[942px]
          h-[675px]
          left-[67px]
          top-[53px]
          pointer-events-none
          z-10
        "
      />

      <div className="w-full max-w-7xl mx-auto px-4 z-10">
        <div className="flex justify-center items-center gap-10">

          {/* nav menu */}
          <nav className="w-[275px] h-center order-1">
            <ul className="h-full flex flex-col items-end justify-center space-y-4">
              <li className="font-DINish text-2xl md:text-3xl lg:text-4xl relative group">
                <a href="#join" className="text-black no-underline tracking-[-0.03em] group-hover:text-[#D6CCF5] transition-colors duration-300" >JOIN A GAME</a>
              </li>
              <li className="font-DINish text-2xl md:text-3xl lg:text-4xl relative group">
                <a href="#about" className="text-black no-underline tracking-[-0.03em] group-hover:text-[#D6CCF5] transition-colors duration-300" >ABOUT</a>
              </li>
              <li className="font-DINish text-2xl md:text-3xl lg:text-4xl relative group">
                <a href="#play" className="text-black no-underline tracking-[-0.03em] group-hover:text-[#D6CCF5] transition-colors duration-300">WAYS TO PLAY</a>
              </li>
              <li className="font-DINish text-2xl md:text-3xl lg:text-4xl relative group">
                <a href="#officers" className="text-black no-underline tracking-[-0.03em] group-hover:text-[#D6CCF5] transition-colors duration-300">OFFICERS</a>
              </li>
              <li className="font-DINish text-2xl md:text-3xl lg:text-4xl relative group">
                <a href="#sponsors" className="text-black no-underline tracking-[-0.03em] group-hover:text-[#D6CCF5] transition-colors duration-300">SPONSORS</a>
              </li>
            </ul>
          </nav>

          {/* title */}
          <h1 className="h-center text-[7rem] md:text-[7.75rem] lg:text-[8.25rem] leading-none font-black m-0 order-2 text-left font-anton-sc z-20" style={{color: "#4C0080"}}>
            VALORANT<br />AT UW
          </h1>
        </div>
      </div>
      {/* scroll arrow */}
      <button
        onClick={scrollToJoin}
        aria-label="Scroll to Join Section"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 focus:outline-none"
      >
        <img
          src={scrollArrow}
          alt="scroll down"
          className="w-50 h-50 z-20"
        />
      </button>
    </section>
  );
}

function JoinSection() {
  return (
    <section
      id="join"
      className="w-full flex justify-center"
    >
    {/* background image for join section */}
    <div className="w-full relative bg-cover bg-center bg-no-repeat min-h-[500px] md:min-h-[600px] lg:min-h-[768px]" style={{
        backgroundImage: "url(" + Background +")",
        backgroundSize: "cover",
        backgroundColor: 'rgba(0,0,0,.6)',
        backgroundBlendMode: 'darken',
        }}>
      <div className="absolute inset-0 bg-purple-950/20 z-5"/>
      <div className="flex flex-col items-center justify-center h-full py-16 z-10">
        <div className="text-center text-4xl md:text-5xl lg:text-7xl font-normal font-['Anton_SC'] uppercase leading-tight mb-8" style={{
          color: "#E9CB88"}}>
          JOIN A GAME
        </div>
        <div className="relative w-full flex justify-center">
          <div className="relative w-full max-w-xs md:max-w-md lg:w-[505px]">
            {/* outline surrounding button */}
            <div className="absolute -inset-1.5 bg-zinc-300/0 outline outline-2 outline-offset-[-1px] outline-white/60"/>
            {/* button with discord link */}
            <Link to="https://discord.com/invite/CBGmfamqvk" target="_blank" rel="noopener noreferrer" className="block w-full">
              <div 
                data-property-1="Default" 
                className="relative w-full h-[60px] md:h-[70px] lg:h-[83px] md:px-8 lg:px-24 px-4 py-4 bg-button-fill flex justify-center items-center gap-3 md:gap-5 group border-2 border-transparent hover:border-white transition-colors duration-300" 
                style={{
                  backgroundColor: "#4C0080"}}
              >
                  {/* white overlay when hovering */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none z-20"/>
                  {/* discord icon */}
                  <div className="w-10 h-7 relative overflow-hidden flex-shrink-0">
                      <div className="w-10 h-7 left-0 top-0 absolute"/>
                      <img src={discord} alt="discord" className="w-full h-full"/>
                  </div>
                  <span className="whitespace-nowrap text-text-alt text-xl md:text-2xl lg:text-3xl font-extrabold font-['DINish'] text-white uppercase">
                    VALORANT @ UW
                  </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}

function AboutSection({ about }) {
  return (
    <section
      id="about"
      className="w-full flex justify-center"
      style={{ backgroundColor: '#3B0361'}}
    >
      <div className="
        w-[1440px]
        h-[608px]
        ">About the Club</div>
    </section>
  );
}

function PlaySection({ play }) {
  return (
    <section 
      id="play"
      className="w-full flex justify-center"
    >
      <div className="w-[1440px] h-[715px] grid grid-cols-2 p-24 text-left gap-48">
        <div className="h-full flex flex-col">
          <div className="text-left text-4xl md:text-5xl lg:text-7xl font-normal font-['Anton_SC'] uppercase leading-tight mb-4">
            Ways to Play
          </div>
          <div className="uppercase font-bold text-2xl">
            Events & More
          </div>
          <div className="divide-y-2 flex flex-grow flex-col justify-center">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                <path d="M8 8L24.6667 53L33 34.1377L53 28.2096L8 8Z" stroke="#3B0361" stroke-width="3" stroke-linejoin="round"/>
              </svg>
              <div>Play</div>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                <path d="M51 28.5H42M15 28.5H6M28.5 15V6M28.5 51V42M46.5 28.5C46.5 38.4411 38.4411 46.5 28.5 46.5C18.5589 46.5 10.5 38.4411 10.5 28.5C10.5 18.5589 18.5589 10.5 28.5 10.5C38.4411 10.5 46.5 18.5589 46.5 28.5ZM35.25 28.5C35.25 32.2279 32.2279 35.25 28.5 35.25C24.7721 35.25 21.75 32.2279 21.75 28.5C21.75 24.7721 24.7721 21.75 28.5 21.75C32.2279 21.75 35.25 24.7721 35.25 28.5Z" stroke="#3B0361" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div>Train</div>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                <path d="M28.5 6C34.1279 12.1613 37.3262 20.1571 37.5 28.5C37.3262 36.8429 34.1279 44.8387 28.5 51M28.5 6C22.8721 12.1613 19.6738 20.1571 19.5 28.5C19.6738 36.8429 22.8721 44.8387 28.5 51M28.5 6C16.0736 6 6 16.0736 6 28.5C6 40.9264 16.0736 51 28.5 51M28.5 6C40.9264 6 51 16.0736 51 28.5C51 40.9264 40.9264 51 28.5 51M7.12504 21.75H49.875M7.125 35.25H49.875" stroke="#3B0361" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div>Bond</div>
            </div>
          </div>
        </div>
        <div>
          <Link to="/events">
            <div>View More Events</div>
          </Link>
        </div>
      </div>
      
    </section>
  );
}

function OfficersSection({ officers }) {
  return (
    <section
    id="officers" 
    className="w-full flex justify-center" style={{backgroundColor: "#E9CB88"}}
    >
      <div className="
      w-[1440px]
      h-[568px]
      ">Officers</div>
      <Link to="/officers">
        <div>Meet the Squad</div>
      </Link>
    </section>
  );
}

function SponsorsSection({ sponsors }) {
  return (
    <section 
    id="sponsors"
    className="w-full flex justify-center">
    <div className="
    w-[1440px] 
    h-[466px]"
    >Sponsors</div>
    </section>
  );    
}

export default Home;