import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, X } from "lucide-react";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";

export default function Gallery() {
  const scrollRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);  }, []);

  const images = useMemo(() => [
    "/images/Team_2026_1.jpg",
    "/images/Team_2026_2.png",
    "/images/Utthana_2026_1.jpg",
    "/images/Utthana_2026_2.png",
    "/images/Utthana_2026_3.png",
    "/images/BOD_Connect_1.png",
    "/images/BOD_Connect_1_2.png",
    "/images/BOD_Connect_1_3.png",
    "/images/BOD_Connect_2.png",
    "/images/BOD_Connect_2_2.png",
    "/images/BOD_Connect_2_3.png",
    "/images/BOD_Connect_2_4.png",
    "/images/Ganeshotsav_2026_2.jpg",
    "/images/Ganeshotsav_2026_1.jpg",
    "/images/Ganeshotsav_2026_3.png",
    "/images/Project_Vidya_1.jpg",
    "/images/Project_Vidya_2.png",
    "/images/Project_Vidya_3.jpg",
    "/images/Project_Vidya_4.png",
    "/images/Bond_and_Beyond_1.png",
    "/images/Bond_and_Beyond_2.png",
    "/images/Bond_and_Beyond_3.png",
    "/images/Gallery18.jpg",
    "/images/Gallery19.jpg",
    "/images/Gallery20.jpg",
    "/images/Gallery21.jpg",
    "/images/Gallery17.jpeg",
    "/images/Gallery3.jpeg",
    "/images/Gallery4.jpeg",
    "/images/Gallery6.jpeg",
    "/images/Gallery7.jpeg",
    "/images/Gallery2.jpeg",
    "/images/Gallery9.png",
    "/images/Gallery1.jpeg",
    "/images/Gallery11.png",
    "/images/Gallery12.png",
    "/images/Gallery5.jpeg",
    "/images/Gallery15.png",
    "/images/Gallery16.jpeg"
  ], []);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
  };

  const openModal = (idx) => {
    setSelectedIndex(idx);
    setSelectedImage(images[idx]);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const showNext = useCallback((e) => {
    if (e) e.stopPropagation();
    const newIdx = (selectedIndex + 1) % images.length;
    setSelectedIndex(newIdx);
    setSelectedImage(images[newIdx]);
  }, [selectedIndex, images]);

  const showPrev = useCallback((e) => {
    if (e) e.stopPropagation();
    const newIdx = (selectedIndex - 1 + images.length) % images.length;
    setSelectedIndex(newIdx);
    setSelectedImage(images[newIdx]);
  }, [selectedIndex, images]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, showNext, showPrev]);

  return (
    <>
      <section style={{ padding: "80px 0 80px 5vw", overflow: "hidden" }}>
        <h2 style={{ fontSize: "2.5rem", color: "var(--text-primary)", marginBottom: "40px" }}>Image Gallery</h2>

        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: "30px",
            overflowX: "auto",
            scrollbarWidth: "none",
            scrollSnapType: "x mandatory",
            paddingBottom: "20px"
          }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>

          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              onClick={() => openModal(idx)}
              style={{
                minWidth: isMobile ? "300px" : "350px",
                height: isMobile ? "300px" : "350px",
                scrollSnapAlign: "start",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <img src={img} alt={`Gallery ${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"} />
            </motion.div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", paddingRight: "5vw", marginTop: "20px" }}>
          <button onClick={scrollLeft} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
            <ArrowLeft size={24} />
          </button>
          <button onClick={scrollRight} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-primary)" }}>
            <ArrowRight size={24} />
          </button>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              zIndex: 9999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: isMobile ? "20px" : "30px",
                right: isMobile ? "20px" : "40px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                color: "white",
                cursor: "pointer",
                borderRadius: "50%",
                width: isMobile ? "40px" : "50px",
                height: isMobile ? "40px" : "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "0.2s",
                zIndex: 10000
              }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
              onMouseOut={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
            >
              <X size={isMobile ? 24 : 32} />
            </button>

            {!isMobile && (
              <button
                onClick={showPrev}
                style={{
                  position: "absolute",
                  left: "40px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "50%",
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "0.2s",
                  zIndex: 10000
                }}
                onMouseOver={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
                onMouseOut={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
              >
                <ArrowLeft size={36} />
              </button>
            )}

            {/* Main Image */}
            <motion.img
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              src={selectedImage}
              alt="Gallery Fullscreen"
              style={{
                maxWidth: isMobile ? "90%" : "80%",
                maxHeight: isMobile ? "70vh" : "85vh",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                userSelect: "none"
              }}
              onClick={(e) => {
                if (isMobile) {
                  showNext();
                } else {
                  e.stopPropagation();
                }
              }}
            />

            {!isMobile && (
              <button
                onClick={showNext}
                style={{
                  position: "absolute",
                  right: "40px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "50%",
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "0.2s",
                  zIndex: 10000
                }}
                onMouseOver={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
                onMouseOut={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
              >
                <ArrowRight size={36} />
              </button>
            )}

            {/* Image Counter */}
            <div style={{
              position: "absolute",
              bottom: "40px",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "500",
              background: "rgba(0,0,0,0.5)",
              padding: "8px 20px",
              borderRadius: "30px",
              letterSpacing: "1px"
            }}>
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
