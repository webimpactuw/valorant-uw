import { upcomingEvent, events } from "../assets/EventList";
import Event from "../components/events/Event";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Events(){
    useEffect(() => {
      window.scrollTo({top: 0, behavior: "instant" });
    }, []);
    const [lightboxImg, setLightboxImg] = useState(null);
    const [isLightboxVisible, setIsLightboxVisible] = useState(false);

    const openLightbox = (img) => {
      setLightboxImg(img);
      setTimeout(() => setIsLightboxVisible(true), 10);
    };

    const closeLightbox = () => {
      setIsLightboxVisible(false);
      setTimeout(() => setLightboxImg(null), 300);
    };

    const links = [
      {
        name: "Link1",
        href: "example.com"
      },
      {
        name: "Link2",
        href: "example.com"
      },
      {
        name: "Link2",
        href: "example.com"
      },
      {
        name: "Link2",
        href: "example.com"
      }

    ]

    return (
      <>
        {lightboxImg && (
          <div className={`w-screen h-screen fixed top-0 left-0 z-10 transition-opacity duration-300 flex justify-center ${isLightboxVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-slate-700 opacity-90 absolute w-full h-full z-10 transition-opacity duration-300"></div>
            <div className={`max-w-screen-xl h-full flex flex-col justify-center gap-8 items-center z-20 relative transition-transform duration-300 ${isLightboxVisible ? '-translate-y-3' : 'translate-x-0'}`}>
              <img src={lightboxImg} className="md:h-3/5 md:w-auto w-5/6 h-auto opacity-full border-2 border-lavender p-2"/>
              <button onClick={closeLightbox} className="group border-accent hover:border-lavender border-2 p-[2px] w-1/3 flex-wrap">
                  <div className="p-2 bg-accent group-hover:bg-lavender text-off-white uppercase font-bold text-2xl text-center py-2.5">Close</div>
              </button>
            </div>
          </div>
        )}
        <div className="relative overflow-hidden max-w-full bg-contain bg-repeat" style={{ backgroundImage: "url('/dot_overlay.png')" }}>
          <div className="md:px-[6vw] px-[10vw] xl:py-[15vh] py-[10vh] bg-contain">
            <section className="flex w-full md:flex-row flex-col justify-between">
              <div className="md:w-1/2 text-left my-auto flex flex-col gap-4">
                <h1 className="text-[#4c0080] md:text-9xl text-8xl leading-[1.2] font-normal uppercase font-anton-sc">Events</h1>
                <p className="font-dinish text-xl text-[#4d4d4d] font-normal">Occasionally, we host larger events and tournaments! These events usually happen a few times a year, so stay tuned for the next event. In the meantime, check out some of our past events and interact with the club.</p>
              </div>
              <div className="md:w-[40%] md:py-0 flex md:flex-col flex-col-reverse relative w-full py-[4em] align-center">
                <div className={`border-[3px] border-[#9886d0] p-[1em] aspect-square md:w-[35vw] flex box-border flex-shrink-0`} >
                    <img 
                        className= "aspect-square object-cover w-full box-border"
                        src = {upcomingEvent.img} 
                        alt = {upcomingEvent.description} 
                        title = {upcomingEvent.title} 
                    />  
                </div>
                <h3 className="text-black text-6xl md:text-right text-left md:pt-[0.5em] pb-[0.5em] uppercase font-anton-sc">Upcoming</h3>
              </div>
            </section>
            {events.length > 0 && (
              <section> 
              <h2 className="text-black text-6xl text-left pt-[0.5em] font-dinish uppercase font-bold mb-8">Past Events</h2>
                <div className="w-full flex flex-col gap-10">
                  {events.map(({title, description, altDescription, img, textDate, textTime, links}) => {
                    return <Event title={title} description={description} altDescription={altDescription} img={img} textDate={textDate} textTime={textTime} links={links} openLightbox={openLightbox}/>
                  })}
                </div>
              </section>
            )}
          </div>
          <h1 className="absolute top-[-10vh] left-0 md:right-[-35vw] max-sm:top-[-10vh] md:text-[35vw] text-[70vh] z-[-2] font-bold" aria-hidden = "true" style={{
            color: 'white',
            WebkitTextStroke: '3px rgba(152, 134, 208, 0.2)',
            textTransform: 'uppercase',
          }}>EventsEvents</h1>
        </div>
      </>
    );
}

export default Events;