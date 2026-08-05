"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { QuizScore } from "@/lib/types";
import { questions, type Question } from "@/data/quizQuestions";

const POINTS = { easy: 1, medium: 2, hard: 3 } as const;
const MAX_SCORE = questions.reduce((a, q) => a + POINTS[q.difficulty], 0);
const SECONDS_PER_QUESTION = 20;

const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const difficultyStyles = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
} as const;

type Stage = "start" | "playing" | "done";

export default function BibleQuiz() {
  const [stage, setStage] = useState<Stage>("start");
  const [deck, setDeck] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);

  const [leaderboard, setLeaderboard] = useState<QuizScore[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadLeaderboard = useCallback(async () => {
    try {
      const res = await fetch("/api/quiz-scores");
      setLeaderboard(res.ok ? await res.json() : []);
    } catch {
      setLeaderboard([]);
    }
  }, []);

  useEffect(() => {
    // Fetch-on-mount: the state update happens in the awaited continuation,
    // not synchronously in the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadLeaderboard();
  }, [loadLeaderboard]);

  // Shuffling happens in a click handler, so the server and the first
  // client render always agree.
  const startQuiz = () => {
    setDeck(shuffle(questions));
    setCurrent(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setPicked(null);
    setTimeLeft(SECONDS_PER_QUESTION);
    setSaved(false);
    setSaveError(null);
    setStage("playing");
  };

  const advance = useCallback(() => {
    setPicked(null);
    setTimeLeft(SECONDS_PER_QUESTION);
    setCurrent((c) => {
      if (c + 1 < deck.length) return c + 1;
      setStage("done");
      return c;
    });
  }, [deck.length]);

  const handleAnswer = useCallback(
    (option: string | null) => {
      if (picked !== null || stage !== "playing") return;

      const q = deck[current];
      const correct = option === q.answer;

      setPicked(option ?? "__timeout__");

      if (correct) {
        setScore((s) => s + POINTS[q.difficulty]);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
      } else {
        setStreak(0);
      }

      setTimeout(advance, 1100);
    },
    [picked, stage, deck, current, advance]
  );

  // Countdown for the current question — state only changes inside the timer.
  useEffect(() => {
    if (stage !== "playing" || picked !== null) return;

    const id = setTimeout(() => {
      if (timeLeft <= 1) handleAnswer(null);
      else setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [timeLeft, stage, picked, handleAnswer]);

  const saveScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setSaving(true);
    setSaveError(null);

    try {
      const res = await fetch("/api/quiz-scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: playerName.trim().slice(0, 40),
          score,
          max_score: MAX_SCORE,
        }),
      });

      if (!res.ok) {
        setSaveError("Couldn't save your score. Please try again.");
      } else {
        setSaved(true);
        await loadLeaderboard();
      }
    } catch {
      setSaveError("Network error — please try again.");
    }
    setSaving(false);
  };

  const optionStyle = (option: string) => {
    if (picked === null)
      return "bg-white border-2 border-slate-200 text-slate-800 hover:border-blue-950 hover:bg-blue-50";
    if (option === deck[current].answer)
      return "bg-green-600 border-2 border-green-600 text-white";
    if (option === picked)
      return "bg-red-500 border-2 border-red-500 text-white";
    return "bg-white border-2 border-slate-200 text-slate-400";
  };

  const q = stage === "start" ? null : deck[current];
  const progress = q ? ((current + (picked !== null ? 1 : 0)) / deck.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-100 pt-[12vh] pb-20">
      <div className="bg-blue-950 text-white py-14">
        <div className="w-[90%] xl:w-[80%] mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Bible Quiz</h1>
          <p className="text-gray-200 max-w-2xl mx-auto">
            Free, fun and educational — see how well you know the Word.
          </p>
        </div>
      </div>

      <div className="w-[90%] max-w-3xl mx-auto -mt-8">
        {/* ---------- Start screen ---------- */}
        {stage === "start" && (
          <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-2xl font-bold text-blue-950 mb-3">
              Ready to test your knowledge?
            </h2>
            <ul className="text-slate-600 text-sm space-y-1.5 mb-8 max-w-sm mx-auto text-left">
              <li>• {questions.length} questions, shuffled every time</li>
              <li>• {SECONDS_PER_QUESTION} seconds per question</li>
              <li>• Easy = 1 point, Medium = 2, Hard = 3</li>
              <li>• {MAX_SCORE} points up for grabs</li>
            </ul>
            <button
              onClick={startQuiz}
              className="bg-blue-950 text-white py-3 px-10 rounded-lg font-semibold hover:bg-blue-900 transition"
            >
              Start Quiz
            </button>
          </div>
        )}

        {/* ---------- Playing ---------- */}
        {stage === "playing" && q && (
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-blue-950 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <span className="text-sm font-semibold text-slate-500">
                Question {current + 1} of {deck.length}
              </span>
              <div className="flex items-center gap-2">
                {streak > 1 && (
                  <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">
                    🔥 {streak} in a row
                  </span>
                )}
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                    difficultyStyles[q.difficulty]
                  }`}
                >
                  {q.difficulty} · {POINTS[q.difficulty]} pt
                  {POINTS[q.difficulty] > 1 ? "s" : ""}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full tabular-nums ${
                    timeLeft <= 5
                      ? "bg-red-100 text-red-700 animate-pulse"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  ⏱ {timeLeft}s
                </span>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-blue-950 mb-6 leading-snug">
              {q.question}
            </h2>

            <div className="grid gap-3">
              {q.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={picked !== null}
                  className={`text-left px-5 py-3.5 rounded-xl font-medium transition-all duration-200 disabled:cursor-default ${optionStyle(
                    option
                  )}`}
                >
                  {option}
                </button>
              ))}
            </div>

            {picked !== null && (
              <p className="mt-5 text-center font-semibold animate-[fadeIn_0.3s_ease-out]">
                {picked === q.answer ? (
                  <span className="text-green-600">✓ Correct!</span>
                ) : picked === "__timeout__" ? (
                  <span className="text-amber-600">
                    ⏱ Time&apos;s up — the answer was {q.answer}
                  </span>
                ) : (
                  <span className="text-red-500">
                    ✗ The answer was {q.answer}
                  </span>
                )}
              </p>
            )}

            <p className="mt-6 text-center text-sm text-slate-400">
              Score so far:{" "}
              <span className="font-bold text-blue-950">{score}</span> /{" "}
              {MAX_SCORE}
            </p>
          </div>
        )}

        {/* ---------- Results ---------- */}
        {stage === "done" && (
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 text-center animate-[fadeInUp_0.4s_ease-out]">
            <div className="text-6xl mb-4">
              {score >= MAX_SCORE * 0.8
                ? "🏆"
                : score >= MAX_SCORE * 0.5
                ? "🎉"
                : "📖"}
            </div>
            <h2 className="text-2xl font-bold text-blue-950 mb-2">
              Quiz Completed!
            </h2>
            <p className="text-4xl font-bold text-blue-950 my-4">
              {score}
              <span className="text-xl text-slate-400"> / {MAX_SCORE}</span>
            </p>
            <p className="text-slate-500 mb-8">
              Best streak: {bestStreak} correct in a row
            </p>

            {!saved ? (
              <form
                onSubmit={saveScore}
                className="max-w-sm mx-auto mb-8 text-left"
              >
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Add your score to the leaderboard
                </label>
                <div className="flex gap-2">
                  <input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    maxLength={40}
                    required
                    placeholder="Your name"
                    className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-950 text-white px-5 rounded-lg font-semibold hover:bg-blue-900 transition disabled:opacity-60"
                  >
                    {saving ? "…" : "Save"}
                  </button>
                </div>
                {saveError && (
                  <p className="text-xs text-red-600 mt-2">{saveError}</p>
                )}
              </form>
            ) : (
              <p className="text-green-600 font-semibold mb-8">
                ✓ Your score is on the leaderboard!
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={startQuiz}
                className="bg-blue-950 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-900 transition"
              >
                Play Again
              </button>
              <Link
                href="/"
                className="py-3 px-8 rounded-lg font-semibold border-2 border-blue-950 text-blue-950 hover:bg-blue-950 hover:text-white transition"
              >
                Back Home
              </Link>
            </div>
          </div>
        )}

        {/* ---------- Leaderboard ---------- */}
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 mt-8">
          <h3 className="font-bold text-blue-950 text-lg mb-5 flex items-center gap-2">
            🏅 Top Scores
          </h3>

          {leaderboard.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">
              No scores yet — be the first!
            </p>
          ) : (
            <ol className="divide-y divide-slate-100">
              {leaderboard.map((row, i) => (
                <li
                  key={row.id}
                  className="py-3 flex items-center gap-4 text-sm"
                >
                  <span
                    className={`w-8 h-8 shrink-0 grid place-items-center rounded-full font-bold ${
                      i === 0
                        ? "bg-yellow-100 text-yellow-700"
                        : i === 1
                        ? "bg-slate-200 text-slate-600"
                        : i === 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 font-medium text-slate-800 truncate">
                    {row.name}
                  </span>
                  <span className="text-slate-400 text-xs">
                    {new Date(row.created_at).toLocaleDateString("default", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="font-bold text-blue-950 tabular-nums">
                    {row.score}/{row.max_score}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
