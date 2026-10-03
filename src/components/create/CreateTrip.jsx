import React, { useState } from "react";
import { useStorage } from "../../hooks/useStorage";
import { AFRICAN_CITIES, EUROPEAN_CITIES, ITEM_TYPE_LABELS, SIZE_LABELS } from "../../utils/constants";
import Icon from "../common/Icon";

const CityOptions = () => <>
  <optgroup label="Africa">{AFRICAN_CITIES.map((city) => <option key={city}>{city}</option>)}</optgroup>
  <optgroup label="Europe — priority corridors">{EUROPEAN_CITIES.map((city) => <option key={city}>{city}</option>)}</optgroup>
</>;

const CreateTrip = ({ onClose, onCreate, initialData = null }) => {
  const { createTrip } = useStorage();
  const [formData, setFormData] = useState({
    from: initialData?.from || "",
    to: initialData?.to || "",
    travelDate: "",
    availableSpace: initialData?.availableSpace || "",
    acceptedItems: initialData?.acceptedItems || [],
    deliveryArea: initialData?.deliveryArea || "",
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

  const isValid = formData.from && formData.to && formData.from !== formData.to && formData.travelDate && formData.availableSpace && formData.acceptedItems.length > 0;

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
          <div><span className="eyebrow">Travel with purpose</span><h2 id="trip-modal-title">{initialData ? "Repeat this trip" : "Share your trip"}</h2><p>{initialData ? "Your previous details are ready. Just choose the new travel date." : "Offer the luggage space you are comfortable carrying."}</p></div>
          <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        </header>

        <form className="market-form" onSubmit={handleSubmit}>
          <fieldset className="form-section"><legend><Icon name="route" /> Your route</legend>
            <div className="form-grid two-columns">
              <label className="market-field">Leaving from<span><select value={formData.from} onChange={(e) => setField("from", e.target.value)} required><option value="">Choose a city</option><CityOptions /></select></span></label>
              <label className="market-field">Going to<span><select value={formData.to} onChange={(e) => setField("to", e.target.value)} required><option value="">Choose a city</option><CityOptions /></select></span></label>
            </div>
            {formData.from && formData.from === formData.to && <p className="field-error">Choose two different cities.</p>}
          </fieldset>

          <fieldset className="form-section"><legend><Icon name="calendar" /> Trip details</legend>
            <div className="form-grid two-columns">
              <label className="market-field">Travel date<input type="date" value={formData.travelDate} onChange={(e) => setField("travelDate", e.target.value)} min={new Date().toISOString().split("T")[0]} required /></label>
              <label className="market-field">Available space<select value={formData.availableSpace} onChange={(e) => setField("availableSpace", e.target.value)} required><option value="">Choose a size</option>{Object.entries(SIZE_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
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













// import React, { useState } from "react";
// import { useAuth } from "../../hooks/useAuth";
// import { useStorage } from "../../hooks/useStorage";
// import { ITEM_TYPE_LABELS, SIZE_LABELS, ALL_CITIES } from "../../utils/constants";
// import { styles} from '../../styles/styles';

// const CreateTrip = ({ onClose, onCreate }) => {
//   const { currentUser, getTheme } = useAuth();
//   const { createTrip } = useStorage();
//   const theme = getTheme();

//   const [formData, setFormData] = useState({
//     from: "",
//     to: "",
//     travelDate: "",
//     availableSpace: "",
//     acceptedItems: [],
//     deliveryArea: "",
//   });

//   const toggleItem = (item) => {
//     setFormData((prev) => ({
//       ...prev,
//       acceptedItems: prev.acceptedItems.includes(item)
//         ? prev.acceptedItems.filter((i) => i !== item)
//         : [...prev.acceptedItems, item],
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const trip = createTrip({
//       ...formData,
//       travelerId: currentUser.id,
//       travelerName: currentUser.name,
//     });

//     onCreate?.(trip);
//     onClose?.();
//   };

//   const isValid =
//     formData.from &&
//     formData.to &&
//     formData.from !== formData.to &&
//     formData.travelDate &&
//     formData.availableSpace &&
//     formData.acceptedItems.length > 0;

//   return (
//     <div style={styles.modalOverlay} onClick={onClose}>
//       <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
//         <h2 style={styles.modalTitle}>Post Your Trip</h2>

//         <form onSubmit={handleSubmit} style={styles.form}>
//           <div style={styles.formRow}>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>From *</label>
//               <select
//                 style={styles.select}
//                 value={formData.from}
//                 onChange={(e) => setFormData({ ...formData, from: e.target.value })}
//                 required
//               >
//                 <option value="">Select city</option>
//                 {ALL_CITIES.map((city) => (
//                   <option key={city} value={city}>
//                     {city}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div style={styles.formGroup}>
//               <label style={styles.label}>To *</label>
//               <select
//                 style={styles.select}
//                 value={formData.to}
//                 onChange={(e) => setFormData({ ...formData, to: e.target.value })}
//                 required
//               >
//                 <option value="">Select city</option>
//                 {ALL_CITIES.map((city) => (
//                   <option key={city} value={city}>
//                     {city}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div style={styles.formRow}>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Travel Date *</label>
//               <input
//                 type="date"
//                 style={styles.input}
//                 value={formData.travelDate}
//                 onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
//                 min={new Date().toISOString().split("T")[0]}
//                 required
//               />
//             </div>

//             <div style={styles.formGroup}>
//               <label style={styles.label}>Available Space *</label>
//               <select
//                 style={styles.select}
//                 value={formData.availableSpace}
//                 onChange={(e) => setFormData({ ...formData, availableSpace: e.target.value })}
//                 required
//               >
//                 <option value="">Select space</option>
//                 {Object.keys(SIZE_LABELS).map((key) => (
//                   <option key={key} value={key}>
//                     {SIZE_LABELS[key]}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div style={styles.formGroup}>
//             <label style={styles.label}>Items You Can Carry *</label>
//             <div style={styles.checkboxGroup}>
//               {Object.keys(ITEM_TYPE_LABELS).map((key) => (
//                 <label key={key} style={styles.checkboxLabel}>
//                   <input
//                     type="checkbox"
//                     checked={formData.acceptedItems.includes(key)}
//                     onChange={() => toggleItem(key)}
//                   />
//                   <span style={{ marginLeft: 8 }}>{ITEM_TYPE_LABELS[key]}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div style={styles.formGroup}>
//             <label style={styles.label}>Delivery Area (optional)</label>
//             <input
//               type="text"
//               style={styles.input}
//               value={formData.deliveryArea}
//               onChange={(e) => setFormData({ ...formData, deliveryArea: e.target.value })}
//               placeholder="e.g., Central London only"
//             />
//           </div>

//           <div style={styles.modalActions}>
//             <button type="button" onClick={onClose} style={styles.cancelButton}>
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={!isValid}
//               style={{
//                 ...styles.primaryButton,
//                 backgroundColor: theme.primary,
//                 opacity: isValid ? 1 : 0.5,
//               }}
//             >
//               Post Trip
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateTrip;
