import { Link } from "react-router-dom";
import './Home.css';
import '../index.css';

function Home() {
    return (
      <div className="home">
        <HeaderSection />
        <AboutSection />
        <PlaySection />
        <OfficersSection />
        <SponsorsSection />
      </div>
    );
}

function HeaderSection() {
  return (
    <div className="h-screen flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center gap-10">
          {/* nav menu */}
          <nav className="w-[275px] relative h-[350px] order-1">
            <ul className="list-none p-0 m-0">
              <li className="absolute right-0 text-right w-full font-black text-4xl" style={{top: "0px"}}>
                <a href="#join" className="text-black no-underline">JOIN A GAME</a>
              </li>
              <li className="absolute right-0 text-right w-full font-black text-4xl" style={{top: "70px"}}>
                <a href="#about" className="text-black no-underline">ABOUT</a>
              </li>
              <li className="absolute right-0 text-right w-full font-black text-4xl" style={{top: "140px"}}>
                <a href="#play" className="text-black no-underline">WAYS TO PLAY</a>
              </li>
              <li className="absolute right-0 text-right w-full font-black text-4xl" style={{top: "210px"}}>
                <a href="#officers" className="text-black no-underline">OFFICERS</a>
              </li>
              <li className="absolute right-0 text-right w-full font-black text-4xl" style={{top: "280px"}}>
                <a href="#sponsors" className="text-black no-underline">SPONSORS</a>
              </li>
            </ul>
          </nav>
          
          {/* title */}
          <h1 className="text-[140px] leading-none text-purple-900 font-black m-0 order-2 text-left font-anton">
            VALORANT<br />AT UW
          </h1>
        </div>
      </div>
    </div>
    
  );
}

function AboutSection() {
  return (
    <div className="section">About the Club</div>
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