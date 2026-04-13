import { useState } from "react";
import { Mountain, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [matricule, setMatricule] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!matricule || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(matricule, password);
    setLoading(false);
    if (ok) {
      navigate("/");
    } else {
      setError("Matricule ou mot de passe incorrect.");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-linear-to-br from-slate-900 via-primary-950/40 to-slate-900 border-r border-slate-800 p-12">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-xl">
            <img src="/logo.png" alt="Logo" className="w-32" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-100 leading-none">
              SMART MINE RDC
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Plateforme nationale de suivi minier
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-slate-100 leading-tight">
              Traçabilité minière
              <br />
              <span className="text-primary-400">en temps réel</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Surveillance nationale des transports de minerais stratégiques.
              Sécurité, conformité et transparence pour la République
              Démocratique du Congo.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "212", label: "Transports actifs" },
              { value: "18", label: "Provinces couvertes" },
              { value: "71t", label: "Tonnes tracées/mois" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 text-center"
              >
                <p className="text-xl font-bold text-primary-400 tabular-nums">
                  {value}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              "Cobalt",
              "Coltan",
              "Cuivre",
              "Or",
              "Cassitérite",
              "Wolframite",
            ].map((m) => (
              <span
                key={m}
                className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-400"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-600">
          © 2024 Ministère des Mines — République Démocratique du Congo
        </p>
      </div>

      {/* Right — login form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600">
              <Mountain className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-100">SMART MINE RDC</p>
              <p className="text-[10px] text-slate-500">Plateforme nationale</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-100">Connexion</h2>
            <p className="text-sm text-slate-400 mt-1">
              Accès réservé au personnel habilité
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="matricule"
                className="text-xs font-medium text-slate-300 uppercase tracking-wider"
              >
                Matricule
              </label>
              <input
                id="matricule"
                type="text"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                placeholder="ex: ADM-2024-001"
                autoComplete="username"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/20 transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-slate-300 uppercase tracking-wider"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2.5 pr-10 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-danger-600/30 bg-danger-600/10 px-3 py-2.5">
                <AlertCircle className="h-4 w-4 text-danger-400 shrink-0" />
                <p className="text-xs text-danger-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {loading ? "Connexion en cours…" : "Se connecter"}
            </button>
          </form>

          <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Accès démo
            </p>
            <button
              type="button"
              onClick={async () => {
                setMatricule("ADM-2024-001");
                setPassword("SmartMine@2024");
                setError("");
                setLoading(true);
                await new Promise((r) => setTimeout(r, 400));
                const ok = login("ADM-2024-001", "SmartMine@2024");
                setLoading(false);
                if (ok) navigate("/");
              }}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary-600/40 bg-primary-600/10 px-3 py-2 text-xs font-semibold text-primary-400 transition-all hover:bg-primary-600/20 hover:border-primary-500/60 disabled:opacity-50 cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5" />
              Connexion auto (admin)
            </button>
            <div className="space-y-1.5 text-xs text-slate-500">
              <div className="flex justify-between">
                <span className="font-mono text-slate-400">ADM-2024-001</span>
                <span className="font-mono text-slate-400">SmartMine@2024</span>
                <span className="text-primary-400 font-medium">Admin</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-slate-400">AGT-2024-042</span>
                <span className="font-mono text-slate-400">Agent@1234</span>
                <span className="text-success-400 font-medium">Agent</span>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-600">
            Problème de connexion ? Contactez votre administrateur système.
          </p>
        </div>
      </div>
    </div>
  );
}
