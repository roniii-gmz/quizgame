// 1. All Available Questions
const allAvailableQuestions = [
  { id: 1, category: "Practical Research", question: "What is the purpose of a Statement of the Problem?", options: ["To summarize the results", "To present the research questions", "To give recommendations", "To list references"], correct: 1 },
  { id: 2, category: "Practical Research", question: "Which statistical tool is used to compute the average?", options: ["Median", "Mode", "Mean", "Range"], correct: 2 },
  { id: 3, category: "Practical Research", question: "Which research design tests cause-and-effect relationships?", options: ["Descriptive research", "Eperimental research", "Historical research", "Phenomenological research"], correct: 1 },
  { id: 4, category: "Practical Research", question: "Which statistical test is commonly used to compare pre-test and post-test scores?", options: ["Frequency", "Percentage", "T-test", "Ranking"], correct: 2 },
  { id: 5, category: "Practical Research", question: "What tool is commonly used to collect data?", options: ["Survey questionnaire", "Paint brush", "Novel", "Dictionary"], correct: 0 },
  { id: 6, category: "Practical Research", question: "What part of the research tells what the study is about?", options: ["Title", "References", "Appendix", "Table"], correct: 0 },
  { id: 7, category: "Practical Research", question: "What do you call information gathered from people?", options: ["Data", "Story", "Opinion", "Guess"], correct: 0 },
  { id: 8, category: "Practical Research", question: "What statistical tool is used to count how many times something appears?", options: ["Frequency", "Mean", "Median", "Mode"], correct: 0 },
  { id: 9, category: "Practical Research", question: "What element in the study highlights the significance of the research?", options: ["Appendix", "References", "Table of Contents", "Introduction"], correct: 3 },
  { id: 10, category: "Practical Research", question: "The group selected to represent the entire population is called by what name?", options: ["Sample", "Conclusion ", "Variable ", "Theory"], correct: 0 },
  { id: 11, category: "Practical Research", question: "Which part of the study uses tables or graphs to present the findings?", options: ["Results", "References", "Title Page", "Appendix"], correct: 0 },
  { id: 12, category: "Practical Research", question: "What method gathers data by watching and recording behavior or events?", options: ["Interview", "Observation", "Experiment", "Survey"], correct: 1 },
  { id: 13, category: "Practical Research", question: "‎What part of the research gives a brief overview of the whole study?", options: ["Abstract", "Methodology", "References", "Appendix"], correct: 0 },
  { id: 14, category: "Practical Research", question: "What part of the research lists the sources used in the study?", options: ["Appendix ", "References ", "Introduction ", "Results "], correct: 1 },
  { id: 15, category: "Practical Research", question: "What is the term for a research study's general framework or plan?", options: ["Graph", "Instrument ", "Frequency ", "Research Design"], correct: 3 },
  { id: 16, category: "Practical Research", question: "What does PR2 stand for?", options: ["Programming Rules 2", "Practical Research 2", "Project Report 2", "Professional Reading 2"], correct: 1 },
  { id: 17, category: "Practical Research", question: "Which research method focuses on numerical data and statistical analysis?", options: ["Qualitative Research", "Quantitative Research", "Historical Research", "Case Study"], correct: 1 },
  { id: 18, category: "Practical Research", question: "In research, what is a hypothesis?", options: ["A proven fact", "A research title", "A testable prediction", "A list of references"], correct: 2 },
  { id: 19, category: "Practical Research", question: "Which part of the research paper presents the findings of the study?", options: ["Introduction", "Methodology", "Results", "Acknowledgement"], correct: 2 },
  { id: 20, category: "Practical Research", question: "What is the purpose of a Review of Related Literature (RRL)?", options: ["To summarize the results", "To present raw data", "To show previous studies related to the topic", "To list survey questions"], correct: 2 }
];

// 2. Rank System
const ranks = [
  { name: "Egg", emoji: "🥚", minPoints: 0, maxPoints: 99 },
  { name: "Chick", emoji: "🐣", minPoints: 100, maxPoints: 249 },
  { name: "Bird", emoji: "🐤", minPoints: 250, maxPoints: 499 },
  { name: "Eagle", emoji: "🦅", minPoints: 500, maxPoints: 999 },
  { name: "Legend", emoji: "🔥", minPoints: 1000, maxPoints: Infinity }
];

