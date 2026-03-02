const quizData = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyperlink Text Mode Language",
      "None of the above"
    ],
    answer: 0
  },
  {
    question: "Which language is used for styling web pages?",
    options: ["HTML", "CSS", "Python", "C++"],
    answer: 1
  },
  {
    question: "Which is a JavaScript framework?",
    options: ["Laravel", "React", "Django", "Flask"],
    answer: 1
  },
  {
    question: "Which tag is used to create a hyperlink in HTML?",
    options: ["<a>", "<link>", "<href>", "<h1>"],
    answer: 0
  },
  {
    question: "Which method is used to select an element in JavaScript?",
    options: [
      "getElementById()",
      "querySelector()",
      "Both A and B",
      "selectElement()"
    ],
    answer: 2
  },
  {
    question: "Which property is used to change text color in CSS?",
    options: ["font-style", "color", "background-color", "text-align"],
    answer: 1
  }
];

let currentQuestion = 0;
let score = 0;

function startQuiz() {
  let username = document.getElementById("username").value;

  if (username.trim() === "") {
    alert("Please enter your name!");
    return;
  }

  document.getElementById("quizContainer").style.display = "block";
  loadQuestion();
}

function loadQuestion() {
  let questionData = quizData[currentQuestion];
  document.getElementById("question").innerText = questionData.question;

  let optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  questionData.options.forEach((option, index) => {
    let label = document.createElement("label");
    label.classList.add("option-label");

    let radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "option";
    radio.value = index;

    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + option));

    optionsContainer.appendChild(label);
  });
}

function nextQuestion() {
  let selected = document.querySelector('input[name="option"]:checked');

  if (!selected) {
    alert("Please select an answer!");
    return;
  }

  if (parseInt(selected.value) === quizData[currentQuestion].answer) {
    score++;
  }

  currentQuestion++;

  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("quizContainer").style.display = "none";
  document.getElementById("result").style.display = "block";

  document.getElementById("scoreText").innerText =
    "Your Score: " + score + "/" + quizData.length;

  localStorage.setItem("quizScore", score);
}

function generateCertificate() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let username = document.getElementById("username").value;
  let finalScore = parseInt(localStorage.getItem("quizScore"));
  let totalMarks = quizData.length;
  let percentage = (finalScore / totalMarks) * 100;
  let today = new Date().toLocaleDateString();

  // Generate Certificate ID
  let certificateID = "CERT-" + Math.floor(100000 + Math.random() * 900000);

  // Grade Calculation
  let grade = "";
  if (percentage >= 80) grade = "A";
  else if (percentage >= 60) grade = "B";
  else grade = "C";

  // Plain White Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, "F");

  // Simple Black Border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2);
  doc.rect(10, 10, 190, 277);

  // University Name
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("VEL TECH UNIVERSITY", 105, 35, { align: "center" });

  // Certificate Title
  doc.setFontSize(28);
  doc.text("Certificate of Completion", 105, 60, { align: "center" });

  // Subtitle
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("This is to certify that", 105, 80, { align: "center" });

  // Student Name
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(username, 105, 95, { align: "center" });

  // Completion Text
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(
    "has successfully completed the Online Quiz Assessment",
    105,
    110,
    { align: "center" }
  );

  // Score & Grade
  doc.setFontSize(16);
  doc.text(
    "Score: " + finalScore + " / " + totalMarks + "   |   Grade: " + grade,
    105,
    125,
    { align: "center" }
  );

  // Certificate ID & Date
  doc.setFontSize(12);
  doc.text("Certificate ID: " + certificateID, 20, 250);
  doc.text("Date: " + today, 20, 260);

  // Signature Line
  doc.line(140, 240, 190, 240);
  doc.text("Authorized Signature", 145, 250);

  // Short File Name
  doc.save("Certificate.pdf");
}