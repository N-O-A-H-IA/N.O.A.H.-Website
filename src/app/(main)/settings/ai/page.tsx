"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Brain, MessageSquare, Database, Trash2, Save,
    RefreshCw, CheckCircle2, AlertCircle, Sparkles, Globe,
    Download, RotateCcw, Zap, MessageCircle, Clock, TrendingUp,
    Eye, ChevronDown, ChevronUp, Tag, X, Plus, Crown,
    Mic, Type, Code2, BookOpen, Shield, Users, Palette,
    Volume2, FileText, Layers, Target, Lightbulb, Star,
    Filter, Search, Calendar, BarChart3, Settings2, Wand2
} from "lucide-react";
import {BsSuitcase} from "react-icons/bs";
import {FaSuitcase} from "react-icons/fa";

// ====== PERSONNALITÉS ÉTENDUES ======
const PERSONALITY_OPTIONS = [
    { id: "professionnel", label: "Professionnel", emoji: "💼", desc: "Formel et structuré", category: "work" },
    { id: "amical", label: "Amical", emoji: "😊", desc: "Chaleureux et proche", category: "social" },
    { id: "concis", label: "Concis", emoji: "⚡", desc: "Direct, sans détour", category: "productivity" },
    { id: "creatif", label: "Créatif", emoji: "🎨", desc: "Original et imagé", category: "creative" },
    { id: "mentor", label: "Mentor", emoji: "🎓", desc: "Pédagogue et patient", category: "learning" },
    { id: "technique", label: "Technique", emoji: "🔧", desc: "Précis et détaillé", category: "work" },
    { id: "motivant", label: "Motivant", emoji: "🔥", desc: "Énergique et encourageant", category: "social" },
    { id: "philosophique", label: "Philosophe", emoji: "🤔", desc: "Réfléchi et profond", category: "creative" },
    { id: "humoriste", label: "Humoriste", emoji: "😄", desc: "Drôle et décalé", category: "social" },
    { id: "scientifique", label: "Scientifique", emoji: "🔬", desc: "Rigoureux et factuel", category: "work" },
    { id: "poetique", label: "Poétique", emoji: "✨", desc: "Lyrique et évocateur", category: "creative" },
    { id: "coach", label: "Coach", emoji: "🏋️", desc: "Stratégique et orienté action", category: "productivity" },
];

// ====== MODÈLES IA ======
const AI_MODELS = [
    { id: "auto", label: "N.O.A.H. Auto", desc: "Choix intelligent selon le contexte", icon: Zap, premium: false },
    { id: "fast", label: "Rapide", desc: "Réponses instantanées, idéal pour questions simples", icon: Zap, premium: false },
    { id: "balanced", label: "Équilibré", desc: "Meilleur rapport qualité/vitesse", icon: Brain, premium: false },
    { id: "reasoning", label: "Raisonnement", desc: "Analyse profonde pour problèmes complexes", icon: Target, premium: true },
    { id: "creative", label: "Créatif", desc: "Idées originales et brainstorming", icon: Sparkles, premium: true },
    { id: "code", label: "Code Expert", desc: "Optimisé pour la programmation", icon: Code2, premium: true },
    { id: "writing", label: "Rédaction", desc: "Textes longs et contenus élaborés", icon: FileText, premium: true },
];

// ====== FORMATS DE RÉPONSE ======
const RESPONSE_FORMATS = [
    { id: "paragraph", label: "Paragraphes", icon: FileText },
    { id: "bullets", label: "Listes à puces", icon: Layers },
    { id: "numbered", label: "Listes numérotées", icon: BarChart3 },
    { id: "mixed", label: "Mixte (auto)", icon: Wand2 },
];

// ====== LONGUEUR DES RÉPONSES ======
const RESPONSE_LENGTHS = [
    { id: "short", label: "Court", value: 100, desc: "~100 mots" },
    { id: "medium", label: "Moyen", value: 300, desc: "~300 mots" },
    { id: "long", label: "Long", value: 600, desc: "~600 mots" },
    { id: "detailed", label: "Très détaillé", value: 1000, desc: "~1000 mots" },
    { id: "unlimited", label: "Illimité", value: 0, desc: "Sans limite" },
];

