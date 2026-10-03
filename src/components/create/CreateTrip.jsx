import React, { useState } from "react";
import { useStorage } from "../../hooks/useStorage";
import { ITEM_TYPE_LABELS } from "../../utils/constants";
import LocationFields from "../common/LocationFields";
import Icon from "../common/Icon";

const SPACE_OPTIONS = { small: "Up to 1 kg", medium: "1–3 kg", large: "3–5 kg" };

const CreateTrip = ({ onClose, onCreate, initialData = null }) => {
  const { createTrip } = useStorage();
  const [formData, setFormData] = useState({
    originCityId: initialData?.originCityId || "", destinationCityId: initialData?.destinationCityId || "",
    from: initialData?.originCityId ? initialData.from : "", to: initialData?.destinationCityId ? initialData.to : "",
    travelDate: "", availableSpace: initialData?.availableSpace || "",
    acceptedItems: initialData?.acceptedItems || [], deliveryArea: initialData?.deliveryArea || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const setField = (field, value) => setFormData((previous) => ({ ...previous, [field]: value }));
  const toggleItem = (item) => setFormData((previous) => ({
    ...previous,
    acceptedItems: previous.acceptedItems.includes(item)
      ? previous.acceptedItems.filter((current) => current !== item)
      : [...previous.acceptedItems, item],
  }));

  const isValid = formData.originCityId && formData.destinationCityId && formData.travelDate && formData.availableSpace && formData.acceptedItems.length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    try {
      const trip = await createTrip(formData);
      onCreate?.(trip);
      onClose?.();
    } catch (submitError) {
      setError(submitError.message || "Your trip could not be posted.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="market-modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <section className="market-modal" role="dialog" aria-modal="true" aria-labelledby="trip-modal-title">
        <header className="market-modal-header">
          <span className="modal-icon traveler"><Icon name="bag" size={24} /></span>
          <div><span className="eyebrow">Travel with purpose</span><h2 id="trip-modal-title">{initialData ? "Repeat this trip" : "Share your trip"}</h2><p>{initialData ? "Confirm the route and choose your new travel date." : "Offer the luggage space you are comfortable carrying."}</p></div>
          <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        </header>

        <form className="market-form" onSubmit={handleSubmit}>
          <fieldset className="form-section"><legend><Icon name="route" /> Your route</legend>
            <LocationFields originCityId={formData.originCityId} destinationCityId={formData.destinationCityId} onChange={(location) => setFormData((previous) => ({ ...previous, ...location }))} />
          </fieldset>

          <fieldset className="form-section"><legend><Icon name="calendar" /> Trip details</legend>
            <div className="form-grid two-columns">
              <label className="market-field">Travel date<input type="date" value={formData.travelDate} onChange={(e) => setField("travelDate", e.target.value)} min={new Date().toISOString().split("T")[0]} required /></label>
              <label className="market-field">Available space<select value={formData.availableSpace} onChange={(e) => setField("availableSpace", e.target.value)} required><option value="">Choose a capacity</option>{Object.entries(SPACE_OPTIONS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
            </div>
          </fieldset>

          <fieldset className="form-section"><legend><Icon name="box" /> Items you can carry</legend>
            <p className="section-help">Select every category you are willing to inspect and carry.</p>
            <div className="choice-grid">{Object.entries(ITEM_TYPE_LABELS).map(([key, label]) => <label className={formData.acceptedItems.includes(key) ? "choice-card selected" : "choice-card"} key={key}><input type="checkbox" checked={formData.acceptedItems.includes(key)} onChange={() => toggleItem(key)} /><Icon name={key === "documents" ? "send" : "box"} /><span>{label}</span><Icon name="check" className="choice-check" /></label>)}</div>
          </fieldset>

          <label className="market-field">Preferred handover area <small>Optional</small><input maxLength="160" value={formData.deliveryArea} onChange={(e) => setField("deliveryArea", e.target.value)} placeholder="For example, central London or Heathrow" /></label>
          <div className="form-safety"><Icon name="shield" /><span>You remain responsible for inspecting the item and following airline and customs rules.</span></div>
          {error && <p className="form-submit-error" role="alert">{error}</p>}
          <footer className="market-modal-actions"><button type="button" className="secondary-action" onClick={onClose}>Cancel</button><button type="submit" className="primary-action" disabled={!isValid || isSubmitting}>{isSubmitting ? "Posting…" : "Post trip"}</button></footer>
        </form>
      </section>
    </div>
  );
};

export default CreateTrip;
