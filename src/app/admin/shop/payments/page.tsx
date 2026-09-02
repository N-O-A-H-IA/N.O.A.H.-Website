export default function PaymentsMethodsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-display text-2xl font-bold">Moyens de paiement</h2>
                <p className="text-white/60 text-sm">Configurez vos passerelles de paiement</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="glass rounded-xl p-6 border border-blue-500/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">💳</div>
                        <div>
                            <h3 className="font-semibold text-white">PayPal</h3>
                            <span className="text-xs text-emerald-400">● Connecté</span>
                        </div>
                    </div>
                    <p className="text-sm text-white/60 mb-4">Paiements via PayPal Sandbox/Production</p>
                    <button className="text-sm text-violet-400 hover:underline">Configurer →</button>
                </div>
                <div className="glass rounded-xl p-6 border border-white/10 opacity-50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">💳</div>
                        <div>
                            <h3 className="font-semibold text-white">Stripe</h3>
                            <span className="text-xs text-white/40">○ Non configuré</span>
                        </div>
                    </div>
                    <p className="text-sm text-white/60 mb-4">Paiements par carte bancaire</p>
                    <button className="text-sm text-violet-400 hover:underline">Configurer →</button>
                </div>
            </div>
        </div>
    );
}