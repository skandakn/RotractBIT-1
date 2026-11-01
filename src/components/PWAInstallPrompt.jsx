import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share, WifiOff, Wifi, Check, Smartphone } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showOnlineToast, setShowOnlineToast] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // 1. Check if already installed / running in standalone mode
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // 2. Check if iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 3. Listen for PWA install prompt event
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if dismissed recently in this session
      const dismissed = sessionStorage.getItem('pwa_prompt_dismissed');
      if (!dismissed) {
        // Small delay so page loads smoothly first
        setTimeout(() => setShowPrompt(true), 2500);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 4. Listen for app installed event
    const handleAppInstalled = () => {
      setInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('[PWA] App successfully installed!');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 5. Network status monitoring
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineToast(true);
      setTimeout(() => setShowOnlineToast(false), 3500);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
        setInstalled(true);
        setShowPrompt(false);
      } else {
        console.log('[PWA] User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  // If already running standalone or installed, don't show install banner
  const shouldShowBanner = showPrompt && !isStandalone && !installed;

  return (
    <>
      {/* Offline Status Warning Bar */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 99999,
              background: 'linear-gradient(90deg, #b91c1c, #dc2626)',
              color: '#ffffff',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '0.88rem',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            <WifiOff size={18} />
            <span>You are offline. Showing cached pages and resources.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Online Toast */}
      <AnimatePresence>
        {showOnlineToast && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 99999,
              background: 'linear-gradient(90deg, #15803d, #16a34a)',
              color: '#ffffff',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '0.88rem',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            <Wifi size={18} />
            <span>Connection restored! You are back online.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating PWA Install Card */}
      <AnimatePresence>
        {shouldShowBanner && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 9998,
              maxWidth: '380px',
              width: 'calc(100vw - 48px)',
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(217, 27, 92, 0.3)',
              borderRadius: '18px',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.25)',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src="/icons/icon-96.png"
                  alt="Rotaract BIT App"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(217, 27, 92, 0.3)',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                    Rotaract Club of BIT
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>
                    Install for offline access & faster app experience
                  </p>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-light)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                }}
                aria-label="Dismiss"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button
                onClick={handleInstallClick}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, var(--accent-pink, #D91B5C), #FF3377)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(217, 27, 92, 0.35)',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <Download size={16} />
                <span>Install App</span>
              </button>

              <button
                onClick={handleDismiss}
                style={{
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid rgba(150, 150, 150, 0.2)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Install Instructions Modal */}
      <AnimatePresence>
        {showIOSModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setShowIOSModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: '24px',
                padding: '28px 24px',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                textAlign: 'center',
                position: 'relative',
                border: '1px solid rgba(217, 27, 92, 0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowIOSModal(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-light)',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              <img
                src="/icons/icon-192.png"
                alt="Rotaract BIT"
                style={{ width: '64px', height: '64px', borderRadius: '16px', marginBottom: '16px' }}
              />

              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                Install on iPhone or iPad
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: '0 0 20px 0' }}>
                Follow these simple steps in Safari to add Rotaract BIT to your Home Screen:
              </p>

              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(217, 27, 92, 0.15)',
                    color: 'var(--accent-pink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}>1</div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Tap the <strong>Share</strong> button <Share size={16} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> in Safari's toolbar.
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(217, 27, 92, 0.15)',
                    color: 'var(--accent-pink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}>2</div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Scroll down and select <strong>Add to Home Screen</strong>.
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(217, 27, 92, 0.15)',
                    color: 'var(--accent-pink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}>3</div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Tap <strong>Add</strong> in the top-right corner. Enjoy the native app!
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                style={{
                  width: '100%',
                  background: 'var(--accent-pink)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                Got It!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
