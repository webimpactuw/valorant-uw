import Placeholder from '../../assets/officer_portraits/Placeholder.png'
import { urlFor } from '../../assets/sanityClient.js'

function OfficerPortrait({image, operatorImage, name, operatorName, role, gradYear}) {
    return ( 
        <div className = "w-full flex flex-col gap-[21px]">
            <figure className= "w-full h-auto relative">
                <img 
                    src = {image ? urlFor(image).auto('format').url() : Placeholder} 
                    alt = {`Portrait of ${name ?? ''}`}
                    className = "w-full h-auto border-[3px] border-[#9886d0] object-cover aspect-[4/5] "
                />
                <div className="absolute bottom-[-8%] right-[-8%] w-[30%] rounded-full z-[2] border-[2px] border-purple-600 p-[2px] bg-white">
                    <img
                        src={operatorImage ? urlFor(operatorImage).auto('format').url() : Placeholder}
                        alt={`Favorite operator: ${operatorName ?? ''}`}
                        title={`Favorite Operator: ${operatorName ?? ''}`}
                        className="rounded-full w-full h-full object-cover"
                    />
                </div>
            </figure>
            <figcaption className = "text-left text-2xl uppercase font-dinish">
                <h4 className = "font-black">{name ?? ''}</h4>
                <p className = "font-normal text-opacity-[1]">{role ?? ''}</p>
                <p className = "font-normal">{gradYear ? `Class of ${gradYear}` : ''}</p>
            </figcaption>
        </div>
    );
}

export default OfficerPortrait;