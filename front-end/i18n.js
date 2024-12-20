import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
      translation: {
        welcomePlayer: "Welcome, Player!",
        selectAction: "Select an action to proceed:",
        manageTeam: "Manage Your Team",
        viewParticipation: "View Participation",
        loginHeader: "Login",
        email: "Email Address",
        password: "Password",
        addPlayer: "Add New Player",
        playerName: "Player Name",
        selectRole: "Select Role",
        adding: "Adding...",
        add: "Add Player",
        pendingRequests: "Pending Join Requests",
        approve: "Approve",
        deny: "Deny",
      },
    },
    fr: {
      translation: {
        welcomePlayer: "Bienvenue, joueur!",
        selectAction: "Sélectionnez une action pour continuer:",
        manageTeam: "Gérez votre équipe",
        viewParticipation: "Voir la participation",
        loginHeader: "Connexion",
        email: "Adresse électronique",
        password: "Mot de passe",
        addPlayer: "Ajouter un nouveau joueur",
        playerName: "Nom du joueur",
        selectRole: "Sélectionner un rôle",
        adding: "Ajout...",
        add: "Ajouter un joueur",
        pendingRequests: "Demandes d'adhésion en attente",
        approve: "Approuver",
        deny: "Refuser",
      },
    },
  };
  
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
