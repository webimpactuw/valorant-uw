import OfficerPortrait from '../components/officer/OfficerPortrait.js';
import OfficerTeamContainer from '../components/officer/OfficerTeamContainer.js';
import AnshChavda from '../assets/officer_portraits/AnshChavda.jpg';
import DavidPham from '../assets/officer_portraits/DavidPham.jpg';
import DianeLazo from '../assets/officer_portraits/DianeLazo.jpg';
import ElaineHsu from '../assets/officer_portraits/ElaineHsu.jpg';
import JakeWonChung from '../assets/officer_portraits/JakeChung.jpg';
import JostenTwist from '../assets/officer_portraits/JostenTwist.jpg';
import MinaTrice from '../assets/officer_portraits/MinaTrice.jpg';
import NicoleErinWang from '../assets/officer_portraits/NicoleWang.jpg';
import StevenTeng from '../assets/officer_portraits/SteveTeng.jpg';
import Clove from '../assets/operator_portraits/Clove.png';
import Cypher from '../assets/operator_portraits/Cypher.png';
import Gekko from '../assets/operator_portraits/Gekko.png';
import Jett from '../assets/operator_portraits/Jett.png';
import Killjoy from '../assets/operator_portraits/Killjoy.png';
import Omen from '../assets/operator_portraits/Omen.png';
import Sova from '../assets/operator_portraits/Sova.png';
import Placeholder from '../assets/officer_portraits/Placeholder.png';
import { useEffect } from 'react';

const marketingOfficerList = [
  {
    image: NicoleErinWang,
    operatorImage: Gekko,
    name: "Nicole Wang",
    operatorName: "Gekko",
    role: "Director",
    gradYear: "2027"
  },
  {
    image: AnshChavda,
    operatorImage: Jett,
    name: "Ansh Chavda",
    operatorName: "Jett",
    role: "Finance",
    gradYear: "2027"
  },
  {
    image: DianeLazo,
    operatorImage: Omen,
    name: "Diane Lazo",
    operatorName: "Omen",
    role: "Social Media",
    gradYear: "2027"
  }
]

const esportsOfficerList = [
  {
    image: ElaineHsu,
    operatorImage: Killjoy,
    name: "Elaine Hsu",
    operatorName: "Killjoy",
    role: "Director",
    gradYear: "2026"
  },
  {
    image: MinaTrice,
    operatorImage: Cypher,
    name: "Mina Trice",
    operatorName: "Cypher",
    role: "Event Org",
    gradYear: "2025"
  },
  {
    image: StevenTeng,
    operatorImage: Cypher,
    name: "Steve Teng",
    operatorName: "Cypher",
    role: "Event Org",
    gradYear: "2028"
  },
  {
    image: Placeholder,
    operatorImage: Jett,
    name: "Kim Nguyen",
    operatorName: "Jett",
    role: "Tournaments",
    gradYear: "2026"
  },
  {
    image: JostenTwist,
    operatorImage: Sova,
    name: "Josten Twist",
    operatorName: "Sova",
    role: "Esports",
    gradYear: "2028",
  },
  {
    image: JakeWonChung,
    operatorImage: Clove,
    name: "Jake Chung",
    operatorName: "Clove",
    role: "Esports",
    gradYear: "2026"
  }
]

function Officers() {
  useEffect(() => {
    window.scrollTo({top: 0, behavior: "instant" });
}, []);
    return (
      <>
        <div className="relative overflow-hidden max-w-full bg-contain bg-repeat" style={{ backgroundImage: "url('/dot_overlay.png')" }}>
          <div className="md:px-[6vw] px-[10vw] xl:py-[30vh] py-[10vh] bg-contain">
            <section className="flex w-full md:flex-row flex-col">
              <div className="w-4/5 text-left my-auto">
                <h1 className="text-[#4c0080] md:text-9xl text-8xl leading-[1.2] font-normal uppercase font-anton-sc">Officers</h1>
                <h2 className="font-dinish text-2xl text-[#4d4d4d] font-normal uppercase">2024-2025 Team</h2>
              </div>
              <div className="md:w-2/5 md:py-0 flex relative w-full py-[4em]">
                <h3 className="president-subtitle text-black text-6xl text-left pb-[1.5em] uppercase font-anton-sc md:pr-[1.25rem] pr-[1rem]" style={{ writingMode: "vertical-rl" }}>President</h3>
                <OfficerPortrait 
                  image={DavidPham} 
                  operatorImage={Omen} 
                  name="David Pham" 
                  operatorName = "Omen" 
                  role="President" 
                  gradYear="2025" 
                />
              </div>
            </section>
            <OfficerTeamContainer teamName="Marketing + Outreach" officers={marketingOfficerList} />
            <OfficerTeamContainer teamName="Esports + Events" officers={esportsOfficerList} />
          </div>
          <h1 className="absolute top-[-20vh] left-0 md:right-[-35vw] max-sm:top-[-10vh] md:text-[35vw] text-[70vh] z-[-2] font-bold" aria-hidden = "true" style={{
            color: 'white',
            WebkitTextStroke: '3px rgba(152, 134, 208, 0.2)',
            textTransform: 'uppercase',
          }}>Lead</h1>
        </div>
      </>
    );
}

export default Officers;