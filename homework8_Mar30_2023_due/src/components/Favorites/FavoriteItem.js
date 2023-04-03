import { RiDeleteBin5Line } from 'react-icons/ri';

const FavoriteItem = (props) => {
    return (
        <tr>
            <td className="bold_td">{props.id}</td>
            <td className="date_detail">{props.date}</td>
            <td>{props.event}</td>
            <td>{props.category}</td>
            <td>{props.venue}</td>
            <td>
                <button className="btn" type="button" onClick={props.remove}><RiDeleteBin5Line /></button>
            </td>
        </tr>
    )
}

export default FavoriteItem;
