import React, { useMemo, useState } from "react";
import { useStorage } from "../../hooks/useStorage";
import { ITEM_TYPE_LABELS } from "../../utils/constants";
import LocationFields from "../common/LocationFields";
import Icon from "../common/Icon";

const weightBand = (weight) => {
  const value = Number(weight);
  if (value <= 1) return "light";
  if (value <= 3) return "standard";
  if (value <= 5) return "large";
  if (value <= 10) return "extra_large";
  return "heavy";
};

const CreateRequest = ({ onClose, onCreate }) => {
  const { createRequest, platformSettings } = useStorage();
  const [formData, setFormData] = useState({ itemType: "", originCityId: "", destinationCityId: "", from: "", to: "", neededBy: "", estimatedWeightKg: "", declaredValueUsd: "", otherItemDescription: "", description: "" });
  const [safetyAccepted, setSafetyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const setField = (field, value) => setFormData((previous) => ({ ...previous, [field]: value }));
  const pricing = platformSettings.pricing || {};

  const quote = useMemo(() => {
    const weight = Number(formData.estimatedWeightKg);
    const declaredValue = Number(formData.declaredValueUsd || 0);
    if (!weight || weight <= 0) return null;
    const billableWeight = Math.max(weight, Number(pricing.minimum_billable_weight_kg || 1));
    const delivery = billableWeight * Number(pricing.price_per_kg || 7);
    const service = delivery < 50 ? Number(pricing.service_fee_below_50 || 5) : Number(pricing.service_fee_from_50 || 10);
    const protection = Math.max(Number(pricing.minimum_protection_fee || 1), Math.min(declaredValue * Number(pricing.protection_rate || .03), Number(pricing.maximum_protection_fee || 10)));
    return { billableWeight, delivery, service, protection, total: delivery + service + protection };
  }, [formData.estimatedWeightKg, formData.declaredValueUsd, pricing]);

  const otherIsValid = formData.itemType !== "other" || formData.otherItemDescription.trim().length >= 3;
  const isValid = formData.itemType && formData.originCityId && formData.destinationCityId && formData.neededBy && Number(formData.estimatedWeightKg) > 0 && otherIsValid && safetyAccepted;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true); setError("");
    try {
      const request = await createRequest({ ...formData, size: weightBand(formData.estimatedWeightKg) });
      onCreate?.(request); onClose?.();
    } catch (submitError) {
      setError(submitError.message || "Your delivery request could not be posted.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="market-modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <section className="market-modal" role="dialog" aria-modal="true" aria-labelledby="request-modal-title">
        <header className="market-modal-header">
          <span className="modal-icon"><Icon name="box" size={24} /></span>
          <div><span className="eyebrow">Send it with care</span><h2 id="request-modal-title">Post a delivery request</h2><p>No payment is taken when you post. First, find and confirm a traveller.</p></div>
          <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        </header>

        <form className="market-form" onSubmit={handleSubmit}>
          <fieldset className="form-section"><legend><Icon name="box" /> What are you sending?</legend>
            <div className="choice-grid package-choice-grid">{Object.entries(ITEM_TYPE_LABELS).map(([key, label]) => <label className={formData.itemType === key ? "choice-card selected" : "choice-card"} key={key}><input type="radio" name="itemType" value={key} checked={formData.itemType === key} onChange={(event) => setField("itemType", event.target.value)} /><Icon name={key === "documents" ? "send" : "box"} /><span>{label}</span><Icon name="check" className="choice-check" /></label>)}</div>
          </fieldset>

          {formData.itemType === "other" && <label className="market-field">Describe the item<input value={formData.otherItemDescription} onChange={(event) => setField("otherItemDescription", event.target.value)} maxLength="160" required /></label>}

          <fieldset className="form-section"><legend><Icon name="route" /> Delivery route</legend>
            <LocationFields originCityId={formData.originCityId} destinationCityId={formData.destinationCityId} onChange={(location) => setFormData((previous) => ({ ...previous, ...location }))} />
          </fieldset>

          <fieldset className="form-section"><legend><Icon name="calendar" /> Package and timing</legend>
            <div className="form-grid two-columns">
              <label className="market-field">Needed by<input type="date" value={formData.neededBy} onChange={(event) => setField("neededBy", event.target.value)} min={new Date().toISOString().split("T")[0]} required /></label>
              <label className="market-field">Estimated weight (kg)<input type="number" min="0.1" max="100" step="0.1" value={formData.estimatedWeightKg} onChange={(event) => setField("estimatedWeightKg", event.target.value)} placeholder="For example, 2.4" required /></label>
              <label className="market-field">Declared item value (USD)<input type="number" min="0" max="100000" step="0.01" value={formData.declaredValueUsd} onChange={(event) => setField("declaredValueUsd", event.target.value)} placeholder="For example, 80" /></label>
            </div>
          </fieldset>

          <label className="market-field">Item details <small>Recommended</small><textarea maxLength="600" value={formData.description} onChange={(event) => setField("description", event.target.value)} placeholder="Describe the exact contents, packaging, and whether the traveller can inspect it." /><span className="character-count">{formData.description.length}/600</span></label>

          {quote && <section className="quote-preview"><header><strong>Estimated price after a traveller is confirmed</strong><span>{weightBand(formData.estimatedWeightKg).replace("_", " ")}</span></header><div><span>Delivery ({quote.billableWeight.toFixed(1)} kg × ${Number(pricing.price_per_kg || 7).toFixed(2)})</span><strong>${quote.delivery.toFixed(2)}</strong></div><div><span>Chagga service fee</span><strong>${quote.service.toFixed(2)}</strong></div><div><span>Chagga Protection</span><strong>${quote.protection.toFixed(2)}</strong></div><footer><span>Estimated total</span><strong>${quote.total.toFixed(2)}</strong></footer><small>This is an estimate only. Payment remains disabled until Chagga’s verified payment provider is connected. Chagga Protection is not insurance; its final coverage terms must be published before payments are enabled.</small></section>}

          <label className="safety-confirmation"><input type="checkbox" checked={safetyAccepted} onChange={(event) => setSafetyAccepted(event.target.checked)} /><span><strong>I confirm this item can be opened and inspected.</strong> It is not cash, dangerous, illegal, restricted, or an unidentified sealed package.</span></label>
          {error && <p className="form-submit-error" role="alert">{error}</p>}
          <footer className="market-modal-actions"><button type="button" className="secondary-action" onClick={onClose}>Cancel</button><button type="submit" className="primary-action" disabled={!isValid || isSubmitting}>{isSubmitting ? "Posting…" : "Post request"}</button></footer>
        </form>
      </section>
    </div>
  );
};

export default CreateRequest;
