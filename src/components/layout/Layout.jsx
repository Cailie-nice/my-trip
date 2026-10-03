import React, { useState } from "react";
import Header from "./Header";
import Navigation from "./Navigation";


import FeedView from "../feed/FeedView";
import ActivityView from "../activity/ActivityView";
import ChatView from "../chat/ChatView";
import ProfileView from "../profile/ProfileView";

const Layout = () => {
  const [activeView, setActiveView] = useState("feed");
  const [profileUserId, setProfileUserId] = useState(null);

  const handleViewChange = (view) => { if (view === "profile") setProfileUserId(null); setActiveView(view); };
  const openProfile = (userId) => { if (!userId) return; setProfileUserId(userId); setActiveView("profile"); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const renderView = () => {
    switch (activeView) {
      case "feed":
        return <FeedView onOpenProfile={openProfile} />;
      case "activity":
        return <ActivityView onOpenProfile={openProfile} />;
      case "chat":
        return <ChatView />;
      case "profile":
        return <ProfileView userId={profileUserId} onBack={() => handleViewChange("feed")} />;
      default:
        return <FeedView />;
    }
  };

  return (
    <div className="app-shell">
      <Header />
      <Navigation activeView={activeView} onViewChange={handleViewChange} />
      <main className="app-main">{renderView()}</main>
    </div>
  );
};

export default Layout;
