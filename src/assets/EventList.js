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
import EmptyEvent from "./empty_event.png"
import WatchParty from "./event_photos_posters/event poster watch party.png";
import ThrowingWhileSnowing from "./event_photos_posters/event poster winter tourney.png";

const unformattedEvents = [
    {
        title: "Event 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        altDescription: "Placeholder description",
        img: ThrowingWhileSnowing,
        textDate: "August 20",
        textTime: "2:00PM - 5:00PM",
        formattedDate: '2025-08-20',
        links: [
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
    },
    {
        title: "Event 2",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        altDescription: "Placeholder description",
        img: WatchParty,
        textDate: "2025-01-01",
        textTime: "3:00PM - 4:00PM",
        formattedDate: '2025-05-18',
        links: []
    },
    {
        title: "Event 3",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        altDescription: "Description",
        img: ThrowingWhileSnowing,
        textDate: "Feb 22-23",
        textTime: "3:00PM - 4:00PM",
        formattedDate: '2025-02-03',
        links: []
    },
    {
        title: "Event 4",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        altDescription: "Placeholder description",
        img: ThrowingWhileSnowing,
        textDate: "Feb 22-23",
        textTime: "3:00PM - 4:00PM",
        formattedDate: '2025-01-01',
        links: []
    },
]

const requiredProperties = ['title', 'altDescription', 'img', 'textDate', 'textTime', 'formattedDate'];
function isValidDateFormat(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}

const events = unformattedEvents
    .filter(event => 
        event.formattedDate && (requiredProperties.every(prop => event.hasOwnProperty(prop)) && isValidDateFormat(event.formattedDate))
    )
    .map(event => ({
        ...event,
        dateObj: new Date(event.formattedDate)
    }))
    .sort((a, b) => b.dateObj - a.dateObj);


const now = new Date();
let upcomingEvent = {
    title: "No Upcoming Events",
    description: "No upcoming events",
    link: "https://www.example.com",
    img: EmptyEvent,
    textDate: "",
    textTime: "",
    formattedDate: '2025'
}


if (events.length > 0 && events[0].dateObj > now) {
    for (let i = 0; i < events.length; i++) {
        if (events[i].dateObj < now) {
            upcomingEvent = events[i - 1]
            break;
        }
    }
}

export {upcomingEvent, events};