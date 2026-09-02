"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import {
    Palette, Globe, CheckCircle2, Sun, Moon, Monitor, Sparkles,
    Type, Zap, Accessibility, Droplets, Layout,
    Save, RefreshCw, Check
} from "lucide-react";
import {useAppearance} from "@/contexts/AppearanceContext";

// ====== LANGUES ======
const LANGUAGES = [
    { code: "fr", emoji: "🇫🇷", native: "Français", translations: {
            fr: "Français", en: "French", es: "Francés", de: "Französisch", it: "Francese",
            pt: "Francês", nl: "Frans", ru: "Французский", zh: "法语", ja: "フランス語",
            ko: "프랑스어", ar: "الفرنسية", hi: "फ्रेंच", tr: "Fransızca", pl: "Francuski", sv: "Franska"
        }},
    { code: "en", emoji: "🇬🇧", native: "English", translations: {
            fr: "Anglais", en: "English", es: "Inglés", de: "Englisch", it: "Inglese",
            pt: "Inglês", nl: "Engels", ru: "Английский", zh: "英语", ja: "英語",
            ko: "영어", ar: "الإنجليزية", hi: "अंग्रेज़ी", tr: "İngilizce", pl: "Angielski", sv: "Engelska"
        }},
    { code: "es", emoji: "🇪🇸", native: "Español", translations: {
            fr: "Espagnol", en: "Spanish", es: "Español", de: "Spanisch", it: "Spagnolo",
            pt: "Espanhol", nl: "Spaans", ru: "Испанский", zh: "西班牙语", ja: "スペイン語",
            ko: "스페인어", ar: "الإسبانية", hi: "स्पैनिश", tr: "İspanyolca", pl: "Hiszpański", sv: "Spanska"
        }},
    { code: "de", emoji: "🇪", native: "Deutsch", translations: {
            fr: "Allemand", en: "German", es: "Alemán", de: "Deutsch", it: "Tedesco",
            pt: "Alemão", nl: "Duits", ru: "Немецкий", zh: "德语", ja: "ドイツ語",
            ko: "독일어", ar: "الألمانية", hi: "जर्मन", tr: "Almanca", pl: "Niemiecki", sv: "Tyska"
        }},
    { code: "it", emoji: "🇮", native: "Italiano", translations: {
            fr: "Italien", en: "Italian", es: "Italiano", de: "Italienisch", it: "Italiano",
            pt: "Italiano", nl: "Italiaans", ru: "Итальянский", zh: "意大利语", ja: "イタリア語",
            ko: "이탈리아어", ar: "الإيطالية", hi: "इटालियन", tr: "İtalyanca", pl: "Włoski", sv: "Italienska"
        }},
    { code: "pt", emoji: "🇵🇹", native: "Português", translations: {
            fr: "Portugais", en: "Portuguese", es: "Portugués", de: "Portugiesisch", it: "Portoghese",
            pt: "Português", nl: "Portugees", ru: "Португальский", zh: "葡萄牙语", ja: "ポルトガル語",
            ko: "포르투갈어", ar: "البرتغالية", hi: "पुर्तगाली", tr: "Portekizce", pl: "Portugalski", sv: "Portugisiska"
        }},
    { code: "nl", emoji: "🇳🇱", native: "Nederlands", translations: {
            fr: "Néerlandais", en: "Dutch", es: "Neerlandés", de: "Niederländisch", it: "Olandese",
            pt: "Holandês", nl: "Nederlands", ru: "Голландский", zh: "荷兰语", ja: "オランダ語",
            ko: "네덜란드어", ar: "الهولندية", hi: "डच", tr: "Flemenkçe", pl: "Niderlandzki", sv: "Nederländska"
        }},
    { code: "ru", emoji: "🇷🇺", native: "Русский", translations: {
            fr: "Russe", en: "Russian", es: "Ruso", de: "Russisch", it: "Russo",
            pt: "Russo", nl: "Russisch", ru: "Русский", zh: "俄语", ja: "ロシア語",
            ko: "러시아어", ar: "الروسية", hi: "रूसी", tr: "Rusça", pl: "Rosyjski", sv: "Ryska"
        }},
    { code: "zh", emoji: "🇨🇳", native: "中文", translations: {
            fr: "Chinois", en: "Chinese", es: "Chino", de: "Chinesisch", it: "Cinese",
            pt: "Chinês", nl: "Chinees", ru: "Китайский", zh: "中文", ja: "中国語",
            ko: "중국어", ar: "الصينية", hi: "चीनी", tr: "Çince", pl: "Chiński", sv: "Kinesiska"
        }},
    { code: "ja", emoji: "🇯", native: "日本語", translations: {
            fr: "Japonais", en: "Japanese", es: "Japonés", de: "Japanisch", it: "Giapponese",
            pt: "Japonês", nl: "Japans", ru: "Японский", zh: "日语", ja: "日本語",
            ko: "일본어", ar: "اليابانية", hi: "जापानी", tr: "Japonca", pl: "Japoński", sv: "Japanska"
        }},
    { code: "ko", emoji: "🇰", native: "한국어", translations: {
            fr: "Coréen", en: "Korean", es: "Coreano", de: "Koreanisch", it: "Coreano",
            pt: "Coreano", nl: "Koreaans", ru: "Корейский", zh: "韩语", ja: "韓国語",
            ko: "한국어", ar: "الكورية", hi: "कोरियाई", tr: "Korece", pl: "Koreański", sv: "Koreanska"
        }},
    { code: "ar", emoji: "🇸🇦", native: "العربية", translations: {
            fr: "Arabe", en: "Arabic", es: "Árabe", de: "Arabisch", it: "Arabo",
            pt: "Árabe", nl: "Arabisch", ru: "Арабский", zh: "阿拉伯语", ja: "アラビア語",
            ko: "아랍어", ar: "العربية", hi: "अरबी", tr: "Arapça", pl: "Arabski", sv: "Arabiska"
        }},
    { code: "hi", emoji: "🇳", native: "हिन्दी", translations: {
            fr: "Hindi", en: "Hindi", es: "Hindi", de: "Hindi", it: "Hindi",
            pt: "Hindi", nl: "Hindi", ru: "Хинди", zh: "印地语", ja: "ヒンディー語",
            ko: "힌디어", ar: "الهندية", hi: "हिन्दी", tr: "Hintçe", pl: "Hindi", sv: "Hindi"
        }},
    { code: "tr", emoji: "🇹🇷", native: "Türkçe", translations: {
            fr: "Turc", en: "Turkish", es: "Turco", de: "Türkisch", it: "Turco",
            pt: "Turco", nl: "Turks", ru: "Турецкий", zh: "土耳其语", ja: "トルコ語",
            ko: "터키어", ar: "التركية", hi: "तुर्की", tr: "Türkçe", pl: "Turecki", sv: "Turkiska"
        }},
    { code: "pl", emoji: "🇱", native: "Polski", translations: {
            fr: "Polonais", en: "Polish", es: "Polaco", de: "Polnisch", it: "Polacco",
            pt: "Polonês", nl: "Pools", ru: "Польский", zh: "波兰语", ja: "ポーランド語",
            ko: "폴란드어", ar: "البولندية", hi: "पोलिश", tr: "Lehçe", pl: "Polski", sv: "Polska"
        }},
    { code: "sv", emoji: "🇪", native: "Svenska", translations: {
            fr: "Suédois", en: "Swedish", es: "Sueco", de: "Schwedisch", it: "Svedese",
            pt: "Sueco", nl: "Zweeds", ru: "Шведский", zh: "瑞典语", ja: "スウェーデン語",
            ko: "스웨덴어", ar: "السويدية", hi: "स्वीडिश", tr: "İsveççe", pl: "Szwedzki", sv: "Svenska"
        }},
];

