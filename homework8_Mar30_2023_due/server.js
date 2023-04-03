// backend/server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const geohash = require('ngeohash');
const axios = require('axios');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors());

// const PORT = 5000;
// const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const google_api_key = "AIzaSyBgPDvrR3oX-ydXSErm31Tho82ik7DquSo"
const ticket_master_token = "sSaF4zzRA6ok1AhXYGY7JryMB4lSTKAG"
const segmentId = {
    "defalt": "",
    "music": "KZFzniwnSyZfZ7v7nJ",
    "sports": "KZFzniwnSyZfZ7v7nE",
    "artsTheater": "KZFzniwnSyZfZ7v7na",
    "film": "KZFzniwnSyZfZ7v7nn",
    "miscellaneous": "KZFzniwnSyZfZ7v7n1"
}

const clientId = 'e88f88ef8cc64adf96be6149304f5f1b';
const clientSecret = 'd74c31c204ca48028245a8409b04e724';
const spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret,
});

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


const isEmpty = (value) => value == null || value == undefined || value == "Undefined" || value == "";

app.get('/suggest', async (req, res) => {
    const query = req.query;
    console.log("req: ", query);
    // call ticketmaster
    ticket_parmas = {
        "keyword": query.keyword,
        "apikey": ticket_master_token
    }
    const ticketmaster_url = new URL("https://app.ticketmaster.com/discovery/v2/suggest");  
    for (const key in ticket_parmas) {
        const val = ticket_parmas[key];
        if (!isEmpty(val)) ticketmaster_url.searchParams.append(key, val);
    }
    console.log("call ticketmaster suggests:", ticketmaster_url.href);

    const search_response = await axios.get(ticketmaster_url);
    const search_data = search_response.data?._embedded;
    if (!isEmpty(search_data)) {
        res.json(search_data);
    } else {
        res.json({"attractions": []});
    }
});

app.get('/searchEvents', async (req, res) => {
    const query = req.query;
    console.log("req: ", query);

    let location_hash = "";
    
    if (query.autoLocation == "true") {
        query.location = query.location.split(',');
        location_hash  = geohash.encode(query.location[0], query.location[1]);
    } else {
        const geo_params = {
            "address": query.location,
            "key": google_api_key
        }
        const geo_url = new URL("https://maps.googleapis.com/maps/api/geocode/json");  
        for (const key in geo_params) {
            geo_url.searchParams.append(key, geo_params[key]);
        }
        const geo_response = await axios.get(geo_url);
        const geo_results = geo_response.data?.results;
        
        if (geo_results.length > 0) {
            const latitute = geo_results[0].geometry?.location?.lat;
            const longitude = geo_results[0].geometry?.location?.lng;
            location_hash = geohash.encode(latitute, longitude);
        } else {
            res.json({
                "events": [],
                "geocode": false 
            });
            return;
        }
    }
    // call ticketmaster
    ticket_parmas = {
        "apikey": ticket_master_token,
        "keyword": query.keyword,
        "radius": query.distance,
        "unit": "miles",
        "geoPoint": location_hash,
        "segmentId": segmentId[query.category],
        "sort": "date,asc"
    }
    const ticketmaster_url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");  
    for (const key in ticket_parmas) {
        const val = ticket_parmas[key];
        if (!isEmpty(val)) ticketmaster_url.searchParams.append(key, val);
    }
    console.log("call ticketmaster search events:", ticketmaster_url.href);

    const search_response = await axios.get(ticketmaster_url);
    const search_data = search_response.data?._embedded;
    if (!isEmpty(search_data)) {
        res.json(search_data);
    } else {
        res.json({"events": []});
    }
});

app.get('/searchVenue', async (req, res) => {
    const query = req.query;
    console.log("req: ", query);
    // call ticketmaster
    ticket_parmas = {
        // "id": query.id,
        "keyword": query.keyword,
        "geoPoint": query.geoPoint,
        "apikey": ticket_master_token
    }
    const ticketmaster_url = new URL("https://app.ticketmaster.com/discovery/v2/venues.json");  
    for (const key in ticket_parmas) {
        const val = ticket_parmas[key];
        if (!isEmpty(val)) ticketmaster_url.searchParams.append(key, val);
    }
    console.log("call ticketmaster search venues:", ticketmaster_url.href);

    const search_response = await axios.get(ticketmaster_url);
    const search_data = search_response.data?._embedded;
    if (!isEmpty(search_data)) {
        res.json(search_data);
    } else {
        res.json({"venues": []});
    }
});

app.get('/spotify', async (req, res) => {
    const query = req.query;  
    console.log("req: ", query);

    await spotifyApi.clientCredentialsGrant().then(
        (data) => {
            accessToken = data.body.access_token;
            spotifyApi.setAccessToken(data.body.access_token);
            console.log("my token:", accessToken);
        },
        (err) => {
            console.error('Error getting access token:', err);
        }
    ).then(
        (data) => {
            spotifyApi.searchArtists(query.keyword, {limit: 1})
            .then((response) => {
                res.json(response.body);
            })
            .catch((error) => {
                if (error.statusCode === 401) {
                    // If the access token is expired or missing, get a new one
                    console.error("Error searching artists: 401");
                } else if (error.statusCode === 400) {
                    //No search query
                    res.json({"artists": []});
                } else {
                    console.error('Error searching artists:', error);
                }
            });
        },
        (err) => {
            console.error('Error getting access token:', err);
        }
    );
});

app.get('/album', async (req, res) => {
    const query = req.query;  
    console.log("req: ", query);

    await spotifyApi.clientCredentialsGrant().then(
        (data) => {
            accessToken = data.body.access_token;
            spotifyApi.setAccessToken(data.body.access_token);
            console.log("my token:", accessToken);
        },
        (err) => {
            console.error('Error getting access token:', err);
        }
    ).then(
        (data) => {
            spotifyApi.getArtistAlbums(query.artistID, {limit: 3})
            .then((response) => {
                res.json(response.body);
            })
            .catch((error) => {
                if (error.statusCode === 401) {
                    // If the access token is expired or missing, get a new one
                    console.error("Error searching artists: 401");
                } else if (error.statusCode === 400) {
                    //No search query
                    res.json({"items": []});
                } else {
                    console.error('Error searching artists:', error);
                }
            });
        },
        (err) => {
            console.error('Error getting access token:', err);
        }
    );
});

app.use('/static', express.static(path.join(__dirname, 'build', 'static')));

// Handle all requests and serve the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

