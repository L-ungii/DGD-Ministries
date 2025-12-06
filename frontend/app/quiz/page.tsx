"use client";

import React, { useState } from "react";

type Question = {
  question: string;
  options: string[];
  answer: string;
  difficulty: "easy" | "medium" | "hard";
};

// 15 questions with mixed difficulties
const questions: Question[] = [
  {
    question: "Who built the ark?",
    options: ["Moses", "Noah", "Abraham", "David"],
    answer: "Noah",
    difficulty: "easy",
  },
  {
    question: "Where was Jesus born?",
    options: ["Nazareth", "Jerusalem", "Bethlehem", "Capernaum"],
    answer: "Bethlehem",
    difficulty: "easy",
  },
  {
    question: "How many days did it rain during the flood?",
    options: ["30", "40", "50", "60"],
    answer: "40",
    difficulty: "easy",
  },
  {
    question: "Who was thrown into the lion's den?",
    options: ["Daniel", "Joseph", "Samson", "Elijah"],
    answer: "Daniel",
    difficulty: "medium",
  },
  {
    question: "What is the first book of the Bible?",
    options: ["Exodus", "Genesis", "Leviticus", "Numbers"],
    answer: "Genesis",
    difficulty: "easy",
  },
  {
    question: "Who interpreted Pharaoh's dream?",
    options: ["Daniel", "Joseph", "Moses", "Aaron"],
    answer: "Joseph",
    difficulty: "medium",
  },
  {
    question: "What river did Moses part?",
    options: ["Jordan", "Nile", "Red Sea", "Euphrates"],
    answer: "Red Sea",
    difficulty: "easy",
  },
  {
    question: "Who denied Jesus three times?",
    options: ["Peter", "John", "Judas", "Thomas"],
    answer: "Peter",
    difficulty: "medium",
  },
  {
    question: "Who was the mother of Samuel?",
    options: ["Hannah", "Elizabeth", "Mary", "Rachel"],
    answer: "Hannah",
    difficulty: "medium",
  },
  {
    question: "Which prophet was taken to heaven in a chariot of fire?",
    options: ["Elijah", "Elisha", "Isaiah", "Ezekiel"],
    answer: "Elijah",
    difficulty: "hard",
  },
  {
    question: "Which city’s walls fell after the Israelites marched around it?",
    options: ["Jericho", "Bethlehem", "Nazareth", "Hebron"],
    answer: "Jericho",
    difficulty: "medium",
  },
  {
    question: "Who wrestled with an angel?",
    options: ["Jacob", "Isaac", "Esau", "Moses"],
    answer: "Jacob",
    difficulty: "hard",
  },
  {
    question: "How many books are in the Bible?",
    options: ["60", "66", "70", "72"],
    answer: "66",
    difficulty: "easy",
  },
  {
    question: "Which disciple walked on water with Jesus?",
    options: ["Peter", "John", "James", "Andrew"],
    answer: "Peter",
    difficulty: "medium",
  },
  {
    question: "Who was the youngest king of Israel?",
    options: ["Josiah", "David", "Solomon", "Hezekiah"],
    answer: "Josiah",
    difficulty: "hard",
  },
];

// Shuffle questions for each playthrough
const shuffleArray = (array: Question[]) => {
  return array.sort(() => Math.random() - 0.5);
};

const BibleQuiz = () => {
  const [shuffledQuestions] = useState(shuffleArray(questions));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswer = (option: string) => {
    if (option === shuffledQuestions[current].answer) {
      // score points based on difficulty
      const points =
        shuffledQuestions[current].difficulty === "easy"
          ? 1
          : shuffledQuestions[current].difficulty === "medium"
          ? 2
          : 3;
      setScore(score + points);
    }

    const next = current + 1;
    if (next < shuffledQuestions.length) {
      setCurrent(next);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrent(0);
    setScore(0);
    setShowScore(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
        {!showScore ? (
          <>
            <h2 className="text-xl font-bold mb-4">
              Question {current + 1} of {shuffledQuestions.length}
            </h2>
            <p className="text-gray-700 mb-6">
              {shuffledQuestions[current].question}
            </p>
            <div className="flex flex-col space-y-3">
              {shuffledQuestions[current].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="mt-4 text-gray-500 text-sm">
              Difficulty: {shuffledQuestions[current].difficulty.toUpperCase()}
            </p>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-gray-700 mb-4">You scored {score} points</p>
            <p className="text-gray-500 mb-4">
              Max possible score:{" "}
              {questions.reduce((acc, q) => {
                const pts =
                  q.difficulty === "easy"
                    ? 1
                    : q.difficulty === "medium"
                    ? 2
                    : 3;
                return acc + pts;
              }, 0)}
            </p>
            <button
              onClick={resetQuiz}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Restart Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BibleQuiz;
