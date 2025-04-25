import { Link } from "react-router-dom";
import './Home.css';
import '../index.css';
import scrollArrow from '../assets/scroll-arrow-icon.svg' /*scroll icon for header*/
import Background from "../assets/join_a_game_bg.jpeg" /*background photo for join*/
import discord from '../assets/Discord-Symbol-White.svg' /*discord icon for join*/
import dotPattern from '../assets/dot_overlay.svg' /*dot pattern for header, about, play, officers*/

function Home() {
    return (
      <div className="home">
        <HeaderSection />
        <JoinSection />
        <AboutSection />
        <PlaySection />
        <OfficersSection />
        <SponsorsSection />
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
          <nav className="w-[275px] h-[350px] order-1">
            <ul className="h-full flex flex-col items-end justify-center space-y-4">
              <li className="font-DINish text-4xl relative group">
                <a href="#join" className="text-black no-underline tracking-[-0.03em] group-hover:text-[#D6CCF5] transition-colors duration-300" >JOIN A GAME</a>
              </li>
              <li className="font-DINish text-4xl relative group">
                <a href="#about" className="text-black no-underline tracking-[-0.03em] group-hover:text-[#D6CCF5] transition-colors duration-300" >ABOUT</a>
              </li>
              <li className="font-DINish text-4xl relative group">
                <a href="#play" className="text-black no-underline tracking-[-0.03em] group-hover:text-[#D6CCF5] transition-colors duration-300">WAYS TO PLAY</a>
              </li>
              <li className="font-DINish text-4xl relative group">
                <a href="#officers" className="text-black no-underline tracking-[-0.03em] group-hover:text-[#D6CCF5] transition-colors duration-300">OFFICERS</a>
              </li>
              <li className="font-DINish text-4xl relative group">
                <a href="#sponsors" className="text-black no-underline tracking-[-0.03em] group-hover:text-[#D6CCF5] transition-colors duration-300">SPONSORS</a>
              </li>
            </ul>
          </nav>

          {/* title */}
          <h1 className="h-[270px] text-[140px] leading-none font-black m-0 order-2 text-left font-anton-sc z-20" style={{color: "#4C0080"}}>
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
          className="w-30px h-30px z-20"
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
    <div className="w-[1440px] h-[768px] relative" style={{
        backgroundImage: "url(" + Background +")",
        backgroundSize: "100%",
        backgroundColor: 'rgba(0,0,0,.6)',
        backgroundBlendMode: 'darken',
        }}>
    <div className="w-[1497px] h-[770px] left-[-37px] top-0 absolute bg-purple-950/20" />
    <div className="w-[525px] h-16 left-[457px] top-[299px] absolute text-center justify-start text-7xl font-normal font-['Anton_SC'] uppercase leading-[72px]" style={{color: "#E9CB88"}}>
      JOIN A GAME
    </div>
    {/* outline surrounding button */}
    <div className="w-[505px] h-[83px] left-[468px] top-[397px] absolute bg-zinc-300/0 outline outline-2 outline-offset-[-1px] outline-white" />
    {/* button with discord link*/}
    <Link to="https://discord.com/invite/CBGmfamqvk" target="_blank" rel="noopener noreferrer" className="block w-full">
      <div 
        data-property-1="Default" 
        className="w-[494px] px-24 py-4 left-[473px] top-[403px] absolute bg-button-fill inline-flex justify-center items-center gap-5 group border-2 border-transparent hover:border-white transition-colors duration-300" 
        style={{backgroundColor: "#4C0080"}}
      >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
          <div className="w-10 h-7 relative overflow-hidden">
              <div className="w-10 h-7 left-0 top-0 absolute"/>
              <img src={discord} alt="discord" className="w-10 h-7"/>
          </div>
          <div className="justify-start text-text-alt text-3xl font-extrabold font-['DINish'] text-white uppercase">
            Valorant @ UW
          </div>
      </div>
    </Link>
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
      <div className="
        w-[1440px]
        h-[715px]
        ">Ways to Play</div>
      <Link to="/events">
        <div>View More Events</div>
      </Link>
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