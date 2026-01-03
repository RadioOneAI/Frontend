import React, { useMemo, useState } from "react";

export default function Feedback() {
  const categories = useMemo(
    () => ["UI/UX", "Performance", "Bug Report", "Feature Request", "Other"],
    []
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "UI/UX",
    rating: 5,
    message: "",
    allowContact: true,
  });

  const [submitted, setSubmitted] = useState(false);

  // Demo: show submitted feedback in a list (replace with API later)
  const [items, setItems] = useState([]);

  const onChange = (key) => (e) => {
    const value =
      e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [key]: value }));
  };

  const setRating = (val) => setForm((p) => ({ ...p, rating: val }));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.message.trim()) return;

    const payload = {
      ...form,
      id: crypto?.randomUUID?.() || String(Date.now()),
      createdAt: new Date().toLocaleString(),
    };

    setItems((prev) => [payload, ...prev]);
    setSubmitted(true);

    // reset main message only
    setForm((p) => ({ ...p, message: "" }));
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-base-content">Feedback</h1>
          <p className="mt-2 text-base-content/70">
            Tell us what you like, what’s missing, or what needs fixing.
          </p>
        </div>

        {/* Success */}
        {submitted && (
          <div className="alert alert-success shadow">
            <span>Thanks! Your feedback has been submitted.</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-2xl">Send Feedback</h2>
              <p className="text-base-content/70">
                Your feedback helps us improve RadioOneAI.
              </p>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {/* Name + Email */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text font-semibold">Name</span>
                    </div>
                    <input
                      className="input input-bordered"
                      placeholder="Your name (optional)"
                      value={form.name}
                      onChange={onChange("name")}
                    />
                  </label>

                  <label className="form-control">
                    <div className="label">
                      <span className="label-text font-semibold">Email</span>
                    </div>
                    <input
                      className="input input-bordered"
                      placeholder="Email (optional)"
                      type="email"
                      value={form.email}
                      onChange={onChange("email")}
                    />
                  </label>
                </div>

                {/* Category */}
                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-semibold">Category</span>
                  </div>
                  <select
                    className="select select-bordered"
                    value={form.category}
                    onChange={onChange("category")}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Rating */}
                <div className="form-control">
                  <div className="label">
                    <span className="label-text font-semibold">Rating</span>
                    <span className="label-text-alt text-base-content/60">
                      {form.rating}/5
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rating rating-lg">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <input
                          key={n}
                          type="radio"
                          name="rating"
                          className="mask mask-star-2 bg-warning"
                          checked={form.rating === n}
                          onChange={() => setRating(n)}
                        />
                      ))}
                    </div>
                    <span className="badge badge-outline">{form.category}</span>
                  </div>
                </div>

                {/* Message */}
                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-semibold">Message *</span>
                  </div>
                  <textarea
                    className="textarea textarea-bordered min-h-32"
                    placeholder="Write your feedback..."
                    value={form.message}
                    onChange={onChange("message")}
                  />
                  <div className="label">
                    <span className="label-text-alt text-base-content/60">
                      Please don’t include sensitive personal data.
                    </span>
                  </div>
                </label>

                {/* Allow contact */}
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={form.allowContact}
                    onChange={onChange("allowContact")}
                  />
                  <span className="label-text">
                    It’s okay to contact me about this feedback
                  </span>
                </label>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={!form.message.trim()}
                  >
                    Submit
                  </button>
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() =>
                      setForm({
                        name: "",
                        email: "",
                        category: "UI/UX",
                        rating: 5,
                        message: "",
                        allowContact: true,
                      })
                    }
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-6">
            {/* Tips */}
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body">
                <h3 className="card-title">Quick Tips</h3>
                <ul className="list-disc ml-5 text-base-content/70 space-y-2">
                  <li>For bugs, include steps to reproduce.</li>
                  <li>For features, explain what problem it solves.</li>
                  <li>Tell us what you expected vs what happened.</li>
                </ul>
              </div>
            </div>

            {/* Recent feedback (demo) */}
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <h3 className="card-title">Recent Feedback</h3>
                  <span className="badge badge-secondary badge-outline">
                    {items.length}
                  </span>
                </div>

                {items.length === 0 ? (
                  <p className="text-base-content/60">
                    No feedback yet. Be the first!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {items.slice(0, 4).map((f) => (
                      <div
                        key={f.id}
                        className="p-4 rounded-2xl border border-base-300 bg-base-200"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-semibold">
                            {f.category} • {f.rating}/5
                          </div>
                          <div className="text-xs text-base-content/60">
                            {f.createdAt}
                          </div>
                        </div>
                        <p className="mt-2 text-base-content/80 line-clamp-3">
                          {f.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center text-sm text-base-content/60">
          © {new Date().getFullYear()} RadioOneAI • Feedback helps us improve.
        </div>
      </div>
    </div>
  );
}
