import { Link } from "react-router-dom";
import './Home.css';

function Home() {
    return (
      <div className="home">
        <HeaderSection />
        <AboutSection id="about"/>
        <PlaySection id="play"/>
        <OfficersSection id="officers"/>
        <SponsorsSection id="sponsors"/>
      </div>
    );
}

function HeaderSection() {
  return (
    <div className="section">Valorant at UW 
      <div className="header-links">
        <a href="#join" className="header-link">Join a Game</a>
        <a href="#about" className="header-link">About</a>
        <a href="#play" className="header-link">Ways to Play</a>
        <a href="#officers" className="header-link">Officers</a>
        <a href="#sponsors" className="header-link">Sponsors</a>
      </div>
    </div>
  );  
}

function AboutSection({ about }) {
  return (
    <div id={about} className="section">About the Club</div>
  );
}

function PlaySection({ play }) {
  return (
    <div id={play} className="section">
      <div>Ways to Play</div>
      <Link to="/events">
        <div>View More Events</div>
      </Link>
    </div>
  );
}

function OfficersSection({ officers }) {
  return (
    <div id={officers} className="section">
      <div>Officers</div>
      <Link to="/officers">
        <div>Meet the Squad</div>
      </Link>
    </div>
  );
}

function SponsorsSection({ sponsors }) {
  return (
    <div id={sponsors} className="section">Sponsors</div>
  );    
}

export default Home;