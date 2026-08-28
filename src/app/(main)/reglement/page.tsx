// src/app/reglement/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

// ============================================
// 📝 BANQUE DE QUESTIONS DÉTAILLÉES ET NUANCÉES
// ============================================
const QUESTION_BANK = [
  {
    q: "Selon le règlement officiel, que signifie **exactement** l'acronyme **N.O.A.H.** et quelle est sa nature ?",
    options: [
      "Neural Operational Assistant Hub : une Intelligence Artificielle en développement communautaire",
      "New Online Artificial Helper : un simple bot de modération automatique",
      "Network Of Advanced Humans : un réseau social exclusif pour les développeurs",
      "Neural Open Access Host : un serveur de jeu multijoueur compétitif"
    ],
    correct: [0],
    multi: false
  },
  {
    q: "Concernant l'ambiance et les valeurs du serveur, lesquelles sont **explicitement** citées comme fondamentales ? (Plusieurs réponses possibles)",
    options: [
      "La bienveillance et le respect mutuel",
      "La compétition acharnée pour être le meilleur",
      "La curiosité et l'envie d'apprendre",
      "Le secret et la confidentialité totale des discussions",
      "L'innovation et la créativité"
    ],
    correct: [0, 2, 4],
    multi: true
  },
  {
    q: "Quelle est la politique **absolue et sans exception** du serveur concernant le harcèlement, la discrimination et le doxing ?",
    options: [
      "C'est toléré si c'est présenté comme une 'blague' ou de l'humour",
      "C'est strictement interdit et entraîne une **exclusion immédiate** (ban)",
      "C'est autorisé dans les messages privés (MP) tant que ça ne se voit pas en public",
      "Cela dépend de l'humeur des modérateurs du moment"
    ],
    correct: [1],
    multi: false
  },
  {
    q: "Si tu es témoin d'un comportement toxique ou d'une règle enfreinte, quelle est la **seule** procédure correcte à suivre ?",
    options: [
      "Insulter la personne en retour pour lui montrer qu'elle a tort",
      "Prévenir tous les membres du serveur en utilisant @everyone pour faire un scandale",
      "Utiliser la commande /report ou ouvrir un **ticket** dans le salon dédié",
      "Prendre une capture d'écran et la publier sur Twitter pour shamer la personne"
    ],
    correct: [2],
    multi: false
  },
  {
    q: "Concernant le contenu **NSFW**, la **violence** (gore) et les activités **illégales** (piratage, malware), quelle est la règle ?",
    options: [
      "C'est autorisé uniquement dans un salon caché réservé aux adultes",
      "C'est strictement **interdit** partout sur le serveur, sans aucune exception",
      "C'est toléré si tu mets un avertissement 'Spoiler' ou 'NSFW' avant le message",
      "C'est autorisé tant que c'est partagé en message privé (MP)"
    ],
    correct: [1],
    multi: false
  },
  {
    q: "Quelle est la différence fondamentale entre **partager une création** et faire de la **publicité** non autorisée ?",
    options: [
      "Il n'y a aucune différence, tout est interdit",
      "La longueur du message : les pubs doivent faire moins de 3 lignes",
      "L'intention : **enrichir la communauté** (partage) vs **attirer les gens vers l'extérieur** pour un gain personnel (pub)",
      "Le partage est réservé aux rôles VIP, la pub est pour tout le monde"
    ],
    correct: [2],
    multi: false
  },
  {
    q: "Dans les salons vocaux, quelles sont les **bonnes pratiques** obligatoires pour respecter les autres ? (Plusieurs réponses possibles)",
    options: [
      "Couper son micro (**Mute**) lorsqu'on ne parle pas pour éviter les bruits de fond",
      "Crier pour être sûr que tout le monde entende bien ce qu'on dit",
      "Demander l'accord de **tous** les participants avant d'enregistrer la conversation",
      "Laisser de la musique jouer en fond en permanence via un bot"
    ],
    correct: [0, 2],
    multi: true
  },
  {
    q: "Concernant les mentions **@everyone** et **@here**, quelle est la règle stricte ?",
    options: [
      "Elles sont totalement libres pour que tout le monde puisse organiser des événements",
      "Elles sont **strictement réservées au Staff** et nécessitent une autorisation préalable",
      "Elles sont autorisées une fois par jour et par membre",
      "Elles sont réservées aux membres ayant le rôle 'VIP Ultimate'"
    ],
    correct: [1],
    multi: false
  },
  {
    q: "Si un membre t'envoie un **Message Privé (DM) publicitaire** non sollicité pour un autre serveur ou un service, que se passe-t-il ?",
    options: [
      "Il reçoit un simple avertissement oral",
      "Il est mis en sourdine (mute) pendant 24 heures",
      "Il subit un **bannissement immédiat et définitif** du serveur",
      "Rien, les messages privés ne regardent pas la modération"
    ],
    correct: [2],
    multi: false
  },
  {
    q: "Pour la catégorie **Étudiants**, quelle est la règle absolue concernant les devoirs, les examens et le partage de connaissances ?",
    options: [
      "Le plagiat est accepté tant que tu ne te fais pas prendre",
      "L'entraide est encouragée, mais le **plagiat** et la **vente de fuites d'examens** sont strictement interdits",
      "Tu peux demander aux autres de faire tes devoirs à ta place",
      "Les sujets d'examens peuvent être partagés librement après l'épreuve"
    ],
    correct: [1],
    multi: false
  },
  {
    q: "Pour la catégorie **Développeurs**, quelles sont les obligations lors du partage de code ou de projets ? (Plusieurs réponses possibles)",
    options: [
      "Le code doit être propre et, si possible, documenté",
      "Le partage de **malware**, de virus ou de code malveillant est un motif de ban immédiat",
      "Tu dois respecter la propriété intellectuelle et les licences des projets open-source",
      "Tu as le droit de voler du code tant que tu ne le dis à personne"
    ],
    correct: [0, 1, 2],
    multi: true
  },
  {
    q: "Concernant le système de sanctions, que signifie une **exclusion temporaire** (kick/ban temporaire) ?",
    options: [
      "Le membre est banni pour toujours sans possibilité de retour",
      "Le membre est retiré du serveur pour une durée définie (ex: 24h à 30 jours) avant de pouvoir revenir",
      "Le membre perd seulement ses rôles colorés pendant une heure",
      "C'est une simple remarque verbale sans conséquence"
    ],
    correct: [1],
    multi: false
  },
  {
    q: "Quelles circonstances sont considérées comme **aggravantes** par la modération et peuvent accélérer une sanction ? (Plusieurs réponses possibles)",
    options: [
      "La récidive (répéter la même infraction après un avertissement)",
      "Le fait de reconnaître ses torts et de s'excuser sincèrement",
      "Le ciblage délibéré et répété d'un membre spécifique",
      "Le fait d'être nouveau sur le serveur et de ne pas connaître les règles"
    ],
    correct: [0, 2],
    multi: true
  },
  {
    q: "Concernant la protection des données (**RGPD**) et l'IA N.O.A.H., quelle affirmation est **vraie** ?",
    options: [
      "N.O.A.H. revend tes données de conversation à des entreprises publicitaires",
      "N.O.A.H. utilise certaines interactions pour **s'améliorer**, mais **ne revend jamais** tes données personnelles",
      "Tu n'as aucun droit sur les données collectées par le serveur",
      "Le serveur conserve tes logs de modération pendant 10 ans"
    ],
    correct: [1],
    multi: false
  },
  {
    q: "Comment exercer tes droits RGPD (accès, rectification, effacement de tes données) sur le serveur N.O.A.H. ?",
    options: [
      "En envoyant un email personnel au fondateur depuis une adresse anonyme",
      "En ouvrant un **ticket** dans le salon dédié avec l'objet exact **'Demande RGPD'**",
      "En le demandant oralement dans un salon vocal",
      "En créant un nouveau compte Discord"
    ],
    correct: [1],
    multi: false
  },
  {
    q: "Quelle est la durée maximale de conservation des logs de modération sur le serveur ?",
    options: [
      "10 ans",
      "À vie",
      "7 jours",
      "Aucune de ces réponses (c'est 30 jours maximum)"
    ],
    correct: [3],
    multi: false
  },
  {
    q: "Si un cas de conflit ou de comportement n'est **pas explicitement prévu** dans ce règlement, comment sera-t-il traité ?",
    options: [
      "La personne sera automatiquement bannie par sécurité",
      "Le staff utilisera son **bon sens** et se basera sur les **valeurs fondamentales** de N.O.A.H. pour trancher",
      "Le cas sera ignoré jusqu'à ce que le règlement soit mis à jour",
      "Un vote de la communauté entière sera organisé"
    ],
    correct: [1],
    multi: false
  },
  {
    q: "Concernant les pseudos et avatars, quelle est la règle pour éviter l'usurpation d'identité ?",
    options: [
      "Il est interdit d'avoir un pseudo, un avatar ou un statut qui imite un membre du **Staff** ou l'IA **N.O.A.H.**",
      "Tu peux te faire passer pour un admin tant que tu ne demandes pas d'argent",
      "Les pseudos doivent obligatoirement contenir ton vrai nom et prénom",
      "L'usurpation est autorisée si c'est fait de manière humoristique"
    ],
    correct: [0],
    multi: false
  },
  {
    q: "Dans le salon **#sante-mentale**, quelle est la limite à ne pas franchir ?",
    options: [
      "C'est un espace d'écoute bienveillante, mais il est **interdit de donner des conseils médicaux** professionnels",
      "Tu dois obligatoirement détailler tous tes problèmes personnels",
      "C'est le seul endroit où les insultes sont tolérées pour évacuer",
      "Seuls les professionnels de santé certifiés ont le droit d'y parler"
    ],
    correct: [0],
    multi: false
  },
  {
    q: "Qui est habilité à prendre les décisions finales sur la vision globale du projet N.O.A.H. selon la hiérarchie ?",
    options: [
      "Le Modérateur",
      "Le Beta-Testeur",
      "Le Fondateur",
      "Aucune de ces réponses"
    ],
    correct: [2],
    multi: false
  },
  {
    q: "Comment devient-on officiellement **Modérateur** ou **Beta-Testeur** sur le serveur ?",
    options: [
      "En achetant un grade VIP",
      "Uniquement sur **candidature** ou **invitation** du Staff",
      "Automatiquement après 1 mois d'ancienneté",
      "Aucune de ces réponses"
    ],
    correct: [1],
    multi: false
  },
  {
    q: "Que se passe-t-il en cas de **faux signalement** délibéré d'un autre membre ?",
    options: [
      "Rien, c'est encouragé pour tester la modération",
      "C'est considéré comme une **infraction en soi** et peut être sanctionné",
      "On reçoit un rôle spécial de 'Détective'",
      "Aucune de ces réponses"
    ],
    correct: [1],
    multi: false
  },
  {
    q: "Dans quel délai faut-il contester une sanction via un ticket d'appel ?",
    options: [
      "Dans les 24 heures",
      "Dans les **7 jours** suivant la décision",
      "Dans les 6 mois",
      "Aucune de ces réponses"
    ],
    correct: [1],
    multi: false
  },
  {
    q: "Les bannissements de **Niveau 5** (infractions extrêmement graves comme les menaces terroristes) sont-ils sujets à appel ?",
    options: [
      "Oui, toujours",
      "Non, ils ne sont **pas sujets à appel**",
      "Oui, mais seulement pour les membres VIP",
      "Aucune de ces réponses"
    ],
    correct: [1],
    multi: false
  },
  {
    q: "Quelle est la règle principale dans l'**Espace Créatif** ?",
    options: [
      "Seules les œuvres professionnelles sont acceptées",
      "Les **critiques constructives** sont bienvenues, pas le dénigrement gratuit",
      "Il est interdit de partager des créations faites avec l'IA N.O.A.H.",
      "Aucune de ces réponses"
    ],
    correct: [1],
    multi: false
  },
  {
    q: "Quelle obligation s'applique spécifiquement aux membres de l'**Espace Beta-Testeurs** ?",
    options: [
      "**Confidentialité obligatoire** sur les fonctionnalités non publiées",
      "Obligation de poster 10 messages par jour",
      "Interdiction totale d'utiliser N.O.A.H.",
      "Aucune de ces réponses"
    ],
    correct: [0],
    multi: false
  },
  {
    q: "Quelle est la sanction typique pour un premier **spam léger** ?",
    options: [
      "Bannissement définitif",
      "Exclusion de 30 jours",
      "Amende financière",
      "Aucune de ces réponses (c'est un simple avertissement)"
    ],
    correct: [3],
    multi: false
  },
  {
    q: "Que signifie le **Niveau 3** dans le système de sanctions progressif ?",
    options: [
      "Avertissement oral",
      "**Mute temporaire** (1h à 24h)",
      "Bannissement définitif",
      "Aucune de ces réponses"
    ],
    correct: [1],
    multi: false
  },
  {
    q: "Qui est officiellement habilité à appliquer des sanctions sur le serveur ?",
    options: [
      "N'importe quel membre ancien",
      "Uniquement l'IA N.O.A.H. de manière automatique",
      "Les membres du **Staff officiel** (Modérateurs, Administrateurs)",
      "Aucune de ces réponses"
    ],
    correct: [2],
    multi: false
  },
  {
    q: "Concernant l'interaction avec l'IA, que signifie le terme **'jailbreak'** mentionné dans le règlement ?",
    options: [
      "Libérer l'IA de ses serveurs physiques",
      "Tenter de contourner ses protections pour lui faire produire du contenu interdit",
      "Redémarrer le bot manuellement",
      "Aucune de ces réponses"
    ],
    correct: [1],
    multi: false
  }
];

