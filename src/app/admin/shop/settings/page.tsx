export default function ShopSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-display text-2xl font-bold">Paramètres de la boutique</h2>
                <p className="text-white/60 text-sm">Configuration générale</p>
            </div>
            <div className="glass rounded-xl p-6 border border-white/10 space-y-4">
                <div>
                    <label className="text-sm font-medium text-white/80 mb-1 block">Devise par défaut</label>
                    <select className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50">
                        <option>EUR (€)</option>
                        <option>USD ($)</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-white/80 mb-1 block">TVA par défaut (%)</label>
                    <input type="number" defaultValue={20} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50" />
                </div>
                <div>
                    <label className="text-sm font-medium text-white/80 mb-1 block">Email de notification des commandes</label>
                    <input type="email" placeholder="contact@noah.ai" className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50" />
                </div>
                <button className="btn-primary px-6 py-2 rounded-lg text-sm font-medium">Sauvegarder</button>
            </div>
        </div>
    );
}