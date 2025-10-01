import { useEffect } from "react";
import "../css/CelebrationBanner.css";

const CelebrationBanner = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // auto-close after 3 seconds
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="celebration-banner">
      🎉 Shopping Complete! ✅
    </div>
  );
};

export default CelebrationBanner;