import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CardContext = React.createContext({
    artist: {},
    album: {},
    artistList: [],
    venue: {},
    showDetail: true,
    showArtist: false,
    showVenue: false,
    isLoading: true,
    searchAlbum: () => {},
    searchVenue: () => {},
    setDetail: () => {},
    setArtist: () => {},
    setVenue: () => {},
    setArtistToSearch: () => {},
    setIsLoading: () => {}
  });

export const CardProvider = (props) => {
    const[artist, setArtist] = useState([]);
    const[album, setAlbum] = useState([]);
    const[artistList, setArtistList] = useState([]);
    const[venue, setVenue] = useState({});
    const[showDetail, setShowDetail] = useState(true);
    const[showArtist, setShowArtist] = useState(false);
    const[showVenue, setShowVenue] = useState(false);
    const[loading, setLoading] = useState(true);
    
    useEffect(() => {
    }, [artist, artistList, showDetail, showArtist, showVenue]);

    var artist_data = [];
    const searchArtist = async (data) => {
        const urls = [];
        for (let i = 0; i < data.length; i++) {
            const url = new URL("https://csci571-hw8-382405.wl.r.appspot.com/spotify");
            url.searchParams.append("keyword", data[i]);
            urls.push(url);
        };
        console.log("Calling /spotify: ", urls);
    
        const responses = await Promise.all(urls.map((url) => {return axios.get(url)}));
        const response_data = responses.map((response) => response.data.artists?.items[0]);
        console.log("spotify artist json list", response_data);

        setArtist(response_data);
        artist_data = response_data;
    };

    const searchAlbum = async (data) => {
        await searchArtist(data);

        const urls = [];
        for (let i = 0; i < artist_data.length; i++) {
            const url = new URL("https://csci571-hw8-382405.wl.r.appspot.com/album");
            url.searchParams.append("artistID", artist_data?.[i]?.id);
            urls.push(url);
        };
        console.log("Calling /Album: ", urls);
    
        const responses = await Promise.all(urls.map((url) => {return axios.get(url)}));
        const response_data = responses.map((response) => response.data.items);
        console.log("album json list", response_data);
        setAlbum(response_data);
        setLoading(false);
    };

    const searchVenue = async (data) => {
        const url = new URL("https://csci571-hw8-382405.wl.r.appspot.com/searchVenue");
        for (const key in data) {
            url.searchParams.append(key, data[key]);
        }
        console.log("Calling: ", url);
        const response = await axios.get(url);
        
        const response_data = response.data;
        const venue_data = response_data.venues;
        setVenue(venue_data);

        console.log('venue data: ', venue_data);
        
        // always show event detail first
        showDetailHandler();
    };

    const showDetailHandler = () => {
        setShowDetail(true);
        setShowArtist(false);
        setShowVenue(false);
    };
    const showArtistHandler = () => {
        setShowDetail(false);
        setShowArtist(true);
        setShowVenue(false);
    };
    const showVenueHandler = () => {
        setShowDetail(false);
        setShowArtist(false);
        setShowVenue(true);
    };

    const setArtistToSearch = (data) => {
        setArtistList(data);
    };

    const setIsLoading = () => {
        setLoading(true);
    }

    return (
        <CardContext.Provider
            value={{
                artist: artist,
                album: album,
                artistList: artistList,
                venue: venue,
                showDetail: showDetail,
                showArtist: showArtist,
                showVenue: showVenue,
                isLoading: loading,
                searchAlbum: searchAlbum,
                searchVenue: searchVenue,
                setDetail: showDetailHandler,
                setArtist: showArtistHandler,
                setVenue: showVenueHandler,
                setArtistToSearch: setArtistToSearch,
                setIsLoading: setIsLoading
            }}
        >
            {props.children}
        </CardContext.Provider>
    )
};

export default CardContext;
