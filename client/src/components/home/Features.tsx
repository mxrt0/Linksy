import { Link2, Lock, BarChart3, Clock3 } from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Custom aliases",
    text: "Create memorable branded links."
  },
  {
    icon: Lock,
    title: "Password protection",
    text: "Keep sensitive links private."
  },
  {
    icon: BarChart3,
    title: "Analytics",
    text: "Track clicks, browsers and devices."
  },
  {
    icon: Clock3,
    title: "Expiration",
    text: "Automatically disable temporary links."
  }
];

export function Features() {
  return (
    <section id="features" className="pb-32">

      <div className="text-center mb-14">
        <p className="text-sm uppercase tracking-[0.35em] text-indigo-500">Features</p>
        <h2 className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">Everything you need</h2>
        <p className="mt-3 mx-auto max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Powerful link management, security, and analytics tools designed for modern teams.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="group rounded-[1.75rem] border border-slate-200 bg-white p-8 transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-white/10 dark:bg-[#09090f]"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-600 transition group-hover:bg-indigo-500 group-hover:text-white">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{feature.text}</p>
            </div>
          );
        })}

      </div>

    </section>
  );
}