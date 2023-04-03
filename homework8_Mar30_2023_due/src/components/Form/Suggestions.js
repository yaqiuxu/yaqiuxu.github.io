import { useEffect, useState } from 'react';
import axios from 'axios';

const Suggestions = ({inputValue, onInputChange }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            console.log('get suggestions', inputValue);
            if (inputValue !== "")
                getSuggestions();            
        }, 200);

        return () => {
            console.log('cleanup autocomplete timeout');
            clearTimeout(timeout);
        }
    }, [inputValue, showSuggestions]);

    const getSuggestions = async () => {
        const url = new URL("http://localhost:5000/suggest");
        url.searchParams.append("keyword", inputValue);
    
        console.log("Calling: ", url);
        const response = await axios.get(url);
        
        const response_data = response.data;
        const suggestions_data = response_data.attractions;
    
        console.log("suggestions_data", suggestions_data);
        const values = Object.values(suggestions_data);
        const attractions = [];
        for (let i = 0; i < values.length; i++) {
            attractions.push(values[i].name);
        }
        setSuggestions(attractions);
        console.log(attractions);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        onInputChange(value);

        if (value === "") setShowSuggestions(false);
        else setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion) => {
        onInputChange(suggestion);
        setShowSuggestions(false);
    };

    return (
    <div className="autocomplete">
        <input
            id="keyword"
            required
            type="text"
            value={inputValue}
            onChange={handleInputChange}
        />
        {showSuggestions && (
            <table>
                <tbody>
                {suggestions.map((suggestion, index) => (
                    <tr key={index} onClick={() => handleSuggestionClick(suggestion)}>
                        <td>
                            {suggestion}
                        </td>
                    </tr>
                ))}
                </tbody>
          </table>
        )}
    </div>
    );
};

export default Suggestions;