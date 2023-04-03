import { useContext } from "react";
import EventContext from "../../store/EventProvider";
import ResultItem from "./ResultItem";
import Table from 'react-bootstrap/Table';

const ResultTable = () => {
    const context = useContext(EventContext);
    const events = context.events;
    const results = [];

    for (let i = 0; i < events.length; i++) {
        let event = events[i];

        let date =  context.replaceNull(event.dates?.start?.localDate, "");
        let localTime = event.dates?.start?.localTime;
        let event_title = event.name;
        let genre = event.classifications?.[0]?.segment?.name;
        let venue = event._embedded?.venues?.[0]?.name;
        let icon = event.images[0].url;

        results.push({
            "id": i,
            "dateTime": date,
            "localTime": localTime,
            "icon": icon,
            "event": event_title,
            "genre": genre,
            "venue": venue
        })
    }
    // console.log("event results (ResultTable.js): ", results);
    
    const resultsList = results.map((result) => (
        <ResultItem
            key = {result.id} // Warning: Each child in a list should have a unique "key" prop.
            id = {result.id}
            dateTime = {result.dateTime}
            localTime = {result.localTime}
            icon = {result.icon}
            event = {result.event}
            genre = {result.genre}
            venue = {result.venue}
        />
    ));

    // https://getbootstrap.com/docs/4.0/content/tables/
    return (
        <div className="table_container">
            <Table responsive striped hover variant="dark" style={{width: "100%", maxWidth: "1350px", margin: 0}}>
                <thead>
                    <tr>
                        <th scope="col">Date/Time</th>
                        <th scope="col">Icon</th>
                        <th scope="col">Event</th>
                        <th scope="col">Genre</th>
                        <th scope="col">Venue</th>
                    </tr>
                </thead>
                <tbody>
                    {resultsList}
                </tbody>
            </Table>
        </div>
    );
};

export default ResultTable;