import { Link } from "react-router-dom";
import './Home.css';

function Home() {
    return (
      <div className="home">
        <Link to="/events">
          <h1>Events</h1>
        </Link>
        <Link to="/officers">
          <h1>Officers</h1>
        </Link>
      </div>
    );
}

export default Home;