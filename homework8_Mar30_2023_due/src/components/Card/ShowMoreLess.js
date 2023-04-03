import React, { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

const ShowMoreLess = ({ content, maxLength }) => {
    const [isTruncated, setIsTruncated] = useState(true);

    const toggleTruncated = () => {
        setIsTruncated(!isTruncated);
    };

    const renderContent = () => {
        if (isTruncated) {
            return content.substring(0, maxLength) + '...';
        }
        return content;
    };

    return (
    <div>
        <p className="event_detail_text">{renderContent()}</p>
        <p className='hyperlink' style={{ textDecoration: "underline", fontSize: "16px" }}
            onClick={toggleTruncated}>
            {isTruncated ? 'Show more' : 'Show less'}
        </p>
        {isTruncated ? <IoIosArrowDown style={{ color: "white" }}/>: <IoIosArrowUp style={{ color: "white" }}/>}
    </div>
    );
};

export default ShowMoreLess;
