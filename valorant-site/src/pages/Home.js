import { Link } from "react-router-dom";
import './Home.css';
import '../index.css';
<<<<<<< HEAD
import scrollArrow from '../assets/scroll-arrow-icon.svg'

=======
import Background from "../assets/join_a_game_bg.jpeg"
>>>>>>> 18923031cea9b5f5ba6cb6161d8cd70cf52ef90b
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
      {/* ← Your down‑arrow SVG at the bottom‑center */}
      <button
        onClick={scrollToJoin}
        aria-label="Scroll to join section"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 focus:outline-none"
      >
        <img
          src={scrollArrow}
          alt=""
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
      style={{backgroundImage: "url(" + Background +")",
              backgroundSize: "100%",
              backgroundColor: 'rgba(0,0,0,.6)',
              backgroundBlendMode: 'darken',
      }}
    >
    <div className="
          w-[1440px]
          h-[768px]
<<<<<<< HEAD
        ">Join</div>
=======
        ">Join Section</div>
        
>>>>>>> 18923031cea9b5f5ba6cb6161d8cd70cf52ef90b
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