// 3. Game State
let questions = [];
let currentUser = null;
let currentQuestion = 0;
let score = 0;
let answered = false;
let allUsers = [];
let isCreateMode = true;

// NEW: Timer & Streak State
let timerInterval;
let timeLeft = 15;
let streak = 0;

// 4. Timer Logic
function startTimer() {
  timeLeft = 15;
  const timerEl = document.getElementById('timer-display');
  if (timerEl) {
    timerEl.textContent = `Time: ${timeLeft}s`;
    timerEl.style.color = "#e94560"; // Reset color
  }

  timerInterval = setInterval(() => {
    timeLeft--;
    if (timerEl) timerEl.textContent = `Time: ${timeLeft}s`;
    
    if (timeLeft <= 5 && timerEl) {
      timerEl.style.color = "#ff4d4d"; // Red warning
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      selectAnswer(-1); // Force a timeout
    }
  }, 1000);
}

// 5. Quiz Logic
function startQuiz() {
  currentQuestion = 0;
  score = 0;
  streak = 0;
  answered = false;
  
  questions = getRandomQuestions(10);

  document.getElementById('menu-screen').classList.add('hidden');
  document.getElementById('quiz-screen').classList.remove('hidden');
  document.getElementById('results-screen').classList.add('hidden');
  
  displayQuestion();
}

function displayQuestion() {
  if (questions.length === 0) return;
  const q = questions[currentQuestion];
  answered = false;
  
  // Timer Reset
  clearInterval(timerInterval);
  startTimer();

  // UI Updates
  const counter = document.getElementById('question-counter');
  if (counter) counter.textContent = `Question ${currentQuestion + 1}/${questions.length}`;
  
  const scoreDisp = document.getElementById('score-display');
  if (scoreDisp) scoreDisp.textContent = score;

  const progBar = document.getElementById('progress-bar');
  if (progBar) progBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

  const qText = document.getElementById('question-text');
  if (qText) qText.textContent = q.question;
  
  const feedback = document.getElementById('feedback-container');
  if (feedback) feedback.classList.add('hidden');
  
  const container = document.getElementById('options-container');
  if (container) {
    container.innerHTML = q.options.map((option, index) => `
      <button 
        data-option="${index}"
        onclick="selectAnswer(${index})"
        class="option-btn w-full p-4 text-left rounded-xl transition-all"
        style="background: rgba(241, 241, 241, 0.05); border: 2px solid rgba(233, 69, 96, 0.3); color: #f1f1f1;"
      >
        <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg mr-3 font-bold" style="background: rgba(233, 69, 96, 0.3); color: #e94560;">
          ${String.fromCharCode(65 + index)}
        </span>
        ${option}
      </button>
    `).join('');
  }
}

function selectAnswer(index) {
  if (answered) return;
  answered = true;
  clearInterval(timerInterval);
  
  const q = questions[currentQuestion];
  const isCorrect = index === q.correct;
  
  if (isCorrect) {
    score++;
    streak++;
  } else {
    streak = 0;
  }
  
  const buttons = document.querySelectorAll('[data-option]');
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) {
      btn.style.background = '#4ade80';
      btn.style.color = '#1a1a2e';
    } else if (i === index && !isCorrect) {
      btn.style.background = '#f87171';
      btn.style.color = '#1a1a2e';
    }
  });

  const feedbackContainer = document.getElementById('feedback-container');
  const feedbackMessage = document.getElementById('feedback-message');
  
  if (feedbackMessage) {
    if (index === -1) {
      feedbackMessage.textContent = "Time's Up! ⏰";
    } else if (streak >= 3 && isCorrect) {
      feedbackMessage.textContent = `🔥 ${streak} IN A ROW!`;
    } else {
      feedbackMessage.textContent = isCorrect ? 'Correct! 🎉' : 'Oops! Wrong answer 😅';
    }
    feedbackMessage.style.color = isCorrect ? '#4ade80' : '#f87171';
  }
  
  if (feedbackContainer) feedbackContainer.classList.remove('hidden');
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion >= questions.length) {
    showResults();
  } else {
    displayQuestion();
  }
}

