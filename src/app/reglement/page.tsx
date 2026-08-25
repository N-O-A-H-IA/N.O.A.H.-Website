// src/app/reglement/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

// ============================================
// 📝 BANQUE DE QUESTIONS (80 questions)
// ============================================
const QUESTION_BANK = [
  { q: "Que signifie l'acronyme N.O.A.H. ?", options: ["Neural Operational Assistant Hub", "Neural Open Access Host", "Network Of Advanced Humans", "New Online Artificial Helper"], correct: [0], multi: false },
  { q: "Qu'est-ce que N.O.A.H. ? (Plusieurs réponses possibles)", options: ["Une Intelligence Artificielle en développement", "Un assistant opérationnel", "Un jeu vidéo multijoueur", "Un projet communautaire"], correct: [0, 1, 3], multi: true },
  { q: "Quels sont les objectifs du serveur N.O.A.H. ? (Plusieurs réponses possibles)", options: ["Tester et améliorer N.O.A.H.", "Vendre des produits", "Partager des idées", "Construire l'IA de demain"], correct: [0, 2, 3], multi: true },
  { q: "Qui peut rejoindre le serveur N.O.A.H. ?", options: ["Uniquement les développeurs", "Uniquement les étudiants", "Tout le monde", "Uniquement les VIP"], correct: [2], multi: false },
  { q: "Quelle est l'ambiance du serveur N.O.A.H. ? (Plusieurs réponses possibles)", options: ["Bienveillante", "Compétitive", "Curieuse", "Stressante", "Innovante"], correct: [0, 2, 4], multi: true },
  { q: "N.O.A.H. évolue grâce à :", options: ["Son créateur uniquement", "Sa communauté", "Une entreprise externe", "Le hasard"], correct: [1], multi: false },
  { q: "Que faire en rejoignant le serveur ? (Plusieurs réponses possibles)", options: ["Lire le règlement", "Spammer partout", "Accepter le règlement", "Inviter 100 personnes"], correct: [0, 2], multi: true },
  { q: "Le serveur N.O.A.H. est :", options: ["Le cœur vivant du projet", "Un simple salon de discussion", "Une plateforme commerciale", "Un réseau social"], correct: [0], multi: false },
  { q: "Les valeurs de N.O.A.H. incluent : (Plusieurs réponses possibles)", options: ["Respect", "Compétition", "Curiosité", "Secret", "Innovation", "Silence"], correct: [0, 2, 4], multi: true },
  { q: "Cette question n'a aucune bonne réponse :", options: ["N.O.A.H. est un jeu vidéo", "N.O.A.H. a été créé en 2020", "N.O.A.H. est fermé au public", "Aucune de ces réponses"], correct: [3], multi: false, trap: true },
  { q: "Quelle est la valeur fondamentale du serveur ?", options: ["La vitesse", "Le respect", "L'argent", "La popularité"], correct: [1], multi: false },
  { q: "Le respect s'applique envers : (Plusieurs réponses possibles)", options: ["Les membres", "Le staff", "N.O.A.H.", "Personne"], correct: [0, 1, 2], multi: true },
  { q: "Quel comportement entraîne une exclusion immédiate ? (Plusieurs réponses possibles)", options: ["Poser une question", "Le harcèlement", "Faire une faute", "La discrimination", "Le doxing"], correct: [1, 3, 4], multi: true },
  { q: "Le racisme est :", options: ["Toléré si c'est une blague", "Strictement interdit", "Autorisé en MP", "Accepté entre amis"], correct: [1], multi: false },
  { q: "Le doxing consiste à :", options: ["Partager des fichiers", "Divulguer des données personnelles sans consentement", "Faire un don", "Créer un compte"], correct: [1], multi: false },
  { q: "En cas de conflit, que faire ? (Plusieurs réponses possibles)", options: ["Insulter l'autre", "Prendre du recul", "Prévenir tout le serveur", "Discuter calmement"], correct: [1, 3], multi: true },
  { q: "Les blagues sont :", options: ["Interdites", "Bienvenues, mais jamais au détriment de quelqu'un", "Autorisées seulement entre VIP", "Autorisées seulement le weekend"], correct: [1], multi: false },
  { q: "Si un débat s'envenime, tu dois :", options: ["Continuer à argumenter agressivement", "Prendre du recul ou passer en MP", "Insulter les modérateurs", "Créer un nouveau salon"], correct: [1], multi: false },
  { q: "Tous les centres d'intérêt sont :", options: ["Illégitimes sauf les jeux vidéo", "Légitimes tant qu'ils respectent les règles", "Réservés aux adultes", "Limités à 3 par personne"], correct: [1], multi: false },
  { q: "L'humour doit être : (Plusieurs réponses possibles)", options: ["Toujours sarcastique", "Léger", "Blessant", "Inclusif"], correct: [1, 3], multi: true },
  { q: "Cette question n'a aucune bonne réponse :", options: ["Le respect est optionnel", "La discrimination est tolérée", "Le harcèlement est accepté", "Aucune de ces réponses"], correct: [3], multi: false, trap: true },
  { q: "La communication bienveillante inclut : (Plusieurs réponses possibles)", options: ["Empathie", "Agressivité", "Ouverture d'esprit", "Critique constructive"], correct: [0, 2, 3], multi: true },
  { q: "Le contenu NSFW est :", options: ["Autorisé dans un salon dédié", "Strictement interdit", "Autorisé après 23h", "Autorisé en MP"], correct: [1], multi: false },
  { q: "Quels contenus sont strictement interdits ? (Plusieurs réponses possibles)", options: ["Images gore", "Partage de recettes", "Piratage", "Créations personnelles", "Malware"], correct: [0, 2, 4], multi: true },
  { q: "Partager des images gore est :", options: ["Autorisé si c'est éducatif", "Strictement interdit", "Autorisé avec un avertissement", "Autorisé en MP"], correct: [1], multi: false },
  { q: "Le piratage est :", options: ["Autorisé si c'est pour apprendre", "Strictement interdit", "Autorisé sur de vieux jeux", "Autorisé avec l'accord du staff"], correct: [1], multi: false },
  { q: "Le spam et le flood sont :", options: ["Autorisés le weekend", "Strictement interdits", "Autorisés en petit quantité", "Autorisés dans #général"], correct: [1], multi: false },
  { q: "Faire de la pub pour un autre serveur Discord nécessite :", options: ["Rien, c'est libre", "Une autorisation du staff", "D'être VIP", "De payer"], correct: [1], multi: false },
  { q: "Pour demander une autorisation, tu dois : (Plusieurs réponses possibles)", options: ["Spammer les admins", "Ouvrir un ticket", "Créer un nouveau compte", "Être patient"], correct: [1, 3], multi: true },
  { q: "Partager tes créations personnelles est :", options: ["Interdit", "Fortement encouragé", "Réservé aux artistes pro", "Payant"], correct: [1], multi: false },
  { q: "Les liens doivent être : (Plusieurs réponses possibles)", options: ["Sûrs", "Raccourcis", "Légaux", "Anonymes"], correct: [0, 2], multi: true },
  { q: "Les fichiers exécutables (.exe) sont :", options: ["Autorisés", "Interdits pour des raisons de sécurité", "Autorisés en MP", "Autorisés avec un antivirus"], correct: [1], multi: false },
  { q: "Cette question n'a aucune bonne réponse :", options: ["Le NSFW est autorisé", "Le spam est encouragé", "Le piratage est libre", "Aucune de ces réponses"], correct: [3], multi: false, trap: true },
  { q: "La différence entre partage et pub, c'est :", options: ["La longueur du message", "L'intention : enrichir vs attirer vers l'extérieur", "L'heure d'envoi", "Le nombre d'emojis"], correct: [1], multi: false },
  { q: "Dans les salons texte, tu dois : (Plusieurs réponses possibles)", options: ["Écrire en majuscules", "Respecter le thème", "Parler uniquement de toi", "Utiliser les threads"], correct: [1, 3], multi: true },
  { q: "Les langues principales du serveur sont :", options: ["Uniquement le français", "Français et anglais", "Toutes les langues partout", "Le latin"], correct: [1], multi: false },
  { q: "Pour les autres langues, utilise le salon :", options: ["#général", "#international", "#détente", "#spam"], correct: [1], multi: false },
  { q: "En vocal, avant de parler tu dois :", options: ["Crier pour te faire entendre", "Te présenter brièvement", "Attendre qu'on t'interroge", "Mettre de la musique"], correct: [1], multi: false },
  { q: "Quand tu ne parles pas en vocal, tu dois :", options: ["Laisser ton micro ouvert", "Couper ton micro", "Quitter le salon", "Mettre de la musique"], correct: [1], multi: false },
  { q: "Pour enregistrer en vocal, il faut :", options: ["L'accord de tous les participants", "Juste le tien", "Rien, c'est libre", "Être VIP"], correct: [0], multi: false },
  { q: "Le @everyone et @here :", options: ["Sont libres d'utilisation", "Nécessitent l'autorisation du staff", "Sont réservés aux VIP", "Sont interdits à vie"], correct: [1], multi: false },
  { q: "Mentionner quelqu'un qui ne t'a pas sollicité :", options: ["Est encouragé", "Est interdit si abusif", "Est obligatoire", "Est réservé aux admins"], correct: [1], multi: false },
  { q: "Les mentions de rôles (@Étudiant, @Dev) :", options: ["Sont toujours interdites", "Sont autorisées si pertinentes", "Coûtent des gems", "Sont réservées aux VIP"], correct: [1], multi: false },
  { q: "Le salon #silencieux est réservé à :", options: ["Ceux qui veulent écouter sans parler", "Ceux qui sont punis", "Les admins uniquement", "Les nouveaux"], correct: [0], multi: false },
  { q: "Un pseudo usurpant le staff est :", options: ["Autorisé si c'est drôle", "Interdit", "Autorisé en avril", "Autorisé avec accord"], correct: [1], multi: false },
  { q: "Le staff peut te demander de changer de pseudo :", options: ["Jamais", "À tout moment", "Seulement le dimanche", "Seulement si tu es nouveau"], correct: [1], multi: false },
  { q: "Les rôles colorés : (Plusieurs réponses possibles)", options: ["Donnent des pouvoirs", "Sont cosmétiques", "Coûtent de l'argent", "Ne donnent pas de droits"], correct: [1, 3], multi: true },
  { q: "Inviter un bot sur le serveur :", options: ["Est libre", "Nécessite l'autorisation du fondateur", "Est interdit à vie", "Est réservé aux devs"], correct: [1], multi: false },
  { q: "Les commandes des bots se font dans :", options: ["N'importe quel salon", "Les salons dédiés (#commandes)", "En MP", "En vocal"], correct: [1], multi: false },
  { q: "Envoyer un DM publicitaire entraîne :", options: ["Un avertissement", "Un mute 24h", "Un bannissement immédiat", "Une simple remarque"], correct: [2], multi: false },
  { q: "Partager tes projets perso est autorisé dans : (Plusieurs réponses possibles)", options: ["Tous les salons", "#idees-projets", "Uniquement en MP", "#partage"], correct: [1, 3], multi: true },
  { q: "Ton avatar doit être :", options: ["N'importe quoi", "Correct, pas NSFW ni haineux", "Une photo de toi obligatoire", "Un logo de serveur"], correct: [1], multi: false },
  { q: "Le système de sanctions est :", options: ["Aléatoire", "Progressif et pédagogique", "Toujours un ban direct", "Inexistant"], correct: [1], multi: false },
  { q: "Quels sont les niveaux de sanctions ? (Plusieurs réponses possibles)", options: ["Avertissement oral", "Amende financière", "Mute temporaire", "Exclusion temporaire", "Bannissement"], correct: [0, 2, 3, 4], multi: true },
  { q: "Un mute temporaire dure :", options: ["5 minutes max", "1h à 24h", "1 semaine", "1 mois"], correct: [1], multi: false },
  { q: "Une exclusion temporaire peut durer :", options: ["1h max", "24h à 30 jours", "1 an", "À vie"], correct: [1], multi: false },
  { q: "Le bannissement est :", options: ["Temporaire", "Permanent", "Réversible après 24h", "Uniquement pour les VIP"], correct: [1], multi: false },
  { q: "La récidive est une circonstance :", options: ["Atténuante", "Aggravante", "Sans effet", "Positive"], correct: [1], multi: false },
  { q: "Reconnaître rapidement ses faits est une circonstance : (Plusieurs réponses possibles)", options: ["Aggravante", "Atténuante", "Sans effet", "Positive"], correct: [1, 3], multi: true },
  { q: "Le staff a :", options: ["Aucun pouvoir", "Une marge d'appréciation", "Des pouvoirs illimités sans règles", "Seulement le droit de mute"], correct: [1], multi: false },
  { q: "Un mensonge au staff lors d'une enquête est :", options: ["Une circonstance aggravante", "Sans conséquence", "Encouragé", "Autorisé"], correct: [0], multi: false },
  { q: "Les DM publicitaires entraînent :", options: ["Un avertissement", "Un mute", "Un bannissement immédiat", "Une exclusion 7j"], correct: [2], multi: false },
  { q: "Cette question n'a aucune bonne réponse :", options: ["Le ban est temporaire", "Le mute dure 1 mois", "L'exclusion est à vie", "Aucune de ces réponses"], correct: [3], multi: false, trap: true },
  { q: "Les circonstances aggravantes incluent : (Plusieurs réponses possibles)", options: ["Récidive", "Excuses sincères", "Ciblage délibéré", "Nouveauté sur le serveur"], correct: [0, 2], multi: true },
  { q: "Pour signaler un message, tu peux : (Plusieurs réponses possibles)", options: ["L'ignorer", "Mettre une réaction ❗", "Insulter l'auteur", "Ouvrir un ticket"], correct: [1, 3], multi: true },
  { q: "Pour un cas complexe, tu dois :", options: ["Spammer le staff", "Ouvrir un ticket", "Créer un nouveau serveur", "Publier sur Twitter"], correct: [1], multi: false },
  { q: "Les bugs techniques se signalent dans :", options: ["#général", "#report-bug", "#détente", "#spam"], correct: [1], multi: false },
  { q: "Les comportements toxiques se signalent dans :", options: ["#report-abus", "#gaming", "#food", "#anniversaires"], correct: [0], multi: false },
  { q: "Le staff peut : (Plusieurs réponses possibles)", options: ["Lire tes MP personnels", "Supprimer tout message non conforme", "Te suivre partout", "Enquêter sur un signalement"], correct: [1, 3], multi: true },
  { q: "Pour contester une sanction, tu dois :", options: ["Créer un drama", "Ouvrir un ticket et expliquer calmement", "Insulter les admins", "Quitter le serveur"], correct: [1], multi: false },
  { q: "Le délai de réponse pour un appel est :", options: ["24h", "48-72h", "1 semaine", "1 mois"], correct: [1], multi: false },
  { q: "Cette question n'a aucune bonne réponse :", options: ["Le staff peut lire tes MP", "Le staff peut te suivre partout", "Le staff peut vendre tes données", "Aucune de ces réponses"], correct: [3], multi: false, trap: true },
  { q: "N.O.A.H. revend-il tes données ?", options: ["Oui", "Non, jamais", "Seulement aux annonceurs", "Seulement aux VIP"], correct: [1], multi: false },
  { q: "Quels sont tes droits RGPD ? (Plusieurs réponses possibles)", options: ["Droit d'accès", "Droit de voler", "Droit d'effacement", "Droit d'opposition", "Droit de pirater"], correct: [0, 2, 3], multi: true },
  { q: "Le droit à l'effacement permet de :", options: ["Supprimer le serveur", "Demander la suppression de tes données", "Effacer les messages des autres", "Supprimer N.O.A.H."], correct: [1], multi: false },
  { q: "Pour exercer tes droits RGPD, tu dois :", options: ["Envoyer un email personnel au fondateur", "Ouvrir un ticket avec l'objet 'Demande RGPD'", "Publier sur Twitter", "Créer un nouveau compte"], correct: [1], multi: false },
  { q: "Les logs de modération sont conservés maximum :", options: ["1 an", "30 jours", "À vie", "7 jours"], correct: [1], multi: false },
  { q: "En cas de fuite de données, tu es informé sous :", options: ["24h", "72h", "1 semaine", "1 mois"], correct: [1], multi: false },
  { q: "N.O.A.H. utilise tes interactions pour : (Plusieurs réponses possibles)", options: ["Les vendre", "S'améliorer", "Te manipuler", "Personnaliser les échanges"], correct: [1, 3], multi: true },
  { q: "Cette question n'a aucune bonne réponse :", options: ["N.O.A.H. revend tes données", "N.O.A.H. te manipule", "N.O.A.H. est une entreprise", "Aucune de ces réponses"], correct: [3], multi: false, trap: true },
  { q: "Dans la catégorie Étudiants, le plagiat est :", options: ["Autorisé", "Strictement interdit", "Autorisé si petit", "Autorisé en groupe"], correct: [1], multi: false },
  { q: "Les fuites de sujets d'examens sont :", options: ["Encouragées", "Interdites", "Autorisées après l'examen", "Autorisées entre amis"], correct: [1], multi: false },
  { q: "Un développeur qui partage un malware sera :", options: ["Félicité", "Sanctionné", "Ignoré", "Rendu VIP"], correct: [1], multi: false },
  { q: "Les avantages VIP : (Plusieurs réponses possibles)", options: ["Donnent des droits supplémentaires", "Permettent d'enfreindre les règles", "Donnent accès à des salons exclusifs", "Ne donnent pas de droits sur le règlement"], correct: [2, 3], multi: true },
  { q: "Le salon #sante-mentale est :", options: ["Pour donner des conseils médicaux", "Un espace bienveillant, pas de conseils médicaux", "Réservé aux médecins", "Interdit"], correct: [1], multi: false },
  { q: "En vocal, tu dois respecter :", options: ["Rien", "Les thématiques", "Seulement les admins", "Les horaires de bureau"], correct: [1], multi: false },
  { q: "Le salon #cinéma en vocal sert à :", options: ["Regarder des films seuls", "Visionnages partagés", "Critiquer les films", "Télécharger des films"], correct: [1], multi: false },
  { q: "Le salon #étude-commune est pour :", options: ["Faire la fête", "Travailler en silence", "Jouer", "Dormir"], correct: [1], multi: false },
  { q: "Les règles pour les devs incluent : (Plusieurs réponses possibles)", options: ["Code propre", "Partage de malware", "Documentation", "Respect de la propriété intellectuelle"], correct: [0, 2, 3], multi: true },
  { q: "Cette question n'a aucune bonne réponse :", options: ["Le plagiat est autorisé", "Les malware sont encouragés", "Les VIP peuvent enfreindre les règles", "Aucune de ces réponses"], correct: [3], multi: false, trap: true },
  { q: "Les 7 valeurs de N.O.A.H. sont : (Plusieurs réponses possibles)", options: ["Respect", "Argent", "Curiosité", "Pouvoir", "Innovation", "Silence", "Bienveillance"], correct: [0, 2, 4, 6], multi: true },
  { q: "N.O.A.H. est avant tout :", options: ["Un produit commercial", "Une communauté vivante", "Un jeu vidéo", "Une entreprise"], correct: [1], multi: false },
  { q: "Chaque membre du serveur :", options: ["N'a aucune valeur", "Apporte sa pierre à l'édifice", "Doit payer", "Doit coder"], correct: [1], multi: false },
  { q: "Le règlement peut évoluer :", options: ["Jamais", "Pour s'adapter à la communauté", "Seulement sur vote", "Seulement le 1er janvier"], correct: [1], multi: false },
  { q: "Un cas non prévu par le règlement est traité :", options: ["Par un ban immédiat", "Par le staff avec bon sens", "En ignorant", "Par un vote"], correct: [1], multi: false },
  { q: "Pour contacter le staff, tu peux : (Plusieurs réponses possibles)", options: ["Spammer en MP", "Ouvrir un ticket", "Crier en vocal", "MP un modérateur"], correct: [1, 3], multi: true },
  { q: "Cette question n'a aucune bonne réponse :", options: ["N.O.A.H. est un produit commercial", "Chaque membre n'a aucune valeur", "Le règlement n'évolue jamais", "Aucune de ces réponses"], correct: [3], multi: false, trap: true },
  { q: "Les valeurs de N.O.A.H. incluent aussi : (Plusieurs réponses possibles)", options: ["Partage", "Compétition", "Apprentissage", "Secret", "Créativité"], correct: [0, 2, 4], multi: true }
];

