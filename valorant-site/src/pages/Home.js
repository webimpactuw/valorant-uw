import { Link } from "react-router-dom";
import './Home.css';
import '../index.css';
import scrollArrow from '../assets/scroll-arrow-icon.svg' /*scroll icon for header*/
import Background from "../assets/join_a_game_bg.jpeg" /*background photo for join*/
import discord from '../assets/Discord-Symbol-White.svg' /*discord icon for join*/

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
    <section className="relative h-screen flex items-center" style={{ backgroundColor: '#F4F1EE' }}>
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center gap-10">

          {/* nav menu */}
          <nav className="w-[275px] h-[350px] order-1">
            <ul className="h-full flex flex-col items-end justify-center space-y-4">
              <li className="font-DINish text-4xl">
                <a href="#join" className="text-black no-underline" class="tracking-[-0.03em]" >JOIN A GAME</a>
              </li>
              <li className="font-DINish text-4xl">
                <a href="#about" className="text-black no-underline" class="tracking-[-0.03em]" >ABOUT</a>
              </li>
              <li className="font-DINish text-4xl">
                <a href="#play" className="text-black no-underline" class="tracking-[-0.03em]">WAYS TO PLAY</a>
              </li>
              <li className="font-DINish text-4xl">
                <a href="#officers" className="text-black no-underline" class="tracking-[-0.03em]">OFFICERS</a>
              </li>
              <li className="font-DINish text-4xl">
                <a href="#sponsors" className="text-black no-underline" class="tracking-[-0.03em]">SPONSORS</a>
              </li>
            </ul>
          </nav>

          {/* title */}
          <h1 className="h-[270px] text-[140px] leading-none font-black m-0 order-2 text-left font-anton-sc" style={{color: "#4C0080"}}>
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
          className="w-30 h-30"
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
    <div className="w-[1440px] h-[768px] relative" style={{
        backgroundImage: "url(" + Background +")",
        backgroundSize: "100%",
        backgroundColor: 'rgba(0,0,0,.6)',
        backgroundBlendMode: 'darken',
        }}>
    <div className="w-[1497px] h-[770px] left-[-37px] top-0 absolute bg-purple-950/20" />
    <div className="w-[525px] h-16 left-[457px] top-[299px] absolute text-center justify-start text-7xl font-normal font-['Anton_SC'] uppercase leading-[72px]" style={{color: "#E9CB88"}}>JOIN A GAME</div>
    <div className="w-[505px] h-20 left-[468px] top-[397px] absolute bg-zinc-300/0 outline outline-2 outline-offset-[-1px] outline-white" />
    <Link to="https://discord.com/invite/CBGmfamqvk" target="_blank" rel="noopener noreferrer">
      <div data-property-1="Default" className="w-[494px] px-24 py-4 left-[473px] top-[403px] absolute bg-button-fill inline-flex justify-center items-center gap-5" style={{backgroundColor: "#4C0080"}}>
          <div className="w-10 h-7 relative overflow-hidden">
              <div className="w-10 h-7 left-0 top-0 absolute"/><img src={discord} alt="discord" className="w-10 h-7"/>
          </div>
          <div className="justify-start text-text-alt text-3xl font-extrabold font-['DINish'] text-white uppercase">Valorant @ UW</div>
      </div>
    </Link>
</div>
    </section>
  );
}

function AboutSection() {
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

function PlaySection() {
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

function OfficersSection() {
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

function SponsorsSection() {
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