import { Link } from "react-router-dom";
import './Home.css';
import '../index.css';

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
  return (
    <div className="h-screen flex items-center" style={{ backgroundColor: '#F4F1EE' }}>
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
    </div>
  );
}

function JoinSection() {
  return (
    <section
      id="join"
      className="w-full flex justify-center"
      style={{ backgroundColor: '#FFFFFF'}}
    >
    <div className="
          w-[1440px]
          h-[768px]
        ">About the Club</div>
    </section>
  );
}

function AboutSection() {
  return (
    <div
      id="about"
      className="w-full flex justify-center"
      style={{ backgroundColor: '#3B0361'}}
    >
      <div className="
            w-[1440px]
            h-[608px]
          ">About the Club</div>
    </div>
  );
}

function PlaySection() {
  return (
    <div className="section">
      <div>Ways to Play</div>
      <Link to="/events">
        <div>View More Events</div>
      </Link>
    </div>
  );
}

function OfficersSection() {
  return (
    <div className="section">
      <div>Officers</div>
      <Link to="/officers">
        <div>Meet the Squad</div>
      </Link>
    </div>
  );
}

function SponsorsSection() {
  return (
    <div className="section">Sponsors</div>
  );    
}

export default Home;