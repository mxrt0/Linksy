import { Link } from "react-router-dom";

export function CTA() {
  return (
    <section className="pb-28">

      <div className="rounded-3xl bg-indigo-500 text-white p-16 text-center">

        <h2 className="text-4xl font-bold">
          Ready to shorten your first link?
        </h2>

        <p className="mt-5 text-indigo-100">
          Join Linksy and start sharing smarter.
        </p>

        <Link
          to="/register"
          className="inline-block mt-10 px-6 py-3 rounded-xl bg-white text-indigo-600 font-medium hover:bg-gray-100 transition"
        >
          Get Started
        </Link>

      </div>

    </section>
  );
}