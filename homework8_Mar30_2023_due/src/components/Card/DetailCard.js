import { useState, useContext, useEffect } from "react";
import CardContext from "../../store/CardProvider";
import EventContext from "../../store/EventProvider";
import Artist from "./Artist";
import CardNav from "./CardNav";
import EventDetail from "./EventDetail";
import Venue from "./Venue";
import { MdArrowBackIos } from 'react-icons/md';
import { Container } from 'react-bootstrap';
import { HiOutlineHeart } from 'react-icons/hi';
import getAllLocalStorageData from "../Favorites/getAllLocalStorageData";

const DetailCard = () => {
    const context = useContext(EventContext);
    const card_context = useContext(CardContext);

    const [event_id, setEventID] = useState(undefined);
    const [event_title, setEventTitle] = useState(undefined);
    const [date, setDate] = useState(undefined);
    const [artist, setArtist] = useState(undefined);
    const [genres, setGenres] = useState(undefined);
    const [venue, setVenue] = useState(undefined);

    const [isFavorite, setIsFavorite] = useState(
        JSON.parse(localStorage.getItem(event_id)) || false
    );

    useEffect(() => {
        let event = context.events[context.selectedEvent];
        let event_id = event.id;
        let event_title = event.name;    
        let date = context.replaceNull(event?.dates?.start?.localDate, "");

        let null_set = new Set([null, undefined, "Undefined", ""]);
        let artist = card_context.artistList.join(" | ");

        let genres = null_set.has(event?.classifications?.[0]?.segment?.name)? "": event?.classifications?.[0]?.segment?.name;
        genres += null_set.has(event?.classifications?.[0]?.genre?.name)? "": " | " + event?.classifications?.[0]?.genre?.name;
        genres += null_set.has(event?.classifications?.[0]?.subGenre?.name)? "": " | " + event?.classifications?.[0]?.subGenre?.name;
        genres += null_set.has(event?.classifications?.[0]?.type?.name)? "": " | " + event?.classifications?.[0]?.type?.name;
        genres += null_set.has(event?.classifications?.[0]?.subType?.name)? "": " | " + event?.classifications?.[0]?.subType?.name;
        let venue = event?._embedded?.venues?.[0]?.name;

        setEventID(event_id);
        setEventTitle(event_title);
        setDate(date);
        setArtist(artist);
        setGenres(genres);
        setVenue(venue);

        if (isFavorate(event_id)) setHeart();
    }, []);

    useEffect(() => {
      }, [isFavorite]);  

    const setHeart = () => {
        const heart = document.getElementById('heart');
        heart.setAttribute('fill', 'red');
        heart.setAttribute('stroke', null);
    };

    const isFavorate = (eventId) => {
        const curr_favorites = getAllLocalStorageData();
        const curr_ids = new Set(Object.keys(curr_favorites));
        return curr_ids.has(eventId);
    };

    const localDataLength = () => {
        return Object.keys(getAllLocalStorageData()).length;
    };
    
    const addFavorite = () => {
        if (isFavorate(event_id)) {
            localStorage.removeItem(event_id);
            const heart = document.getElementById('heart');
            heart.setAttribute('fill', 'none');
            heart.setAttribute('stroke', "black");
            heart.setAttribute('strokeWidth', "1rem");
            alert("Removed from Favorites!");
            return;
        }

        const localData = {
            "num": localDataLength() + 1,
            "Date": date,
            "Event": event_title,
            "Category": genres,
            "Venue": venue
        }
        localStorage.setItem(event_id, JSON.stringify(localData));
        setIsFavorite(true);
        setHeart();
        alert("Event Added to Favorites!");
    }

    return (
        <Container style={{ maxWidth: "800px",  padding: 0 }} className="box2">
            <div style={{ height: "120px", paddingTop: "30px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <a className="hyperlink" style={{ textDecoration: "underline", color: "white", position: "absolute", top: "10%", left: "10px" }}
                    onClick={context.backToTable}>
                        <MdArrowBackIos></MdArrowBackIos>Back
                </a>
                <label style={{ color: "white", fontSize: "20px" }}>{event_title}</label>
                <div className="circle" type="button" style={{ marginLeft: "10px" }}
                    onClick={addFavorite}>
                    <HiOutlineHeart className="heart-icon" id="heart"/>
                </div>
            </div>
            <CardNav/>
            {card_context.showDetail && <EventDetail data={
                {
                    "event": event_title,
                    "date": date,
                    "artist": artist,
                    "venue": venue,
                    "category": genres
                }}/>}
            {card_context.showArtist && <Artist genres={genres}/>}
            {card_context.showVenue && <Venue/>}
        </Container>
    )
}

export default DetailCard;
