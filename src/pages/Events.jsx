import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Search, Image as ImageIcon, Sparkles, History } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { eventsData } from "../data/eventsData";

const CATEGORIES = [
  { label: "All Updates", value: "All" },
  { label: "Activities", value: "Activity" },
  { label: "Meetings", value: "Meeting" },
  { label: "Installations", value: "Installation" },
  { label: "Projects", value: "Project" }
];

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

export default function Events() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState("2026–2027");
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(12);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute counts for the year buttons
  const countsByYear = useMemo(() => {
    let y2026 = 0;
    let y2025 = 0;
    eventsData.forEach(e => {
      const year = e.rotaractYear || (e.date >= new Date("2026-07-01") ? "2026–2027" : "2025–2026");
      if (year === "2026–2027") y2026++;
      else y2025++;
    });
    return {
      "2026–2027": y2026,
      "2025–2026": y2025,
      all: eventsData.length
    };
  }, []);

  // Filter and format all events
  const allFilteredEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let result = eventsData.map(e => {
      const year = e.rotaractYear || (e.date >= new Date("2026-07-01") ? "2026–2027" : "2025–2026");
      return {
        ...e,
        rotaractYear: year,
        status: e.date >= today ? "Upcoming" : "Completed",
        formattedDate: e.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        displayImage: e.image && e.image.includes("placeholder") ? FALLBACK_IMAGE : e.image || FALLBACK_IMAGE,
      };
    });

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        e =>
          e.title.toLowerCase().includes(lowerSearch) ||
          e.location.toLowerCase().includes(lowerSearch) ||
          e.description.toLowerCase().includes(lowerSearch)
      );
    }

    // Category filter
    if (activeTab !== "All") {
      result = result.filter(e => e.category === activeTab);
    }

    // Date status filter
    if (dateFilter !== "All") {
      result = result.filter(e => e.status === dateFilter);
    }

    // Sort by date descending
    result.sort((a, b) => b.date - a.date);

    return result;
  }, [searchTerm, activeTab, dateFilter]);

  // Split into 2026–2027 and 2025–2026
  const events2026 = useMemo(() => {
    return allFilteredEvents.filter(e => e.rotaractYear === "2026–2027");
  }, [allFilteredEvents]);

  const events2025 = useMemo(() => {
    return allFilteredEvents.filter(e => e.rotaractYear === "2025–2026");
  }, [allFilteredEvents]);

  // Current list depending on selectedYear tab
  const activeEventsList = useMemo(() => {
    if (selectedYear === "2026–2027") return events2026;
    if (selectedYear === "2025–2026") return events2025;
    return allFilteredEvents;
  }, [selectedYear, events2026, events2025, allFilteredEvents]);

  const displayedEvents = activeEventsList.slice(0, visibleCount);

  // Render individual event card
  const renderEventCard = (event) => (
    <motion.div
      layout
      key={event.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        border: "1px solid rgba(128,128,128,0.12)",
        borderRadius: "18px"
      }}
      onClick={() => navigate(`/events/${event.id}`)}
      whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(217, 27, 92, 0.25)" }}
    >
      {/* Category Tag */}
      <div style={{
        position: "absolute",
        top: "14px",
        left: "14px",
        background: "rgba(255, 255, 255, 0.95)",
        color: "var(--accent-pink)",
        padding: "5px 12px",
        borderRadius: "30px",
        fontSize: "0.75rem",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.8px",
        zIndex: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
      }}>
        {event.category}
      </div>

      {/* Year Pill & Status */}
      <div style={{
        position: "absolute",
        top: "14px",
        right: "14px",
        display: "flex",
        gap: "6px",
        zIndex: 2
      }}>
        <div style={{
          background: event.rotaractYear === "2026–2027" ? "rgba(217, 27, 92, 0.9)" : "rgba(30, 41, 59, 0.85)",
          color: "#ffffff",
          padding: "5px 10px",
          borderRadius: "30px",
          fontSize: "0.72rem",
          fontWeight: "700",
          backdropFilter: "blur(6px)",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
        }}>
          {event.rotaractYear}
        </div>
      </div>

      {/* Image Preview */}
      <div style={{ height: "220px", overflow: "hidden", position: "relative" }}>
        <motion.img
          src={event.displayImage}
          alt={event.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Card Content */}
      <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontSize: "1.25rem", marginBottom: "12px", color: "var(--text-primary)", lineHeight: "1.35", fontWeight: "700" }}>
          {event.title}
        </h3>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "0.88rem", fontWeight: "500" }}>
            <Calendar size={15} color="var(--accent-pink)" />
            {event.formattedDate}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "0.88rem", fontWeight: "500" }}>
            <MapPin size={15} color="var(--accent-pink)" />
            <span style={{ maxWidth: "160px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {event.location}
            </span>
          </div>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: "1.55", flex: 1, marginBottom: "20px" }}>
          {event.description}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "14px", borderTop: "1px solid rgba(128,128,128,0.1)" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--text-light)" }}>
            {event.monthYear}
          </span>
          <span style={{ color: "var(--accent-pink)", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.88rem" }}>
            Details <ArrowRight size={15} />
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section style={{ minHeight: "100vh", position: "relative", paddingTop: "120px", paddingBottom: "100px" }}>
      
      {/* Page Header */}
      <div className="section-header" style={{ marginBottom: "35px" }}>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Club Platform: Events & Projects
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Explore our activities, meetings, installations, and community projects organized by tenure.
        </motion.p>
      </div>

      {/* 2-Section Year Selector Toggle */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto 35px",
        padding: "0 15px"
      }}>
        <div style={{
          display: "inline-flex",
          background: "rgba(128, 128, 128, 0.08)",
          padding: "6px",
          borderRadius: "40px",
          border: "1px solid rgba(217, 27, 92, 0.25)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.05)",
          gap: "8px",
          flexWrap: "wrap",
          justifyContent: "center"
        }}>
          {[
            { id: "2026–2027", label: "2026–2027", icon: <Sparkles size={16} />, subtitle: "Current Tenure", count: countsByYear["2026–2027"] },
            { id: "2025–2026", label: "2025–2026", icon: <History size={16} />, subtitle: "Past Tenure", count: countsByYear["2025–2026"] },
            { id: "All", label: "All Years", icon: <Calendar size={16} />, subtitle: "Complete Archive", count: countsByYear.all }
          ].map((tab) => {
            const isActive = selectedYear === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedYear(tab.id);
                  setVisibleCount(12);
                }}
                style={{
                  padding: isMobile ? "8px 16px" : "10px 24px",
                  borderRadius: "30px",
                  border: "none",
                  background: isActive ? "linear-gradient(135deg, var(--accent-pink, #D91B5C), #FF3377)" : "transparent",
                  color: isActive ? "#ffffff" : "var(--text-secondary)",
                  fontWeight: isActive ? "700" : "600",
                  fontSize: isMobile ? "0.88rem" : "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: isActive ? "0 4px 16px rgba(217, 27, 92, 0.35)" : "none"
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span style={{
                  background: isActive ? "rgba(255, 255, 255, 0.25)" : "rgba(128, 128, 128, 0.15)",
                  color: isActive ? "#ffffff" : "var(--text-secondary)",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  fontWeight: "700"
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Pills */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "25px"
      }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => { setActiveTab(cat.value); setVisibleCount(12); }}
            style={{
              padding: "8px 20px",
              borderRadius: "50px",
              border: `2px solid ${activeTab === cat.value ? "var(--accent-pink)" : "rgba(128,128,128,0.2)"}`,
              background: activeTab === cat.value ? "var(--accent-pink)" : "transparent",
              color: activeTab === cat.value ? "white" : "var(--text-secondary)",
              fontWeight: "600",
              fontSize: "0.88rem",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search and Date Filter Bar */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        maxWidth: "1200px",
        margin: "0 auto 40px auto",
        padding: isMobile ? "15px" : "18px 22px",
        background: "var(--bg-secondary)",
        borderRadius: "16px",
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)",
        flexDirection: isMobile ? "column" : "row",
        border: "1px solid rgba(128,128,128,0.15)"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flex: "1",
          minWidth: isMobile ? "100%" : "250px",
          background: "var(--bg-primary)",
          padding: "10px 18px",
          borderRadius: "12px"
        }}>
          <Search size={18} color="var(--text-light)" />
          <input
            type="text"
            placeholder="Search events, locations, descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              width: "100%",
              color: "var(--text-primary)",
              fontSize: "0.95rem"
            }}
          />
        </div>
        
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: "10px 18px",
              borderRadius: "12px",
              border: "1px solid rgba(128,128,128,0.2)",
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
              fontWeight: "500",
              outline: "none",
              cursor: "pointer",
              appearance: "none",
              width: isMobile ? "100%" : "auto",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23d91b5c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 15px center",
              paddingRight: "45px"
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* If 'All' is selected, render both sections explicitly */}
        {selectedYear === "All" ? (
          <div>
            {/* Section 1: 2026-2027 */}
            <div style={{ marginBottom: "60px" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
                paddingBottom: "12px",
                borderBottom: "2px solid rgba(217, 27, 92, 0.25)",
                flexWrap: "wrap",
                gap: "10px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.6rem" }}>🌟</span>
                  <h3 style={{ margin: 0, fontSize: "1.6rem", color: "var(--text-primary)", fontWeight: "800" }}>
                    Rotaract Year 2026–2027
                  </h3>
                </div>
                <span style={{
                  background: "rgba(217, 27, 92, 0.12)",
                  color: "var(--accent-pink)",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "0.82rem",
                  fontWeight: "700"
                }}>
                  {events2026.length} Events
                </span>
              </div>

              {events2026.length > 0 ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "280px" : "340px"}, 1fr))`,
                  gap: "30px",
                }}>
                  <AnimatePresence>
                    {events2026.map(renderEventCard)}
                  </AnimatePresence>
                </div>
              ) : (
                <p style={{ color: "var(--text-light)", textAlign: "center", padding: "30px 0" }}>
                  No 2026–2027 events match the current search or filters.
                </p>
              )}
            </div>

            {/* Section 2: 2025-2026 */}
            <div>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
                paddingBottom: "12px",
                borderBottom: "2px solid rgba(128, 128, 128, 0.2)",
                flexWrap: "wrap",
                gap: "10px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.6rem" }}>🏛️</span>
                  <h3 style={{ margin: 0, fontSize: "1.6rem", color: "var(--text-primary)", fontWeight: "800" }}>
                    Rotaract Year 2025–2026
                  </h3>
                </div>
                <span style={{
                  background: "rgba(128, 128, 128, 0.12)",
                  color: "var(--text-secondary)",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "0.82rem",
                  fontWeight: "700"
                }}>
                  {events2025.length} Events
                </span>
              </div>

              {events2025.length > 0 ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "280px" : "340px"}, 1fr))`,
                  gap: "30px",
                }}>
                  <AnimatePresence>
                    {events2025.map(renderEventCard)}
                  </AnimatePresence>
                </div>
              ) : (
                <p style={{ color: "var(--text-light)", textAlign: "center", padding: "30px 0" }}>
                  No 2025–2026 events match the current search or filters.
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Single Selected Year View */
          <div>
            {/* Section Header Banner */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "28px",
              paddingBottom: "14px",
              borderBottom: `2px solid ${selectedYear === "2026–2027" ? "rgba(217, 27, 92, 0.3)" : "rgba(128, 128, 128, 0.2)"}`,
              flexWrap: "wrap",
              gap: "10px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "1.7rem" }}>
                  {selectedYear === "2026–2027" ? "🌟" : "🏛️"}
                </span>
                <h3 style={{ margin: 0, fontSize: "1.7rem", color: "var(--text-primary)", fontWeight: "800" }}>
                  Rotaract Year {selectedYear}
                </h3>
              </div>
              <span style={{
                background: selectedYear === "2026–2027" ? "rgba(217, 27, 92, 0.12)" : "rgba(128, 128, 128, 0.12)",
                color: selectedYear === "2026–2027" ? "var(--accent-pink)" : "var(--text-secondary)",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: "700"
              }}>
                {activeEventsList.length} Events
              </span>
            </div>

            {displayedEvents.length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "280px" : "340px"}, 1fr))`,
                gap: "35px",
              }}>
                <AnimatePresence>
                  {displayedEvents.map(renderEventCard)}
                </AnimatePresence>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-secondary)" }}>
                <ImageIcon size={48} color="var(--text-light)" style={{ margin: "0 auto 15px auto", opacity: 0.5 }} />
                <h3>No events found for {selectedYear}</h3>
                <p>Try adjusting your search query or category filters.</p>
              </div>
            )}

            {visibleCount < activeEventsList.length && (
              <div style={{ textAlign: "center", marginTop: "50px" }}>
                <button
                  className="btn"
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  style={{
                    background: "linear-gradient(135deg, var(--accent-pink, #D91B5C), #FF3377)",
                    color: "#ffffff",
                    border: "none",
                    padding: "12px 28px",
                    borderRadius: "30px",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(217, 27, 92, 0.3)"
                  }}
                >
                  Load More Events <ArrowRight size={18} style={{ marginLeft: "8px", verticalAlign: "middle" }} />
                </button>
              </div>
            )}
          </div>
        )}

      </div>

    </section>
  );
}
