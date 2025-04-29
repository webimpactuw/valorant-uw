function OfficerPortrait({image, operatorImage, name, role, gradYear}) {
    return ( 
        <div className = "w-full flex flex-col gap-[21px]">
            <div className= "w-full h-auto relative">
                <img src = {image} className = "w-full h-auto border-[3px] border-[#9886d0] object-cover aspect-[4/5] "/>
                <img src = {operatorImage} className = "absolute bottom-[-8%] right-[-8%] w-[30%] rounded-full z-[2]"/>
            </div>
            <div className = "text-left text-2xl uppercase font-dinish">
                <h4 className = "font-black">{name}</h4>
                <h5 className = "font-normal">{role}</h5>
                <h5 className = "font-normal">Class of {gradYear}</h5>
            </div>
        </div>
    );
}

export default OfficerPortrait;