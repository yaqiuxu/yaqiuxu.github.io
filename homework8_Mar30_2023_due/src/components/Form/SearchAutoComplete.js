import React, { useCallback, useState } from "react";
import axios from "axios";
import { AutoComplete } from "antd";
import { BounceLoader } from "react-spinners";
import debounce from 'lodash/debounce';


const SearchAutoComplete = (props) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const getSuggestions = async (inputValue) => {
        setLoading(true);

        const url = new URL("https://csci571-hw8-382405.wl.r.appspot.com/suggest");
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

        setOptions(
            attractions.map((attraction) => ({
                value: attraction,
            }))
        );

        setLoading(false);
    };

    const debouncedGetSuggestions = useCallback(
        debounce(getSuggestions, 300),
        []
    );

    const onSearch = (searchText) => {
        if (searchText) {
            debouncedGetSuggestions(searchText);
        } else {
            setOptions([]);
        }
    };

    const handleChange = (inputValue) => {
        props.onInputChange(inputValue);
    };
    
    return (
        <div>
            <AutoComplete
                options={options}
                style={{ width: "100%"}}
                onSelect={console.log}
                onSearch={onSearch}
                onChange={handleChange}
                value={props.inputValue}
                id="keyword"
            />
            <BounceLoader color="#1890ff" loading={loading} />
        </div>
    );
};

export default SearchAutoComplete;