// ============================================
// 🎯 COMPOSANT PRINCIPAL
// ============================================
export default function ReglementPage() {
  console.log("🔍 VRAIE VALEUR DU CLIENT ID :",  process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID);
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [securityViolations, setSecurityViolations] = useState(0);
  
  // ✅ CORRECTION ICI : Nom de variable d'état changé
  const [securityAlertMessage, setSecurityAlertMessage] = useState('');

  const QUIZ_LENGTH = 15;
  const PASS_THRESHOLD = 0.75;

  // ✅ CORRECTION ICI : Nom de la fonction changé pour éviter le conflit
  const displaySecurityAlert = (message: string) => {
    setSecurityAlertMessage(message);
    setTimeout(() => setSecurityAlertMessage(''), 3000);
  };

  const logViolation = (type: string) => {
    setSecurityViolations(prev => prev + 1);
    console.log(`[N.O.A.H. Security] Violation: ${type} | User: ${user?.username || 'anonymous'}`);
  };

  // ============================================
  // 🔐 PROTECTIONS ANTI-TRICHE
  // ============================================
  

  // ============================================
  // 🔐 CONNEXION UTILISATEUR
  // ============================================
  useEffect(() => {
    const userId = searchParams.get('userId');
    const username = searchParams.get('username');
    const avatar = searchParams.get('avatar');

    if (userId && username && avatar) {
      const userData = { id: userId, username, avatar };
      setUser(userData);
      localStorage.setItem('noah_user', JSON.stringify(userData));
    } else {
      const saved = localStorage.getItem('noah_user');
      if (saved) setUser(JSON.parse(saved));
    }
  }, [searchParams]);

  // ============================================
  // 🎯 FONCTIONS QUIZ
  // ============================================
  const startQuiz = () => {
    const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
    setQuizQuestions(shuffled.slice(0, QUIZ_LENGTH));
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizStartTime(Date.now());
    setShowQuiz(true);
    setQuizResult(null);
  };

  const selectAnswer = (answerIndex: number, isMulti: boolean) => {
  if (isMulti) {
    const currentAnswers = userAnswers[currentQuestionIndex] || [];
    const newAnswers = currentAnswers.includes(answerIndex)
      ? currentAnswers.filter((a: number) => a !== answerIndex)  // ✅ Corrigé
      : [...currentAnswers, answerIndex];
      const newAnswersCopy = [...userAnswers];
      newAnswersCopy[currentQuestionIndex] = newAnswers;
      setUserAnswers(newAnswersCopy);
    } else {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestionIndex] = [answerIndex];
      setUserAnswers(newAnswers);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex === QUIZ_LENGTH - 1) {
      finishQuiz();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = () => {
    let correct = 0;
    userAnswers.forEach((answers, idx) => {
      if (answers && answers.length > 0) {
        const question = quizQuestions[idx];
        const correctAnswers = question.correct;
       const isCorrect = answers.length === correctAnswers.length &&
  answers.every((a: number) => correctAnswers.includes(a));  // ✅ Corrigé
        if (isCorrect) correct++;
      }
    });

    const score = correct / QUIZ_LENGTH;
    const percentage = Math.round(score * 100);
    const passed = score >= PASS_THRESHOLD;
    const duration = Math.round((Date.now() - quizStartTime) / 1000);

    setQuizResult({ correct, percentage, passed, duration });

    if (passed && user) {
      grantAccess();
    }
  };

  const grantAccess = async () => {
    try {
      const response = await fetch('/api/discord/grant-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        alert('✅ Accès accordé ! Tu peux maintenant rejoindre le serveur Discord.');
        window.location.href = 'https://discord.gg/RWJDtZSeve'; // ⚠️ REMPLACE PAR TON LIEN D'INVITATION
      } else {
        alert('❌ Erreur lors de l\'attribution du rôle. Contacte le support.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur de connexion au serveur.');
    }
  };

  const retryQuiz = () => {
    setShowQuiz(false);
    setQuizResult(null);
    startQuiz();
  };

  // ============================================
  // 🎨 RENDU : ÉCRAN DE CONNEXION
  // ============================================
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-7xl mb-6 animate-pulse">🤖</div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            N.O.A.H.
          </h1>
          <p className="text-gray-400 mb-8">Connecte-toi pour accéder au règlement</p>
          <a
            href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent((process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/api/discord/callback')}&response_type=code&scope=identify`}
            className="bg-[#5865F2] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#4752C4] transition transform hover:scale-105 inline-flex items-center gap-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Se connecter avec Discord
          </a>
        </div>
      </div>
    );
  }

  // ============================================
  // 🎨 RENDU : QUIZ
  // ============================================
  if (showQuiz) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isMulti = currentQuestion?.multi || currentQuestion?.correct.length > 1;
    const currentAnswers = userAnswers[currentQuestionIndex] || [];

    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
        {securityAlertMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl font-semibold z-50 animate-bounce">
            ⚠️ {securityAlertMessage}
          </div>
        )}

        <div className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
          {quizResult ? (
            <div className="text-center">
              <div className="text-8xl mb-6">{quizResult.passed ? '🎉' : '😔'}</div>
              <h2 className={`text-4xl font-bold mb-4 ${quizResult.passed ? 'text-green-400' : 'text-red-400'}`}>
                {quizResult.passed ? 'Quiz réussi !' : 'Quiz échoué'}
              </h2>
              <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-6">
                {quizResult.percentage}%
              </div>
              <p className="text-gray-400 mb-8 text-lg">
                {quizResult.passed
                  ? `Bravo ${user.username} ! Tu as obtenu ${quizResult.correct}/${QUIZ_LENGTH} bonnes réponses en ${quizResult.duration}s.`
                  : `Tu as obtenu ${quizResult.correct}/${QUIZ_LENGTH} bonnes réponses. Il faut minimum 75% pour réussir.`}
              </p>
              {quizResult.passed ? (
                <button

                  onClick={() => window.location.href = 'https://discord.gg/RWJDtZSeve'}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition"
                >
                  🎉 Rejoindre le serveur
                </button>
              ) : (
                <button
                  onClick={retryQuiz}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition"
                >
                  🔄 Réessayer
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-cyan-400 mb-4">🎯 Quiz de Vérification</h2>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Question {currentQuestionIndex + 1} / {QUIZ_LENGTH}</span>
                  <span>Score : {userAnswers.filter(a => a && a.length > 0).length} répondues</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestionIndex) / QUIZ_LENGTH) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{currentQuestion.q}</h3>
                {isMulti && (
                  <p className="text-yellow-400 text-sm italic font-semibold">⚠️ Plusieurs réponses possibles</p>
                )}
              </div>

              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option: string, idx: number) => {
                  const isSelected = currentAnswers.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => selectAnswer(idx, isMulti)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-gray-700 bg-gray-800/50 hover:border-cyan-500/50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-cyan-500 border-cyan-500' : 'border-gray-600'
                      }`}>
                        {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                      <span className="text-white font-medium">{option}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between gap-4">
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
                >
                  ← Précédent
                </button>
                <button
                  onClick={nextQuestion}
                  disabled={currentAnswers.length === 0}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition"
                >
                  {currentQuestionIndex === QUIZ_LENGTH - 1 ? 'Terminer ✓' : 'Suivant →'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ============================================
  // 🎨 RENDU : RÈGLEMENT
  // ============================================
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {securityAlertMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl font-semibold z-50 animate-bounce">
          ⚠️ {securityAlertMessage}
        </div>
      )}

      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center py-12 border-b border-cyan-500/20 mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            🤖 Règlement N.O.A.H.
          </h1>
          <p className="text-gray-400 text-lg italic mb-6">Neural Operational Assistant Hub</p>
          <div className="inline-flex items-center gap-3 bg-gray-800/50 border border-cyan-500/20 rounded-full px-6 py-3">
            <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
            <span className="font-semibold">{user.username}</span>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-500 transition">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center gap-3">🌟 1. Bienvenue & Présentation</h2>
            <h3 className="text-xl font-bold text-white mb-3">🤖 Qui est N.O.A.H. ?</h3>
            <p className="text-gray-400 mb-4">
              <b className="text-white">N.O.A.H.</b> (<em className="text-cyan-400">Neural Operational Assistant Hub</em>) est une <b className="text-white">Intelligence Artificielle en développement</b>, conçue pour être un assistant <b className="text-white">opérationnel, créatif et bienveillant</b>.
            </p>
            <h3 className="text-xl font-bold text-white mb-3">🎯 Nos missions</h3>
            <ul className="space-y-2 text-gray-400 mb-4">
              <li>🧠 <b className="text-white">Tester et améliorer</b> N.O.A.H. ensemble</li>
              <li>💡 <b className="text-white">Partager</b> des idées, découvertes, créations</li>
              <li>🎓 <b className="text-white">Apprendre</b> les uns des autres</li>
              <li>🚀 <b className="text-white">Construire</b> l'IA de demain collectivement</li>
            </ul>
            <h3 className="text-xl font-bold text-white mb-3">✅ Acceptation du règlement</h3>
            <p className="text-gray-400">
              En accédant au serveur, tu confirmes avoir <b className="text-white">lu, compris et accepté</b> ce règlement. <b className="text-white">L'ignorance des règles n'est pas une excuse.</b>
            </p>
          </section>

          <section className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-500 transition">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center gap-3">🧠 2. Respect & Vivre Ensemble</h2>
            <h3 className="text-xl font-bold text-white mb-3">🤝 Le respect : valeur fondamentale</h3>
            <p className="text-gray-400 mb-4">Le respect s'applique <b className="text-white">entre membres</b>, envers le staff, envers N.O.A.H., et envers les idées de chacun.</p>
            <h3 className="text-xl font-bold text-white mb-3">🚫 Tolérance zéro</h3>
            <p className="text-red-400 font-bold mb-3">Les comportements suivants entraînent une <b className="text-white">exclusion immédiate</b> :</p>
            <ul className="space-y-2 text-gray-400 mb-4">
              <li>❌ <b className="text-white">Harcèlement</b> sous toutes ses formes</li>
              <li>❌ <b className="text-white">Discrimination</b> (racisme, sexisme, homophobie, etc.)</li>
              <li>❌ <b className="text-white">Discours haineux</b> ou appels à la violence</li>
              <li>❌ <b className="text-white">Doxing</b> (divulgation de données personnelles)</li>
              <li>❌ <b className="text-white">Menaces</b> physiques ou psychologiques</li>
            </ul>
          </section>

          <section className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-500 transition">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center gap-3">💡 3. Contenu Autorisé & Interdit</h2>
            <h3 className="text-xl font-bold text-white mb-3">🚫 Contenu strictement interdit</h3>
            <div className="overflow-x-auto mb-4">
              <table className="w-full bg-gray-800/50 rounded-lg">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-cyan-400 font-bold">Catégorie</th>
                    <th className="text-left p-3 text-cyan-400 font-bold">Exemples</th>
                  </tr>
                </thead>
                <tbody className="text-gray-400">
                  <tr className="border-b border-gray-700"><td className="p-3 text-red-400 font-bold">🔞 NSFW</td><td className="p-3">Pornographie, nudité explicite</td></tr>
                  <tr className="border-b border-gray-700"><td className="p-3 text-red-400 font-bold">⚠️ Violence</td><td className="p-3">Images gore, apologie de la violence</td></tr>
                  <tr className="border-b border-gray-700"><td className="p-3 text-red-400 font-bold">⚖️ Illégal</td><td className="p-3">Piratage, drogues, malware, phishing</td></tr>
                  <tr className="border-b border-gray-700"><td className="p-3 text-red-400 font-bold">🎯 Spam</td><td className="p-3">Messages répétés, flood, pub non autorisée</td></tr>
                  <tr><td className="p-3 text-red-400 font-bold">👤 Doxing</td><td className="p-3">Partage de données personnelles</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-500 transition">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center gap-3">⚡ 4. Règles de Communication</h2>
            <h3 className="text-xl font-bold text-white mb-3">💬 Salons texte</h3>
            <ul className="space-y-2 text-gray-400 mb-4">
              <li>📌 <b className="text-white">Respecte le thème</b> de chaque salon</li>
              <li>🔤 Français ou anglais <b className="text-white">principalement</b></li>
              <li>🧵 Utilise les <b className="text-white">threads</b> pour les sujets longs</li>
            </ul>
            <h3 className="text-xl font-bold text-white mb-3">🔊 Salons vocaux</h3>
            <ul className="space-y-2 text-gray-400">
              <li>🎤 <b className="text-white">Présente-toi</b> en arrivant</li>
              <li>🔇 <b className="text-white">Coupe ton micro</b> quand tu ne parles pas</li>
              <li>🎙️ Les enregistrements nécessitent <b className="text-white">l'accord de tous</b></li>
            </ul>
          </section>

          <section className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-500 transition">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center gap-3">⚖️ 6. Système de Sanctions</h2>
            <h3 className="text-xl font-bold text-white mb-3">📈 Échelle progressive</h3>
            <div className="overflow-x-auto mb-4">
              <table className="w-full bg-gray-800/50 rounded-lg">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-cyan-400 font-bold">Niveau</th>
                    <th className="text-left p-3 text-cyan-400 font-bold">Sanction</th>
                    <th className="text-left p-3 text-cyan-400 font-bold">Durée</th>
                  </tr>
                </thead>
                <tbody className="text-gray-400">
                  <tr className="border-b border-gray-700"><td className="p-3">🟡 1</td><td className="p-3">Avertissement oral</td><td className="p-3">Immédiat</td></tr>
                  <tr className="border-b border-gray-700"><td className="p-3">🟠 2</td><td className="p-3">Avertissement écrit</td><td className="p-3">Permanent</td></tr>
                  <tr className="border-b border-gray-700"><td className="p-3">🔴 3</td><td className="p-3">Mute temporaire</td><td className="p-3">1h à 24h</td></tr>
                  <tr className="border-b border-gray-700"><td className="p-3">⚫ 4</td><td className="p-3">Exclusion temporaire</td><td className="p-3">24h à 30 jours</td></tr>
                  <tr><td className="p-3">💀 5</td><td className="p-3">Bannissement</td><td className="p-3">Permanent</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-500 transition">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center gap-3">🔐 8. Protection des Données (RGPD)</h2>
            <h3 className="text-xl font-bold text-white mb-3">🤖 Données utilisées par N.O.A.H.</h3>
            <p className="text-gray-400 mb-4">N.O.A.H. traite certaines interactions pour <b className="text-white">s'améliorer</b>, personnaliser les échanges et analyser les tendances. <b className="text-white">N.O.A.H. ne revend pas tes données.</b></p>
            <h3 className="text-xl font-bold text-white mb-3">🛡️ Tes droits</h3>
            <ul className="space-y-2 text-gray-400">
              <li>✅ Droit d'<b className="text-white">accès</b>, de <b className="text-white">rectification</b>, d'<b className="text-white">effacement</b></li>
              <li>✅ Droit d'<b className="text-white">opposition</b>, à la <b className="text-white">portabilité</b>, à la <b className="text-white">limitation</b></li>
            </ul>
          </section>

          <section className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-500 transition">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center gap-3">🌟 10. Valeurs & Conclusion</h2>
            <blockquote className="border-l-4 border-cyan-500 pl-6 py-3 bg-gray-800/50 rounded-r-lg italic text-gray-400 font-semibold mb-4">
              <b className="text-white">Respect · Curiosité · Innovation · Bienveillance · Partage · Apprentissage · Créativité</b>
            </blockquote>
            <p className="text-gray-400">Ces <b className="text-white">sept valeurs</b> guident chaque interaction. Bienvenue dans l'aventure N.O.A.H. 🚀</p>
          </section>
        </div>

        <div className="sticky bottom-8 mt-12 flex justify-center z-40">
          <button
            onClick={startQuiz}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:scale-105 transition animate-bounce"
          >
            🎯 Passer le quiz d'accès
          </button>
        </div>
      </div>
    </div>
  );
}