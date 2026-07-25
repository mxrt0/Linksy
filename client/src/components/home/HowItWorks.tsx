export function HowItWorks() {
  const steps = [
    "Paste your long URL",
    "Customize your link",
    "Share it anywhere",
    "Track every click"
  ];

  return (
    <section className="pb-32">

      <div className="text-center mb-14">
        <p className="text-sm uppercase tracking-[0.35em] text-indigo-500">Workflow</p>
        <h2 className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">How it works</h2>
        <p className="mt-3 mx-auto max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Create and manage secure short links in four simple steps.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">

        {steps.map((step, i) => (
          <div
            key={step}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 dark:border-white/10 dark:bg-[#09090f]"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 text-xl font-bold">
              {i + 1}
            </div>
            <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">{step}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {step === "Paste your long URL" && "Start with a URL and make it short."}
              {step === "Customize your link" && "Choose a unique alias and adjust settings."}
              {step === "Share it anywhere" && "Send it to your contacts, posts, or campaigns."}
              {step === "Track every click" && "See performance with real-time analytics."}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}