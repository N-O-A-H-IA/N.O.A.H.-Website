"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

type Language = "fr" | "en" | "es" | "de" | "it" | "pt" | "nl" | "ru" | "zh" | "ja" | "ko" | "ar" | "hi" | "tr" | "pl" | "sv";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string; // Fonction de traduction
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Dictionnaire de traductions (exemple)
const translations: Record<string, Record<Language, string>> = {
    "nav.chat": {
        fr: "Chat", en: "Chat", es: "Chat", de: "Chat", it: "Chat",
        pt: "Chat", nl: "Chat", ru: "Чат", zh: "聊天", ja: "チャット",
        ko: "채팅", ar: "دردشة", hi: "चैट", tr: "Sohbet", pl: "Czat", sv: "Chatt"
    },
    "nav.pricing": {
        fr: "Tarifs", en: "Pricing", es: "Precios", de: "Preise", it: "Prezzi",
        pt: "Preços", nl: "Prijzen", ru: "Цены", zh: "价格", ja: "料金",
        ko: "요금", ar: "الأسعار", hi: "मूल्य", tr: "Fiyatlar", pl: "Cennik", sv: "Priser"
    },
    "nav.marketplace": {
        fr: "Marketplace", en: "Marketplace", es: "Mercado", de: "Marktplatz",
        it: "Mercato", pt: "Mercado", nl: "Markt", ru: "Маркет", zh: "市场",
        ja: "マーケット", ko: "마켓", ar: "سوق", hi: "बाज़ार", tr: "Pazar", pl: "Rynek", sv: "Marknad"
    },
    "nav.logout": {
        fr: "Déconnexion", en: "Logout", es: "Cerrar sesión", de: "Abmelden",
        it: "Esci", pt: "Sair", nl: "Uitloggen", ru: "Выйти", zh: "退出",
        ja: "ログアウト", ko: "로그아웃", ar: "تسجيل الخروج", hi: "लॉगआउट",
        tr: "Çıkış", pl: "Wyloguj", sv: "Logga ut"
    },
    "nav.settings": {
        fr: "Paramètres", en: "Settings", es: "Ajustes", de: "Einstellungen",
        it: "Impostazioni", pt: "Configurações", nl: "Instellingen", ru: "Настройки",
        zh: "设置", ja: "設定", ko: "설정", ar: "الإعدادات", hi: "सेटिंग्स",
        tr: "Ayarlar", pl: "Ustawienia", sv: "Inställningar"
    },
    "nav.profile": {
        fr: "Compte", en: "Account", es: "Cuenta", de: "Konto",
        it: "Account", pt: "Conta", nl: "Account", ru: "Аккаунт",
        zh: "账户", ja: "アカウント", ko: "계정", ar: "حساب", hi: "खाता",
        tr: "Hesap", pl: "Konto", sv: "Konto"
    },

    // Settings

    "settings.security": {
        fr: "Sécurité", en: "Security", es: "Seguridad", de: "Sicherheit",
        it: "Sicurezza", pt: "Segurança", nl: "Beveiliging", ru: "Безопасность",
        zh: "安全", ja: "セキュリティ", ko: "보안", ar: "الأمان", hi: "सुरक्षा",
        tr: "Güvenlik", pl: "Bezpieczeństwo", sv: "Säkerhet"
    },



    // Page Apparence
// Page Apparence

    "appearance.title": {
        fr: "Apparence & Personnalisation",
        en: "Appearance & Customization",
        es: "Apariencia y Personalización",
        de: "Erscheinungsbild & Anpassung",
        it: "Aspetto e Personalizzazione",
        pt: "Aparência e Personalização",
        nl: "Uiterlijk & Aanpassing",
        ru: "Внешний вид и настройка",
        zh: "外观与个性化",
        ja: "外観とカスタマイズ",
        ko: "모양 및 맞춤설정",
        ar: "المظهر والتخصيص",
        hi: "रूप और अनुकूलन",
        tr: "Görünüm ve Özelleştirme",
        pl: "Wygląd i Personalizacja",
        sv: "Utseende & Anpassning",
    },

    "appearance.description": {
        fr: "Personnalisez l'apparence, la langue et l'accessibilité de N.O.A.H.",
        en: "Customize the appearance, language and accessibility of N.O.A.H.",
        es: "Personaliza la apariencia, idioma y accesibilidad de N.O.A.H.",
        de: "Passen Sie das Erscheinungsbild, die Sprache und die Barrierefreiheit von N.O.A.H. an",
        it: "Personalizza l'aspetto, la lingua e l'accessibilità di N.O.A.H.",
        pt: "Personalize a aparência, idioma e acessibilidade do N.O.A.H.",
        nl: "Pas het uiterlijk, de taal en de toegankelijkheid van N.O.A.H. aan",
        ru: "Настройте внешний вид, язык и доступность N.O.A.H.",
        zh: "自定义 N.O.A.H. 的外观、语言和无障碍功能",
        ja: "N.O.A.H. の外観、言語、アクセシビリティをカスタマイズ",
        ko: "N.O.A.H.의 모양, 언어 및 접근성 사용자 지정",
        ar: "تخصيص مظهر ولغة وإمكانية الوصول في N.O.A.H.",
        hi: "N.O.A.H. का रूप, भाषा और सुगमता अनुकूलित करें",
        tr: "N.O.A.H.'nin görünümünü, dilini ve erişilebilirliğini özelleştirin",
        pl: "Dostosuj wygląd, język i dostępność N.O.A.H.",
        sv: "Anpassa utseende, språk och tillgänglighet för N.O.A.H.",
    },

    "appearance.theme": {
        fr: "Thème",
        en: "Theme",
        es: "Tema",
        de: "Thema",
        it: "Tema",
        pt: "Tema",
        nl: "Thema",
        ru: "Тема",
        zh: "主题",
        ja: "テーマ",
        ko: "테마",
        ar: "السمة",
        hi: "थीम",
        tr: "Tema",
        pl: "Motyw",
        sv: "Tema",
    },

    "appearance.accent": {
        fr: "Couleur d'accentuation",
        en: "Accent color",
        es: "Color de acento",
        de: "Akzentfarbe",
        it: "Colore di accento",
        pt: "Cor de destaque",
        nl: "Accentkleur",
        ru: "Цвет акцента",
        zh: "强调色",
        ja: "アクセントカラー",
        ko: "액센트 색상",
        ar: "لون التمييز",
        hi: "एक्सेंट रंग",
        tr: "Vurgu rengi",
        pl: "Kolor akcentu",
        sv: "Accentfärg",
    },

    "appearance.accent_desc": {
        fr: "Choisissez la couleur principale utilisée pour les boutons et éléments interactifs",
        en: "Choose the primary color used for buttons and interactive elements",
        es: "Elige el color principal usado para botones y elementos interactivos",
        de: "Wählen Sie die Primärfarbe für Schaltflächen und interaktive Elemente",
        it: "Scegli il colore principale per pulsanti ed elementi interattivi",
        pt: "Escolha a cor principal para botões e elementos interativos",
        nl: "Kies de primaire kleur voor knoppen en interactieve elementen",
        ru: "Выберите основной цвет для кнопок и интерактивных элементов",
        zh: "选择用于按钮和交互元素的主要颜色",
        ja: "ボタンやインタラクティブ要素に使用されるメインカラーを選択",
        ko: "버튼 및 상호작용 요소에 사용되는 기본 색상 선택",
        ar: "اختر اللون الرئيسي للأزرار والعناصر التفاعلية",
        hi: "बटन और इंटरैक्टिव तत्वों के लिए प्राथमिक रंग चुनें",
        tr: "Düğmeler ve etkileşimli öğeler için kullanılan ana rengi seçin",
        pl: "Wybierz główny kolor dla przycisków i elementów interaktywnych",
        sv: "Välj primärfärg för knappar och interaktiva element",
    },

    "appearance.language": {
        fr: "Langue",
        en: "Language",
        es: "Idioma",
        de: "Sprache",
        it: "Lingua",
        pt: "Idioma",
        nl: "Taal",
        ru: "Язык",
        zh: "语言",
        ja: "言語",
        ko: "언어",
        ar: "اللغة",
        hi: "भाषा",
        tr: "Dil",
        pl: "Język",
        sv: "Språk",
    },

    "appearance.language_description": {
        fr: "La langue sélectionnée s'appliquera à toute l'interface et aux réponses de N.O.A.H.",
        en: "The selected language will apply to the entire interface and N.O.A.H.'s responses",
        es: "El idioma seleccionado se aplicará a toda la interfaz y a las respuestas de N.O.A.H.",
        de: "Die ausgewählte Sprache gilt für die gesamte Benutzeroberfläche und die Antworten von N.O.A.H.",
        it: "La lingua selezionata si applicherà a tutta l'interfaccia e alle risposte di N.O.A.H.",
        pt: "O idioma selecionado será aplicado a toda a interface e às respostas do N.O.A.H.",
        nl: "De geselecteerde taal is van toepassing op de hele interface en de antwoorden van N.O.A.H.",
        ru: "Выбранный язык будет применяться ко всему интерфейсу и ответам N.O.A.H.",
        zh: "所选语言将应用于整个界面和 N.O.A.H. 的回复",
        ja: "選択した言語はインターフェース全体と N.O.A.H. の応答に適用されます",
        ko: "선한 언어는 전체 인터페이스와 N.O.A.H.의 응답에 적용됩니다",
        ar: "ستطبق اللغة المحددة على الواجهة بأكملها وعلى ردود N.O.A.H.",
        hi: "चयनित भाषा पूरे इंटरफेस और N.O.A.H. की प्रतिक्रियाओं पर लागू होगी",
        tr: "Seçilen dil, tüm arayüze ve N.O.A.H.'nin yanıtlarına uygulanacaktır",
        pl: "Wybrany język będzie stosowany do całego interfejsu i odpowiedzi N.O.A.H.",
        sv: "Det valda språket kommer att gälla för hela gränssnittet och N.O.A.H.:s svar",
    },

    "appearance.density": {
        fr: "Densité de l'interface",
        en: "Interface density",
        es: "Densidad de interfaz",
        de: "Oberflächendichte",
        it: "Densità dell'interfaccia",
        pt: "Densidade da interface",
        nl: "Interface dichtheid",
        ru: "Плотность интерфейса",
        zh: "界面密度",
        ja: "インターフェースの密度",
        ko: "인터페이스 밀도",
        ar: "كثافة الواجهة",
        hi: "इंटरफेस घनत्व",
        tr: "Arayüz yoğunluğu",
        pl: "Gęstość interfejsu",
        sv: "Gränssnittstäthet",
    },

    "appearance.density_desc": {
        fr: "Ajustez l'espacement des éléments de l'interface",
        en: "Adjust the spacing of interface elements",
        es: "Ajusta el espaciado de los elementos de la interfaz",
        de: "Passen Sie den Abstand der Oberflächenelemente an",
        it: "Regola la spaziatura degli elementi dell'interfaccia",
        pt: "Ajuste o espaçamento dos elementos da interface",
        nl: "Pas de afstand van interface-elementen aan",
        ru: "Настройте интервалы между элементами интерфейса",
        zh: "调整界面元素的间距",
        ja: "インターフェース要素の間隔を調整",
        ko: "인터페이스 요소의 간격 조정",
        ar: "اضبط تباعد عناصر الواجهة",
        hi: "इंटरफेस तत्वों का अंतराल समायोजित करें",
        tr: "Arayüz öğelerinin boşluğunu ayarlayın",
        pl: "Dostosuj odstępy elementów interfejsu",
        sv: "Justera avståndet för gränssnittselement",
    },

    "appearance.font_size": {
        fr: "Taille du texte",
        en: "Font size",
        es: "Tamaño de fuente",
        de: "Schriftgröße",
        it: "Dimensione del testo",
        pt: "Tamanho da fonte",
        nl: "Lettergrootte",
        ru: "Размер шрифта",
        zh: "字体大小",
        ja: "文字サイズ",
        ko: "글꼴 크기",
        ar: "حجم الخط",
        hi: "फ़ॉन्ट आकार",
        tr: "Yazı boyutu",
        pl: "Rozmiar czcionki",
        sv: "Teckenstorlek",
    },

    "appearance.font_size_desc": {
        fr: "Ajustez la taille du texte dans toute l'application",
        en: "Adjust the text size throughout the application",
        es: "Ajusta el tamaño de fuente en toda la aplicación",
        de: "Passen Sie die Textgröße in der gesamten Anwendung an",
        it: "Regola la dimensione del testo in tutta l'applicazione",
        pt: "Ajuste o tamanho da fonte em todo o aplicativo",
        nl: "Pas de tekstgrootte in de hele applicatie aan",
        ru: "Настройте размер текста во всем приложении",
        zh: "调整整个应用程序中的文本大小",
        ja: "アプリケーション全体の文字サイズを調整",
        ko: "전체 애플리케이션의 텍스트 크기 조정",
        ar: "اضبط حجم النص في التطبيق بأكمله",
        hi: "पूरे एप्लिकेशन में टेक्स्ट आकार समायोजित करें",
        tr: "Uygulama genelinde yazı boyutunu ayarlayın",
        pl: "Dostosuj rozmiar tekstu w całej aplikacji",
        sv: "Justera textstorleken i hela applikationen",
    },

    "appearance.preview_text": {
        fr: "Ceci est un aperçu de la taille du texte. N.O.A.H. s'adapte à vos préférences.",
        en: "This is a preview of the text size. N.O.A.H. adapts to your preferences.",
        es: "Esta es una vista previa del tamaño del texto. N.O.A.H. se adapta a tus preferencias.",
        de: "Dies ist eine Vorschau der Textgröße. N.O.A.H. passt sich Ihren Einstellungen an.",
        it: "Questa è un'anteprima della dimensione del testo. N.O.A.H. si adatta alle tue preferenze.",
        pt: "Esta é uma prévia do tamanho do texto. O N.O.A.H. se adapta às suas preferências.",
        nl: "Dit is een voorbeeld van de tekstgrootte. N.O.A.H. past zich aan uw voorkeuren aan.",
        ru: "Это предпросмотр размера текста. N.O.A.H. адаптируется к вашим настройкам.",
        zh: "这是文本大小的预览。N.O.A.H. 会适应您的偏好。",
        ja: "これは文字サイズのプレビューです。N.O.A.H. はあなたの設定に適応します。",
        ko: "텍스트 크기 미리보기입니다. N.O.A.H.는 환경설정에 맞게 조정됩니다.",
        ar: "هذه معاينة لحجم النص. يتكيف N.O.A.H. مع تفضيلاتك.",
        hi: "यह टेक्स्ट आकार का पूर्वावलोकन है। N.O.A.H. आपकी प्राथमिकताओं के अनुसार अनुकूलित होता है।",
        tr: "Bu yazı boyutu önizlemesidir. N.O.A.H. tercihlerinize uyum sağlar.",
        pl: "To podgląd rozmiaru tekstu. N.O.A.H. dostosowuje się do Twoich preferencji.",
        sv: "Detta är en förhandsvisning av textstorleken. N.O.A.H. anpassar sig till dina preferenser.",
    },

    "appearance.animations": {
        fr: "Animations",
        en: "Animations",
        es: "Animaciones",
        de: "Animationen",
        it: "Animazioni",
        pt: "Animações",
        nl: "Animaties",
        ru: "Анимации",
        zh: "动画",
        ja: "アニメーション",
        ko: "애니메이션",
        ar: "الرسوم المتحركة",
        hi: "एनिमेशन",
        tr: "Animasyonlar",
        pl: "Animacje",
        sv: "Animationer",
    },

    "appearance.enable_animations": {
        fr: "Activer les animations",
        en: "Enable animations",
        es: "Activar animaciones",
        de: "Animationen aktivieren",
        it: "Abilita animazioni",
        pt: "Ativar animações",
        nl: "Animaties inschakelen",
        ru: "Включить анимации",
        zh: "启用动画",
        ja: "アニメーションを有効化",
        ko: "애니메이션 활성화",
        ar: "تفعيل الرسوم المتحركة",
        hi: "एनिमेशन सक्षम करें",
        tr: "Animasyonları etkinleştir",
        pl: "Włącz animacje",
        sv: "Aktivera animationer",
    },

    "appearance.enable_animations_desc": {
        fr: "Animer les transitions et les interactions",
        en: "Animate transitions and interactions",
        es: "Animar transiciones e interacciones",
        de: "Übergänge und Interaktionen animieren",
        it: "Anima transizioni e interazioni",
        pt: "Animar transições e interações",
        nl: "Animeer overgangen en interacties",
        ru: "Анимировать переходы и взаимодействия",
        zh: "为过渡和交互添加动画",
        ja: "トランジションとインタラクションをアニメーション化",
        ko: "전환 및 상호작용 애니메이션",
        ar: "تحريك الانتقالات والتفاعلات",
        hi: "संक्रमण और इंटरैक्शन एनिमेट करें",
        tr: "Geçişleri ve etkileşimleri canlandır",
        pl: "Animuj przejścia i interakcje",
        sv: "Animera övergångar och interaktioner",
    },

    "appearance.reduce_motion": {
        fr: "Réduire les animations",
        en: "Reduce motion",
        es: "Reducir movimiento",
        de: "Bewegung reduzieren",
        it: "Riduci movimento",
        pt: "Reduzir movimento",
        nl: "Beweging verminderen",
        ru: "Уменьшить движение",
        zh: "减少动画",
        ja: "モーションを減らす",
        ko: "모션 줄이기",
        ar: "تقليل الحركة",
        hi: "गति कम करें",
        tr: "Hareketi azalt",
        pl: "Zmniejsz ruch",
        sv: "Minska rörelse",
    },

    "appearance.reduce_motion_desc": {
        fr: "Réduire les animations pour les personnes sensibles au mouvement",
        en: "Reduce animations for people sensitive to motion",
        es: "Reducir animaciones para personas sensibles al movimiento",
        de: "Animationen für bewegungsempfindliche Personen reduzieren",
        it: "Riduci le animazioni per le persone sensibili al movimento",
        pt: "Reduzir animações para pessoas sensíveis a movimento",
        nl: "Verminder animaties voor mensen die gevoelig zijn voor beweging",
        ru: "Уменьшить анимации для людей, чувствительных к движению",
        zh: "为对动画敏感的人减少动画",
        ja: "モーションに敏感な人のためにアニメーションを減らす",
        ko: "모션에 민감한 사람을 위한 애니메이션 줄이기",
        ar: "تقليل الرسوم المتحركة للأشخاص الحساسين للحركة",
        hi: "गति के प्रति संवेदनशील लोगों के लिए एनिमेशन कम करें",
        tr: "Harekete duyarlı kişiler için animasyonları azalt",
        pl: "Zmniejsz animacje dla osób wrażliwych na ruch",
        sv: "Minska animationer för personer känsliga för rörelse",
    },

    "appearance.accessibility": {
        fr: "Accessibilité",
        en: "Accessibility",
        es: "Accesibilidad",
        de: "Barrierefreiheit",
        it: "Accessibilità",
        pt: "Acessibilidade",
        nl: "Toegankelijkheid",
        ru: "Доступность",
        zh: "无障碍",
        ja: "アクセシビリティ",
        ko: "접근성",
        ar: "إمكانية الوصول",
        hi: "सुगमता",
        tr: "Erişilebilirlik",
        pl: "Dostępność",
        sv: "Tillgänglighet",
    },

    "appearance.high_contrast": {
        fr: "Contraste élevé",
        en: "High contrast",
        es: "Alto contraste",
        de: "Hoher Kontrast",
        it: "Alto contrasto",
        pt: "Alto contraste",
        nl: "Hoog contrast",
        ru: "Высокий контраст",
        zh: "高对比度",
        ja: "高コントラスト",
        ko: "고대비",
        ar: "تباين عالي",
        hi: "उच्च विपरीत",
        tr: "Yüksek kontrast",
        pl: "Wysoki kontrast",
        sv: "Hög kontrast",
    },

    "appearance.high_contrast_desc": {
        fr: "Augmenter le contraste pour une meilleure lisibilité",
        en: "Increase contrast for better readability",
        es: "Aumentar el contraste para mejor legibilidad",
        de: "Kontrast für bessere Lesbarkeit erhöhen",
        it: "Aumenta il contrasto per una migliore leggibilità",
        pt: "Aumentar o contraste para melhor legibilidade",
        nl: "Verhoog het contrast voor betere leesbaarheid",
        ru: "Увеличить контраст для лучшей читаемости",
        zh: "增加对比度以提高可读性",
        ja: "読みやすさのためにコントラストを上げる",
        ko: "가독성을 위해 대비 높이기",
        ar: "زيادة التباين لتحسين القراءة",
        hi: "बेहतर पठनीयता के लिए कंट्रास्ट बढ़ाएं",
        tr: "Daha iyi okunabilirlik için kontrastı artır",
        pl: "Zwiększ kontrast dla lepszej czytelności",
        sv: "Öka kontrasten för bättre läsbarhet",
    },

    "appearance.screen_reader": {
        fr: "Optimiser pour lecteur d'écran",
        en: "Optimize for screen reader",
        es: "Optimizar para lector de pantalla",
        de: "Für Bildschirmleser optimieren",
        it: "Ottimizza per screen reader",
        pt: "Otimizar para leitor de tela",
        nl: "Optimaliseren voor schermlezer",
        ru: "Оптимизировать для экранного диктора",
        zh: "为屏幕阅读器优化",
        ja: "スクリーンリーダー用に最適化",
        ko: "스크린 리더에 최적화",
        ar: "تحسين لقارئ الشاشة",
        hi: "स्क्रीन रीडर के लिए अनुकूलित करें",
        tr: "Ekran okuyucusu için optimize et",
        pl: "Optymalizuj dla czytnika ekranu",
        sv: "Optimera för skärmläsare",
    },

    "appearance.screen_reader_desc": {
        fr: "Améliorer la compatibilité avec les lecteurs d'écran",
        en: "Improve compatibility with screen readers",
        es: "Mejorar la compatibilidad con lectores de pantalla",
        de: "Kompatibilität mit Bildschirmlesern verbessern",
        it: "Migliora la compatibilità con gli screen reader",
        pt: "Melhorar a compatibilidade com leitores de tela",
        nl: "Verbeter de compatibiliteit met schermlezers",
        ru: "Улучшить совместимость с программами чтения с экрана",
        zh: "提高与屏幕阅读器的兼容性",
        ja: "スクリーンリーダーとの互換性を向上",
        ko: "스크린 리더 호환성 향상",
        ar: "تحسين التوافق مع قارئات الشاشة",
        hi: "स्क्रीन रीडर के साथ संगतता में सुधार करें",
        tr: "Ekran okuyucularıyla uyumluluğu artır",
        pl: "Popraw kompatybilność z czytnikami ekranu",
        sv: "Förbättra kompatibiliteten med skärmläsare",
    },

    "common.save": {
        fr: "Sauvegarder",
        en: "Save",
        es: "Guardar",
        de: "Speichern",
        it: "Salva",
        pt: "Salvar",
        nl: "Opslaan",
        ru: "Сохранить",
        zh: "保存",
        ja: "保存",
        ko: "저장",
        ar: "حفظ",
        hi: "सहेजें",
        tr: "Kaydet",
        pl: "Zapisz",
        sv: "Spara",
    },

};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("fr");
    const supabase = createClient();

    useEffect(() => {
        // Charger la langue depuis le profil utilisateur
        const loadLanguage = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from("profiles")
                .select("ai_language")
                .eq("id", user.id)
                .single();

            if (profile?.ai_language) {
                setLanguage(profile.ai_language as Language);
                document.documentElement.lang = profile.ai_language;
            }
        };

        loadLanguage();
    }, []);

    const handleSetLanguage = async (lang: Language) => {
        setLanguage(lang);
        document.documentElement.lang = lang;

        // Sauvegarder dans Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase
                .from("profiles")
                .update({ ai_language: lang })
                .eq("id", user.id);
        }
    };

    const t = (key: string): string => {
        return translations[key]?.[language] || translations[key]?.fr || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within LanguageProvider");
    return context;
};