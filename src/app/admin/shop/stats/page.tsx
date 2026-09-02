export default function StatsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-display text-2xl font-bold">Statistiques</h2>
                <p className="text-white/60 text-sm">Vue d'ensemble des performances</p>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
                {[
                    { label: "Chiffre d'affaires", value: "0€", color: "from-emerald-500 to-teal-500" },
                    { label: "Transactions", value: "0", color: "from-blue-500 to-cyan-500" },
                    { label: "Abonnés actifs", value: "0", color: "from-violet-500 to-purple-500" },
                    { label: "Codes utilisés", value: "0", color: "from-amber-500 to-orange-500" },
                ].map((stat) => (
                    <div key={stat.label} className="glass rounded-2xl p-6 border border-white/10">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 text-white font-bold text-xl`}></div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-white/60">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}