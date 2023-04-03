import { useContext } from "react";
import CardContext from "../../store/CardProvider";
import EventContext from "../../store/EventProvider";
const geohash = require('ngeohash');

const ResultItem = (props) => {
    const context = useContext(EventContext);
    const context_card = useContext(CardContext);

    return (
        <tr onClick={() => {
            context.selectEvent(props.id);
            let event = context.events[props.id];
            // get venue info
            // const venue_id = context.events[props.id]?._embedded?.venues?.[0]?.id;
            const venue_keyword = event?._embedded?.venues?.[0]?.name;
            const lat = event?._embedded?.venues?.[0]?.location?.latitude;
            const long = event?._embedded?.venues?.[0]?.location?.longitude;
            const location_hash  = geohash.encode(lat, long);
            context_card.searchVenue({
                // id: venue_id,
                keyword: venue_keyword,
                geoPoint: location_hash
            });
            
            let null_set = new Set([null, undefined, "Undefined", ""]);
            let artistList = [];
            // clear saved artist list
            context_card.setArtistToSearch(artistList);
            if (null_set.has(event?._embedded?.attractions)) {
                // pass
            } else {
                for (let i = 0; i < event?._embedded?.attractions?.length; i ++) {
                    artistList.push(event?._embedded?.attractions?.[i]?.name);
                }
            }
            context_card.setArtistToSearch(artistList);
            context_card.searchAlbum(artistList);
        }}>
            <td className="date_detail">{props.dateTime}<br/>{props.localTime}</td>
            <td><img alt="icon" src={props.icon} height="100px" width="100px"/></td>
            <td className="event_td">{props.event}</td>
            <td>{props.genre}</td>
            <td>{props.venue}</td>
        </tr>
    );
};

export default ResultItem;
