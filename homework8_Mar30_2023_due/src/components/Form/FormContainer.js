import { useContext } from "react";
import EventContext from "../../store/EventProvider";
import FormBody from "./FormBody";
import { Container } from 'react-bootstrap';
import '../style.css';

const FormContainer = () => {
    const context = useContext(EventContext);
    return (
        <Container style={{maxWidth: "770px"}} className="box">
                <div className="header_box">
                    <hr/> 
                    <h1 className='header_text'>Events Search</h1>
                </div>
                <FormBody onConfirm={context.submitSearch}/>
        </Container>
    )
};

export default FormContainer;
