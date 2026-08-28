"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";
import {
    Upload, Mail, FileText, CheckCircle2, AlertCircle, Loader2,
    GraduationCap, Shield, Clock, X, Search, Building2, Globe,
    Calendar, Trash2, RefreshCw, Lock, Info
} from "lucide-react";

type VerificationStatus = "idle" | "processing" | "verified" | "pending" | "rejected";

export default function StudentVerificationPage() {
    const router = useRouter();
    const supabase = createClient();

    const [step, setStep] = useState(1);
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("idle");
    const [studentEmail, setStudentEmail] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [institution, setInstitution] = useState("");
    const [country, setCountry] = useState("France");
    const [institutionType, setInstitutionType] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [expectedEndDate, setExpectedEndDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});
    const [rejectionReason, setRejectionReason] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Vérifier la connexion au chargement
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login?redirect=/student-verification");
            }
        };
        checkUser();
    }, [router, supabase]);

    const processFiles = (files: File[]) => {
        const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
        const maxSize = 10 * 1024 * 1024; // 10MB

        const invalidFiles = files.filter(file =>
            !validTypes.includes(file.type) || file.size > maxSize
        );

        if (invalidFiles.length > 0) {
            setErrors(prev => ({
                ...prev,
                files: "Fichiers invalides. Acceptés : PDF, JPG, PNG (max 10MB)"
            }));
            return;
        }

        setUploadedFiles(prev => [...prev, ...files]);
        setErrors(prev => ({ ...prev, files: undefined }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(Array.from(e.target.files));
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        processFiles(Array.from(e.dataTransfer.files));
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!studentEmail && uploadedFiles.length === 0) {
            newErrors.email = "Veuillez fournir au moins un email étudiant OU un justificatif";
            newErrors.files = "Veuillez fournir au moins un email étudiant OU un justificatif";
        }

        if (studentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
            newErrors.email = "Veuillez entrer une adresse email valide";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        setVerificationStatus("processing");

        try {
            // 1. Récupérer l'utilisateur connecté
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                throw new Error("Session expirée. Veuillez vous reconnecter.");
            }

            // 2. Upload du fichier vers Supabase Storage (si présent)
            let documentUrl: string | null = null;
            let documentType = "email";

            if (uploadedFiles.length > 0) {
                documentType = "certificate";
                const file = uploadedFiles[0];
                const fileExt = file.name.split('.').pop();
                // Nommer le fichier avec l'ID utilisateur pour l'organisation et la sécurité
                const fileName = `${user.id}/${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('student-documents')
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    console.error("Erreur upload:", uploadError);
                    throw new Error("Échec de l'upload du document. Veuillez réessayer.");
                }

                // Récupérer l'URL publique (ou signée si ton bucket est privé)
                const { data: urlData } = supabase.storage
                    .from('student-documents')
                    .getPublicUrl(fileName);

                documentUrl = urlData.publicUrl;
            }

            // 3. Insérer la demande dans la base de données
            const { error: dbError } = await supabase
                .from('student_verifications')
                .insert({
                    user_id: user.id,
                    email: studentEmail || null,
                    document_url: documentUrl,
                    document_type: documentType,
                    institution_name: institution,
                    country: country,
                    institution_type: institutionType,
                    status: 'pending', // Par défaut en attente de validation admin
                });

            if (dbError) {
                console.error("Erreur DB:", dbError);
                throw new Error("Une erreur est survenue lors de l'enregistrement de votre demande.");
            }

            // 4. Succès ! Redirection vers l'état "pending" (ou "verified" si tu fais de l'auto-validation)
            setVerificationStatus("pending");

        } catch (error: any) {
            console.error("Erreur globale:", error);
            setVerificationStatus("rejected");
            setRejectionReason(error.message || "Une erreur inattendue est survenue.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetVerification = () => {
        setVerificationStatus("idle");
        setStep(1);
        setUploadedFiles([]);
        setStudentEmail("");
        setErrors({});
    };

    // --- RENDU DES ÉTATS (Processing, Verified, Pending, Rejected) ---
    // (Je garde exactement ton excellent code de rendu, inchangé)

    if (verificationStatus === "processing") {
        return (
            <main className="min-h-screen bg-noah-black">
                <Navbar />
                <section className="pt-32 pb-20 px-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="glass rounded-2xl p-10 text-center border border-violet-500/20">
                            <div className="w-20 h-20 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mx-auto mb-6">
                                <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
                            </div>
                            <h1 className="font-display text-3xl font-bold text-white mb-6">Vérification en cours...</h1>
                            <div className="space-y-4 text-left max-w-md mx-auto">
                                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /><span className="text-white/80">Document reçu</span></div>
                                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /><span className="text-white/80">Format vérifié</span></div>
                                <div className="flex items-center gap-3"><Loader2 className="w-5 h-5 text-violet-400 animate-spin" /><span className="text-white/80">Enregistrement sécurisé...</span></div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    if (verificationStatus === "pending") {
        return (
            <main className="min-h-screen bg-noah-black">
                <Navbar />
                <section className="pt-32 pb-20 px-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="glass rounded-2xl p-10 text-center border border-amber-500/20 bg-amber-500/[0.03]">
                            <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
                                <Clock className="w-10 h-10 text-amber-400" />
                            </div>
                            <h1 className="font-display text-3xl font-bold text-white mb-4">Demande envoyée avec succès !</h1>
                            <p className="text-white/70 text-lg mb-8 leading-relaxed">
                                Nous devons effectuer une <span className="font-bold text-amber-400">vérification manuelle</span> de votre justificatif.
                                <br />Vous recevrez une notification lorsque la vérification sera terminée.
                            </p>
                            <div className="glass rounded-xl p-6 border border-white/10 mb-8 text-left">
                                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-amber-400" />Délai estimé
                                </h3>
                                <p className="text-sm text-white/70 leading-relaxed">
                                    La vérification manuelle prend généralement <span className="font-bold text-white">24h ouvrées maximum</span>.
                                </p>
                            </div>
                            <a href="/dashboard" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-white font-semibold hover:bg-white/5 transition">
                                Retour au tableau de bord
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    if (verificationStatus === "rejected") {
        return (
            <main className="min-h-screen bg-noah-black">
                <Navbar />
                <section className="pt-32 pb-20 px-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="glass rounded-2xl p-10 text-center border border-red-500/20 bg-red-500/[0.03]">
                            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-red-400" />
                            </div>
                            <h1 className="font-display text-3xl font-bold text-white mb-4">Vérification non aboutie</h1>
                            <p className="text-white/70 text-lg mb-6 leading-relaxed">{rejectionReason || "Nous n'avons pas pu confirmer votre statut étudiant."}</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button onClick={resetVerification} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-semibold transition-all hover:scale-105">
                                    <RefreshCw className="w-4 h-4" />Réessayer
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    // --- RENDU DU FORMULAIRE MULTI-ÉTAPES ---
    return (
        <main className="min-h-screen bg-noah-black">
            <Navbar />
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header avec progression */}
                    <div className="text-center mb-10">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                </div>
                                <span className="text-sm text-white/60">Compte</span>
                            </div>
                            <div className="w-8 h-px bg-white/20" />
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                                    <span className="text-sm font-bold text-violet-400">2</span>
                                </div>
                                <span className="text-sm text-white font-medium">Vérification</span>
                            </div>
                            <div className="w-8 h-px bg-white/20" />
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                    <span className="text-sm text-white/40">3</span>
                                </div>
                                <span className="text-sm text-white/40">Résultat</span>
                            </div>
                        </div>
                        <h1 className="font-display text-4xl font-bold text-white mb-4">Vérifiez votre statut étudiant</h1>
                        <p className="text-white/70 text-lg max-w-2xl mx-auto mb-4">
                            Confirmez votre statut étudiant pour accéder aux offres et avantages <span className="font-bold text-white">N.O.A.H. Student</span>.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Étape 1 : Informations personnelles */}
                        {step === 1 && (
                            <div className="glass rounded-2xl p-8 border border-white/10 space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                        <GraduationCap className="w-5 h-5 text-violet-400" />
                                    </div>
                                    <div>
                                        <h2 className="font-display text-xl font-bold text-white">Informations étudiant</h2>
                                        <p className="text-sm text-white/60">Renseignez vos informations personnelles</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-xs font-semibold text-white/70 mb-2 block uppercase tracking-wider">Prénom</label>
                                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Jean" className="w-full bg-noah-panel border border-noah-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-white/70 mb-2 block uppercase tracking-wider">Nom</label>
                                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Dupont" className="w-full bg-noah-panel border border-noah-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-white/70 mb-2 block uppercase tracking-wider">Année de fin de formation prévue</label>
                                    <input type="text" value={expectedEndDate} onChange={(e) => setExpectedEndDate(e.target.value)} placeholder="2026" className="w-full bg-noah-panel border border-noah-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition" />
                                </div>
                                <button type="button" onClick={() => setStep(2)} className="w-full btn-primary py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-violet-500/20">
                                    Continuer
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </button>
                            </div>
                        )}

                        {/* Étape 2 : Établissement */}
                        {step === 2 && (
                            <div className="glass rounded-2xl p-8 border border-white/10 space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="font-display text-xl font-bold text-white">Établissement</h2>
                                        <p className="text-sm text-white/60">Informations sur votre école ou université</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-white/70 mb-2 block uppercase tracking-wider">Nom de l'établissement</label>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} required placeholder="Rechercher votre établissement..." className="w-full bg-noah-panel border border-noah-border rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-xs font-semibold text-white/70 mb-2 block uppercase tracking-wider">Pays</label>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-noah-panel border border-noah-border rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition appearance-none cursor-pointer">
                                                <option value="France">🇫🇷 France</option>
                                                <option value="Belgique">🇧🇪 Belgique</option>
                                                <option value="Suisse">🇨🇭 Suisse</option>
                                                <option value="Canada">🇨🇦 Canada</option>
                                                <option value="Autre">🌍 Autre</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-white/70 mb-2 block uppercase tracking-wider">Type d'établissement</label>
                                        <select value={institutionType} onChange={(e) => setInstitutionType(e.target.value)} required className="w-full bg-noah-panel border border-noah-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition appearance-none cursor-pointer">
                                            <option value="">Sélectionnez...</option>
                                            <option value="universite">Université</option>
                                            <option value="ecole">École</option>
                                            <option value="bts">BTS</option>
                                            <option value="but">BUT / IUT</option>
                                            <option value="licence">Licence</option>
                                            <option value="master">Master</option>
                                            <option value="doctorat">Doctorat</option>
                                            <option value="specialisee">École spécialisée</option>
                                            <option value="autre">Autre</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-xl font-semibold text-white glass border border-white/10 hover:bg-white/5 transition">Retour</button>
                                    <button type="button" onClick={() => setStep(3)} className="flex-1 btn-primary py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-violet-500/20">
                                        Continuer
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Étape 3 : Méthode de vérification */}
                        {step === 3 && (
                            <div className="glass rounded-2xl p-8 border border-white/10 space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h2 className="font-display text-xl font-bold text-white">Méthode de vérification</h2>
                                        <p className="text-sm text-white/60">Choisissez comment prouver votre statut étudiant</p>
                                    </div>
                                </div>

                                {/* Méthode 1 : Email étudiant */}
                                <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">Méthode recommandée : Email étudiant</h3>
                                            <p className="text-sm text-white/60">Utilisez votre adresse email fournie par votre établissement</p>
                                        </div>
                                    </div>
                                    <input
                                        type="email"
                                        value={studentEmail}
                                        onChange={(e) => setStudentEmail(e.target.value)}
                                        placeholder="prenom.nom@universite.fr"
                                        className={`w-full bg-noah-panel border ${errors.email ? 'border-red-500/50' : 'border-noah-border'} rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition`}
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" />{errors.email}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs text-white/50">💡 Si votre email est reconnu, la validation sera <span className="text-emerald-400 font-medium">automatique et instantanée</span></p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-px bg-white/10" />
                                    <span className="text-sm text-white/50">OU</span>
                                    <div className="flex-1 h-px bg-white/10" />
                                </div>

                                {/* Méthode 2 : Upload de justificatif */}
                                <div className="p-6 rounded-xl bg-gradient-to-br from-violet-500/5 to-transparent border border-violet-500/20">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-4 h-4 text-violet-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">Importer un justificatif</h3>
                                            <p className="text-sm text-white/60">Fournissez un document officiel confirmant votre inscription</p>
                                        </div>
                                    </div>

                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        className="border-2 border-dashed border-white/20 rounded-xl p-6 hover:border-violet-500/30 transition-colors"
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                                <Upload className="w-5 h-5 text-violet-400" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-white mb-1">Déposez votre justificatif ici</p>
                                                <p className="text-xs text-white/50 mb-3">ou cliquez pour choisir un fichier</p>
                                                <p className="text-xs text-white/40">PDF, JPG, PNG • Max 10 Mo</p>
                                            </div>
                                        </label>
                                    </div>

                                    {uploadedFiles.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {uploadedFiles.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/10">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-4 h-4 text-violet-400" />
                                                        <div>
                                                            <span className="text-sm text-white block truncate max-w-[200px]">{file.name}</span>
                                                            <span className="text-xs text-white/50">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                        </div>
                                                    </div>
                                                    <button type="button" onClick={() => removeFile(index)} className="p-1 hover:bg-white/10 rounded transition">
                                                        <Trash2 className="w-4 h-4 text-white/60" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {errors.files && (
                                        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" />{errors.files}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setStep(2)} className="flex-1 py-3.5 rounded-xl font-semibold text-white glass border border-white/10 hover:bg-white/5 transition">Retour</button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 btn-primary py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-violet-500/20"
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...</>
                                        ) : (
                                            <><CheckCircle2 className="w-4 h-4" /> Envoyer ma demande</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    {/* Informations complémentaires */}
                    <div className="mt-8 grid md:grid-cols-2 gap-4">
                        <div className="glass rounded-xl p-5 border border-white/10">
                            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />Documents acceptés
                            </h3>
                            <ul className="space-y-2 text-sm text-white/70">
                                <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span><span>Certificat de scolarité</span></li>
                                <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span><span>Attestation d'inscription</span></li>
                                <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span><span>Carte étudiante (avec date de validité)</span></li>
                            </ul>
                        </div>
                        <div className="glass rounded-xl p-5 border border-white/10">
                            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                <X className="w-4 h-4 text-red-400" />Documents non acceptés
                            </h3>
                            <ul className="space-y-2 text-sm text-white/70">
                                <li className="flex items-start gap-2"><span className="text-red-400">✗</span><span>Passeport / CNI</span></li>
                                <li className="flex items-start gap-2"><span className="text-red-400">✗</span><span>Permis de conduire</span></li>
                                <li className="flex items-start gap-2"><span className="text-red-400">✗</span><span>Documents falsifiés</span></li>
                            </ul>
                        </div>
                    </div>

                    {/* Confidentialité */}
                    <div className="mt-6 glass rounded-xl p-6 border border-violet-500/20 bg-violet-500/[0.03]">
                        <div className="flex items-start gap-3">
                            <Lock className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-white mb-2">Vos données restent protégées</h3>
                                <p className="text-sm text-white/70 leading-relaxed mb-3">
                                    N.O.A.H. utilise uniquement les informations nécessaires à la vérification de votre statut étudiant.
                                </p>
                                <ul className="space-y-1.5 text-xs text-white/60">
                                    <li>• Vos documents sont traités de manière sécurisée</li>
                                    <li>• Les données ne sont pas utilisées pour entraîner les modèles IA</li>
                                    <li>• <a href="/legal/privacy" className="text-violet-400 hover:underline">Consulter notre politique de confidentialité</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}