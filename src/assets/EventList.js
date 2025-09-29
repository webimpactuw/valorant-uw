/*
This page contains a list of events to be displayed on the home page.

Event objects follow this structure:
{
    title: "Event Title",
    description: "Event description goes here",
    link: "https://www.example.com",
    img: "path/to/image.png",
    date: "2025-01-01"
}

The date is the last date the event is available. The date is used to swap
the image to a different one if the event is over. If there are multiple upcoming
events, the one with the closest date will be shown.

The date is in the format YYYY-MM-DD.
*/
import Placeholder from "./placeholder_event_poster.png";
import WatchParty from "./event_photos_posters/event poster watch party.png";
import ThrowingWhileSnowing from "./event_photos_posters/event poster winter tourney.png";

const events = [
    {
        title: "Event 1",
        altDescription: "Placeholder description",
        link: "https://www.example.com",
        img: ThrowingWhileSnowing,
        textDate: "Fri, April 4th",
        textTime: "2PM - 5PM",
        formattedDate: '2025-05-30'
    },
    {
        title: "Event 2",
        altDescription: "Placeholder description",
        link: "https://www.example.com",
        img: WatchParty,
        textDate: "2025-01-01",
        textTime: "",
        formattedDate: '2025-05-18'
    },
    {
        title: "Event 3",
        altDescription: "Description",
        link: "",
        img: ThrowingWhileSnowing,
        textDate: "Feb 22-23",
        textTime: "",
        formattedDate: '2025-02-03'
    },
    {
        title: "Event 4",
        altDescription: "Placeholder description",
        link: "https://www.example.com",
        img: ThrowingWhileSnowing,
        textDate: "Feb 22-23",
        textTime: "",
        formattedDate: '2025-01-01'
    },
]

const requiredProperties = ['title', 'altDescription', 'img', 'textDate', 'textTime', 'formattedDate'];
function isValidDateFormat(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}

const formattedEvents = events
    .filter(event => 
        event.formattedDate && (requiredProperties.every(prop => event.hasOwnProperty(prop)) && isValidDateFormat(event.formattedDate))
    )
    .map(event => ({
        ...event,
        dateObj: new Date(event.formattedDate)
    }))
    .sort((a, b) => b.dateObj - a.dateObj);

let upcomingEvent = {
    title: "No Upcoming Events",
    description: "No upcoming events",
    link: "https://www.example.com",
    img: Placeholder,
    textDate: "",
    textTime: "",
    formattedDate: '2025'
}

let pastEvents = [];
const date = Date.now();

// console.log(formattedEvents);
for (let i = formattedEvents.length - 1; i >= 0 && formattedEvents[i].dateObj <= date; i--) {
    pastEvents.unshift(formattedEvents[i]);

    if (formattedEvents[i].dateObj.getTime() > date) {
        upcomingEvent = formattedEvents[i];
    }
}

// console.log(pastEvents);

export {upcomingEvent, pastEvents};