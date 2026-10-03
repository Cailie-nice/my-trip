import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useStorage } from "../../hooks/useStorage";
import Icon from "../common/Icon";

const ProfileView = ({ userId, onBack }) => {
  const { currentUser } = useAuth();
  const {
    getUserById, getTripsByTraveler, getRequestsBySender,
    getDeliveriesByUser, getRatingsByUser, updateProfile, uploadProfilePicture,
  } = useStorage();

  const viewedUserId = userId || currentUser.id;
  const isOwnProfile = viewedUserId === currentUser.id;
  const profile = getUserById(viewedUserId) || (isOwnProfile ? currentUser : null);
  const [name, setName] = useState(profile?.name || "");
  const [routesText, setRoutesText] = useState((profile?.usualRoutes || []).join("\n"));
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(profile?.name || "");
    setRoutesText((profile?.usualRoutes || []).join("\n"));
    setNotice("");
    setError("");
  }, [viewedUserId, profile?.name, profile?.usualRoutes]);

  if (!profile) {
    return (
      <section className="profile-page">
        <button type="button" className="profile-back" onClick={onBack}><Icon name="back" size={18} /> Back to Discover</button>
        <div className="activity-empty"><h3>Profile unavailable</h3><p>This member’s profile could not be loaded.</p></div>
      </section>
    );
  }

  const trips = getTripsByTraveler(viewedUserId);
  const requests = getRequestsBySender(viewedUserId);
  const ownDeliveries = isOwnProfile ? getDeliveriesByUser(viewedUserId) : [];
  const completedCount = isOwnProfile
    ? ownDeliveries.filter((delivery) => delivery.status === "completed").length
    : Number(profile.completedDeliveries || 0);
  const reviews = getRatingsByUser(viewedUserId);
  const initials = (profile.name || "Member").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const ratingLabel = profile.rating == null ? "New member" : `${Number(profile.rating).toFixed(1)} rating`;

  const saveProfile = async (event) => {
    event.preventDefault();
    if (!isOwnProfile) return;
    setSaving(true); setNotice(""); setError("");
    const usualRoutes = routesText.split("\n").map((route) => route.trim()).filter(Boolean).slice(0, 5);
    const result = await updateProfile({ name, usualRoutes });
    setSaving(false);
    if (result.success) setNotice("Profile saved.");
    else setError(result.error || "Could not save your profile.");
  };

  const changePhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !isOwnProfile) return;
    setNotice(""); setError("");
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      setError("Choose a JPG, PNG, or WebP image smaller than 2 MB.");
      return;
    }
    setSaving(true);
    const result = await uploadProfilePicture(file);
    setSaving(false);
    if (result.success) setNotice("Profile picture updated.");
    else setError(result.error || "Could not upload the picture.");
  };

  return (
    <section className="profile-page">
      {!isOwnProfile && <button type="button" className="profile-back" onClick={onBack}><Icon name="back" size={18} /> Back to Discover</button>}
      <header className="page-heading">
        <span className="eyebrow">{isOwnProfile ? "Your Chagga profile" : "Chagga member"}</span>
        <h1>{isOwnProfile ? "Profile" : profile.name}</h1>
        <p>{isOwnProfile ? "Keep it simple—just enough information for another person to recognise you." : "Public profile information and delivery history."}</p>
      </header>

      <div className="profile-layout">
        <aside className="profile-summary-card">
          <div className="profile-avatar-large">
            {profile.avatarUrl ? <img src={profile.avatarUrl} alt={`${profile.name}'s profile`} /> : <span>{initials}</span>}
          </div>
          {isOwnProfile && <label className="photo-upload-button">Change picture<input type="file" accept="image/jpeg,image/png,image/webp" onChange={changePhoto} disabled={saving} /></label>}
          <h2>{profile.name}</h2>
          <p className="profile-rating"><Icon name="star" size={17} /> {ratingLabel}</p>
          <p className="member-since">Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "recently"}</p>
          <div className="profile-stats">
            <div><strong>{trips.length}</strong><span>Trips posted</span></div>
            <div><strong>{requests.length}</strong><span>Requests made</span></div>
            <div><strong>{completedCount}</strong><span>Completed</span></div>
          </div>
        </aside>

        <div className="profile-main-card">
          {isOwnProfile ? (
            <form onSubmit={saveProfile} className="profile-form">
              <div><h2>Basic information</h2><p>This information is visible to other signed-in members.</p></div>
              <label className="market-field">Full name<input value={name} onChange={(event) => setName(event.target.value)} maxLength="100" required /></label>
              <label className="market-field">Usual routes <small>Optional, one route per line</small><textarea value={routesText} onChange={(event) => setRoutesText(event.target.value)} placeholder={"Nairobi → Bujumbura\nBujumbura → Kigali"} maxLength="500" /></label>
              <p className="profile-hint">Add up to five routes you travel regularly. You can change these at any time.</p>
              {notice && <div className="notice notice-success">{notice}</div>}
              {error && <div className="notice notice-error" role="alert">{error}</div>}
              <button className="primary-action profile-save" disabled={saving || !name.trim()}>{saving ? "Saving…" : "Save profile"}</button>
            </form>
          ) : (
            <section className="public-profile-routes">
              <h2>Usual routes</h2>
              {(profile.usualRoutes || []).length === 0
                ? <p>No usual routes added yet.</p>
                : <div className="route-tags">{profile.usualRoutes.map((route) => <span key={route}><Icon name="route" size={16} /> {route}</span>)}</div>}
            </section>
          )}

          <section className="profile-reviews">
            <h2>Recent ratings</h2>
            {reviews.length === 0 ? <p>No ratings yet. Ratings appear after a completed delivery.</p> : reviews.slice(0, 3).map((review) => <article key={review.id}><strong>{review.stars}/5</strong>{review.comment && <p>{review.comment}</p>}</article>)}
          </section>
        </div>
      </div>
    </section>
  );
};

export default ProfileView;
