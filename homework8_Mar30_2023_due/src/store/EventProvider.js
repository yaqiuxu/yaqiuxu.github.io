import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventContext = React.createContext({
    events: [],
    showTable: false,
    showNoResult: false,
    showNoGeo: false,
    showCard: false,
    selectedEvent: -1,
    hideResults: () => {},
    submitSearch: () => {},
    selectEvent: () => {},
    backToTable: () => {},
    replaceNull: () => {}
  });

export const EventProvider = (props) => {
    const[events, setEvents] = useState({});
    const[showTable, setShowTable] = useState(false);
    const[showNoResult, setShowNoResult] = useState(false);
    const[showNoGeo, setShowNoGeo] = useState(false);
    const[showCard, setShowCard] = useState(false);
    const[selectedEvent, setSelectedEvent] = useState(-1);
    
    useEffect(() => {
    }, [showTable, showNoResult, showNoGeo, showCard]);

    const hideResults = () => {
        setShowTable(false);
        setShowNoResult(false);
        setShowNoGeo(false);
        setShowCard(false);
    };

    // Call backend to search events
    let location = '';
    const autoDetectLocation = async () => {
        const myToken = "d95740ebbf0185";
        const url = new URL("https://ipinfo.io/");
        url.searchParams.append("token", myToken);
        try {
            const response = await fetch(url, { method: "GET" });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            location = data.loc;
            console.log("auto detect location: ", location);

        } catch (error) {
            console.log("auto detect location error: ", error);
        }
    };
    const submitSearch = async (data) => {
        if (data.autoLocation) {
            await autoDetectLocation();
            data.location = location;
        }
        console.log("form data: ", data);

        const url = new URL("https://csci571-hw8-382405.wl.r.appspot.com/searchEvents");
        for (const key in data) {
            url.searchParams.append(key, data[key]);
        }
        console.log("Calling: ", url);
        const response = await axios.get(url);
        
        const response_data = response.data;
        const event_data = response_data.events;
        setEvents(event_data);
        
        if (event_data.length > 0) {
            setShowTable(true);
            setShowNoResult(false);
            setShowNoGeo(false);
            setShowCard(false);
        } else if (response_data.geocode !== undefined) {
            setShowTable(false);
            setShowNoResult(false);
            setShowNoGeo(true);
            setShowCard(false);
        } else {
            setShowTable(false);
            setShowNoResult(true);
            setShowNoGeo(false);
            setShowCard(false);
        }

        console.log("events data: (EventProvider.js)", response_data);
    };

    const selectEvent = (i) => {
        console.log("select event ", i);
        setSelectedEvent(i);
        setShowCard(true);
        setShowTable(false);
    };

    const backToTable = () => {
        setShowCard(false);
        setShowTable(true);
    }

    let null_set = new Set([null, undefined, "Undefined", ""]);
    const replace_null = (value, null_string) => {
        if (null_set.has(value)){
            return null_string;
        }
        return value;
    }

    return (
        <EventContext.Provider
            value={{
                events: events,
                showTable: showTable,
                showNoResult: showNoResult,
                showNoGeo: showNoGeo,
                showCard: showCard,
                selectedEvent: selectedEvent,
                hideResults: hideResults,
                submitSearch: submitSearch,
                selectEvent: selectEvent,
                backToTable: backToTable,
                replaceNull: replace_null
            }}
        >
            {props.children}
        </EventContext.Provider>
    )
};

export default EventContext;
