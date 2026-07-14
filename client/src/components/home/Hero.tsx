import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="pt-28 pb-24 text-center">

      <div className="inline-flex px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-500 text-sm mb-8">
        Fast • Secure • Simple
      </div>

      <h1 className="text-5xl md:text-6xl font-bold leading-tight">
        Shorten,
        <br />
        protect and track
        <br />
        every link you share.
      </h1>

      <p className="mt-8 max-w-2xl mx-auto text-lg text-gray-500 dark:text-white/50 leading-8">
        Linksy helps you create memorable short links with custom aliases,
        password protection, expiration dates and built-in analytics.
      </p>

      <div className="mt-10 flex justify-center gap-4">

        <Link
          to="/register"
          className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition"
        >
          Get Started
        </Link>

        <Link
          to="/login"
          className="px-6 py-3 rounded-xl border border-gray-300 dark:border-white/10 hover:border-indigo-500 transition"
        >
          Sign In
        </Link>

      </div>

    </section>
  );
}