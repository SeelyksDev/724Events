import PropTypes from "prop-types";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

const DataContext = createContext({});

export const api = {
    loadData: async () => {
        const json = await fetch("/events.json");
        return json.json();
    },
};

const getLastEvent = (data) => {
    const events = [...data.events];

    const mostRecent = events.sort((evtA, evtB) =>
        new Date(evtA.date) > new Date(evtB.date) ? -1 : 1
    );

    const lastEvent = mostRecent[0];

    return lastEvent;
};

export const DataProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [last, setLast] = useState(null);
    const getData = useCallback(async () => {
        try {
            const loadedData = await api.loadData();
            setData(loadedData);
            setLast(getLastEvent(loadedData));
        } catch (err) {
            setError(err);
        }
    }, []);
    useEffect(() => {
        if (data) return;
        getData();
    });

    return (
        <DataContext.Provider
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            value={{
                data,
                error,
                last,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

DataProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
