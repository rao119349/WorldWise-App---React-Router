import { createContext, useContext, useEffect, useState } from "react"

const BASE_URL = `https://worldwiseappreactrouter-bhzs--9000--96435430.local-credentialless.webcontainer.io`;

const CitiesContext = createContext();

function CitiesProvider({ children }) {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCity, setCurrentCity] = useState({});

    useEffect(function () {
        async function fetchCities() {
            try {
                setIsLoading(false);
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                setCities(data);
            } catch (error) {
                alert('There was an error loading data...')
            } finally {
                setIsLoading(false);
            }
        }
        fetchCities()
    }, []);

    async function getCity(id) {
        try {
            setIsLoading(false);
            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();
            setCurrentCity(data);
        } catch (error) {
            alert('There was an error loading data...')
        } finally {
            setIsLoading(false);
        }
    }

    async function createCity(newCity) {
        try {
            setIsLoading(false);
            const res = await fetch(`${BASE_URL}/cities`, { method: 'POST', body: JSON.stringify(newCity), headers: { "Content-Type": "application/json", }, });
            const data = await res.json();
            setCities(cities => [...cities, data]);
        } catch (error) {
            alert('There was an error creating city.')
        } finally {
            setIsLoading(false);
        }
    }

    async function deleteCity(id) {
        try {
            setIsLoading(false);
            await fetch(`${BASE_URL}/cities/${id}`, { method: 'DELETE'});
            setCities(cities => cities.filter(city => city.id !== id));
        } catch (error) {
            alert('There was an error deleting city.')
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity, createCity , deleteCity }}>
            {children}
        </CitiesContext.Provider>
    )
}

function useCities() {
    const context = useContext(CitiesContext);
    if (context === undefined) throw new Error('Cities context was used outside the CitiesProvider');
    return context;
}

export { CitiesProvider, useCities }
