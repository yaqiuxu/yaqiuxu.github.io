import { useContext } from "react";
import EventContext from "../../store/EventProvider";
import { Container, Row, Col } from 'react-bootstrap';
import { BsTwitter } from 'react-icons/bs';
import { FaFacebookSquare } from 'react-icons/fa';
import NoResults from '../Results/NoResults';

const EventDetail = (props) => {
    const context = useContext(EventContext);
    let event = context.events[context.selectedEvent];
    let null_set = new Set([null, undefined, "Undefined", ""]);

    let date = props.data.date;
    let artist = props.data.artist;
    let venue = props.data.venue;
    let genres = props.data.category;
    let priceRanges = null_set.has(event?.priceRanges?.[0]?.min)? "": event?.priceRanges?.[0]?.min;
    priceRanges +=  null_set.has(event?.priceRanges?.[0]?.max)? "": " - " + event?.priceRanges?.[0]?.max;
    // priceRanges += null_set.has(event.priceRanges?.[0]?.currency)? "": " " + event.priceRanges?.[0]?.currency;
    let ticketStatus = event?.dates?.status?.code;
    let buyTicketAt = event?.url;
    let seatMap = event?.seatmap?.staticUrl;

    let eventName = event?.name;
    let ticketmasterLink = event?.url;
    let twitterUrl = `https://twitter.com/intent/tweet?text=Check%20${encodeURIComponent(eventName)}%20on%20Ticketmaster%3A%20${ticketmasterLink}`;
    let fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${ticketmasterLink}`;
    
    return (
            <Container style={{ width: "92%", marginTop: "30px" }}>
                <Row>
                    <Col className="d-flex flex-column align-items-center justify-content-center text-center" xs={12} md={6}>
                        { !null_set.has(date) && 
                            <div id="date">
                                <label className="detail_titles">Date</label><br/>
                                <p className="event_detail_text">{date}</p>
                            </div>
                        }
                        { !null_set.has(artist) &&
                            <div id="artistTeam">
                                <label className="detail_titles">Artist/Team</label><br/>
                                <p className="event_detail_text">{artist}</p>
                            </div>
                        }
                        
                        { !null_set.has(venue) &&
                            <div id="venue">
                                <label className="detail_titles">Venue</label><br/>
                                <p className="event_detail_text">{venue}</p>
                            </div>
                        }
                        
                        { !null_set.has(genres) &&
                            <div id="genres">
                                <label className="detail_titles">Genres</label><br/>
                                <p className="event_detail_text">{genres}</p>
                            </div>
                        }
                        
                        { !null_set.has(priceRanges) &&
                            <div id="priceRanges">
                                <label className="detail_titles">Price Ranges</label><br/>
                                <p className="event_detail_text">{priceRanges}</p>
                            </div>
                        }
                        
                        { !null_set.has(ticketStatus) &&
                            <div id="ticketStatus">
                                <label className="detail_titles">Ticket Status</label>
                                {ticketStatus === "onsale" && <div id="onsale" className="ticket_status_div">On Sale</div>}
                                {ticketStatus === "offsale" && <div id="offsale" className="ticket_status_div">Off Sale</div>}
                                {ticketStatus === "canceled" && <div id="canceled" className="ticket_status_div">Canceled</div>}
                                {ticketStatus === "postponed" && <div id="postponed" className="ticket_status_div">Postponed</div>}
                                {ticketStatus === "rescheduled" && <div id="rescheduled" className="ticket_status_div">Rescheduled</div>}
                            </div>
                        }
                        
                        { !null_set.has(buyTicketAt) &&
                            <div id="BuyTicketAt">
                                <label className="detail_titles">Buy Ticket At:</label><br/>
                                <a target='_blank' className="hyperlink" href={buyTicketAt} rel="noopener noreferrer">Ticketmaster</a>
                            </div>
                        }
                    </Col>
                    
                    <Col className="d-flex align-items-center justify-content-center" style={{ width: "50%" }} xs={12} md={6}>
                        { !null_set.has(seatMap) && 
                            <div id="seatMap">
                                <img alt='seat_map' src={seatMap} style={{ maxWidth: '100%', height: 'auto' }}/>
                            </div>
                        }
                        { null_set.has(seatMap) && <NoResults message={"No site map"}/>}
                    </Col>
                </Row>
                <div style={{textAlign: "center", padding: "40px 0 30px 0"}}>
                    <label className="event_detail_text">Share on:</label>
                    <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                        <BsTwitter fill="#1DA1F2" size={24} style={{ marginLeft: "5px"}}/>
                    </a>
                    <a href={fbUrl} target="_blank" rel="noopener noreferrer">
                        <FaFacebookSquare fill="#1877F2" size={24} style={{ marginLeft: "5px"}} />
                    </a>
                </div>
            </Container>
    );
};

export default EventDetail;
