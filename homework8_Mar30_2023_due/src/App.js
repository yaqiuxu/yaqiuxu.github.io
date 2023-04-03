import './App.css';
import './components/style.css';
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';
import Search from './components/Search';
import Favorites from './components/Favorites';
import EventContext from './store/EventProvider';

function App() {
    const context = useContext(EventContext);

    const showSearchForm = () => {
        const nav_button1 = document.getElementById('nav_button1');
        nav_button1.classList.add('selected');
        const nav_button2 = document.getElementById('nav_button2');
        nav_button2.classList.remove('selected');

        context.hideResults();
    };

    const showFavorites = () => {
        const nav_button1 = document.getElementById('nav_button1');
        nav_button1.classList.remove('selected');
        const nav_button2 = document.getElementById('nav_button2');
        nav_button2.classList.add('selected');
    };

    return (
        <Router>
            <div>
                {/* Navigation bar */}
                <nav className="nav_container">
                    <button className="nav_button selected" type="button" id="nav_button1" onClick={showSearchForm}>
                        <NavLink to="/search" className="no-hover-decoration nav_text">
                            Search
                        </NavLink>
                    </button>
                    <button className="nav_button" type="button" id="nav_button2" onClick={showFavorites}>
                        <NavLink to="/favorites" className="no-hover-decoration nav_text">
                            Favorites
                        </NavLink>
                    </button>      
                </nav>

                {/* Route configuration */}
                <Routes>
                    <Route path="/search" element={<Search />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route index element={<Search />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
