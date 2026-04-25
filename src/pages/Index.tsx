import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Users, Egg, Trophy, RotateCcw } from "lucide-react";

const Index = () => {
  const [textoBruto, setTextoBruto] = useState("");
  const [participantes, setParticipantes] = useState<string[]>([]);
  const [ganhador, setGanhador] = useState<string | null>(null);
  const [estaSorteando, setEstaSorteando] = useState(false);
  const [finalizado, setFinalizado] = useState(false);
  const winnerRef = useRef<HTMLDivElement>(null);

  const processarEntrada = (valor: string) => {
    setTextoBruto(valor);
    setParticipantes(valor.split("\n").map((n) => n.trim()).filter(Boolean));
  };

  const executarSorteio = () => {
    if (participantes.length === 0) return;
    setEstaSorteando(true);
    setFinalizado(false);
    setGanhador(null);

    const intervalo = setInterval(() => {
      const i = Math.floor(Math.random() * participantes.length);
      setGanhador(participantes[i]);
    }, 90);

    setTimeout(() => {
      clearInterval(intervalo);
      const finalIdx = Math.floor(Math.random() * participantes.length);
      setGanhador(participantes[finalIdx]);
      setEstaSorteando(false);
      setFinalizado(true);

      const fire = (particleRatio: number, opts: confetti.Options) =>
        confetti({
          origin: { y: 0.7 },
          colors: ["#0f6b3a", "#22c55e", "#facc15", "#fbbf24", "#ffffff"],
          ...opts,
          particleCount: Math.floor(220 * particleRatio),
        });
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }, 3200);
  };

  const reiniciar = () => {
    setGanhador(null);
    setFinalizado(false);
  };

  useEffect(() => {
    if (finalizado && winnerRef.current) {
      winnerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [finalizado]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-[8%] text-6xl opacity-20 animate-float-slow">🥚</div>
        <div className="absolute top-40 right-[10%] text-5xl opacity-20 animate-float-slow" style={{ animationDelay: "1s" }}>🐰</div>
        <div className="absolute bottom-32 left-[15%] text-5xl opacity-20 animate-float-slow" style={{ animationDelay: "2s" }}>🌷</div>
        <div className="absolute bottom-20 right-[12%] text-6xl opacity-20 animate-float-slow" style={{ animationDelay: "3s" }}>🐣</div>
      </div>

      <div className="relative max-w-3xl mx-auto px-5 py-12 md:py-20">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary border border-border text-primary text-xs font-semibold uppercase tracking-widest mb-6 shadow-soft">
            <Sparkles className="w-3.5 h-3.5" />
            Edição Páscoa 2026
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.95] mb-4">
            <span className="text-shimmer">Sorteio</span>
            <br />
            <span className="text-foreground">de Páscoa</span>
            <span className="inline-block ml-3 animate-float-slow">🐰</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
            Cole sua lista, gire a roleta e descubra quem vai ganhar a cesta especial.
          </p>
        </header>

        <main className="bg-card rounded-[2rem] border border-border shadow-elegant overflow-hidden backdrop-blur-sm">
          <div className="p-6 md:p-10">
            <div className="flex items-center justify-between mb-5">
              <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <Users className="w-4 h-4" />
                Participantes
              </label>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold tabular-nums">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-glow animate-pulse" />
                {participantes.length}
              </div>
            </div>

            <textarea
              className="w-full h-52 p-5 rounded-2xl bg-secondary/50 border-2 border-border focus:border-primary focus:bg-card focus:outline-none transition-smooth resize-none text-foreground placeholder:text-muted-foreground/60 font-medium leading-relaxed"
              placeholder={"Maria Silva\nJoão Pereira\nAna Costa\n..."}
              value={textoBruto}
              onChange={(e) => processarEntrada(e.target.value)}
              disabled={estaSorteando}
            />

            <button
              onClick={executarSorteio}
              disabled={estaSorteando || participantes.length === 0}
              className={`group relative w-full mt-6 py-5 rounded-2xl font-bold text-lg transition-smooth overflow-hidden ${
                estaSorteando || participantes.length === 0
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-gradient-primary text-primary-foreground shadow-elegant hover:scale-[1.02] hover:shadow-glow active:scale-[0.98]"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {estaSorteando ? (
                  <>
                    <Egg className="w-5 h-5 animate-spin" />
                    Sorteando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
                    Iniciar Sorteio
                  </>
                )}
              </span>
              {!estaSorteando && participantes.length > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
            </button>
          </div>

          {(ganhador || estaSorteando) && (
            <div
              ref={winnerRef}
              className={`relative px-6 py-12 md:py-16 text-center transition-smooth border-t border-border ${
                finalizado ? "bg-gradient-accent animate-glow-pulse" : "bg-secondary/40"
              }`}
            >
              {finalizado && (
                <>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2">
                    <Trophy className="w-10 h-10 text-accent-foreground drop-shadow-lg animate-scale-in" />
                  </div>
                  <div className="absolute top-6 left-6 text-3xl">🎉</div>
                  <div className="absolute top-6 right-6 text-3xl">🎊</div>
                </>
              )}

              <p className={`text-xs font-bold uppercase tracking-[0.3em] mb-4 mt-6 ${finalizado ? "text-accent-foreground/80" : "text-primary/70"}`}>
                {estaSorteando ? "Quem será..." : "🏆 Vencedor(a) 🏆"}
              </p>

              <div
                key={ganhador}
                className={`font-display text-4xl md:text-6xl font-black break-words px-4 ${
                  estaSorteando ? "text-primary/40 blur-[1px]" : "text-accent-foreground animate-scale-in"
                }`}
              >
                {ganhador}
              </div>

              {finalizado && (
                <button
                  onClick={reiniciar}
                  className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-foreground/10 hover:bg-accent-foreground/20 text-accent-foreground text-sm font-semibold transition-smooth backdrop-blur-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Sortear novamente
                </button>
              )}
            </div>
          )}
        </main>

        <footer className="mt-10 text-center">
          <p className="text-muted-foreground/70 text-xs tracking-wide">
            🔒 Interface protegida · Uso interno
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;