// ====== THÈMES ======
const THEMES = [
    {
        id: "midnight",
        name: { fr: "Minuit", en: "Midnight", es: "Medianoche", de: "Mitternacht", it: "Mezzanotte", pt: "Meia-noite", nl: "Middernacht", ru: "Полночь", zh: "午夜", ja: "ミッドナイト", ko: "자정", ar: "منتصف الليل", hi: "मध्यरात्रि", tr: "Gece Yarısı", pl: "Północ", sv: "Midnatt" },
        desc: { fr: "Sombre profond avec accents violets", en: "Deep dark with violet accents", es: "Oscuro profundo con acentos violeta", de: "Tiefes Dunkel mit violetten Akzenten", it: "Scuro profondo con accenti viola", pt: "Escuro profundo com acentos violeta", nl: "Diep donker met paarse accenten", ru: "Глубокий тёмный с фиолетовыми акцентами", zh: "深黑色配紫色点缀", ja: "深いダークとバイオレットアクセント", ko: "짙은 다크와 바이올렛 액센트", ar: "داكن عميق مع لمسات بنفسجية", hi: "गहरा डार्क बैंगनी एक्सेंट के साथ", tr: "Mor vurgulu derin koyu", pl: "Głęboka czerń z fioletowymi akcentami", sv: "Djup mörk med lila accenter" },
        preview: "from-gray-900 via-gray-950 to-black",
        accent: "bg-violet-500",
        icon: Moon,
    },
    {
        id: "ocean",
        name: { fr: "Océan", en: "Ocean", es: "Océano", de: "Ozean", it: "Oceano", pt: "Oceano", nl: "Oceaan", ru: "Океан", zh: "海洋", ja: "オーシャン", ko: "오션", ar: "المحيط", hi: "महासागर", tr: "Okyanus", pl: "Ocean", sv: "Hav" },
        desc: { fr: "Bleus profonds et cyan lumineux", en: "Deep blues and bright cyan", es: "Azules profundos y cian brillante", de: "Tiefes Blau und helles Cyan", it: "Blu profondo e ciano luminoso", pt: "Azuis profundos e ciano brilhante", nl: "Diepblauw en helder cyaan", ru: "Глубокие синие и яркий циан", zh: "深蓝与亮青色", ja: "深い青と明るいシアン", ko: "은 블루와 밝은 시안", ar: "أزرق عميق وسماوي ساطع", hi: "गहरा नीला और चमकदार सियान", tr: "Derin mavi ve parlak camgöbeği", pl: "Głęboka niebieskość i jasny cyjan", sv: "Djupblå och ljus cyan" },
        preview: "from-blue-900 via-cyan-900 to-slate-900",
        accent: "bg-cyan-500",
        icon: Droplets,
    },
    {
        id: "forest",
        name: { fr: "Forêt", en: "Forest", es: "Bosque", de: "Wald", it: "Foresta", pt: "Floresta", nl: "Bos", ru: "Лес", zh: "森林", ja: "フォレスト", ko: "포레스트", ar: "الغابة", hi: "जंगल", tr: "Orman", pl: "Las", sv: "Skog" },
        desc: { fr: "Verts naturels et tons boisés", en: "Natural greens and woody tones", es: "Verdes naturales y tonos amaderados", de: "Natürliche Grüntöne und Holztöne", it: "Verdi naturali e toni legnosi", pt: "Verdes naturais e tons amadeirados", nl: "Natuurlijke groenen en houttinten", ru: "Природные зелёные и древесные тона", zh: "自然绿与木色调", ja: "自然な緑と木目調", ko: "자연 그린과 우디 톤", ar: "أخضر طبيعي ونغمات خشبية", hi: "प्राकृतिक हरा और लकड़ी के रंग", tr: "Doğal yeşiller ve ahşap tonları", pl: "Naturalna zieleń i drewniane odcienie", sv: "Naturliga gröna och trätoner" },
        preview: "from-emerald-900 via-green-900 to-slate-900",
        accent: "bg-emerald-500",
        icon: Sparkles,
    },
    {
        id: "sunset",
        name: { fr: "Coucher de soleil", en: "Sunset", es: "Atardecer", de: "Sonnenuntergang", it: "Tramonto", pt: "Pôr do sol", nl: "Zonsondergang", ru: "Закат", zh: "日落", ja: "サンセット", ko: "선셋", ar: "غروب الشمس", hi: "सूर्यास्त", tr: "Gün Batımı", pl: "Zachód słońca", sv: "Solnedgång" },
        desc: { fr: "Oranges chauds et roses vibrants", en: "Warm oranges and vibrant pinks", es: "Naranjas cálidos y rosas vibrantes", de: "Warme Orangetöne und lebendiges Rosa", it: "Arancioni caldi e rosa vivaci", pt: "Laranjas quentes e rosas vibrantes", nl: "Warme oranje en levendig roze", ru: "Тёплые оранжевые и яркие розовые", zh: "暖橙色与鲜艳粉色", ja: "暖かいオレンジと鮮やかなピンク", ko: "따뜻한 오렌지와 선명한 핑크", ar: "برتقالي دافئ ووردي نابض", hi: "गर्म नारंगी और जीवंत गुलाबी", tr: "Sıcak turuncu ve canlı pembe", pl: "Ciepłe pomarańcze i żywe róże", sv: "Varm orange och livfull rosa" },
        preview: "from-orange-900 via-rose-900 to-purple-900",
        accent: "bg-orange-500",
        icon: Sun,
    },
    {
        id: "nordic",
        name: { fr: "Nordique", en: "Nordic", es: "Nórdico", de: "Nordisch", it: "Nordico", pt: "Nórdico", nl: "Noords", ru: "Скандинавский", zh: "北欧", ja: "ノーディック", ko: "노르딕", ar: "النوردية", hi: "नॉर्डिक", tr: "Nordik", pl: "Nordycki", sv: "Nordisk" },
        desc: { fr: "Minimaliste et épuré, tons froids", en: "Minimalist and clean, cool tones", es: "Minimalista y limpio, tonos fríos", de: "Minimalistisch und klar, kühle Töne", it: "Minimalista e pulito, toni freddi", pt: "Minimalista e limpo, tons frios", nl: "Minimalistisch en schoon, koele tinten", ru: "Минималистичный и чистый, холодные тона", zh: "极简主义，冷色调", ja: "ミニマリストでクールなトーン", ko: "미니멀하고 시원한 톤", ar: "بسيط ونظيف، نغمات باردة", hi: "न्यूनतम और साफ, ठंडे रंग", tr: "Minimalist ve temiz, soğuk tonlar", pl: "Minimalistyczny i czysty, chłodne odcienie", sv: "Minimalistisk och ren, kalla toner" },
        preview: "from-slate-800 via-gray-800 to-zinc-900",
        accent: "bg-sky-500",
        icon: Monitor,
    },
    {
        id: "cyberpunk",
        name: { fr: "Cyberpunk", en: "Cyberpunk", es: "Cyberpunk", de: "Cyberpunk", it: "Cyberpunk", pt: "Cyberpunk", nl: "Cyberpunk", ru: "Киберпанк", zh: "赛博朋克", ja: "サイバーパンク", ko: "사이버펑크", ar: "سايبربانك", hi: "साइबरपंक", tr: "Cyberpunk", pl: "Cyberpunk", sv: "Cyberpunk" },
        desc: { fr: "Néons vifs et ambiance futuriste", en: "Vivid neons and futuristic vibe", es: "Neones vívidos y ambiente futurista", de: "Lebendige Neons und futuristisches Flair", it: "Neon vivaci e atmosfera futuristica", pt: "Neons vívidos e vibe futurista", nl: "Levendige neon en futuristische sfeer", ru: "Яркие неоны и футуристическая атмосфера", zh: "鲜艳霓虹与未来感", ja: "鮮やかなネオンと未来的な雰囲気", ko: "선명한 네온과 미래적 분위기", ar: "نيون حيوي وأجواء مستقبلية", hi: "जीवंत नियॉन और भविष्यवादी माहौल", tr: "Canlı neonlar ve fütüristik hava", pl: "Żywe neony i futurystyczny klimat", sv: "Livfulla neon och futuristisk känsla" },
        preview: "from-fuchsia-900 via-purple-900 to-cyan-900",
        accent: "bg-fuchsia-500",
        icon: Zap,
    },
    {
        id: "light",
        name: { fr: "Clair", en: "Light", es: "Claro", de: "Hell", it: "Chiaro", pt: "Claro", nl: "Licht", ru: "Светлый", zh: "浅色", ja: "ライト", ko: "라이트", ar: "فاتح", hi: "लाइट", tr: "Açık", pl: "Jasny", sv: "Ljus" },
        desc: { fr: "Interface claire et lumineuse", en: "Light and bright interface", es: "Interfaz clara y brillante", de: "Helle und helle Benutzeroberfläche", it: "Interfaccia chiara e luminosa", pt: "Interface clara e brilhante", nl: "Lichte en heldere interface", ru: "Светлый и яркий интерфейс", zh: "明亮清晰的界面", ja: "明るく鮮やかなインターフェース", ko: "밝고 선명한 인터페이스", ar: "واجهة فاتحة ومشرقة", hi: "हल्का और उज्ज्वल इंटरफेस", tr: "Açık ve parlak arayüz", pl: "Jasny i jasny interfejs", sv: "Ljust och ljust gränssnitt" },
        preview: "from-gray-100 via-white to-gray-200",
        accent: "bg-blue-500",
        icon: Sun,
    },
    {
        id: "system",
        name: { fr: "Système", en: "System", es: "Sistema", de: "System", it: "Sistema", pt: "Sistema", nl: "Systeem", ru: "Система", zh: "系统", ja: "システム", ko: "시스템", ar: "النظام", hi: "सिस्टम", tr: "Sistem", pl: "System", sv: "System" },
        desc: { fr: "S'adapte aux préférences système", en: "Adapts to system preferences", es: "Se adapta a las preferencias del sistema", de: "Passt sich den Systemeinstellungen an", it: "Si adatta alle preferenze di sistema", pt: "Adapta-se às preferências do sistema", nl: "Past zich aan systeemvoorkeuren aan", ru: "Адаптируется к системным настройкам", zh: "适应系统偏好", ja: "システム設定に適応", ko: "시스템 환경에 맞춤", ar: "يتكيف مع تفضيلات النظام", hi: "सिस्टम प्राथमिकताओं के अनुसार अनुकूलित", tr: "Sistem tercihlerine uyum sağlar", pl: "Dostosowuje się do preferencji systemowych", sv: "Anpassar sig till systempreferenser" },
        preview: "from-gray-400 via-gray-500 to-gray-600",
        accent: "bg-gray-500",
        icon: Monitor,
    },
];

