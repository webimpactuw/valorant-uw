
function Event({ id, title, description, altDescription, img, textDate, textTime, links = [], openLightbox }) {
    return (
        <>
            <div id={id} className="w-full p-7 gap-7 flex md:flex-row flex-col bg-[#E2DCE8] border-lavender border-4">
                <img
                    src={img}
                    alt={altDescription || description || title}
                    onClick={() => openLightbox({img, altDescription})}
                    className="md:w-1/4 max-w-full h-auto border-2 border-lavender p-1 cursor-pointer min-w-0 flex-shrink-0 self-start"
                />
                <div className="text-left flex flex-col justify-between flex-shrink">
                    <div className="flex flex-col gap-2">
                        <h2 className="md:text-6xl text-4xl text-left font-dinish uppercase font-bold text-accent">{title}</h2>
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl">{textDate}</h3>
                            <div className=" w-1 h-1 bg-accent-dark flex-shrink-0"/>
                            <h3 className="text-xl">{textTime}</h3>
                        </div>
                    </div>
                    {description && <div className="py-8 flex flex-col justify-start flex-grow">
                        <p className="text-lg  text-[#4D4D4D]">{description}</p>
                    </div>}
                    <div className="flex flex-wrap gap-4 flex-grow">
                        {links && links.map(({ name, href }, idx) => {
                            return (
                                <a key={idx} href={href} className="w-full sm:w-1/4 cursor-pointer">
                                    <div className="group border-accent hover:border-lavender border-2 p-[2px] w-full flex-wrap">
                                        <div className="p-2 bg-accent group-hover:bg-lavender text-off-white uppercase font-bold text-2xl text-center py-2.5">{name}</div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Event;