"use client";

import { useId, useState, type FormEvent } from "react";
import type { SubscriberQuestion } from "@/typings/subscriber-dashboard";

interface QuestionsPanelProps {
  initialQuestions: SubscriberQuestion[];
}

function statusLabel(status: SubscriberQuestion["status"]) {
  switch (status) {
    case "answered":
      return "Answered";
    case "featured":
      return "Featured";
    default:
      return "Pending";
  }
}

export default function QuestionsPanel({
  initialQuestions,
}: QuestionsPanelProps) {
  const formId = useId();
  const [questions, setQuestions] =
    useState<SubscriberQuestion[]>(initialQuestions);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || submitting) {
      return;
    }
    setSubmitting(true);
    const newQ: SubscriberQuestion = {
      id: `local-${Date.now()}`,
      text,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    setQuestions((prev) => [newQ, ...prev]);
    setDraft("");
    setSubmitting(false);
  };

  return (
    <section
      id="questions"
      aria-labelledby="questions-heading"
      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
    >
      <h2
        id="questions-heading"
        className="text-lg font-bold text-zinc-50"
      >
        Your questions
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        Submit a question for upcoming live sessions. You&apos;ll see status
        here when hosts address it.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label htmlFor={formId} className="sr-only">
          Question for the hosts
        </label>
        <textarea
          id={formId}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="What would you like to ask on the next live show?"
          className="w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950/80 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-amber-600/50 focus:outline-none focus:ring-2 focus:ring-amber-500/25"
        />
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-zinc-600" aria-live="polite">
            {draft.length}/500
          </span>
          <button
            type="submit"
            disabled={!draft.trim() || submitting}
            className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:from-amber-600 enabled:hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Submit question
          </button>
        </div>
      </form>

      <ul className="mt-6 max-h-64 space-y-3 overflow-y-auto pr-1" role="list">
        {questions.map((q) => (
          <li key={q.id}>
            <blockquote className="rounded-xl border border-zinc-800/80 bg-zinc-800/40 p-3">
              <p className="text-sm text-zinc-200">&ldquo;{q.text}&rdquo;</p>
              <footer className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <time dateTime={q.submittedAt}>
                  {new Date(q.submittedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <span
                  className={`rounded-full px-2 py-0.5 font-medium ${
                    q.status === "answered"
                      ? "bg-green-900/40 text-green-400"
                      : q.status === "featured"
                        ? "bg-amber-900/40 text-amber-400"
                        : "bg-zinc-700/50 text-zinc-400"
                  }`}
                >
                  {statusLabel(q.status)}
                </span>
                {q.sessionTitle && (
                  <span className="text-zinc-600">{q.sessionTitle}</span>
                )}
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </section>
  );
}
