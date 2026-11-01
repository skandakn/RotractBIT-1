import BackgroundBlobs from './components/BackgroundBlobs';
import BackToTop from './components/BackToTop';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import SocialBar from './components/SocialBar';
import SplashScreen from './components/SplashScreen';
import Router from './router';

export default function App() {
  return (
    <>
      <SplashScreen />
      <BackgroundBlobs />
      <Navbar />
      <Router />
      <SocialBar />
      <Footer />
      <BackToTop />
      <PWAInstallPrompt />
    </>
  );
}
