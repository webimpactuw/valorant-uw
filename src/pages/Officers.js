import OfficerPortrait from '../components/officer/OfficerPortrait.js';
import OfficerTeamContainer from '../components/officer/OfficerTeamContainer.js';
import { useEffect, useState } from 'react';
import dotOverlay from '../assets/dot_overlay.svg'
import { client } from '../assets/sanityClient.js'



function Officers() {
  const [president, setPresident] = useState();
  const [teams, setTeams] = useState();


  useEffect(() => {
    window.scrollTo({top: 0, behavior: "instant" });

    client.fetch(`*[_type == "teams" && name match "President"]`)
      .then(data => setPresident(data[0].officers[0]))
      .catch(err => console.error(err));

    client.fetch(`*[_type == "teams" && !(name match "President")]`)
      .then(data => setTeams(data))
      .catch(err => console.error(err));

  }, []);

    return (
      <>
        <div className="relative overflow-hidden max-w-full bg-contain bg-repeat flex justify-center" style={{ backgroundImage: `url(${dotOverlay})` }}>
          <div className='overflow-hidden max-w-[90rem] px-[auto]'>
            <div className="md:px-[5rem] px-[3rem] xl:py-[10rem] py-[10rem] bg-contain">
              <section className="flex w-full md:flex-row flex-col">
                <div className="w-4/5 text-left my-auto">
                  <h1 className="text-[#4c0080] md:text-9xl text-8xl leading-[1.2] font-normal uppercase font-anton-sc">Officers</h1>
                  <h2 className="font-dinish text-2xl text-[#4d4d4d] font-normal uppercase">2024-2025 Team</h2>
                </div>
                <div className="md:w-2/5 md:py-0 flex relative w-full py-[4em]">
                  <h3 className="president-subtitle text-black text-6xl text-left pb-[1.5em] uppercase font-anton-sc md:pr-[1.25rem] pr-[1rem]" style={{ writingMode: "vertical-rl" }}>President</h3>
                  <OfficerPortrait 
                    image={president?.image} 
                    operatorImage={president?.operatorImage} 
                    name={president?.name}
                    operatorName = {president?.operatorName} 
                    role={president?.role}
                    gradYear={president?.gradYear}
                  />
                </div>
              </section>
              {teams && teams.map( team => <OfficerTeamContainer teamName={team.name} officers={team.officers}/>)}
            </div>
            <h1 className="absolute top-[-10vh] left-0 md:right-[-35vw] max-sm:top-[-10vh] md:text-[35vw] text-[70vh] z-[-2] font-bold" aria-hidden = "true" style={{
              color: 'white',
              WebkitTextStroke: '3px rgba(152, 134, 208, 0.2)',
              textTransform: 'uppercase',
            }}>Lead</h1>
          </div>
        </div>
      </>
    );
}

export default Officers;