import React, { useState } from "react";
import { useStorage } from "../../hooks/useStorage";
import ChaggaLogo from "../common/ChaggaLogo";
import Icon from "../common/Icon";
import RequestCard from "../feed/RequestCard";
import TravelerCard from "../feed/TravelerCard";

const PublicMarketplace = ({ onLogin }) => {
  const { getActiveTrips, getActiveRequests, isMarketplaceLoading, marketplaceError, refreshMarketplace } = useStorage();
  const [view, setView] = useState("trips");
  const items = view === "trips" ? getActiveTrips() : getActiveRequests();

  return (
    <div className="public-marketplace">
      <header className="public-header"><div className="brand-lockup"><ChaggaLogo /></div><button className="primary-action" onClick={onLogin}>Sign in or create account</button></header>
      <main className="public-main">
        <section className="public-hero"><div><span className="eyebrow">People-powered delivery</span><h1>See where Chagga is moving.</h1><p>Browse upcoming trips and delivery requests before creating an account. Sign in only when you are ready to connect.</p></div><div className="public-hero-mark" aria-hidden="true"><Icon name="bag" size={42} /></div></section>
        <nav className="public-toggle" aria-label="Marketplace view"><button className={view === "trips" ? "active" : ""} onClick={() => setView("trips")}>Available trips</button><button className={view === "requests" ? "active" : ""} onClick={() => setView("requests")}>Delivery requests</button></nav>
        <div className="public-safety"><Icon name="shield" size={18} /><span>Public listings never show private contact details. Sign in to contact someone or view a full member profile.</span></div>
        {marketplaceError && <div className="notice notice-error">Marketplace could not load: {marketplaceError} <button className="text-button" onClick={refreshMarketplace}>Try again</button></div>}
        <div className="feed-grid">
          {isMarketplaceLoading ? <div className="empty-state"><h3>Loading marketplace</h3></div> : items.length === 0 ? <div className="empty-state"><h3>No public {view} yet</h3><p>Check again soon as the early Chagga community grows.</p></div> : view === "trips" ? items.map((trip) => <TravelerCard key={trip.id} trip={trip} onSendRequest={onLogin} publicMode />) : items.map((request) => <RequestCard key={request.id} request={request} onHelp={onLogin} publicMode />)}
        </div>
      </main>
      <footer className="public-footer"><span>Chagga early access</span><button onClick={onLogin}>Log in or create an account to continue</button></footer>
    </div>
  );
};

export default PublicMarketplace;
