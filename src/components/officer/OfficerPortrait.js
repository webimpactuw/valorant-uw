function OfficerPortrait({image, operatorImage, name, operatorName, role, gradYear}) {
    return ( 
        <div className = "w-full flex flex-col gap-[21px]">
            <figure className= "w-full h-auto relative">
                <img 
                    src = {image} 
                    alt = {`Portrait of ${name}`}
                    className = "w-full h-auto border-[3px] border-[#9886d0] object-cover aspect-[4/5] "
                />
                <img 
                    src = {operatorImage} 
                    alt = {`Favorite operator: ${operatorName}`} 
                    title = {`Favorite Operator: ${operatorName}`} 
                    className = "absolute bottom-[-8%] right-[-8%] w-[30%] rounded-full z-[2]"
                />
            </figure>
            <figcaption className = "text-left text-2xl uppercase font-dinish">
                <h4 className = "font-black">{name}</h4>
                <p className = "font-normal text-opacity-[1]">{role}</p>
                <p className = "font-normal">Class of {gradYear}</p>
            </figcaption>
        </div>
    );
}

export default OfficerPortrait;