import React, { useMemo, useState } from "react";
import { useStorage } from "../../hooks/useStorage";
import Icon from "./Icon";

const LocationRequestForm = ({ direction, pairedCityId, onClose }) => {
  const { requestLocation } = useStorage();
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true); setError("");
    const result = await requestLocation({ country, city, direction, pairedCityId, comment });
    setSaving(false);
    if (!result.success) setError(result.error || "Could not submit your request.");
    else setNotice("Thanks. The Chagga team will review this location request.");
  };

  return (
    <div className="market-modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="market-modal location-request-modal" role="dialog" aria-modal="true" aria-labelledby="location-request-title">
        <header className="market-modal-header">
          <span className="modal-icon traveler"><Icon name="route" /></span>
          <div><span className="eyebrow">Help us expand</span><h2 id="location-request-title">Request a {direction}</h2><p>Requests help us decide which locations and corridors to activate next.</p></div>
          <button type="button" className="icon-button modal-close" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        </header>
        {notice ? <div className="location-request-success"><Icon name="check" /><p>{notice}</p><button type="button" className="primary-action" onClick={onClose}>Done</button></div> : (
          <form className="market-form" onSubmit={submit}>
            <div className="form-grid two-columns">
              <label className="market-field">Country<input value={country} onChange={(event) => setCountry(event.target.value)} maxLength="100" required /></label>
              <label className="market-field">City<input value={city} onChange={(event) => setCity(event.target.value)} maxLength="100" required /></label>
            </div>
            <label className="market-field">Why would this route help? <small>Optional</small><textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength="500" /></label>
            {error && <p className="form-submit-error" role="alert">{error}</p>}
            <footer className="market-modal-actions"><button type="button" className="secondary-action" onClick={onClose}>Cancel</button><button className="primary-action" disabled={saving || !country.trim() || !city.trim()}>{saving ? "Sending…" : "Submit request"}</button></footer>
          </form>
        )}
      </section>
    </div>
  );
};

const LocationFields = ({ originCityId, destinationCityId, onChange }) => {
  const { countries, cities, routes } = useStorage();
  const [requestDirection, setRequestDirection] = useState(null);
  const countryById = useMemo(() => Object.fromEntries(countries.map((country) => [country.id, country])), [countries]);
  const cityById = useMemo(() => Object.fromEntries(cities.map((city) => [city.id, city])), [cities]);
  const activeRoutes = routes.filter((route) => route.is_active);
  const originIds = new Set(activeRoutes.map((route) => route.origin_city_id));
  const originCities = cities.filter((city) => city.is_active && countryById[city.country_id]?.is_active && originIds.has(city.id));
  const destinationIds = new Set(activeRoutes.filter((route) => route.origin_city_id === originCityId).map((route) => route.destination_city_id));
  const destinationCities = cities.filter((city) => destinationIds.has(city.id));

  const labelFor = (city) => `${city.name}, ${countryById[city.country_id]?.name || ""}`;
  const chooseOrigin = (id) => {
    const city = cityById[id];
    onChange({ originCityId: id, destinationCityId: "", from: city ? labelFor(city) : "", to: "" });
  };
  const chooseDestination = (id) => {
    const origin = cityById[originCityId];
    const destination = cityById[id];
    onChange({ originCityId, destinationCityId: id, from: origin ? labelFor(origin) : "", to: destination ? labelFor(destination) : "" });
  };

  return (
    <>
      <div className="form-grid two-columns">
        <label className="market-field">From
          <select value={originCityId || ""} onChange={(event) => chooseOrigin(event.target.value)} required>
            <option value="">Choose an operational city</option>
            {originCities.map((city) => <option key={city.id} value={city.id}>{labelFor(city)}</option>)}
          </select>
          <button type="button" className="location-request-link" onClick={() => setRequestDirection("origin")}>Can’t find your origin? Request it</button>
        </label>
        <label className="market-field">To
          <select value={destinationCityId || ""} onChange={(event) => chooseDestination(event.target.value)} disabled={!originCityId} required>
            <option value="">{originCityId ? "Choose an active destination" : "Choose the origin first"}</option>
            {destinationCities.map((city) => <option key={city.id} value={city.id}>{labelFor(city)}</option>)}
          </select>
          <button type="button" className="location-request-link" onClick={() => setRequestDirection("destination")}>Can’t find your destination? Request it</button>
        </label>
      </div>
      {originCityId && destinationCities.length === 0 && <p className="field-error">No operational destinations are active from this city yet.</p>}
      {requestDirection && <LocationRequestForm direction={requestDirection} pairedCityId={requestDirection === "origin" ? destinationCityId : originCityId} onClose={() => setRequestDirection(null)} />}
    </>
  );
};

export default LocationFields;
