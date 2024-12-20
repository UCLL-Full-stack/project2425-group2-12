import { withAuth } from "@/components/withAuth";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import i18n from "../i18n"; // Ensure this points to your setup file

const PlayerLanding: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation(); // Initialize translation hook

 

  const handleNavigate = (path: string) => {
    router.push(path);
  };
  const changeLanguage = (lang: string) => {
    if (i18n.isInitialized) {
      i18n.changeLanguage(lang);
      console.log(`Language changed to: ${lang}`);
    } else {
      console.error("i18n is not initialized");
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 rounded-lg shadow-lg">
        <button
          onClick={() => changeLanguage("en")}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          English
        </button>
        <button
          onClick={() => changeLanguage("fr")}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Français
        </button>
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
      {t("welcomePlayer")}
      </h1>
      <p className="text-lg text-gray-700 text-center mb-8">
      {t("selectAction")}
      </p>
      <div className="flex flex-col space-y-4 items-center">
        <button
          onClick={() => handleNavigate("/teamManagement")}
          className="w-full md:w-1/2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold shadow-md transition-all duration-200"
        >
  {t("manageTeam")}
  </button>
        <button
          onClick={() => handleNavigate("/participation")}
          className="w-full md:w-1/2 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold shadow-md transition-all duration-200"
        >
  {t("viewParticipation")}
  </button>
      </div>
    </div>
  );
};

export default withAuth(PlayerLanding, ["player"]);