// ====== COULEURS D'ACCENTUATION ======
const ACCENT_COLORS = [
    { id: "violet", label: "Violet", color: "bg-violet-500", hex: "#8b5cf6" },
    { id: "blue", label: "Bleu", color: "bg-blue-500", hex: "#3b82f6" },
    { id: "cyan", label: "Cyan", color: "bg-cyan-500", hex: "#06b6d4" },
    { id: "emerald", label: "Émeraude", color: "bg-emerald-500", hex: "#10b981" },
    { id: "amber", label: "Ambre", color: "bg-amber-500", hex: "#f59e0b" },
    { id: "rose", label: "Rose", color: "bg-rose-500", hex: "#f43f5e" },
    { id: "fuchsia", label: "Fuchsia", color: "bg-fuchsia-500", hex: "#d946ef" },
    { id: "indigo", label: "Indigo", color: "bg-indigo-500", hex: "#6366f1" },
];

// ====== DENSITÉS ======
const DENSITIES = [
    { id: "compact", label: { fr: "Compacte", en: "Compact", es: "Compacta", de: "Kompakt", it: "Compatta", pt: "Compacta", nl: "Compact", ru: "Компактная", zh: "紧凑", ja: "コンパクト", ko: "컴팩트", ar: "مضغوط", hi: "कॉम्पैक्ट", tr: "Kompakt", pl: "Kompaktowy", sv: "Kompakt" }, icon: Layout },
    { id: "standard", label: { fr: "Standard", en: "Standard", es: "Estándar", de: "Standard", it: "Standard", pt: "Padrão", nl: "Standaard", ru: "Стандартная", zh: "标准", ja: "標準", ko: "표준", ar: "قياسي", hi: "मानक", tr: "Standart", pl: "Standardowy", sv: "Standard" }, icon: Layout },
    { id: "comfortable", label: { fr: "Confortable", en: "Comfortable", es: "Cómoda", de: "Komfortabel", it: "Comoda", pt: "Confortável", nl: "Comfortabel", ru: "Комфортная", zh: "舒适", ja: "快適", ko: "편안한", ar: "مريح", hi: "आरामदायक", tr: "Rahat", pl: "Komfortowy", sv: "Bekväm" }, icon: Layout },
];

