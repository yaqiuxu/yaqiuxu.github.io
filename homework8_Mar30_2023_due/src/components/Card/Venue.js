import { useState, useContext } from "react";
import CardContext from "../../store/CardProvider";
import ShowMoreLess from "./ShowMoreLess";
import GoogleMapsModal from "./GoogleMapsModal";
import { Container, Row, Col } from 'react-bootstrap';

const Venue = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const context = useContext(CardContext);
    let venue = context.venue[0];
    // console.log("venue data in venue.js >> ", venue);
    
    let venue_name = venue?.name;

    let street = venue?.address?.line1;
    let city = venue?.city?.name;
    let state = venue?.state?.name;
    let address = (street === undefined? "": street ) + (city === undefined? "": ", " + city) + (state === undefined? "": ", " + state);
    
    let phone = venue?.boxOfficeInfo?.phoneNumberDetail;
    let openHours = venue?.boxOfficeInfo?.openHoursDetail;
    let generalRule = venue?.generalInfo?.generalRule;
    let childRule = venue?.generalInfo?.childRule;

    const lat = venue?.location?.latitude;
    const long = venue?.location?.longitude;
    const center = {
        lat: parseFloat(lat),
        lng: parseFloat(long),
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Container style={{ width: "92%", marginTop: "30px" }}>
            <Row>
                <Col className="d-flex flex-column align-items-center justify-content-center text-center" xs={12} md={6}>
                    { venue_name !== undefined &&
                        <div>
                            <label className="detail_titles">Name</label><br/>
                            <p className="event_detail_text">{venue_name}</p>
                        </div>
                    }
                    { address !== undefined &&
                        <div>
                            <label className="detail_titles">Address</label><br/>
                            <p className="event_detail_text">{address}</p>
                        </div>
                    }
                    { phone !== undefined &&
                        <div>
                            <label className="detail_titles">Phone Number</label><br/>
                            <p className="event_detail_text">{phone}</p>
                        </div>
                    }
                </Col>
                <Col className="d-flex flex-column align-items-center justify-content-center text-center" xs={12} md={6}>
                    { openHours !== undefined &&
                        <div>
                            <label className="detail_titles">Open Hours</label><br/>
                            <ShowMoreLess content={openHours} maxLength={100}/>
                        </div>
                    }
                    { generalRule !== undefined &&
                        <div>
                            <label className="detail_titles">General Rule</label><br/>
                            <ShowMoreLess content={generalRule} maxLength={100}/>
                        </div>
                    }
                    { childRule !== undefined &&
                        <div>
                            <label className="detail_titles">Child Rule</label><br/>
                            <ShowMoreLess content={childRule} maxLength={100}/>
                        </div>
                    }
                </Col>
            </Row>
            <Row className="d-flex flex-column align-items-center justify-content-center p-5">
                <button className="btn btn-danger" onClick={openModal}>Show venue on Google map</button>
                <GoogleMapsModal isOpen={isModalOpen} closeModal={closeModal} center={center}/>
            </Row>
        </Container>
    );
};

export default Venue;
