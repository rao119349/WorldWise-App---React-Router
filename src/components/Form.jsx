// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useState, useEffect } from "react";
import { useUrlPosition } from '../hooks/useUrlPosition';
import Button from "./Button";
import Message from "./Message";
import Spinner from "./Spinner";
import BackButton from "./BackButton";

import DatePicker from "react-datepicker";

import styles from "./Form.module.css";
import "react-datepicker/dist/react-datepicker.css";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [lat,lng] = useUrlPosition();

  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [geocodingError, setGeocodingError] = useState("");

  const [emoji, setEmoji] = useState('');

  useEffect(function() {
    if(!lat && !lng) return;

    async function fetchCityData() {
      try {
        setIsLoadingGeoCoding(true);
        setGeocodingError('');
        const res = await fetch (`${BASE_URL}?latitude=${lat}0&longitude=${lng}`)
        const data = await res.json();
        console.log(data);
        if(!data.countryCode) throw new Error("No one owns this land. Would you like to capture 🤑.");
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
        console.log(emoji);
      } catch (err) {
        setGeocodingError(err.message);
      } finally {
        setIsLoadingGeoCoding(false);
      }
    }
    fetchCityData();
  } , [lat,lng])

  function handleSubmit(e) {
    e.preventDefault();
  }

  if(isLoadingGeoCoding) return <Spinner />

  if(!lat && !lng) return <Message message="Start by clicking somewhere on the map" />

  if (geocodingError) return <Message message = {geocodingError} />
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}

        <DatePicker onChange={date => setDate(date)} selected={date} dateFormat='dd/MM/YYYY'/>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