// ====== NIVEAUX DE FORMALITÉ ======
const FORMALITY_LEVELS = [
    { id: "casual", label: "Très décontracté", emoji: "" },
    { id: "informal", label: "Décontracté", emoji: "🙂" },
    { id: "neutral", label: "Neutre", emoji: "😐" },
    { id: "formal", label: "Formel", emoji: "👔" },
    { id: "very_formal", label: "Très formel", emoji: "🎩" },
];

// ====== THÈMES DE RÉPONSE ======
const RESPONSE_THEMES = [
    { id: "default", label: "Par défaut", color: "from-violet-500 to-blue-500" },
    { id: "dark", label: "Sombre", color: "from-gray-700 to-gray-900" },
    { id: "light", label: "Clair", color: "from-gray-100 to-white" },
    { id: "ocean", label: "Océan", color: "from-cyan-500 to-blue-600" },
    { id: "forest", label: "Forêt", color: "from-emerald-500 to-green-600" },
    { id: "sunset", label: "Coucher de soleil", color: "from-orange-500 to-red-500" },
];

// ====== CATÉGORIES DE SOUVENIRS ======
const MEMORY_CATEGORIES: Record<string, { label: string; color: string; icon: any }> = {
    projet: { label: "Projet", color: "blue", icon: Code2 },
    preference: { label: "Préférence", color: "violet", icon: Star },
    contexte: { label: "Contexte perso", color: "emerald", icon: Users },
    objectif: { label: "Objectif", color: "amber", icon: Target },
    apprentissage: { label: "Apprentissage", color: "cyan", icon: BookOpen },
    travail: { label: "Travail", color: "rose", icon: FaSuitcase},
};

// Ajout manquant
const Briefcase = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

