import { useEffect, useMemo, useState } from "react";
import FavoriteItem from "./FavoriteItem";
import NoResults from "../Results/NoResults";
import Table from 'react-bootstrap/Table';
import getAllLocalStorageData from './getAllLocalStorageData';

const FavoritesTable = () => {
    const [favorites, SetFavotites] = useState(getAllLocalStorageData());
    
    useEffect(() => {
        console.log("favorites (FavoriteTable.js)", favorites);
    }, [favorites]);

    const favoritesArray = useMemo(() =>{
        const tmp = []
        const keys = Object.keys(favorites);
        const values = Object.values(favorites);

        for (let i = 0; i < keys.length; i++) {
            tmp.push({
                "num": values[i].num,
                "key": keys[i],
                "date": values[i].Date,
                "event": values[i].Event,
                "category": values[i].Category,
                "venue": values[i].Venue
            });
        }
        tmp.sort((a, b) => a.num - b.num);
        console.log("current favorite: ", tmp);
        return tmp;
    }, [favorites]);

    const removeFavorite = (eventID) => {
        localStorage.removeItem(eventID);
        SetFavotites(getAllLocalStorageData());
        alert("Removed from Favorites!");
    };

    const favoriteList = favoritesArray.map((favorite, index) => (
        <FavoriteItem
            key = {favorite.key} // Warning: Each child in a list should have a unique "key" prop.
            id = {index + 1}
            date = {favorite.date}
            event = {favorite.event}
            category = {favorite.category}
            venue = {favorite.venue}
            remove = {() => {removeFavorite(favorite.key)}}
        />
    ));

    return (
        <div>
            { Object.keys(favorites).length === 0 && <NoResults message="No favorite events to show"/>}
            { Object.keys(favorites).length > 0 && 
                <div>
                    <p style={{textAlign: 'center', margin: '3% auto', color: 'rgba(117,254,222,255)', fontSize: "20px"}}>List of your favorite events</p>
                        <div className="table_container" style={{marginTop: 0}}>
                            <Table responsive hover style={{ margin: 0, backgroundColor: "white" }}>
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Event</th>
                                        <th scope="col">Category</th>
                                        <th scope="col">Venue</th>
                                        <th scope="col">Favorite</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {favoriteList}
                                </tbody>
                            </Table>
                        </div>
                </div>}
        </div>
    )
};

export default FavoritesTable;
