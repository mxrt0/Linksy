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

      <h2 className="text-3xl font-bold text-center mb-16">
        Everything you need
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {features.map((feature) => {

          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6"
            >
              <Icon className="text-indigo-500 mb-5" size={26} />

              <h3 className="font-semibold mb-2">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-500 dark:text-white/50">
                {feature.text}
              </p>

            </div>
          );
        })}

      </div>

    </section>
  );
}