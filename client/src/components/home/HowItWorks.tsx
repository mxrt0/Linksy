export function HowItWorks() {
  const steps = [
    "Paste your long URL",
    "Customize your link",
    "Share it anywhere",
    "Track every click"
  ];

  return (
    <section className="pb-32">

      <h2 className="text-3xl font-bold text-center mb-14">
        How it works
      </h2>

      <div className="grid md:grid-cols-4 gap-6">

        {steps.map((step, i) => (
          <div
            key={step}
            className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 text-center"
          >
            <div className="text-indigo-500 text-2xl font-bold mb-4">
              {i + 1}
            </div>

            <div>{step}</div>

          </div>
        ))}

      </div>

    </section>
  );
}