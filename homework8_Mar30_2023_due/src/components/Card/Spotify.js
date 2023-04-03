import { Container, Row, Col } from 'react-bootstrap';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaSpotify } from 'react-icons/fa';

const Spotify = (props) => {
    const myClass = "d-flex flex-column align-items-center justify-content-center text-center";

    return (
        <Container style={{ width: "90%", marginTop: "30px" }}>
            <Row>
                <Col className={{myClass}}>
                    <img alt="artist" src={props.image}
                        style={{ borderRadius: "50%", width: "180px", height: "180px"}}/>
                    <br/>
                    <div>
                        <label className="detail_titles_big">{props.name}</label>
                    </div>
                </Col>
                <Col className={{myClass}}>
                    <label className="detail_titles">Popularity</label><br/>
                    <div style={{ width: '50px', height: '50px', margin:"10px auto 10px auto" }}>
                        <CircularProgressbar 
                            value={props.popularity}
                            text={props.popularity}
                            styles={buildStyles({pathColor: "red", textColor: "white", textSize: '30px', pathTransitionDuration: 0.5, trailColor: 'transparent' })}
                        />
                    </div>
                </Col>
                <Col className={{myClass}}>
                    <label className="detail_titles">Followers</label><br/>
                    <p className="event_detail_text" style={{ margin:"20px" }}>
                        {props.followers?.toLocaleString()}
                    </p>
                </Col>
                <Col className={{myClass}}>
                    <label className="detail_titles">Spotify Link</label><br/>
                    <a href={props.spotifyLink} target='_blank' rel="noopener noreferrer" className='spotifyIcon'>
                        <FaSpotify size="48" color='#1DB954' />
                    </a>
                </Col>
            </Row>
            <Row>
                <label className="detail_titles">Album featuring&nbsp;</label>
                <label className="detail_titles">{props.name}</label><br/>
            </Row>
            <Container>
                <img alt={props.albums?.[0]?.images?.[0]?.url} src={props.albums?.[0]?.images?.[0]?.url} className="albumImg"/>
                <img alt={props.albums?.[1]?.images?.[0]?.url} src={props.albums?.[1]?.images?.[0]?.url} className="albumImg"/>
                <img alt={props.albums?.[2]?.images?.[0]?.url} src={props.albums?.[2]?.images?.[0]?.url} className="albumImg"/>
            </Container>
        </Container>
    );
};
  

export default Spotify;