// ====== TAILLES DE TEXTE ======
const FONT_SIZES = [
    { id: "small", label: "S", value: 14 },
    { id: "medium", label: "M", value: 16 },
    { id: "large", label: "L", value: 18 },
    { id: "xlarge", label: "XL", value: 20 },
];

export default function AppearancePage() {
    const { language, setLanguage, t } = useLanguage();
    const supabase = createClient();
    const appearance = useAppearance(); // Récupère les valeurs actuelles


    // On utilise les valeurs du provider directement
    const [selectedTheme, setSelectedTheme] = useState(appearance.theme);
    const [accentColor, setAccentColor] = useState(appearance.accentColor);
    const [density, setDensity] = useState(appearance.density);
    const [fontSize, setFontSize] = useState(appearance.fontSize);
    const [animations, setAnimations] = useState(appearance.animations);
    const [reducedMotion, setReducedMotion] = useState(appearance.reducedMotion);
    const [highContrast, setHighContrast] = useState(appearance.highContrast);
    const [screenReader, setScreenReader] = useState(appearance.screenReader);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");


    // Charger les préférences au montage
    // Auto-save dès qu'un state change
    useEffect(() => {
        const timer = setTimeout(async () => {
            setSaving(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                await supabase.from("profiles").update({
                    theme: selectedTheme,
                    accent_color: accentColor,
                    density,
                    font_size: fontSize,
                    animations,
                    reduced_motion: reducedMotion,
                    high_contrast: highContrast,
                    screen_reader: screenReader,
                }).eq("id", user.id);
            } catch (e) { console.error(e); }
            finally { setSaving(false); }
        }, 800); // Sauvegarde 800ms après le dernier clic

        return () => clearTimeout(timer);
    }, [selectedTheme, accentColor, density, fontSize, animations, reducedMotion, highContrast, screenReader]);


    const loadPreferences = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from("profiles")
                .select("theme, accent_color, density, font_size, animations, reduced_motion, high_contrast, screen_reader")
                .eq("id", user.id)
                .single();

            if (profile) {
                setSelectedTheme(profile.theme || "midnight");
                setAccentColor(profile.accent_color || "violet");
                setDensity(profile.density || "standard");
                setFontSize(profile.font_size || "medium");
                setAnimations(profile.animations ?? true);
                setReducedMotion(profile.reduced_motion ?? false);
                setHighContrast(profile.high_contrast ?? false);
                setScreenReader(profile.screen_reader ?? false);
            }
        } catch (error) {
            console.error("Erreur chargement préférences:", error);
        }
    };

    const applyPreferences = () => {
        const root = document.documentElement;
        const body = document.body;

        // 1. Appliquer le thème
        body.className = body.className.replace(/theme-\w+/g, "").trim();
        body.classList.add(`theme-${selectedTheme}`);

        // 2. Appliquer la couleur d'accentuation
        const accentColors: Record<string, string> = {
            violet: "#8b5cf6", blue: "#3b82f6", cyan: "#06b6d4", emerald: "#10b981",
            amber: "#f59e0b", rose: "#f43f5e", fuchsia: "#d946ef", indigo: "#6366f1",
        };
        root.style.setProperty("--accent-color", accentColors[accentColor] || accentColors.violet);

        // 3. Appliquer la densité
        body.className = body.className.replace(/density-\w+/g, "").trim();
        body.classList.add(`density-${density}`);

        // 4. Appliquer la taille de police
        const fontSizes: Record<string, string> = {
            small: "14px", medium: "16px", large: "18px", xlarge: "20px",
        };
        root.style.setProperty("--base-font-size", fontSizes[fontSize] || "16px");
        body.style.fontSize = fontSizes[fontSize] || "16px";

        // 5. Appliquer les animations
        if (reducedMotion || !animations) {
            root.classList.add("reduce-motion");
        } else {
            root.classList.remove("reduce-motion");
        }

        // 6. Appliquer le contraste élevé
        if (highContrast) {
            root.classList.add("high-contrast");
        } else {
            root.classList.remove("high-contrast");
        }

        // 7. Appliquer l'optimisation lecteur d'écran
        if (screenReader) {
            root.classList.add("screen-reader-optimized");
        } else {
            root.classList.remove("screen-reader-optimized");
        }

        console.log("✅ Préférences appliquées:", {
            theme: selectedTheme,
            accentColor,
            density,
            fontSize,
        });
    };

    // Sauvegarder dans Supabase (debounce 1 seconde)
    useEffect(() => {
        const timer = setTimeout(async () => {
            await savePreferences();
        }, 1000);

        return () => clearTimeout(timer);
    }, [selectedTheme, accentColor, density, fontSize, animations, reducedMotion, highContrast, screenReader]);

    const savePreferences = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from("profiles")
                .update({
                    theme: selectedTheme,
                    accent_color: accentColor,
                    density,
                    font_size: fontSize,
                    animations,
                    reduced_motion: reducedMotion,
                    high_contrast: highContrast,
                    screen_reader: screenReader,
                })
                .eq("id", user.id);

            if (error) throw error;

            setSuccess("✅ Préférences sauvegardées !");
            setTimeout(() => setSuccess(""), 2000);
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
        } finally {
            setSaving(false);
        }
    };

    const getLanguageName = (lang: any) => {
        return lang.translations[language as keyof typeof lang.translations] || lang.native;
    };

    const getTranslatedText = (obj: any) => {
        return obj[language as keyof typeof obj] || obj.fr || obj.en;
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold text-white mb-2 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-violet-500/20 border border-pink-500/30 flex items-center justify-center">
                            <Palette className="w-5 h-5 text-pink-400" />
                        </div>
                        {t("appearance.title")}
                    </h1>
                    <p className="text-white/60">{t("appearance.description")}</p>
                </div>
                <div className="flex items-center gap-2">
                    {saving && (
                        <span className="text-xs text-white/50 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" /> Sauvegarde...
            </span>
                    )}
                    {success && (
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {success}
            </span>
                    )}
                </div>
            </div>

            {/* ===== THÈME ===== */}
            <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <Palette className="w-5 h-5 text-pink-400" />
                    <h2 className="font-semibold text-white text-lg">{t("appearance.theme")}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {THEMES.map((theme) => {
                        const Icon = theme.icon;
                        return (
                            <button
                                key={theme.id}
                                onClick={() => setSelectedTheme(theme.id)}
                                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                                    selectedTheme === theme.id
                                        ? "border-violet-500/50 ring-2 ring-violet-500/30"
                                        : "border-white/10 hover:border-white/20"
                                }`}
                            >
                                <div className={`h-20 rounded-lg bg-gradient-to-br ${theme.preview} mb-3 relative`}>
                                    <div className={`absolute bottom-2 right-2 w-3 h-3 rounded-full ${theme.accent}`} />
                                </div>

                                {selectedTheme === theme.id && (
                                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mb-1">
                                    <Icon className="w-4 h-4 text-white/60" />
                                    <span className="text-sm font-bold text-white">{getTranslatedText(theme.name)}</span>
                                </div>
                                <p className="text-xs text-white/50">{getTranslatedText(theme.desc)}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ===== COULEUR D'ACCENTUATION ===== */}
            <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <Droplets className="w-5 h-5 text-blue-400" />
                    <h2 className="font-semibold text-white text-lg">{t("appearance.accent")}</h2>
                </div>

                <p className="text-sm text-white/60">{t("appearance.accent_desc")}</p>

                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {ACCENT_COLORS.map((color) => (
                        <button
                            key={color.id}
                            onClick={() => setAccentColor(color.id)}
                            className={`group relative p-3 rounded-xl border transition-all ${
                                accentColor === color.id
                                    ? "border-white/30 ring-2 ring-white/20"
                                    : "border-white/10 hover:border-white/20"
                            }`}
                            title={color.label}
                        >
                            <div className={`w-full aspect-square rounded-lg ${color.color} group-hover:scale-110 transition-transform`} />
                            {accentColor === color.id && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                    <Check className="w-3 h-3 text-black" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* ===== LANGUE ===== */}
            <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <h2 className="font-semibold text-white text-lg">{t("appearance.language")}</h2>
                </div>

                <p className="text-sm text-white/60">{t("appearance.language_description")}</p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {LANGUAGES.map((l) => (
                        <button
                            key={l.code}
                            onClick={() => setLanguage(l.code as any)}
                            className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                                language === l.code
                                    ? "bg-violet-500/20 border-violet-500/50 ring-2 ring-violet-500/30"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                        >
                            <div className="text-3xl flex-shrink-0 font-sans">{l.emoji}</div>
                            <div className="flex-1 min-w-0">
                                <div className={`text-sm font-bold flex items-center gap-2 ${language === l.code ? "text-violet-300" : "text-white"}`}>
                                    {getLanguageName(l)}
                                    {language === l.code && <CheckCircle2 className="w-4 h-4" />}
                                </div>
                                <div className="text-xs text-white/40">{l.native}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* ===== DENSITÉ ===== */}
            <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <Layout className="w-5 h-5 text-cyan-400" />
                    <h2 className="font-semibold text-white text-lg">{t("appearance.density")}</h2>
                </div>

                <p className="text-sm text-white/60">{t("appearance.density_desc")}</p>

                <div className="grid grid-cols-3 gap-3">
                    {DENSITIES.map((d) => {
                        const Icon = d.icon;
                        return (
                            <button
                                key={d.id}
                                onClick={() => setDensity(d.id)}
                                className={`p-4 rounded-xl border text-center transition-all ${
                                    density === d.id
                                        ? "bg-cyan-500/20 border-cyan-500/50 ring-2 ring-cyan-500/30"
                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                }`}
                            >
                                <Icon className={`w-6 h-6 mx-auto mb-2 ${density === d.id ? "text-cyan-400" : "text-white/60"}`} />
                                <div className={`text-sm font-bold ${density === d.id ? "text-cyan-300" : "text-white"}`}>
                                    {getTranslatedText(d.label)}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ===== TAILLE DU TEXTE ===== */}
            <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <Type className="w-5 h-5 text-amber-400" />
                    <h2 className="font-semibold text-white text-lg">{t("appearance.font_size")}</h2>
                </div>

                <p className="text-sm text-white/60">{t("appearance.font_size_desc")}</p>

                <div className="flex gap-3">
                    {FONT_SIZES.map((size) => (
                        <button
                            key={size.id}
                            onClick={() => setFontSize(size.id)}
                            className={`flex-1 py-4 rounded-xl border transition-all ${
                                fontSize === size.id
                                    ? "bg-amber-500/20 border-amber-500/50 ring-2 ring-amber-500/30"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                        >
                            <div className={`font-bold ${fontSize === size.id ? "text-amber-300" : "text-white"}`} style={{ fontSize: `${size.value}px` }}>
                                {size.label}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Aperçu */}
                <div className="p-4 rounded-xl bg-noah-panel border border-white/10">
                    <p className="text-white/80" style={{ fontSize: `${FONT_SIZES.find(s => s.id === fontSize)?.value}px` }}>
                        {t("appearance.preview_text")}
                    </p>
                </div>
            </div>

            {/* ===== ANIMATIONS ===== */}
            <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-5 h-5 text-violet-400" />
                    <h2 className="font-semibold text-white text-lg">{t("appearance.animations")}</h2>
                </div>

                {[
                    { label: t("appearance.enable_animations"), desc: t("appearance.enable_animations_desc"), value: animations, set: setAnimations },
                    { label: t("appearance.reduce_motion"), desc: t("appearance.reduce_motion_desc"), value: reducedMotion, set: setReducedMotion },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5">
                        <div className="flex-1">
                            <div className="text-sm font-medium text-white">{item.label}</div>
                            <div className="text-xs text-white/50">{item.desc}</div>
                        </div>
                        <button
                            onClick={() => item.set(!item.value)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                item.value ? "bg-violet-500" : "bg-white/10"
                            }`}
                        >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  item.value ? "translate-x-6" : "translate-x-1"
              }`} />
                        </button>
                    </div>
                ))}
            </div>

            {/* ===== ACCESSIBILITÉ ===== */}
            <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                    <Accessibility className="w-5 h-5 text-emerald-400" />
                    <h2 className="font-semibold text-white text-lg">{t("appearance.accessibility")}</h2>
                </div>

                {[
                    { label: t("appearance.high_contrast"), desc: t("appearance.high_contrast_desc"), value: highContrast, set: setHighContrast },
                    { label: t("appearance.screen_reader"), desc: t("appearance.screen_reader_desc"), value: screenReader, set: setScreenReader },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5">
                        <div className="flex-1">
                            <div className="text-sm font-medium text-white">{item.label}</div>
                            <div className="text-xs text-white/50">{item.desc}</div>
                        </div>
                        <button
                            onClick={() => item.set(!item.value)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                item.value ? "bg-emerald-500" : "bg-white/10"
                            }`}
                        >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  item.value ? "translate-x-6" : "translate-x-1"
              }`} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}