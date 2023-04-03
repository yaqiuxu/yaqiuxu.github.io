import NoResults from "../Results/NoResults";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Spotify from "./Spotify";
import { useState, useContext, useEffect } from "react";
import CardContext from "../../store/CardProvider";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BounceLoader } from "react-spinners";

const Artist = (props) => {
    const [showArtist, setShowArtist] = useState(false);
    const [carouselList, setCarouselList] = useState(undefined);
    const context = useContext(CardContext);
    const artists = context.artist;
    const albums = context.album;

    useEffect(() => {
        if (props.genres?.toLowerCase().includes("music")) {
            setShowArtist(true);
        }        
    }, [carouselList ,showArtist, artists, albums]);

    useEffect(()=> {
        const keys = Object.keys(artists);
        const values = Object.values(artists);
        const Album_values = Object.values(albums);
        const tmp = [];
        for (let i = 0; i < keys.length; i++) {
            tmp.push({
                "image": values[i]?.images?.[0]?.url,
                "name": values[i]?.name,
                "popularity": values[i]?.popularity,
                "followers": values[i]?.followers?.total,
                "spotifyLink": values[i]?.external_urls?.spotify,
                "albums": Album_values[i]
            });        
        }
        console.log("current artists: ", tmp);
        if (tmp?.[0]?.name === undefined) {
            setShowArtist(false);
        } else {
            const carousel = tmp.map((artist, index) => (
                <Spotify
                    key = {index}
                    image = {artist.image}
                    name = {artist.name}
                    popularity = {artist.popularity}
                    followers = {artist.followers}
                    spotifyLink = {artist.spotifyLink}
                    albums = {artist.albums}
                />
            ))
            setCarouselList(carousel);
        }
    }, []);

    return (
        <div>
            <BounceLoader color="#1890ff" loading={context.isLoading} />
            { showArtist &&
                <Carousel
                    showArrows={true}
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop
                    emulateTouch={false}
                    swipeable={false}
                    transitionTime={500}
                >
                    {carouselList}
                </Carousel>
            }
            { !showArtist && <NoResults message="No music related artist details to show"/>}
        </div>
    );
};

export default Artist;