// ============================================
// 🎯 COMPOSANT PRINCIPAL
// ============================================
export default function ReglementPage() {
  console.log("🔍 DEBUG - VALEUR DU CLIENT ID :", process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID);

  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [securityViolations, setSecurityViolations] = useState(0);
  const [securityAlertMessage, setSecurityAlertMessage] = useState('');

  const QUIZ_LENGTH = 15;
  const PASS_THRESHOLD = 0.75;

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
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      displaySecurityAlert('Clic droit désactivé sur cette page');
      logViolation('contextmenu');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault();
        displaySecurityAlert('Touche F12 désactivée');
        logViolation('F12');
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        e.preventDefault();
        displaySecurityAlert('Outils de développement bloqués');
        logViolation('Ctrl+Shift+DevTools');
      }
      if (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'p')) {
        e.preventDefault();
        displaySecurityAlert('Action clavier bloquée');
        logViolation('Ctrl+' + e.key);
      }
    };

    const handleDragStart = (e: DragEvent) => e.preventDefault();
    const handleDrop = (e: DragEvent) => e.preventDefault();

    const detectDevTools = setInterval(() => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      if (widthThreshold || heightThreshold) {
        displaySecurityAlert('Ouverture des outils de développement détectée');
        logViolation('devtools');
      }
    }, 1000);

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('drop', handleDrop);
      clearInterval(detectDevTools);
    };
  }, []);

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
          ? currentAnswers.filter((a: number) => a !== answerIndex)
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
            answers.every((a: number) => correctAnswers.includes(a));
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
        alert('✅ Accès accordé ! Les rôles ont été mis à jour. Tu peux maintenant rejoindre le serveur Discord.');
        window.location.href = 'https://discord.gg/RWJDtZSeve';
      } else {
        alert('❌ Erreur lors de l\'attribution du rôle. Contacte le support via un ticket.');
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
          <div className="text-center max-w-md">
            <div className="text-8xl mb-6 animate-pulse">🤖</div>
            <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              N.O.A.H.
            </h1>
            <p className="text-gray-300 mb-8 text-lg">
              Pour accéder au <b className="text-white">règlement complet</b> et au quiz de vérification, une connexion est requise.
            </p>
            <a
                href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent((process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/api/discord/callback')}&response_type=code&scope=identify`}
                className="bg-[#5865F2] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#4752C4] transition transform hover:scale-105 inline-flex items-center gap-3 shadow-lg shadow-blue-500/20"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
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
              <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-xl font-bold z-50 shadow-lg animate-bounce">
                ⚠️ {securityAlertMessage}
              </div>
          )}

          <div className="bg-[#111827] border-2 border-cyan-500/30 rounded-2xl p-8 max-w-3xl w-full shadow-2xl">
            {quizResult ? (
                <div className="text-center py-8">
                  <div className="text-8xl mb-6">{quizResult.passed ? '🎉' : '😔'}</div>
                  <h2 className={`text-4xl font-extrabold mb-4 ${quizResult.passed ? 'text-green-400' : 'text-red-400'}`}>
                    {quizResult.passed ? 'Quiz Réussi avec Succès !' : 'Quiz Échoué'}
                  </h2>
                  <div className="text-7xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-6">
                    {quizResult.percentage}%
                  </div>
                  <p className="text-gray-300 mb-8 text-xl leading-relaxed">
                    {quizResult.passed
                        ? `<b class="text-white">Bravo ${user.username} !</b> Tu as obtenu <b class="text-cyan-400">${quizResult.correct}/${QUIZ_LENGTH}</b> bonnes réponses en <b class="text-white">${quizResult.duration}s</b>. Tes rôles ont été mis à jour.`
                        : `Tu as obtenu <b class="text-red-400">${quizResult.correct}/${QUIZ_LENGTH}</b> bonnes réponses. Il faut un minimum de <b class="text-white">75%</b> pour réussir. <br/><br/>Relis attentivement le règlement et réessaie !`}
                  </p>
                  {quizResult.passed ? (
                      <button
                          onClick={() => window.location.href = 'https://discord.gg/RWJDtZSeve'}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:scale-105 transition shadow-lg"
                      >
                        🚀 Rejoindre le Serveur Maintenant
                      </button>
                  ) : (
                      <button
                          onClick={retryQuiz}
                          className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:scale-105 transition shadow-lg"
                      >
                        🔄 Relire et Réessayer
                      </button>
                  )}
                </div>
            ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-cyan-400 mb-4">🎯 Quiz de Vérification des Connaissances</h2>
                    <div className="flex justify-between text-sm text-gray-400 mb-3 font-semibold">
                      <span>Question {currentQuestionIndex + 1} sur {QUIZ_LENGTH}</span>
                      <span>Progression : {userAnswers.filter(a => a && a.length > 0).length} répondues</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-700">
                      <div
                          className="bg-gradient-to-r from-cyan-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${((currentQuestionIndex) / QUIZ_LENGTH) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="mb-8 bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-3 leading-relaxed">{currentQuestion.q}</h3>
                    {isMulti && (
                        <p className="text-yellow-400 text-sm font-bold flex items-center gap-2">
                          <span>⚠️</span> <span className="uppercase tracking-wider">Plusieurs réponses possibles</span>
                        </p>
                    )}
                  </div>

                  <div className="space-y-4 mb-8">
                    {currentQuestion.options.map((option: string, idx: number) => {
                      const isSelected = currentAnswers.includes(idx);
                      return (
                          <button
                              key={idx}
                              onClick={() => selectAnswer(idx, isMulti)}
                              className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-start gap-4 ${
                                  isSelected
                                      ? 'border-cyan-400 bg-cyan-500/10 shadow-md shadow-cyan-500/10'
                                      : 'border-gray-700 bg-gray-800/50 hover:border-cyan-500/50 hover:bg-gray-800'
                              }`}
                          >
                            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                isSelected ? 'bg-cyan-500 border-cyan-500' : 'border-gray-500'
                            }`}>
                              {isSelected && <span className="text-white text-sm font-black">✓</span>}
                            </div>
                            <span className="text-gray-200 font-medium leading-relaxed">{option}</span>
                          </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between gap-4 pt-4 border-t border-gray-700">
                    <button
                        onClick={previousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="bg-gray-800 text-gray-300 px-6 py-3 rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition border border-gray-600"
                    >
                      ← Précédent
                    </button>
                    <button
                        onClick={nextQuestion}
                        disabled={currentAnswers.length === 0}
                        className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition shadow-lg"
                    >
                      {currentQuestionIndex === QUIZ_LENGTH - 1 ? 'Terminer et Voir le Résultat ✓' : 'Question Suivante →'}
                    </button>
                  </div>
                </>
            )}
          </div>
        </div>
    );
  }

  // ============================================
// 🎨 RENDU : RÈGLEMENT DÉTAILLÉ
// ============================================
  return (
      <div className="min-h-screen bg-[#0a0e1a] text-white">
        {securityAlertMessage && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-xl font-bold z-50 shadow-lg animate-bounce">
              ⚠️ {securityAlertMessage}
            </div>
        )}

        <div className="max-w-5xl mx-auto p-6 md:p-10">
          {/* ===== HEADER ===== */}
          <div className="text-center py-16 border-b-2 border-cyan-500/30 mb-12">
            <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              🤖 Règlement Officiel N.O.A.H.
            </h1>
            <p className="text-gray-400 text-xl italic mb-2 font-medium">Neural Operational Assistant Hub</p>
            <p className="text-gray-500 text-sm mb-8">📜 Version 2.0 · Dernière mise à jour : Août 2026</p>
            <div className="inline-flex items-center gap-4 bg-gray-800/60 border border-cyan-500/30 rounded-full px-8 py-4 shadow-lg">
              <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full border-2 border-cyan-500" />
              <span className="font-bold text-lg text-cyan-300">{user.username}</span>
            </div>

            {/* Sommaire rapide */}
            <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-3xl mx-auto">
              {[
                "🌟 Présentation", "🧠 Respect", "💡 Contenu", "⚡ Communication",
                "⚖️ Sanctions", "🔐 RGPD & IA", "🏠 Catégories", "🎭 Rôles",
                "🚨 Signalement", "📢 Appel", "🌟 Valeurs"
              ].map((item, idx) => (
                  <span key={idx} className="text-xs px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-full text-gray-400">
                {item}
              </span>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            {/* ============================================ */}
            {/* SECTION 1 — PRÉSENTATION */}
            {/* ============================================ */}
            <section className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/50 transition duration-300 shadow-lg">
              <h2 className="text-3xl font-black text-cyan-400 mb-6 flex items-center gap-3 border-b border-gray-700 pb-4">
                🌟 1. Bienvenue & Présentation du Projet
              </h2>

              <h3 className="text-xl font-bold text-white mb-3">🤖 Qu'est-ce que N.O.A.H. ?</h3>
              <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                <b className="text-white text-xl">N.O.A.H.</b> (<em className="text-cyan-400 font-semibold">Neural Operational Assistant Hub</em>) est une <b className="text-white">Intelligence Artificielle en développement continu</b>. Elle est conçue pour être un assistant <b className="text-cyan-300">opérationnel, créatif et bienveillant</b>. Ce serveur Discord n'est pas juste un lieu de discussion, c'est le <b className="text-white">cœur vivant du projet</b> : l'espace où la communauté teste, améliore et façonne l'IA de demain.
              </p>

              <h3 className="text-xl font-bold text-white mb-3">🎯 Nos Missions Fondamentales</h3>
              <ul className="space-y-3 text-gray-300 mb-6 text-lg">
                <li className="flex items-start gap-3">🧠 <b className="text-white">Tester et améliorer</b> les capacités de <b className="text-cyan-300">N.O.A.H.</b> ensemble, en temps réel.</li>
                <li className="flex items-start gap-3">💡 <b className="text-white">Partager</b> des idées, des découvertes techniques et des créations innovantes.</li>
                <li className="flex items-start gap-3">🎓 <b className="text-white">Apprendre</b> les uns des autres, quel que soit ton niveau de départ.</li>
                <li className="flex items-start gap-3">🚀 <b className="text-white">Construire</b> collectivement l'avenir de cette technologie.</li>
                <li className="flex items-start gap-3">🔍 <b className="text-white">Identifier</b> les bugs et limites de <b className="text-cyan-300">N.O.A.H.</b> pour accélérer son évolution.</li>
                <li className="flex items-start gap-3">🌍 <b className="text-white">Fédérer</b> une communauté internationale passionnée d'IA.</li>
              </ul>

              <h3 className="text-xl font-bold text-white mb-3">🗺️ Comment naviguer sur ce serveur ?</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700">
                  <p className="text-cyan-300 font-bold mb-1">📌 #annonces</p>
                  <p className="text-gray-400 text-sm">Les mises à jour officielles de <b className="text-white">N.O.A.H.</b></p>
                </div>
                <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700">
                  <p className="text-cyan-300 font-bold mb-1">💬 #discussion-generale</p>
                  <p className="text-gray-400 text-sm">L'espace de vie principal de la communauté</p>
                </div>
                <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700">
                  <p className="text-cyan-300 font-bold mb-1">🎫 #ouvrir-un-ticket</p>
                  <p className="text-gray-400 text-sm">Pour contacter le Staff en privé</p>
                </div>
              </div>

              <div className="bg-cyan-900/20 border-l-4 border-cyan-500 p-4 rounded-r-lg">
                <p className="text-cyan-200 font-bold text-lg">
                  ✅ <b className="text-white">Acceptation du règlement :</b> En accédant à ce serveur, tu confirmes avoir <b className="text-white">lu, compris et accepté</b> l'intégralité de ce document.
                  <b className="text-red-400"> L'ignorance des règles n'est jamais une excuse valable.</b>
                </p>
              </div>
            </section>

            {/* ============================================ */}
            {/* SECTION 2 — RESPECT */}
            {/* ============================================ */}
            <section className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/50 transition duration-300 shadow-lg">
              <h2 className="text-3xl font-black text-cyan-400 mb-6 flex items-center gap-3 border-b border-gray-700 pb-4">
                🧠 2. Respect & Vivre Ensemble (Tolérance Zéro)
              </h2>

              <h3 className="text-xl font-bold text-white mb-3">🤝 Le respect : notre valeur absolue</h3>
              <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                Le respect s'applique <b className="text-white">entre tous les membres</b>, envers l'équipe du staff, envers l'IA <b className="text-cyan-300">N.O.A.H.</b> elle-même, et envers la diversité des idées et des centres d'intérêt de chacun. <b className="text-white">Aucune exception</b> n'est tolérée, quel que soit ton rôle, ton ancienneté ou ton statut VIP.
              </p>

              <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2">🚫 Tolérance Zéro Absolue</h3>
              <p className="text-gray-300 mb-4 font-semibold">Les comportements suivants entraînent une <b className="text-red-400 text-xl">exclusion immédiate et définitive (Bannissement)</b>, sans aucun avertissement préalable :</p>
              <ul className="space-y-3 text-gray-300 mb-6 text-lg">
                <li className="flex items-start gap-3">❌ <b className="text-white">Harcèlement</b> sous toutes ses formes (moral, sexuel, cyberharcèlement, acharnement).</li>
                <li className="flex items-start gap-3">❌ <b className="text-white">Discrimination</b> (racisme, sexisme, homophobie, transphobie, validisme, antisémitisme, etc.).</li>
                <li className="flex items-start gap-3">❌ <b className="text-white">Discours haineux</b>, incitation à la haine ou appels à la violence.</li>
                <li className="flex items-start gap-3">❌ <b className="text-white">Doxing</b> (divulgation de données personnelles, d'adresse ou de numéro de téléphone sans consentement explicite).</li>
                <li className="flex items-start gap-3">❌ <b className="text-white">Menaces</b> physiques, psychologiques ou chantage.</li>
                <li className="flex items-start gap-3">❌ <b className="text-white">Apologie</b> de comportements violents, terroristes ou autodestructeurs.</li>
                <li className="flex items-start gap-3">❌ <b className="text-white">Manipulation</b> répétée ou détournement délibéré de <b className="text-cyan-300">N.O.A.H.</b> pour produire du contenu haineux.</li>
              </ul>

              <h3 className="text-xl font-bold text-white mb-3">💬 Communication bienveillante</h3>
              <ul className="space-y-2 text-gray-300 text-lg mb-6">
                <li>• Exprime-toi avec <b className="text-cyan-300">empathie</b> et <b className="text-cyan-300">ouverture d'esprit</b>.</li>
                <li>• Les blagues et l'humour sont les bienvenus, mais <b className="text-red-400">jamais au détriment ou à l'encontre de quelqu'un</b>.</li>
                <li>• En cas de conflit, <b className="text-white">prends du recul</b> ou passe en message privé. Si ça bloque, contacte un modérateur via un ticket.</li>
                <li>• Les <b className="text-white">débats</b> sont encouragés tant qu'ils restent argumentés et courtois — le désaccord n'est jamais une excuse pour l'agressivité.</li>
              </ul>

              <h3 className="text-xl font-bold text-white mb-3">🌈 Diversité et inclusion</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                <b className="text-cyan-300">N.O.A.H.</b> se veut un espace <b className="text-white">accueillant pour tous</b>, indépendamment de l'origine, du genre, de l'orientation, de la religion ou du niveau technique. La diversité des profils est une <b className="text-white">richesse</b>, pas un motif de division.
              </p>
            </section>

            {/* ============================================ */}
            {/* SECTION 3 — CONTENU */}
            {/* ============================================ */}
            <section className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/50 transition duration-300 shadow-lg">
              <h2 className="text-3xl font-black text-cyan-400 mb-6 flex items-center gap-3 border-b border-gray-700 pb-4">
                💡 3. Contenu Autorisé & Strictement Interdit
              </h2>

              <h3 className="text-xl font-bold text-red-400 mb-4">🚫 Contenu strictement interdit (Motif de Sanction)</h3>
              <div className="overflow-x-auto mb-8">
                <table className="w-full bg-gray-800/40 rounded-xl border border-gray-700">
                  <thead>
                  <tr className="border-b border-gray-600 bg-gray-900/50">
                    <th className="text-left p-4 text-cyan-400 font-black text-lg">Catégorie</th>
                    <th className="text-left p-4 text-cyan-400 font-black text-lg">Exemples Concrets</th>
                  </tr>
                  </thead>
                  <tbody className="text-gray-300 text-lg">
                  <tr className="border-b border-gray-700">
                    <td className="p-4 text-red-400 font-bold">🔞 Contenu NSFW</td>
                    <td className="p-4">Pornographie, nudité explicite, contenu érotique, gore.</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-4 text-red-400 font-bold">⚖️ Activités Illégales</td>
                    <td className="p-4">Piratage logiciel, vente de drogues, contrefaçon, phishing, arnaques.</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-4 text-red-400 font-bold">🦠 Menaces Informatiques</td>
                    <td className="p-4">Partage de <b>malware</b>, virus, chevaux de Troie, ou fichiers exécutables (.exe, .bat) suspects.</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-4 text-red-400 font-bold">🎯 Spam & Flood</td>
                    <td className="p-4">Envoi massif de messages identiques, murs de texte, pub non autorisée.</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-4 text-red-400 font-bold">🎭 Usurpation d'identité</td>
                    <td className="p-4">Se faire passer pour un membre du <b>Staff</b> ou pour l'IA <b className="text-cyan-300">N.O.A.H.</b> elle-même.</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-4 text-red-400 font-bold">🤖 Abus de l'IA</td>
                    <td className="p-4">Tenter de contourner les protections de <b className="text-cyan-300">N.O.A.H.</b> ("jailbreak") pour produire du contenu interdit.</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-red-400 font-bold">💰 Escroquerie</td>
                    <td className="p-4">Faux giveaways, liens de phishing déguisés en récompenses, vente frauduleuse.</td>
                  </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-bold text-green-400 mb-3">✅ Contenu fortement encouragé et valorisé</h3>
              <ul className="space-y-2 text-gray-300 text-lg mb-6">
                <li>🎨 <b className="text-white">Tes créations personnelles</b> (art, code, musique, écriture, montage vidéo).</li>
                <li>📚 <b className="text-white">Tes découvertes</b> (articles pertinents, nouveaux outils IA, recherches).</li>
                <li>🚀 <b className="text-white">Tes projets</b> liés à <b className="text-cyan-300">N.O.A.H.</b> ou à la technologie en général (dans les salons dédiés).</li>
                <li>🧪 <b className="text-white">Tes retours d'expérience</b> sur l'utilisation de <b className="text-cyan-300">N.O.A.H.</b> — bugs, idées, suggestions.</li>
                <li>🏆 <b className="text-white">Tes réussites</b>, qu'elles soient personnelles, scolaires ou professionnelles.</li>
              </ul>

              <h3 className="text-xl font-bold text-white mb-3">📸 Règles sur le partage de médias</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Tout média partagé doit respecter le <b className="text-white">droit d'auteur</b>. Crédite systématiquement les créateurs originaux si tu partages une œuvre qui n'est pas la tienne. Le contenu généré par <b className="text-cyan-300">N.O.A.H.</b> doit être identifié comme tel lorsqu'il est partagé hors du serveur.
              </p>
            </section>

            {/* ============================================ */}
            {/* SECTION 4 — COMMUNICATION */}
            {/* ============================================ */}
            <section className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/50 transition duration-300 shadow-lg">
              <h2 className="text-3xl font-black text-cyan-400 mb-6 flex items-center gap-3 border-b border-gray-700 pb-4">
                ⚡ 4. Règles de Communication & Étiquette
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">💬 Salons Texte & Forums</h3>
                  <ul className="space-y-3 text-gray-300 text-lg">
                    <li>📌 <b className="text-white">Respecte le thème</b> de chaque salon. Utilise les fils de discussion (threads) pour les sujets longs.</li>
                    <li>🔤 Le <b className="text-white">Français</b> et l'<b className="text-white">Anglais</b> sont les langues principales. Utilise le salon <b className="text-cyan-300">#international</b> pour les autres.</li>
                    <li>🔗 Les liens partagés doivent être <b className="text-white">sûrs, vérifiés et légaux</b>. Pas de raccourcisseurs d'URL suspects.</li>
                    <li>📝 <b className="text-white">Formate</b> tes messages longs pour faciliter la lecture (titres, listes, blocs de code).</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">🔊 Salons Vocaux</h3>
                  <ul className="space-y-3 text-gray-300 text-lg">
                    <li>🎤 <b className="text-white">Présente-toi brièvement</b> en arrivant dans un salon.</li>
                    <li>🔇 <b className="text-white">Coupe ton micro (Mute)</b> impérativement quand tu ne parles pas pour éviter les bruits de clavier ou de fond.</li>
                    <li>🎙️ L'<b className="text-white">enregistrement audio/vidéo</b> d'une conversation nécessite l'<b className="text-red-400">accord explicite de tous</b> les participants présents.</li>
                    <li>🎧 Évite de <b className="text-white">changer de salon vocal en boucle</b>, cela dérange les autres membres.</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mt-6 mb-3">🤖 Interagir avec N.O.A.H. directement</h3>
              <ul className="space-y-2 text-gray-300 text-lg mb-6">
                <li>✅ Utilise les <b className="text-white">salons dédiés au bot</b> pour tes tests intensifs afin de ne pas polluer les discussions générales.</li>
                <li>✅ Signale toute <b className="text-white">réponse étrange ou erronée</b> de <b className="text-cyan-300">N.O.A.H.</b> dans le salon <b className="text-cyan-300">#retours-ia</b>.</li>
                <li>❌ N'utilise pas <b className="text-cyan-300">N.O.A.H.</b> pour spammer ou surcharger volontairement le système.</li>
              </ul>

              <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="text-yellow-200 font-bold text-lg">
                  🔔 <b className="text-white">Mentions :</b> L'utilisation de <b className="text-red-400">@everyone</b> et <b className="text-red-400">@here</b> est <b className="text-white">strictement réservée au Staff</b>. Mentionner abusivement un membre qui ne t'a pas sollicité est interdit.
                </p>
              </div>
            </section>

            {/* ============================================ */}
            {/* SECTION 5 — SANCTIONS */}
            {/* ============================================ */}
            <section className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/50 transition duration-300 shadow-lg">
              <h2 className="text-3xl font-black text-cyan-400 mb-6 flex items-center gap-3 border-b border-gray-700 pb-4">
                ⚖️ 5. Système de Sanctions Progressif
              </h2>
              <p className="text-gray-300 mb-6 text-lg">
                Notre système est <b className="text-white">pédagogique</b> : l'objectif est de corriger le comportement, pas de punir aveuglément. Cependant, la gravité de l'infraction détermine la sanction, et certains actes graves <b className="text-red-400">court-circuitent directement les premiers niveaux</b>.
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="w-full bg-gray-800/40 rounded-xl border border-gray-700">
                  <thead>
                  <tr className="border-b border-gray-600 bg-gray-900/50">
                    <th className="text-left p-4 text-cyan-400 font-black text-lg">Niveau</th>
                    <th className="text-left p-4 text-cyan-400 font-black text-lg">Sanction Appliquée</th>
                    <th className="text-left p-4 text-cyan-400 font-black text-lg">Durée / Portée</th>
                  </tr>
                  </thead>
                  <tbody className="text-gray-300 text-lg">
                  <tr className="border-b border-gray-700"><td className="p-4 font-bold text-yellow-400">🟡 Niveau 1</td><td className="p-4">Avertissement oral (en MP ou vocal)</td><td className="p-4">Immédiat</td></tr>
                  <tr className="border-b border-gray-700"><td className="p-4 font-bold text-orange-400">🟠 Niveau 2</td><td className="p-4">Avertissement écrit (trace dans le système)</td><td className="p-4">Permanent</td></tr>
                  <tr className="border-b border-gray-700"><td className="p-4 font-bold text-red-400">🔴 Niveau 3</td><td className="p-4">Mute temporaire (impossibilité d'écrire/parler)</td><td className="p-4">1 heure à 24 heures</td></tr>
                  <tr className="border-b border-gray-700"><td className="p-4 font-bold text-purple-400">⚫ Niveau 4</td><td className="p-4">Exclusion temporaire (Kick/Ban temporaire)</td><td className="p-4">24 heures à 30 jours</td></tr>
                  <tr><td className="p-4 font-bold text-gray-400">💀 Niveau 5</td><td className="p-4">Bannissement définitif (Blacklist)</td><td className="p-4">Permanent, sans appel immédiat</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">🔍 Circonstances prises en compte</h3>
              <ul className="space-y-2 text-gray-300 text-lg mb-6">
                <li>📈 <b className="text-red-400">Aggravantes :</b> Récidive après avertissement, infraction collective, mensonge au staff, ciblage délibéré, usage de plusieurs comptes pour contourner une sanction.</li>
                <li>📉 <b className="text-green-400">Atténuantes :</b> Reconnaissance rapide des faits, excuses sincères, jeune âge ou nouveauté sur le serveur, absence d'antécédents.</li>
              </ul>

              <h3 className="text-xl font-bold text-white mb-3">👮 Qui applique les sanctions ?</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Seuls les membres du <b className="text-white">Staff officiel</b> (Modérateurs, Administrateurs) sont habilités à sanctionner. Toute personne prétendant appliquer une sanction sans détenir ce rôle sera elle-même sanctionnée pour <b className="text-red-400">usurpation d'autorité</b>.
              </p>
            </section>

            {/* ============================================ */}
            {/* SECTION 6 — RGPD & IA */}
            {/* ============================================ */}
            <section className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/50 transition duration-300 shadow-lg">
              <h2 className="text-3xl font-black text-cyan-400 mb-6 flex items-center gap-3 border-b border-gray-700 pb-4">
                🔐 6. Protection des Données (RGPD) & IA
              </h2>

              <h3 className="text-xl font-bold text-white mb-3">📊 Quelles données sont collectées ?</h3>
              <ul className="space-y-2 text-gray-300 mb-6 text-lg">
                <li>🆔 ID Discord, pseudo et avatar (pour l'identification et l'affichage).</li>
                <li>💬 Historique des messages (uniquement pour la modération et l'entraînement local de <b className="text-cyan-300">N.O.A.H.</b>).</li>
                <li>🎭 Rôles et activité vocale (pour les statistiques internes, de manière anonyme).</li>
                <li>📅 Dates de connexion et d'activité (pour la sécurité et la lutte contre les comptes multiples).</li>
              </ul>

              <h3 className="text-xl font-bold text-white mb-3">🤖 Utilisation par l'IA N.O.A.H.</h3>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                <b className="text-cyan-300">N.O.A.H.</b> peut traiter certaines de tes interactions pour <b className="text-cyan-300">s'améliorer</b>, personnaliser les échanges et analyser les tendances de la communauté.
                <br/><br/>
                <b className="text-green-400 text-xl">⚠️ ENGAGEMENT FORT : N.O.A.H. ne revend JAMAIS tes données personnelles à des tiers ou des annonceurs.</b>
              </p>

              <h3 className="text-xl font-bold text-white mb-3">🛡️ Tes droits fondamentaux</h3>
              <p className="text-gray-300 mb-4 text-lg">
                Conformément au RGPD, tu disposes d'un droit d'<b className="text-white">accès</b>, de <b className="text-white">rectification</b>, d'<b className="text-white">effacement</b> ("droit à l'oubli"), et d'<b className="text-white">opposition</b>.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700">
                  <p className="text-cyan-300 font-bold mb-1">🗑️ Suppression de compte</p>
                  <p className="text-gray-400 text-sm">Sur simple demande, tes données sont <b className="text-white">effacées sous 30 jours</b>.</p>
                </div>
                <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700">
                  <p className="text-cyan-300 font-bold mb-1">📤 Export de données</p>
                  <p className="text-gray-400 text-sm">Tu peux demander une <b className="text-white">copie complète</b> de tes données stockées.</p>
                </div>
              </div>

              <div className="bg-cyan-900/20 border-l-4 border-cyan-500 p-4 rounded-r-lg">
                <p className="text-cyan-200 font-bold text-lg">
                  📧 <b className="text-white">Comment exercer tes droits ?</b> Ouvre simplement un <b className="text-white">ticket</b> dans le salon <b className="text-cyan-300">#ouvrir-un-ticket</b> avec l'objet exact : <em>"Demande RGPD"</em>. Délai de traitement : 30 jours max.
                </p>
              </div>
            </section>

            {/* ============================================ */}
            {/* SECTION 7 — CATÉGORIES */}
            {/* ============================================ */}
            <section className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/50 transition duration-300 shadow-lg">
              <h2 className="text-3xl font-black text-cyan-400 mb-6 flex items-center gap-3 border-b border-gray-700 pb-4">
                🏠 7. Règles Spécifiques par Catégorie
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-xl font-bold text-blue-400 mb-3">🎓 Espace Étudiants</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>✅ Entraide <b className="text-white">sérieuse, détaillée et constructive</b>.</li>
                    <li>❌ <b className="text-red-400">Plagiat strictement interdit</b>. Les travaux doivent être personnels.</li>
                    <li>❌ Partage ou vente de <b className="text-red-400">fuites de sujets d'examens</b> interdit.</li>
                    <li>✅ Utilise <b className="text-cyan-300">N.O.A.H.</b> comme outil d'aide, pas comme substitut à ton propre travail.</li>
                  </ul>
                </div>
                <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-xl font-bold text-purple-400 mb-3">💻 Espace Développeurs</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>✅ Code <b className="text-white">propre, documenté</b> et respectueux des licences open-source.</li>
                    <li>❌ Partage de <b className="text-red-400">malware</b> ou code malveillant = Ban immédiat.</li>
                    <li>✅ Respect absolu de la <b className="text-white">propriété intellectuelle</b> d'autrui.</li>
                    <li>✅ Encourage la <b className="text-white">revue de code bienveillante</b> entre membres.</li>
                  </ul>
                </div>
                <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">💎 Espace VIP</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>✅ Accès à des salons exclusifs, previews et support prioritaire.</li>
                    <li>⚠️ <b className="text-red-400">Les avantages VIP ne donnent AUCUN droit supplémentaire</b> pour enfreindre le règlement général. Un VIP toxique sera sanctionné comme les autres.</li>
                    <li>✅ Accès anticipé aux <b className="text-white">nouvelles fonctionnalités</b> de <b className="text-cyan-300">N.O.A.H.</b> en test.</li>
                  </ul>
                </div>
                <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-xl font-bold text-green-400 mb-3">🔊 Étiquette Vocale</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>✅ Respecte les <b className="text-white">thématiques</b> des salons (ex: silence en #étude-commune).</li>
                    <li>✅ Utilisation de <b className="text-white">Push-to-Talk</b> fortement recommandée en cas de bruit ambiant.</li>
                  </ul>
                </div>
                <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-xl font-bold text-pink-400 mb-3">🎨 Espace Créatif</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>✅ Partage librement tes <b className="text-white">créations générées avec ou sans N.O.A.H.</b></li>
                    <li>✅ Les <b className="text-white">critiques constructives</b> sont bienvenues, pas le dénigrement gratuit.</li>
                  </ul>
                </div>
                <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-xl font-bold text-orange-400 mb-3">🧪 Espace Beta-Testeurs</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>✅ Rôle réservé aux membres testant les <b className="text-white">nouvelles fonctions de N.O.A.H.</b></li>
                    <li>🔒 <b className="text-red-400">Confidentialité obligatoire</b> sur les fonctionnalités non publiées.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* ============================================ */}
            {/* SECTION 8 — RÔLES & HIÉRARCHIE (NOUVEAU) */}
            {/* ============================================ */}
            <section className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/50 transition duration-300 shadow-lg">
              <h2 className="text-3xl font-black text-cyan-400 mb-6 flex items-center gap-3 border-b border-gray-700 pb-4">
                🎭 8. Rôles, Hiérarchie & Équipe
              </h2>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Le serveur <b className="text-cyan-300">N.O.A.H.</b> repose sur une organisation claire pour garantir une modération juste et transparente.
              </p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full bg-gray-800/40 rounded-xl border border-gray-700">
                  <thead>
                  <tr className="border-b border-gray-600 bg-gray-900/50">
                    <th className="text-left p-4 text-cyan-400 font-black text-lg">Rôle</th>
                    <th className="text-left p-4 text-cyan-400 font-black text-lg">Responsabilités</th>
                  </tr>
                  </thead>
                  <tbody className="text-gray-300 text-lg">
                  <tr className="border-b border-gray-700"><td className="p-4 font-bold text-red-400">👑 Fondateur</td><td className="p-4">Vision globale du projet, décisions finales sur <b className="text-cyan-300">N.O.A.H.</b></td></tr>
                  <tr className="border-b border-gray-700"><td className="p-4 font-bold text-purple-400">🛡️ Administrateur</td><td className="p-4">Gestion du serveur, application des sanctions lourdes, supervision du Staff</td></tr>
                  <tr className="border-b border-gray-700"><td className="p-4 font-bold text-cyan-400">🔧 Modérateur</td><td className="p-4">Modération quotidienne, traitement des tickets, avertissements</td></tr>
                  <tr className="border-b border-gray-700"><td className="p-4 font-bold text-green-400">🧪 Beta-Testeur</td><td className="p-4">Test des nouvelles fonctionnalités avant leur sortie officielle</td></tr>
                  <tr><td className="p-4 font-bold text-gray-400">👤 Membre</td><td className="p-4">Participation libre dans le respect du règlement</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                Devenir <b className="text-white">Modérateur</b> ou <b className="text-white">Beta-Testeur</b> se fait uniquement sur <b className="text-white">candidature</b> ou <b className="text-white">invitation</b> du Staff, jamais par achat ou favoritisme.
              </p>
            </section>

            {/* ============================================ */}
            {/* SECTION 9 — SIGNALEMENT (NOUVEAU) */}
            {/* ============================================ */}
            <section className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/50 transition duration-300 shadow-lg">
              <h2 className="text-3xl font-black text-cyan-400 mb-6 flex items-center gap-3 border-b border-gray-700 pb-4">
                🚨 9. Comment Signaler un Problème ?
              </h2>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Si tu es témoin ou victime d'un comportement contraire au règlement, voici la marche à suivre :
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <p className="text-white font-bold">Ouvre un ticket</p>
                    <p className="text-gray-400">Rends-toi dans <b className="text-cyan-300">#ouvrir-un-ticket</b> et décris la situation clairement.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <p className="text-white font-bold">Fournis des preuves</p>
                    <p className="text-gray-400">Captures d'écran, liens de messages — cela accélère grandement le traitement.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <p className="text-white font-bold">Le Staff analyse</p>
                    <p className="text-gray-400">Un modérateur examine la situation en toute <b className="text-white">confidentialité</b>.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                  <span className="text-2xl">4️⃣</span>
                  <div>
                    <p className="text-white font-bold">Une décision est prise</p>
                    <p className="text-gray-400">Tu es informé de l'issue, dans le respect de la vie privée de toutes les parties.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-200 font-bold text-lg">
                  ⚠️ <b className="text-white">Faux signalements :</b> Signaler délibérément et faussement un membre est considéré comme une <b className="text-red-400">infraction en soi</b> et peut être sanctionné.
                </p>
              </div>
            </section>

            {/* ============================================ */}
            {/* SECTION 10 — APPEL D'UNE SANCTION (NOUVEAU) */}
            {/* ============================================ */}
            <section className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/50 transition duration-300 shadow-lg">
              <h2 className="text-3xl font-black text-cyan-400 mb-6 flex items-center gap-3 border-b border-gray-700 pb-4">
                📢 10. Contester une Sanction
              </h2>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Tu penses qu'une sanction est <b className="text-white">injuste ou erronée</b> ? Tu as le droit de la contester.
              </p>
              <ul className="space-y-3 text-gray-300 text-lg mb-6">
                <li>📩 Ouvre un ticket avec l'objet <em className="text-cyan-300">"Appel de sanction"</em> dans les <b className="text-white">7 jours</b> suivant la décision.</li>
                <li>🧾 Explique calmement ta version des faits, sans agressivité envers le Staff.</li>
                <li>⏳ Un membre du Staff <b className="text-white">différent</b> de celui ayant appliqué la sanction réexaminera le dossier.</li>
                <li>✅ Si l'erreur est reconnue, la sanction est <b className="text-white">levée ou ajustée</b> sans conséquence pour toi.</li>
              </ul>
              <p className="text-gray-400 text-base italic">
                Les bannissements de <b className="text-white">Niveau 5</b> pour infractions extrêmement graves (pédopornographie, menaces terroristes, etc.) ne sont <b className="text-red-400">pas sujets à appel</b>.
              </p>
            </section>

            {/* ============================================ */}
            {/* SECTION 11 — VALEURS & CONCLUSION */}
            {/* ============================================ */}
            <section className="bg-[#111827] border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/50 transition duration-300 shadow-lg">
              <h2 className="text-3xl font-black text-cyan-400 mb-6 flex items-center gap-3 border-b border-gray-700 pb-4">
                🌟 11. Valeurs & Conclusion
              </h2>
              <blockquote className="border-l-4 border-cyan-500 pl-6 py-4 bg-gray-800/50 rounded-r-xl italic text-gray-300 font-semibold mb-6 text-xl leading-relaxed">
                "<b className="text-white text-2xl">Respect · Curiosité · Innovation · Bienveillance · Partage · Apprentissage · Créativité</b>"
              </blockquote>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Ces <b className="text-cyan-300">sept valeurs</b> ne sont pas juste des mots, elles guident <b className="text-white">chaque interaction</b> et chaque décision de modération sur ce serveur. <b className="text-cyan-300">N.O.A.H.</b> est avant tout une <b className="text-white">communauté vivante</b>, et chaque membre, quel qu'il soit, apporte sa pierre à l'édifice.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Ce règlement <b className="text-white">évoluera</b> avec le projet. Toute modification importante sera annoncée dans <b className="text-cyan-300">#annonces</b>, et ton maintien sur le serveur vaut acceptation des futures mises à jour.
              </p>
              <div className="text-center bg-gradient-to-r from-cyan-900/30 to-purple-900/30 p-8 rounded-2xl border border-cyan-500/30">
                <p className="text-2xl font-black text-white mb-2">Bienvenue dans l'aventure N.O.A.H. 🚀</p>
                <p className="text-cyan-300 font-medium">Ensemble, construisons l'IA de demain.</p>
              </div>
            </section>
          </div> {/* ✅ Fin de la div "space-y-10" */}

          {/* ✅ BOUTON QUIZ FLOTTANT (doit être À L'INTÉRIEUR du conteneur principal) */}
          <div className="sticky bottom-8 mt-16 flex justify-center z-40">
            <button
                onClick={startQuiz}
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white px-12 py-6 rounded-2xl font-black text-2xl shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all duration-300 animate-bounce border-2 border-white/10"
            >
              🎯 Passer le Quiz de Vérification d'Accès
            </button>
          </div>

        </div>
      </div>
  );
}