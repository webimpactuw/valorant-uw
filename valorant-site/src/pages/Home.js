import { Link } from "react-router-dom";
import './Home.css';

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
    <div className="section">Valorant at UW</div>
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