export default function IntelligencePage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [activeTab, setActiveTab] = useState<"general" | "memory" | "advanced" | "stats">("general");

    // Préférences IA - Général
    const [personality, setPersonality] = useState("amical");
    const [creativity, setCreativity] = useState(50);
    const [humor, setHumor] = useState(30);
    const [detail, setDetail] = useState(70);
    const [formality, setFormality] = useState("neutral");
    const [language, setLanguage] = useState("fr");
    const [selectedModel, setSelectedModel] = useState("auto");
    const [responseFormat, setResponseFormat] = useState("mixed");
    const [responseLength, setResponseLength] = useState("medium");
    const [responseTheme, setResponseTheme] = useState("default");
    const [customContext, setCustomContext] = useState("");
    const [customResponse, setCustomResponse] = useState("");

    // Fonctionnalités avancées
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [voiceSpeed, setVoiceSpeed] = useState(1);
    const [autoSuggestions, setAutoSuggestions] = useState(true);
    const [codeHighlighting, setCodeHighlighting] = useState(true);
    const [emojiUsage, setEmojiUsage] = useState(true);
    const [markdownEnabled, setMarkdownEnabled] = useState(true);

    // Conversation starters
    const [conversationStarters, setConversationStarters] = useState<string[]>([
        "Résume mes tâches du jour",
        "Aide-moi à déboguer ce code",
        "Explique-moi un concept complexe",
    ]);
    const [newStarter, setNewStarter] = useState("");

    // Mémoire
    const [memoryEnabled, setMemoryEnabled] = useState(true);
    const [autoMemory, setAutoMemory] = useState(true);
    const [memories, setMemories] = useState<{ id: string; text: string; category: string; date: string }[]>([]);
    const [memoryFilter, setMemoryFilter] = useState("all");
    const [memorySearch, setMemorySearch] = useState("");

    // Stats
    const [stats] = useState({
        totalConversations: 47,
        totalMessages: 312,
        memoriesCount: 3,
        lastActive: "Aujourd'hui",
        avgResponseTime: "1.2s",
        favoriteTopics: ["Programmation", "Design", "Productivité"],
        weeklyUsage: [12, 19, 8, 15, 22, 18, 14],
    });

    useEffect(() => {
        loadAISettings();
    }, []);

    const loadAISettings = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profile) {
                setPersonality(profile.ai_personality || "amical");
                setCreativity(profile.ai_creativity ?? 50);
                setHumor(profile.ai_humor ?? 30);
                setDetail(profile.ai_detail ?? 70);
                setFormality(profile.ai_formality || "neutral");
                setCustomContext(profile.ai_custom_context || "");
                setCustomResponse(profile.ai_custom_response || "");
                setMemoryEnabled(profile.ai_memory_enabled !== false);
                setAutoMemory(profile.ai_auto_memory ?? true);
                setLanguage(profile.ai_language || "fr");
                setSelectedModel(profile.ai_model || "auto");
                setResponseFormat(profile.ai_response_format || "mixed");
                setResponseLength(profile.ai_response_length || "medium");
                setVoiceEnabled(profile.ai_voice_enabled || false);
                setEmojiUsage(profile.ai_emoji_usage ?? true);
                setMarkdownEnabled(profile.ai_markdown_enabled ?? true);
            }

            // Mock memories
            setMemories([
                { id: "1", text: "L'utilisateur développe une application Flutter nommée N.O.A.H.", category: "projet", date: "12 juil. 2026" },
                { id: "2", text: "L'utilisateur préfère les réponses détaillées et structurées.", category: "preference", date: "8 juil. 2026" },
                { id: "3", text: "L'utilisateur est étudiant en informatique.", category: "contexte", date: "1 juil. 2026" },
                { id: "4", text: "Objectif : lancer N.O.A.H. en bêta publique d'ici septembre.", category: "objectif", date: "28 juin 2026" },
                { id: "5", text: "Apprend le japonais en parallèle du développement.", category: "apprentissage", date: "25 juin 2026" },
            ]);
        } catch (error) {
            console.error("Erreur chargement IA:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        setSuccess("");
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from("profiles")
                .update({
                    ai_personality: personality,
                    ai_creativity: creativity,
                    ai_humor: humor,
                    ai_detail: detail,
                    ai_formality: formality,
                    ai_custom_context: customContext,
                    ai_custom_response: customResponse,
                    ai_memory_enabled: memoryEnabled,
                    ai_auto_memory: autoMemory,
                    ai_language: language,
                    ai_model: selectedModel,
                    ai_response_format: responseFormat,
                    ai_response_length: responseLength,
                    ai_voice_enabled: voiceEnabled,
                    ai_emoji_usage: emojiUsage,
                    ai_markdown_enabled: markdownEnabled,
                })
                .eq("id", user.id);

            if (error) throw error;

            setSuccess("✅ Préférences sauvegardées avec succès !");
            setTimeout(() => setSuccess(""), 3000);
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
        } finally {
            setSaving(false);
        }
    };

    const resetToDefaults = () => {
        setPersonality("amical");
        setCreativity(50);
        setHumor(30);
        setDetail(70);
        setFormality("neutral");
        setLanguage("fr");
        setSelectedModel("auto");
        setResponseFormat("mixed");
        setResponseLength("medium");
        setCustomContext("");
        setCustomResponse("");
        setShowResetConfirm(false);
    };

    const deleteMemory = (id: string) => {
        setMemories((prev) => prev.filter((m) => m.id !== id));
    };

    const addStarter = () => {
        if (!newStarter.trim()) return;
        setConversationStarters((prev) => [...prev, newStarter.trim()]);
        setNewStarter("");
    };

    const removeStarter = (idx: number) => {
        setConversationStarters((prev) => prev.filter((_, i) => i !== idx));
    };

    const exportMemories = () => {
        const blob = new Blob([JSON.stringify(memories, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "noah-memoires.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const filteredMemories = memories.filter((m) => {
        const matchCategory = memoryFilter === "all" || m.category === memoryFilter;
        const matchSearch = m.text.toLowerCase().includes(memorySearch.toLowerCase());
        return matchCategory && matchSearch;
    });

    const getPreviewText = () => {
        const personalityObj = PERSONALITY_OPTIONS.find(p => p.id === personality);
        const formalityObj = FORMALITY_LEVELS.find(f => f.id === formality);

        if (creativity > 70 && humor > 50) return "Ohlà, on part sur un truc audacieux ! 🚀 Voici une idée un peu folle mais qui pourrait vraiment marcher...";
        if (detail > 70) return "Voici une explication complète et structurée, avec le contexte, les étapes détaillées, et quelques nuances importantes à connaître...";
        if (personality === "concis") return "Réponse : oui. Voici pourquoi, en 2 points clés.";
        if (formality === "very_formal") return "Permettez-moi de vous exposer les éléments de réponse à votre interrogation avec la plus grande rigueur.";
        return `${personalityObj?.emoji || '💬'} Bonne question ! Laisse-moi t'expliquer ça simplement, avec un exemple concret pour bien visualiser.`;
    };

    const colorMap: Record<string, string> = {
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 text-violet-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-6">
            {/* ===== Header ===== */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30 flex items-center justify-center">
                            <Brain className="w-6 h-6 text-violet-400" />
                        </div>
                        Intelligence N.O.A.H.
                    </h1>
                    <p className="text-white/60">Personnalisez le comportement, le style et la mémoire de votre assistant.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowResetConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Réinitialiser
                    </button>
                    <button
                        onClick={saveSettings}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-semibold transition-all disabled:opacity-50 shadow-lg shadow-violet-500/20"
                    >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Sauvegarde..." : "Sauvegarder"}
                    </button>
                </div>
            </div>

            {success && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {success}
                </div>
            )}

            {/* ===== Tabs de navigation ===== */}
            <div className="flex gap-2 border-b border-white/10 pb-2 overflow-x-auto">
                {[
                    { id: "general", label: "Général", icon: Settings2 },
                    { id: "memory", label: "Mémoire", icon: Database },
                    { id: "advanced", label: "Avancé", icon: Wand2 },
                    { id: "stats", label: "Statistiques", icon: BarChart3 },
                ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                                activeTab === tab.id
                                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ===== TAB: GÉNÉRAL ===== */}
            {activeTab === "general" && (
                <div className="space-y-6">
                    {/* Personnalité */}
                    <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                            <h2 className="font-semibold text-white text-lg">Personnalité & Ton</h2>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-white/60 mb-3 block uppercase tracking-wider">Ton de voix principal</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {PERSONALITY_OPTIONS.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setPersonality(p.id)}
                                        className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                                            personality === p.id
                                                ? "bg-violet-500/20 border-violet-500/50 ring-2 ring-violet-500/30"
                                                : "bg-white/5 border-white/10 hover:bg-white/10"
                                        }`}
                                    >
                                        <div className="text-3xl flex-shrink-0">{p.emoji}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`text-sm font-bold ${personality === p.id ? "text-violet-300" : "text-white"}`}>
                                                {p.label}
                                            </div>
                                            <div className="text-xs text-white/40">{p.desc}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Niveau de formalité */}
                        <div className="pt-4 border-t border-white/5">
                            <label className="text-xs font-semibold text-white/60 mb-3 block uppercase tracking-wider">Niveau de formalité</label>
                            <div className="flex flex-wrap gap-2">
                                {FORMALITY_LEVELS.map((f) => (
                                    <button
                                        key={f.id}
                                        onClick={() => setFormality(f.id)}
                                        className={`px-4 py-3 rounded-xl border text-sm transition flex items-center gap-3 ${
                                            formality === f.id
                                                ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                                                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                        }`}
                                    >
                                        <span className="text-2xl">{f.emoji}</span>
                                        <span className="font-medium">{f.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sliders */}
                        <div className="space-y-6 pt-4 border-t border-white/5">
                            {[
                                { label: "Créativité", value: creativity, set: setCreativity, desc: "Plus c'est élevé, plus les réponses seront originales et imprévisibles.", icon: Sparkles },
                                { label: "Humour", value: humor, set: setHumor, desc: "Ajoute des touches d'humour et de légèreté dans les réponses.", icon: "😄" },
                                { label: "Niveau de détail", value: detail, set: setDetail, desc: "Détermine la longueur et la profondeur des explications.", icon: Layers },
                            ].map((slider) => (
                                <div key={slider.label}>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-white flex items-center gap-2">
                                            {typeof slider.icon === 'string' ? <span>{slider.icon}</span> : <slider.icon className="w-4 h-4 text-violet-400" />}
                                            {slider.label}
                                        </label>
                                        <span className="text-xs font-mono text-violet-400 bg-violet-500/10 px-2 py-1 rounded">{slider.value}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={slider.value}
                                        onChange={(e) => slider.set(Number(e.target.value))}
                                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                                    />
                                    <p className="text-xs text-white/40 mt-1">{slider.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Aperçu en direct */}
                        <div className="pt-4 border-t border-white/5">
                            <label className="text-xs font-semibold text-white/60 mb-3 flex items-center gap-2 uppercase tracking-wider">
                                <Eye className="w-3.5 h-3.5" /> Aperçu du style de réponse
                            </label>
                            <div className="p-4 rounded-xl bg-noah-panel border border-white/10 flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                                    <Brain className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-sm text-white/80 italic">{getPreviewText()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Modèle IA */}
                    <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <Zap className="w-5 h-5 text-amber-400" />
                            <h2 className="font-semibold text-white text-lg">Modèle IA</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {AI_MODELS.map((model) => {
                                const Icon = model.icon;
                                return (
                                    <button
                                        key={model.id}
                                        onClick={() => setSelectedModel(model.id)}
                                        className={`p-4 rounded-xl border text-left transition-all relative ${
                                            selectedModel === model.id
                                                ? "bg-violet-500/20 border-violet-500/50 ring-2 ring-violet-500/30"
                                                : "bg-white/5 border-white/10 hover:bg-white/10"
                                        } ${model.premium ? "overflow-hidden" : ""}`}
                                    >
                                        {model.premium && (
                                            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[10px] text-amber-400 font-medium">
                                                <Crown className="w-3 h-3" /> PRO
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                selectedModel === model.id ? "bg-violet-500/30" : "bg-white/10"
                                            }`}>
                                                <Icon className="w-6 h-6 text-violet-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className={`text-sm font-bold ${selectedModel === model.id ? "text-violet-300" : "text-white"}`}>
                                                    {model.label}
                                                </div>
                                                <div className="text-xs text-white/50 mt-0.5">{model.desc}</div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Format et longueur */}
                    <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Type className="w-5 h-5 text-blue-400" />
                            <h2 className="font-semibold text-white text-lg">Format des réponses</h2>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-white/60 mb-3 block uppercase tracking-wider">Structure préférée</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {RESPONSE_FORMATS.map((format) => {
                                    const Icon = format.icon;
                                    return (
                                        <button
                                            key={format.id}
                                            onClick={() => setResponseFormat(format.id)}
                                            className={`p-3 rounded-xl border text-center transition-all ${
                                                responseFormat === format.id
                                                    ? "bg-blue-500/20 border-blue-500/50"
                                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                            }`}
                                        >
                                            <Icon className={`w-5 h-5 mx-auto mb-1 ${responseFormat === format.id ? "text-blue-400" : "text-white/60"}`} />
                                            <div className="text-xs font-medium text-white">{format.label}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-white/60 mb-3 block uppercase tracking-wider">Longueur des réponses</label>
                            <div className="flex flex-wrap gap-2">
                                {RESPONSE_LENGTHS.map((length) => (
                                    <button
                                        key={length.id}
                                        onClick={() => setResponseLength(length.id)}
                                        className={`px-4 py-2 rounded-lg border text-sm transition ${
                                            responseLength === length.id
                                                ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                                                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                        }`}
                                    >
                                        <div className="font-medium">{length.label}</div>
                                        <div className="text-[10px] text-white/40">{length.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== TAB: MÉMOIRE ===== */}
            {activeTab === "memory" && (
                <div className="space-y-6">
                    <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Database className="w-5 h-5 text-emerald-400" />
                                <h2 className="font-semibold text-white text-lg">Mémoire N.O.A.H.</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                {memories.length > 0 && (
                                    <button
                                        onClick={exportMemories}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-xs font-medium transition"
                                    >
                                        <Download className="w-3.5 h-3.5" /> Exporter
                                    </button>
                                )}
                                <button
                                    onClick={() => setMemoryEnabled(!memoryEnabled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        memoryEnabled ? "bg-emerald-500" : "bg-white/10"
                                    }`}
                                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      memoryEnabled ? "translate-x-6" : "translate-x-1"
                  }`} />
                                </button>
                            </div>
                        </div>

                        {memoryEnabled ? (
                            <>
                                {/* Auto-memory toggle */}
                                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Lightbulb className="w-5 h-5 text-emerald-400" />
                                        <div>
                                            <div className="text-sm font-medium text-white">Mémorisation automatique</div>
                                            <div className="text-xs text-white/50">N.O.A.H. apprend automatiquement de vos conversations</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setAutoMemory(!autoMemory)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            autoMemory ? "bg-emerald-500" : "bg-white/10"
                                        }`}
                                    >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoMemory ? "translate-x-6" : "translate-x-1"
                    }`} />
                                    </button>
                                </div>

                                {/* Filtres et recherche */}
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            type="text"
                                            value={memorySearch}
                                            onChange={(e) => setMemorySearch(e.target.value)}
                                            placeholder="Rechercher dans les souvenirs..."
                                            className="w-full bg-noah-panel border border-noah-border rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-emerald-500/50"
                                        />
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto">
                                        <button
                                            onClick={() => setMemoryFilter("all")}
                                            className={`px-3 py-2 rounded-lg border text-xs whitespace-nowrap ${
                                                memoryFilter === "all" ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" : "bg-white/5 border-white/10 text-white/60"
                                            }`}
                                        >
                                            Tous ({memories.length})
                                        </button>
                                        {Object.entries(MEMORY_CATEGORIES).map(([key, cat]) => {
                                            const count = memories.filter(m => m.category === key).length;
                                            if (count === 0) return null;
                                            return (
                                                <button
                                                    key={key}
                                                    onClick={() => setMemoryFilter(key)}
                                                    className={`px-3 py-2 rounded-lg border text-xs whitespace-nowrap ${
                                                        memoryFilter === key ? `bg-${cat.color}-500/20 border-${cat.color}-500/50 text-${cat.color}-300` : "bg-white/5 border-white/10 text-white/60"
                                                    }`}
                                                >
                                                    {cat.label} ({count})
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Liste des souvenirs */}
                                {filteredMemories.length === 0 ? (
                                    <div className="text-center py-8 text-white/40 text-sm border border-dashed border-white/10 rounded-xl">
                                        Aucun souvenir trouvé.
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {filteredMemories.map((mem) => {
                                            const cat = MEMORY_CATEGORIES[mem.category];
                                            const CatIcon = cat?.icon || Tag;
                                            return (
                                                <div
                                                    key={mem.id}
                                                    className="flex items-start justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 group hover:border-emerald-500/20 transition"
                                                >
                                                    <div className="flex-1 pr-4">
                                                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 ${colorMap[cat?.color || 'blue']}`}>
                                <CatIcon className="w-2.5 h-2.5" /> {cat?.label || mem.category}
                              </span>
                                                            <span className="text-[11px] text-white/30 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {mem.date}
                              </span>
                                                        </div>
                                                        <p className="text-sm text-white/80">"{mem.text}"</p>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteMemory(mem.id)}
                                                        className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100"
                                                        title="Oublier ce souvenir"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {memories.length > 0 && (
                                    <button
                                        onClick={() => { if (confirm("Supprimer tous les souvenirs ?")) setMemories([]); }}
                                        className="text-xs text-red-400 hover:text-red-300 underline mt-2"
                                    >
                                        Tout effacer
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p>La mémoire est désactivée. N.O.A.H. ne conservera aucune information de vos conversations d'une session à l'autre.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ===== TAB: AVANCÉ ===== */}
            {activeTab === "advanced" && (
                <div className="space-y-6">
                    {/* Instructions personnalisées */}
                    <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <MessageSquare className="w-5 h-5 text-blue-400" />
                            <h2 className="font-semibold text-white text-lg">Instructions personnalisées</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-white mb-2 block">Que souhaitez-vous que N.O.A.H. sache sur vous ?</label>
                                <textarea
                                    value={customContext}
                                    onChange={(e) => setCustomContext(e.target.value)}
                                    placeholder="Ex: Je suis développeur Flutter, je préfère les exemples de code en Dart, j'apprends l'anglais..."
                                    rows={4}
                                    className="w-full bg-noah-panel border border-noah-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-white mb-2 block">Comment souhaitez-vous que N.O.A.H. vous réponde ?</label>
                                <textarea
                                    value={customResponse}
                                    onChange={(e) => setCustomResponse(e.target.value)}
                                    placeholder="Ex: Sois toujours direct, utilise des listes à puces, évite le jargon technique inutile..."
                                    rows={4}
                                    className="w-full bg-noah-panel border border-noah-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fonctionnalités avancées */}
                    <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <Wand2 className="w-5 h-5 text-violet-400" />
                            <h2 className="font-semibold text-white text-lg">Fonctionnalités avancées</h2>
                        </div>

                        <div className="space-y-3">
                            {[
                                { label: "Synthèse vocale", desc: "N.O.A.H. peut lire ses réponses à voix haute", icon: Volume2, value: voiceEnabled, set: setVoiceEnabled },
                                { label: "Suggestions automatiques", desc: "Proposer des réponses contextuelles", icon: Lightbulb, value: autoSuggestions, set: setAutoSuggestions },
                                { label: "Coloration syntaxique", desc: "Mettre en couleur les blocs de code", icon: Code2, value: codeHighlighting, set: setCodeHighlighting },
                                { label: "Utilisation d'emojis", desc: "Ajouter des emojis dans les réponses", icon: "😊", value: emojiUsage, set: setEmojiUsage },
                                { label: "Support Markdown", desc: "Formater les réponses en Markdown", icon: FileText, value: markdownEnabled, set: setMarkdownEnabled },
                            ].map((feature) => (
                                <div key={feature.label} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                            {typeof feature.icon === 'string' ? <span className="text-lg">{feature.icon}</span> : <feature.icon className="w-5 h-5 text-violet-400" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-white">{feature.label}</div>
                                            <div className="text-xs text-white/50">{feature.desc}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => feature.set(!feature.value)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            feature.value ? "bg-violet-500" : "bg-white/10"
                                        }`}
                                    >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        feature.value ? "translate-x-6" : "translate-x-1"
                    }`} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Vitesse de voix */}
                        {voiceEnabled && (
                            <div className="pt-4 border-t border-white/5">
                                <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                                    <Volume2 className="w-4 h-4 text-violet-400" /> Vitesse de lecture
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="2"
                                        step="0.1"
                                        value={voiceSpeed}
                                        onChange={(e) => setVoiceSpeed(Number(e.target.value))}
                                        className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                                    />
                                    <span className="text-xs font-mono text-violet-400 bg-violet-500/10 px-2 py-1 rounded w-12 text-center">{voiceSpeed}x</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Conversation starters */}
                    <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <MessageCircle className="w-5 h-5 text-cyan-400" />
                            <h2 className="font-semibold text-white text-lg">Suggestions de conversation</h2>
                        </div>

                        <p className="text-xs text-white/40">
                            Ces suggestions apparaîtront comme raccourcis au démarrage d'une nouvelle conversation.
                        </p>

                        {conversationStarters.map((s, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                                <span className="text-sm text-white/80 flex-1">{s}</span>
                                <button onClick={() => removeStarter(idx)} className="text-white/30 hover:text-red-400 transition">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        <div className="flex gap-2">
                            <input
                                value={newStarter}
                                onChange={(e) => setNewStarter(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addStarter()}
                                placeholder="Ajouter une suggestion..."
                                className="flex-1 bg-noah-panel border border-noah-border rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-cyan-500/50 transition"
                            />
                            <button
                                onClick={addStarter}
                                className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/30 transition flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Ajouter
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== TAB: STATISTIQUES ===== */}
            {activeTab === "stats" && (
                <div className="space-y-6">
                    {/* Stats rapides */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { icon: MessageCircle, label: "Conversations", value: stats.totalConversations, color: "blue" },
                            { icon: Zap, label: "Messages échangés", value: stats.totalMessages, color: "violet" },
                            { icon: Database, label: "Souvenirs actifs", value: stats.memoriesCount, color: "emerald" },
                            { icon: Clock, label: "Dernière activité", value: stats.lastActive, color: "amber" },
                        ].map((s, i) => {
                            const Icon = s.icon;
                            const colors: Record<string, string> = {
                                blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                                violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
                                emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                                amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                            };
                            return (
                                <div key={i} className="glass rounded-xl p-4 border border-white/10">
                                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-2 ${colors[s.color]}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-2xl font-bold text-white">{s.value}</div>
                                    <div className="text-xs text-white/50">{s.label}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Utilisation hebdomadaire */}
                    <div className="glass rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            <h2 className="font-semibold text-white text-lg">Activité cette semaine</h2>
                        </div>
                        <div className="flex items-end justify-between h-32 gap-2">
                            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, i) => {
                                const height = (stats.weeklyUsage[i] / 25) * 100;
                                return (
                                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full bg-white/5 rounded-t-lg relative" style={{ height: '100px' }}>
                                            <div
                                                className="absolute bottom-0 w-full bg-gradient-to-t from-violet-500 to-blue-500 rounded-t-lg transition-all"
                                                style={{ height: `${height}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-white/50">{day}</span>
                                        <span className="text-xs font-mono text-violet-400">{stats.weeklyUsage[i]}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sujets favoris */}
                    <div className="glass rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <Star className="w-5 h-5 text-amber-400" />
                            <h2 className="font-semibold text-white text-lg">Sujets favoris</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {stats.favoriteTopics.map((topic) => (
                                <span key={topic} className="px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm">
                  {topic}
                </span>
                            ))}
                        </div>
                    </div>

                    {/* Temps de réponse moyen */}
                    <div className="glass rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <Zap className="w-5 h-5 text-cyan-400" />
                            <h2 className="font-semibold text-white text-lg">Performance</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                <div className="text-xs text-white/50 mb-1">Temps de réponse moyen</div>
                                <div className="text-2xl font-bold text-cyan-400">{stats.avgResponseTime}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                <div className="text-xs text-white/50 mb-1">Taux de satisfaction</div>
                                <div className="text-2xl font-bold text-emerald-400">94%</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== Modal reset ===== */}
            {showResetConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="glass rounded-2xl p-6 max-w-sm w-full border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-amber-400" />
                            </div>
                            <h3 className="font-semibold text-white">Réinitialiser les réglages ?</h3>
                        </div>
                        <p className="text-sm text-white/60 mb-6">
                            Ceci remettra la personnalité, les curseurs et la langue aux valeurs par défaut. Tes souvenirs ne seront pas affectés.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 text-sm font-medium transition"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={resetToDefaults}
                                className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 text-sm font-medium transition"
                            >
                                Réinitialiser
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}