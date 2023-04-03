import React, { useState, useRef, useContext } from "react";
import EventContext from "../../store/EventProvider";
import SearchAutoComplete from "./SearchAutoComplete";
import Form from 'react-bootstrap/Form';
import '../style.css';

const isEmpty = (value) => value.trim().length === 0;
  
const FormBody = (props) => {
    const context = useContext(EventContext);
    
    const [keyword, setInputValue] = useState('');
    const handleInputChange = (value) => {
        setInputValue(value);
    };
    const distance = useRef();
    const category = useRef();
    const location = useRef();
    const autoLocationChecked = useRef();

    const clear = () => {
        handleInputChange("");
        distance.current.value = 10;
        category.current.value = "default";
        location.current.value = "";
        location.current.disabled = false;
        autoLocationChecked.current.checked = false;
        context.hideResults();
    };

    const searchEvents = (event) => {
        event.preventDefault();
        
        const input_keyword = document.getElementById("keyword");
        input_keyword.required = true;
        if (input_keyword.reportValidity() === false){
            return;
        }
        const input_location = document.getElementById("input_location");
        input_location.required = true;
        if (input_location.reportValidity() === false){
            return;
        }
        
        const enteredKeyword = keyword;
        const enteredDistance = isEmpty(distance.current.value)? 10: distance.current.value;
        const enteredCategory = category.current.value;
        const enteredLocation = location.current.value;
        const ifAutoLocation = autoLocationChecked.current.checked;

        props.onConfirm({
            keyword: enteredKeyword,
            distance: enteredDistance,
            category: enteredCategory,
            location: enteredLocation,
            autoLocation: ifAutoLocation
        });
    };

    return (
        <form name="search_form" id="search_form" method="get">
            
            <div id="keyword_div">
                <label>Keyword</label><label className="required">*</label>
                <SearchAutoComplete inputValue={keyword} onInputChange={handleInputChange} />
            </div>
            
            
            <div id="distance_category_div">
                <div className="distance_div element-1" style={{marginTop: "3%"}}>
                    <label htmlFor="distance">Distance</label>
                    <input name="distance" id="distance" type="number" placeholder="10" min="0" step="1" defaultValue="10"
                            ref={distance}/>
                </div>
                <div className="category_div element-2" style={{marginTop: "3%"}}>
                    <label htmlFor="category">Category</label><label className="required">*</label>
                    <select name="category" id="category" defaultValue='default' ref={category}>
                        <option value="default">Default</option>
                        <option value="music">Music</option>
                        <option value="sports">Sports</option>
                        <option value="artsTheater">Arts &amp; Theater</option>
                        <option value="film">Film</option>
                        <option value="miscellaneous">Miscellaneous</option>
                    </select>
                </div>
            </div>
            
            <div id="location_div">
                <label htmlFor="input_location">Location</label><label className="required">*</label>
                <Form.Control style={{height: "32px"}} name="input_location" id="input_location" type="text" ref={location} required/>
                
                <input name="auto_location" id="auto_location" type="checkbox" ref={autoLocationChecked}
                    onChange={
                        (event) => {
                            location.current.value = "";
                            location.current.disabled = autoLocationChecked.current.checked;
                        }}
                />
                <label htmlFor="auto_location" id="auto_detect">Auto-Detect Location</label>
            </div>
            <div id="buttons">
                <button name="search" id="search_button" type="submit" onClick={searchEvents}>SUBMIT</button>
                <button name="clear" id="clear_button" type="button" onClick={clear}>CLEAR</button>
            </div>
        </form>
    );
}

export default FormBody;