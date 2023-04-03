import "../style.css";
import Card from 'react-bootstrap/Card';

const NoResults = (props) => {
    return (
        <div style={{ paddingBottom: "2%", paddingLeft: "5%", paddingRight: "5%" }}>
            <Card style={{borderRadius: "20px", maxWidth: "800px", height: "auto", margin: "5% auto"}}>
                <Card.Body className="d-flex align-items-center justify-content-center"
                    style={{ padding: 0, color: "red", fontSize: '18px', fontWeight: 'bold' }}>
                    {props.message}
                </Card.Body>
            </Card>
        </div>
    )
}

export default NoResults;
