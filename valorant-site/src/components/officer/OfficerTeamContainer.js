import OfficerPortrait from "./OfficerPortrait";
import { v4 as generateKey } from 'uuid';

// Takes a teamName and a list of officer objects and displays them
function OfficerTeamContainer({teamName, officers}) {

    // Adds officer unique officer IDs so React can more efficiently update DOM
    const officersWithIds = officers.map(officer => ({
      ...officer,
      id: officer.id || generateKey(),
    }))

    return (
        <section className="w-full">
          <h2 className="text-left uppercase text-[4rem] font-anton-sc">{teamName}</h2>
          <div className="grid grid-cols-1 py-[2em] w-full md:gap-[5vw] gap-[5vh] md:grid-cols-4 sm:grid-cols-2">
            {officersWithIds.map(({ image, operatorImage, name, operatorName, role, gradYear, id }) => (
                <OfficerPortrait 
                    image={image} 
                    operatorImage={operatorImage} 
                    name={name} 
                    operatorName = {operatorName}
                    role={role} 
                    gradYear={gradYear} 
                    key = {id}
                />
            ))}
          </div>
        </section>
    );
}

export default OfficerTeamContainer;