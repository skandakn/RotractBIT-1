import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, X } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
export default function GalleryPage() {
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
    "/images/Gallery1.jpeg",
    "/images/Gallery2.jpeg",
    "/images/Gallery3.jpeg",
    "/images/Gallery4.jpeg",
    "/images/Gallery5.jpeg",
    "/images/Gallery6.jpeg",
    "/images/Gallery7.jpeg",
    "/images/Gallery8.png",
    "/images/Gallery9.png",
    "/images/Gallery10.png",
    "/images/Gallery11.png",
    "/images/Gallery12.png",
    "/images/Gallery14.png",
    "/images/Gallery15.png",
    "/images/Gallery16.jpeg",
    "/images/Gallery17.jpeg",
    "/images/Gallery18.jpg",
    "/images/Gallery19.jpg",
    "/images/Gallery20.jpg",
    "/images/Gallery21.jpg"
  ], []);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
    <section style={{ paddingTop: "140px", paddingBottom: "100px", maxWidth: "1200px", margin: "0 auto", paddingLeft: "5vw", paddingRight: "5vw", minHeight: "100vh" }}>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", fontSize: "2.5rem", color: "var(--text-primary)", marginBottom: "40px", textTransform: "uppercase" }}
      >
        Image Gallery
      </motion.h1>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
        gap: "25px"
      }}>
        {images.map((img, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, zIndex: 10, boxShadow: "0 20px 40px rgba(0,0,0,0.15)", rotate: i % 2 === 0 ? 2 : -2 }}
            transition={{ duration: 0.4 }}
            onClick={() => openModal(i)}
            style={{ borderRadius: "12px", overflow: "hidden", height: "300px", background: "var(--bg-secondary)", cursor: "pointer", border: "1px solid rgba(0,0,0,0.05)" }}
          >
            <img src={img} alt={`Gallery highlight ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
        ))}
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
              top: "20px",
              right: "20px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "white",
              cursor: "pointer",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "0.2s",
              zIndex: 10000
            }}
            onMouseOver={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.2)"}
            onMouseOut={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.1)"}
          >
            <X size={32} />
          </button>

          {/* Previous Button */}
          <button 
            onClick={showPrev}
            style={{
              position: "absolute",
              left: "20px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "white",
              cursor: "pointer",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "0.2s",
              zIndex: 10000
            }}
            onMouseOver={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.2)"}
            onMouseOut={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.1)"}
          >
            <ArrowLeft size={32} />
          </button>

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
              maxWidth: "85%", 
              maxHeight: "85vh", 
              objectFit: "contain",
              borderRadius: "8px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              userSelect: "none"
            }} 
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next Button */}
          <button 
            onClick={showNext}
            style={{
              position: "absolute",
              right: "20px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "white",
              cursor: "pointer",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "0.2s",
              zIndex: 10000
            }}
            onMouseOver={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.2)"}
            onMouseOut={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.1)"}
          >
            <ArrowRight size={32} />
          </button>

          {/* Image Counter */}
          <div style={{
            position: "absolute",
            bottom: "30px",
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
