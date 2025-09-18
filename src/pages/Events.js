import { upcomingEvent, events } from "../assets/EventList";
import Event from "../components/events/Event";
import Placeholder from '../assets/empty_event.png'
import { useEffect, useState } from "react";
import { client, urlFor } from '../assets/sanityClient.js'

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function Events(){
    const [lightboxImg, setLightboxImg] = useState(null);
    const [isLightboxVisible, setIsLightboxVisible] = useState(false);
    const [events, setEvents] = useState();
    const [upcomingEvent, setUpcomingEvent] = useState(null);

    useEffect(() => {
      window.scrollTo({top: 0, behavior: "instant" });

      client.fetch(`*[_type == "events"] | order(_formattedDate desc)`)
        .then(data => setEvents(data))
        .catch(err => console.log(err));

      const date = new Date().toISOString()
      
      client.fetch(`*[_type == "events" && formattedDate > $now] | order(_formattedDate asc)[0]`, { now: date })
        .then(data => setUpcomingEvent(data))
        .catch(err => console.log(err));
    }, []);

    const openLightbox = (lightboxImg) => {
      setLightboxImg(lightboxImg);
      setTimeout(() => setIsLightboxVisible(true), 10);
    };

    const closeLightbox = () => {
      setIsLightboxVisible(false);
      setTimeout(() => setLightboxImg(null), 300);
    };

    console.log(events)

    return (
      <>
        {lightboxImg && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-modal" 
            aria-hidden={!isLightboxVisible}
            tabIndex={-1}
            className={`w-screen h-screen fixed top-0 left-0 z-10 transition-opacity duration-300 flex justify-center ${isLightboxVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="bg-slate-700 opacity-90 absolute w-full h-full z-10 transition-opacity duration-300"></div>
            <div className={`max-w-screen-xl h-full flex flex-col justify-center gap-8 items-center z-20 relative transition-transform duration-300 ${isLightboxVisible ? '-translate-y-3' : 'translate-x-0'}`}>
              <img src={urlFor(lightboxImg.img).auto('format').url()} alt={lightboxImg.altDescription} className="md:h-4/5 md:w-auto w-5/6 h-auto opacity-full border-2 border-lavender p-2"/>
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
                <div className="border-lavender border-2 p-6 md:w-[35vw] bg-[#E2DCE8]">
                  <div className = "flex flex-col gap-2">
                      <img 
                          className= " w-full box-border"
                          src = {upcomingEvent?.img ? urlFor(upcomingEvent.img).auto('format').url() : Placeholder} 
                          alt = {upcomingEvent?.altDescription ?? 'No upcoming events'} 
                          title = {upcomingEvent?.title ?? 'No upcoming events'} 
                      />  
                      <h2 className="md:text-6xl text-4xl text-left font-dinish uppercase font-bold text-accent">{upcomingEvent?.title ?? 'No upcoming events'}</h2>
                      <div className="flex items-center gap-3">
                          <h3 className="text-xl">{upcomingEvent?.timeDescription ?? ''}</h3>
                      </div>
                      <a href={`#${upcomingEvent && slugify(upcomingEvent.title)}`} className = "flex flex-col gap-2">
                        <div className="group border-accent hover:border-lavender border-2 p-[2px] w-full lg:w-[334px] relative z-1">
                          <div className="p-2 bg-accent group-hover:bg-lavender text-off-white uppercase font-bold text-2xl text-center py-2.5">See Event</div>
                        </div>
                      </a>
                    </div>
                </div>
                <h3 className="text-black text-6xl md:text-right text-left md:pt-[0.5em] pb-[0.5em] uppercase font-anton-sc">Upcoming</h3>
              </div>
            </section>
            {(events && events.length > 0) && (
              <section> 
              <h2 className="text-black text-6xl text-left pt-[0.5em] font-dinish uppercase font-bold mb-8">Events</h2>
                <div className="w-full flex flex-col gap-10">
                  {events.map(({title, description, altDescription, img, timeDescription, formattedDate, links}) => {
                    const eventId = slugify(title);
                    return <Event id={eventId} key={eventId} title={title} description={description} altDescription={altDescription} img={img} timeDescription={timeDescription} formattedDate={formattedDate} links={links} openLightbox={openLightbox}/>;
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