// --- KEEP YOUR EXISTING HELPER FUNCTIONS BELOW ---
// loadUsers(), saveUsers(), createAccount(), loginAccount(), getRandomQuestions(), showResults(), etc.

    // Game State
    let currentUser = null;
    let currentQuestion = 0;
    let score = 0;
    let answered = false;
    let allUsers = [];
    let isCreateMode = true;
    let timerInterval; // <--- MUST HAVE THIS
    let timeLeft = 15; 
    let streak = 0;


    // Load users from localStorage on page load
    function loadUsers() {
      const stored = localStorage.getItem('quizUsers');
      allUsers = stored ? JSON.parse(stored) : [];
      updateLoginDropdown();
    }

    // Save users to localStorage
    function saveUsers() {
      localStorage.setItem('quizUsers', JSON.stringify(allUsers));
    }

    function updateLoginDropdown() {
      const select = document.getElementById('username-login');
      const currentValue = select.value;
      
      select.innerHTML = '<option value="">-- Select an account --</option>';
      allUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user.username;
        option.textContent = user.username;
        select.appendChild(option);
      });

      if (allUsers.length === 0) {
        select.innerHTML = '<option value="">No accounts found. Create one first!</option>';
      }
    }

    function toggleAuthMode() {
      isCreateMode = !isCreateMode;
      const createForm = document.getElementById('create-account-form');
      const loginForm = document.getElementById('login-form');
      const toggleBtn = document.getElementById('toggle-text');
      const subtitle = document.getElementById('auth-subtitle');

      if (isCreateMode) {
        createForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        toggleBtn.textContent = 'Already have an account? Login';
        subtitle.textContent = 'Create an account to start playing';
      } else {
        createForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        toggleBtn.textContent = 'New here? Create an account';
        subtitle.textContent = 'Login to your account';
        updateLoginDropdown();
      }
    }

    function createAccount(event) {
      event.preventDefault();
      const username = document.getElementById('username-create').value.trim();
      const errorEl = document.getElementById('error-message-create');
      const btn = document.getElementById('create-account-btn');

      errorEl.classList.add('hidden');

      if (!username) {
        errorEl.textContent = 'Please enter a username';
        errorEl.classList.remove('hidden');
        return;
      }

      if (allUsers.some(u => u.username === username)) {
        errorEl.textContent = 'Username already taken';
        errorEl.classList.remove('hidden');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Creating...';

      // Create new user
      const newUser = {
        username: username,
        total_points: 0,
        rank_tier: "Egg",
        quizzes_completed: 0,
        best_score: 0,
        answered_question_ids: [],
        created_at: new Date().toISOString()
      };

      allUsers.push(newUser);
      saveUsers();

      currentUser = newUser;
      document.getElementById('auth-screen').classList.add('hidden');
      document.getElementById('menu-screen').classList.remove('hidden');
      updateProfileDisplay();

      btn.disabled = false;
      btn.textContent = 'Create Account';
    }

    function loginAccount(event) {
      event.preventDefault();
      const username = document.getElementById('username-login').value.trim();
      const errorEl = document.getElementById('error-message-login');

      errorEl.classList.add('hidden');

      if (!username) {
        errorEl.textContent = 'Please select an account';
        errorEl.classList.remove('hidden');
        return;
      }

      currentUser = allUsers.find(u => u.username === username);
      
      if (currentUser) {
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('menu-screen').classList.remove('hidden');
        updateProfileDisplay();
      } else {
        errorEl.textContent = 'Account not found';
        errorEl.classList.remove('hidden');
      }
    }

    function getRank(points) {
      return ranks.find(r => points >= r.minPoints && points <= r.maxPoints) || ranks[0];
    }

    function updateProfileDisplay() {
      if (!currentUser) return;

      document.getElementById('profile-username').textContent = currentUser.username;
      document.getElementById('profile-points').textContent = currentUser.total_points;
      document.getElementById('profile-quizzes').textContent = currentUser.quizzes_completed;
      document.getElementById('profile-best').textContent = `${currentUser.best_score}/10`;
      
      const rank = getRank(currentUser.total_points);
      document.getElementById('profile-rank').textContent = rank.name;
      document.getElementById('rank-icon').textContent = rank.emoji;
      document.getElementById('rank-icon').style.background = `rgba(233, 69, 96, 0.2)`;
    }

    function toggleProfile() {
      document.getElementById('profile-card').classList.toggle('hidden');
    }

    function showProfile() {
      toggleProfile();
      updateProfileDisplay();
    }

    function getRandomQuestions(count) {
      // Get question IDs that haven't been answered yet
      const answeredIds = currentUser.answered_question_ids || [];
      const unansweredQuestions = allAvailableQuestions.filter(q => !answeredIds.includes(q.id));

      // If all questions have been answered, reset the answered list
      if (unansweredQuestions.length === 0) {
        currentUser.answered_question_ids = [];
        return getRandomQuestions(count);
      }

      // Pick random questions (up to count, or less if fewer available)
      const selected = [];
      const availableCopy = [...unansweredQuestions];
      const numToSelect = Math.min(count, availableCopy.length);

      for (let i = 0; i < numToSelect; i++) {
        const randomIndex = Math.floor(Math.random() * availableCopy.length);
        selected.push(availableCopy[randomIndex]);
        availableCopy.splice(randomIndex, 1);
      }

      return selected;
    }

    function startQuiz() {
      currentQuestion = 0;
      score = 0;
      answered = false;
      
      // Get 10 random unanswered questions
      questions = getRandomQuestions(10);

      document.getElementById('menu-screen').classList.add('hidden');
      document.getElementById('quiz-screen').classList.remove('hidden');
      document.getElementById('results-screen').classList.add('hidden');

      console.log(questions);
        
      displayQuestion();
    }

    function displayQuestion() {
  const q = questions[currentQuestion];
  if (!q) return; // Stop if no question exists

  answered = false;
  
  // 1. Reset and Start Timer
  clearInterval(timerInterval);
  startTimer();

  // 2. Safe UI Updates (Checks if ID exists before trying to change it)
  const counter = document.getElementById('question-counter');
  if (counter) counter.textContent = `Question ${currentQuestion + 1}/${questions.length}`;

  const scoreDisp = document.getElementById('score-display');
  if (scoreDisp) scoreDisp.textContent = score;

  const progBar = document.getElementById('progress-bar');
  if (progBar) progBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

  const catBadge = document.getElementById('category-badge');
  if (catBadge) catBadge.textContent = q.category;

  const qText = document.getElementById('question-text');
  if (qText) qText.textContent = q.question;
  
  // 3. Hide feedback
  const feedback = document.getElementById('feedback-container');
  if (feedback) feedback.classList.add('hidden');
  
  // 4. Render Options
  const container = document.getElementById('options-container');
  if (container) {
    container.innerHTML = q.options.map((option, index) => `
      <button 
        data-option="${index}"
        onclick="selectAnswer(${index})"
        class="option-btn w-full p-4 text-left rounded-xl transition-all"
        style="background: rgba(241, 241, 241, 0.05); border: 2px solid rgba(233, 69, 96, 0.3); color: #f1f1f1;"
      >
        <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg mr-3 font-bold" style="background: rgba(233, 69, 96, 0.3); color: #e94560;">
          ${String.fromCharCode(65 + index)}
        </span>
        ${option}
      </button>
    `).join('');
  }
}



    function selectAnswer(index) {
      if (answered) return;
      answered = true;
      clearInterval(timerInterval); // Stop the clock!
      
      const q = questions[currentQuestion];
      const isCorrect = index === q.correct;
      
      if (isCorrect) {
        score++;
        streak++; // Add to streak
      } else {
        streak = 0; // Reset streak on wrong answer
      }
      
      const buttons = document.querySelectorAll('[data-option]');
      buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.correct) {
          btn.style.background = '#4ade80'; // Green for correct
          btn.style.color = '#1a1a2e';
        } else if (i === index && !isCorrect) {
          btn.style.background = '#f87171'; // Red for wrong
          btn.style.color = '#1a1a2e';
        }
      });
    
      const feedbackMessage = document.getElementById('feedback-message');
      
      // Custom feedback for streaks
      if (index === -1) {
        feedbackMessage.textContent = "Time's up! ⏰";
      } else if (streak >= 3 && isCorrect) {
        feedbackMessage.textContent = `🔥 ${streak} STREAK!`;
      } else {
        feedbackMessage.textContent = isCorrect ? 'Correct! 🎉' : 'Oops! Wrong answer 😅';
      }
      
      feedbackMessage.style.color = isCorrect ? '#4ade80' : '#f87171';
      document.getElementById('feedback-container').classList.remove('hidden');
    }


    function nextQuestion() {
      currentQuestion++;
      
      if (currentQuestion >= questions.length) {
        showResults();
      } else {
        displayQuestion();
      }
    }

    function showResults() {
      document.getElementById('quiz-screen').classList.add('hidden');
      document.getElementById('results-screen').classList.remove('hidden');
      
      const finalScore = document.getElementById('final-score');
      const scoreMessage = document.getElementById('score-message');
      const resultEmoji = document.getElementById('result-emoji');
      const correctCount = document.getElementById('correct-count');
      const wrongCount = document.getElementById('wrong-count');
      const pointsEarned = document.getElementById('points-earned');
      
      finalScore.textContent = score;
      correctCount.textContent = score;
      wrongCount.textContent = questions.length - score;
      
      const points = score * 10;
      pointsEarned.textContent = `+${points}`;
      
      const percentage = (score / questions.length) * 100;
      if (percentage === 100) {
        resultEmoji.textContent = '🏆';
        scoreMessage.textContent = 'Perfect score! You\'re a genius!';
      } else if (percentage >= 80) {
        resultEmoji.textContent = '🌟';
        scoreMessage.textContent = 'Excellent! Almost perfect!';
      } else if (percentage >= 60) {
        resultEmoji.textContent = '👏';
        scoreMessage.textContent = 'Good job! Well done!';
      } else if (percentage >= 40) {
        resultEmoji.textContent = '💪';
        scoreMessage.textContent = 'Not bad! Keep practicing!';
      } else {
        resultEmoji.textContent = '📚';
        scoreMessage.textContent = 'Time to study more!';
      }

      // Mark questions as answered and update user stats
      if (currentUser) {
        questions.forEach(q => {
          if (!currentUser.answered_question_ids.includes(q.id)) {
            currentUser.answered_question_ids.push(q.id);
          }
        });

        const newTotalPoints = (currentUser.total_points || 0) + points;
        const newBestScore = Math.max(currentUser.best_score || 0, score);
        const newRank = getRank(newTotalPoints).name;

        currentUser.total_points = newTotalPoints;
        currentUser.best_score = newBestScore;
        currentUser.rank_tier = newRank;
        currentUser.quizzes_completed = (currentUser.quizzes_completed || 0) + 1;

        // Update in allUsers array
        const userIndex = allUsers.findIndex(u => u.username === currentUser.username);
        if (userIndex !== -1) {
          allUsers[userIndex] = currentUser;
        }

        saveUsers();
      }
    }

    function backToMenu() {
      document.getElementById('results-screen').classList.add('hidden');
      document.getElementById('menu-screen').classList.remove('hidden');
      updateProfileDisplay();
    }

    function exitQuiz() {
      document.getElementById('quiz-screen').classList.add('hidden');
      document.getElementById('menu-screen').classList.remove('hidden');
    }

    function logout() {
      currentUser = null;
      isCreateMode = true;
      document.getElementById('menu-screen').classList.add('hidden');
      document.getElementById('auth-screen').classList.remove('hidden');
      document.getElementById('username-create').value = '';
      document.getElementById('username-login').value = '';
      document.getElementById('profile-card').classList.add('hidden');
      document.getElementById('error-message-create').classList.add('hidden');
      document.getElementById('error-message-login').classList.add('hidden');
      document.getElementById('create-account-form').classList.remove('hidden');
      document.getElementById('login-form').classList.add('hidden');
      document.getElementById('toggle-text').textContent = 'Already have an account? Login';
      document.getElementById('auth-subtitle').textContent = 'Create an account to start playing';
    }

    function startTimer() {
      timeLeft = 15; 
      const timerEl = document.getElementById('timer-display');
      
      if (timerEl) {
        timerEl.textContent = `Time: ${timeLeft}s`;
        timerEl.classList.remove('timer-low');
      }
    
      timerInterval = setInterval(() => {
        timeLeft--;
        if (timerEl) timerEl.textContent = `Time: ${timeLeft}s`;
        
        if (timeLeft <= 5 && timerEl) {
          timerEl.classList.add('timer-low');
        }
        
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          selectAnswer(-1); // This triggers the "Time's Up" logic
        }
      }, 1000);
    }





    // Initialize on page load
    loadUsers();














