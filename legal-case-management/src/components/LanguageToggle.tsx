/**
 * Language Toggle component for Hindi/English switching.
 */
import { useAuth } from "../context/AuthContext";
import { legalTranslations } from "../utils/hindiUtils";

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useAuth();
  const label = legalTranslations[language].toggleLanguage;

  return (
    <button
      type="button"
      className="language-toggle"
      onClick={() => setLanguage(language === "en" ? "hi" : "en")}
      aria-label={label}
      title={label}
    >
      {language === "hi" ? "EN" : "हिंदी"}
    </button>
  );
};

export default LanguageToggle;
