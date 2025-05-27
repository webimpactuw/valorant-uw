import { upcomingEvent, pastEvents } from "../assets/EventList";
import Event from "../components/events/Event";


console.log(pastEvents);

function Events() {
    return (
      <>
        <div className="relative overflow-hidden max-w-full bg-contain bg-repeat" style={{ backgroundImage: "url('/dot_overlay.png')" }}>
          <div className="md:px-[6vw] px-[10vw] xl:py-[15vh] py-[10vh] bg-contain">
            <section className="flex w-full md:flex-row flex-col justify-between">
              <div className="md:w-1/2 text-left my-auto flex flex-col gap-4">
                <h1 className="text-[#4c0080] md:text-9xl text-8xl leading-[1.2] font-normal uppercase font-anton-sc">Events</h1>
                <p className="font-dinish text-xl text-[#4d4d4d] font-normal">Occasionally, we host larger events and tournaments! These events usually happen a few times a year, so stay tuned for the next event. In the meantime, check out some of our past events and interact with the club.</p>
              </div>
              <div className="md:w-[40%] md:py-0 flex md:flex-col flex-col-reverse relative w-full py-[4em] align-center">
                <Event img = {upcomingEvent.img} altDescription={upcomingEvent.altDescription} title={upcomingEvent.title}/>
                <h3 className="text-black text-6xl md:text-right text-left md:pt-[0.5em] pb-[0.5em] uppercase font-anton-sc">Upcoming</h3>
              </div>
            </section>
            {pastEvents.length > 0 && (<section className="md:w-screen overflow-x-visible"> 
             <h2 className="text-black text-6xl text-left pt-[0.5em] font-dinish uppercase font-bold mb-8">Past Events</h2>
              <div className = "flex md:flex-row flex-col gap-8 md:w-max-content md:overflow-x-scroll md:pr-[12vw] md:p-6"  style={{ scrollbarWidth: "none" }}>
                {pastEvents.map((event) => (
                  <Event className = "md:w-[35vw] hover:scale-110 transition-transform" key={event.title} title={event.title} altDescription={event.altDescription} link={event.link} img={event.img} textDate={event.textDate} textTime={event.textTime} formattedDate={event.formattedDate}/>
                ))}
              </div>
            </section>)}
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