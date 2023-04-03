import { useContext} from 'react';
import EventContext from '../store/EventProvider';
import FormContainer from './Form/FormContainer';
import ResultTable from './Results/ResultTable';
import NoResults from './Results/NoResults';
import DetailCard from './Card/DetailCard';
import { CardProvider } from '../store/CardProvider';

const Search = () => {
    const context = useContext(EventContext);

    return (
            <div className='body'>
                <FormContainer/>
                <CardProvider>
                    {context.showTable && <ResultTable/>}
                    {context.showNoResult && <NoResults message="No results available"/>}
                    {context.showNoGeo && <NoResults message="Can not geohash your location"/>}
                    {context.showCard && <DetailCard/>}
                </CardProvider>
            </div>
    );
}

export default Search;
