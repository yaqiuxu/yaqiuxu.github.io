import { useContext, useEffect, useState } from "react";
import CardContext from "../../store/CardProvider";
import { Row, Col } from 'react-bootstrap';

const CardNav = () => {
    const context = useContext(CardContext);
    const [click, setClick] = useState(0);

    useEffect(() => {
        if (click === 0) {
            document.getElementById("nav1").style.borderBottom = "3px solid darkslategray";
            document.getElementById("nav2").style.borderBottom = 0;
            document.getElementById("nav3").style.borderBottom = 0;
        } else if (click === 1) {
            document.getElementById("nav1").style.borderBottom = 0;
            document.getElementById("nav2").style.borderBottom = "3px solid darkslategray";
            document.getElementById("nav3").style.borderBottom = 0;
        } else if (click === 2) {
            document.getElementById("nav1").style.borderBottom = 0;
            document.getElementById("nav2").style.borderBottom = 0;
            document.getElementById("nav3").style.borderBottom = "3px solid darkslategray";
        }
    }, [click])

    return (
        <div className="p-0 d-flex align-items-center justify-content-center" style={{ margin: "20px 0 0 0" }} >
            <Row className="justify-content-center card_nav w-100">
                <Col id="nav1" className="d-flex align-items-center justify-content-center text-light cursor fs-6 col-md-2 nav_item" type="button"
                    
                    onClick={ () => {
                        setClick(0);
                        context.setDetail();}}>
                            Events</Col>
                <Col id="nav2" className="d-flex align-items-center justify-content-center text-light cursor fs-6 col-md-2 nav_item" type="button"
                    
                    style={{ ":hover": { color: "white" } }}
                    onClick={ () => {
                        setClick(1);
                        context.setArtist();}}>
                            Artists/Teams</Col>
                <Col id="nav3" className="d-flex align-items-center justify-content-center text-light cursor fs-6 col-md-2 nav_item" type="button" 
                     
                    onClick={ () => {
                        setClick(2);
                        context.setVenue();}}>
                            Venue</Col>
            </Row>
        </div>
    );
};

export default CardNav;
