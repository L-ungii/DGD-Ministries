export type Question = {
  question: string;
  options: string[];
  answer: string;
  difficulty: "easy" | "medium" | "hard";
};

export const questions: Question[] = [
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
    question: "Which sea did Moses part?",
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
    question: "Which city's walls fell after the Israelites marched around it?",
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
    question: "Who was the youngest king of Judah?",
    options: ["Josiah", "David", "Solomon", "Hezekiah"],
    answer: "Josiah",
    difficulty: "hard",
  },
  {
    question: "What was the first miracle Jesus performed?",
    options: [
      "Healing a leper",
      "Turning water into wine",
      "Feeding the 5,000",
      "Walking on water",
    ],
    answer: "Turning water into wine",
    difficulty: "medium",
  },
  {
    question: "Who baptised Jesus?",
    options: ["Peter", "John the Baptist", "Paul", "Andrew"],
    answer: "John the Baptist",
    difficulty: "easy",
  },
  {
    question: "How many disciples did Jesus choose?",
    options: ["7", "10", "12", "14"],
    answer: "12",
    difficulty: "easy",
  },
  {
    question: "Who wrote most of the New Testament letters?",
    options: ["Peter", "Paul", "John", "James"],
    answer: "Paul",
    difficulty: "medium",
  },
  {
    question: "What is the last book of the Bible?",
    options: ["Jude", "Revelation", "Malachi", "Acts"],
    answer: "Revelation",
    difficulty: "easy",
  },
  {
    question: "Who was swallowed by a great fish?",
    options: ["Jonah", "Job", "Hosea", "Amos"],
    answer: "Jonah",
    difficulty: "easy",
  },
  {
    question: "Which king wrote most of the Psalms?",
    options: ["Solomon", "David", "Saul", "Hezekiah"],
    answer: "David",
    difficulty: "medium",
  },
  {
    question: "How many people were saved on Noah's ark?",
    options: ["4", "6", "8", "10"],
    answer: "8",
    difficulty: "hard",
  },
  {
    question: "On what mountain did Moses receive the Ten Commandments?",
    options: ["Mount Carmel", "Mount Sinai", "Mount Zion", "Mount Nebo"],
    answer: "Mount Sinai",
    difficulty: "medium",
  },
  {
    question: "Who was the first martyr of the early church?",
    options: ["Stephen", "James", "Peter", "Philip"],
    answer: "Stephen",
    difficulty: "hard",
  },
];
