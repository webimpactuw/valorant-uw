import OfficerPortrait from "./OfficerPortrait";

function OfficerTeamContainer({teamName, officers}) {
    return (
        <section className="w-full">
          <h2 className="text-left uppercase text-[4rem] font-anton-sc">{teamName}</h2>
          <div className="grid grid-cols-1 py-[2em] w-full md:gap-[5vw] gap-[5vh] md:grid-cols-4 sm:grid-cols-2">
            {officers.map(({ image, operatorImage, name, role, gradYear }) => (
                <OfficerPortrait 
                    image={image} 
                    operatorImage={operatorImage} 
                    name={name} 
                    role={role} 
                    gradYear={gradYear} 
                />
            ))}
          </div>
        </section>
    );
}

export default OfficerTeamContainer;