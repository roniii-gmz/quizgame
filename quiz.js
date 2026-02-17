// All Available Questions - Add as many as you want!
    const allAvailableQuestions = [
      {
        id: 1,
        category: "Geography",
        question: "What is the capital of Japan?",
        options: ["Seoul", "Tokyo", "Beijing", "Bangkok"],
        correct: 1
      },
      {
        id: 2,
        category: "Science",
        question: "What planet is known as the Red Planet?",
        options: ["Venus", "Jupiter", "Mars", "Saturn"],
        correct: 2
      },
      {
        id: 3,
        category: "History",
        question: "In which year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        correct: 2
      },
      {
        id: 4,
        category: "Literature",
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correct: 1
      },
      {
        id: 5,
        category: "Science",
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Fe", "Au", "Cu"],
        correct: 2
      },
      {
        id: 6,
        category: "Geography",
        question: "Which is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correct: 3
      },
      {
        id: 7,
        category: "Entertainment",
        question: "Which movie features the character 'Jack Sparrow'?",
        options: ["The Mummy", "Pirates of the Caribbean", "Treasure Island", "Master and Commander"],
        correct: 1
      },
      {
        id: 8,
        category: "Nature",
        question: "What is the fastest land animal?",
        options: ["Lion", "Cheetah", "Gazelle", "Horse"],
        correct: 1
      },
      {
        id: 9,
        category: "Technology",
        question: "Who co-founded Apple Inc.?",
        options: ["Bill Gates", "Mark Zuckerberg", "Steve Jobs", "Jeff Bezos"],
        correct: 2
      },
      {
        id: 10,
        category: "Music",
        question: "Which band performed 'Bohemian Rhapsody'?",
        options: ["The Beatles", "Led Zeppelin", "Queen", "Pink Floyd"],
        correct: 2
      },
      {
        id: 11,
        category: "Geography",
        question: "What is the capital of France?",
        options: ["Lyon", "Paris", "Marseille", "Nice"],
        correct: 1
      },
      {
        id: 12,
        category: "Science",
        question: "How many bones does an adult human have?",
        options: ["186", "206", "226", "246"],
        correct: 1
      },
      {
        id: 13,
        category: "History",
        question: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"],
        correct: 1
      },
      {
        id: 14,
        category: "Literature",
        question: "Who wrote '1984'?",
        options: ["George Orwell", "Ray Bradbury", "Aldous Huxley", "Kurt Vonnegut"],
        correct: 0
      },
      {
        id: 15,
        category: "Science",
        question: "What is the hardest natural substance on Earth?",
        options: ["Gold", "Diamond", "Platinum", "Sapphire"],
        correct: 1
      },
      {
        id: 16,
        category: "Geography",
        question: "What is the longest river in the world?",
        options: ["Amazon", "Yangtze", "Nile", "Mississippi"],
        correct: 2
      },
      {
        id: 17,
        category: "Entertainment",
        question: "Who directed 'The Shawshank Redemption'?",
        options: ["Steven Spielberg", "Frank Darabont", "Martin Scorsese", "Christopher Nolan"],
        correct: 1
      },
      {
        id: 18,
        category: "Nature",
        question: "How many legs does a spider have?",
        options: ["6", "8", "10", "12"],
        correct: 1
      },
      {
        id: 19,
        category: "Technology",
        question: "In what year was the first iPhone released?",
        options: ["2005", "2006", "2007", "2008"],
        correct: 2
      },
      {
        id: 20,
        category: "Music",
        question: "How many strings does a standard violin have?",
        options: ["4", "5", "6", "7"],
        correct: 0
      }
    ];

    let questions = [];

    // Rank System
    const ranks = [
      { name: "Egg", emoji: "🥚", minPoints: 0, maxPoints: 99 },
      { name: "Chick", emoji: "🐣", minPoints: 100, maxPoints: 249 },
      { name: "Bird", emoji: "🐤", minPoints: 250, maxPoints: 499 },
      { name: "Eagle", emoji: "🦅", minPoints: 500, maxPoints: 999 },
      { name: "Legend", emoji: "🔥", minPoints: 1000, maxPoints: Infinity }
    ];

    // Game State
    let currentUser = null;
    let currentQuestion = 0;
    let score = 0;
    let answered = false;
    let allUsers = [];
    let isCreateMode = true;

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
      
      displayQuestion();
    }

    function displayQuestion() {
      const q = questions[currentQuestion];
      answered = false;
      
      document.getElementById('question-counter').textContent = `Question ${currentQuestion + 1}/${questions.length}`;
      document.getElementById('score-display').textContent = score;
      document.getElementById('progress-bar').style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
      document.getElementById('category-badge').textContent = q.category;
      document.getElementById('question-text').textContent = q.question;
      
      document.getElementById('feedback-container').classList.add('hidden');
      
      const container = document.getElementById('options-container');
      
      container.innerHTML = q.options.map((option, index) => `
        <button 
          data-option="${index}"
          onclick="selectAnswer(${index})"
          class="option-btn w-full p-3 sm:p-4 text-left rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-all"
          style="background: rgba(241, 241, 241, 0.05); border: 2px solid rgba(233, 69, 96, 0.3); color: #f1f1f1; font-family: 'Space Grotesk', sans-serif;"
        >
          <span class="inline-flex items-center justify-center w-7 sm:w-8 h-7 sm:h-8 rounded-lg mr-2 sm:mr-3 text-xs sm:text-sm font-bold" style="background: rgba(233, 69, 96, 0.3); color: #e94560;">
            ${String.fromCharCode(65 + index)}
          </span>
          ${option}
        </button>
      `).join('');

      container.querySelectorAll('button').forEach((btn, i) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(20px)';
        setTimeout(() => {
          btn.style.transition = 'all 0.3s ease';
          btn.style.opacity = '1';
          btn.style.transform = 'translateY(0)';
        }, i * 100);
      });
    }

    function selectAnswer(index) {
      if (answered) return;
      answered = true;
      
      const q = questions[currentQuestion];
      const isCorrect = index === q.correct;
      const buttons = document.querySelectorAll('[data-option]');
      
      buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.correct) {
          btn.style.background = '#4ade80';
          btn.style.borderColor = '#4ade80';
          btn.style.color = '#1a1a2e';
          btn.classList.add('correct');
        } else if (i === index && !isCorrect) {
          btn.style.background = '#f87171';
          btn.style.borderColor = '#f87171';
          btn.style.color = '#1a1a2e';
          btn.classList.add('wrong', 'animate-shake');
        }
      });
      
      if (isCorrect) {
        score++;
        document.getElementById('score-display').textContent = score;
        document.getElementById('score-display').parentElement.classList.add('animate-pulse-once');
      }
      
      const feedbackContainer = document.getElementById('feedback-container');
      const feedbackMessage = document.getElementById('feedback-message');
      
      feedbackMessage.textContent = isCorrect ? 'Correct! 🎉' : 'Oops! Wrong answer 😅';
      feedbackMessage.style.color = isCorrect ? '#4ade80' : '#f87171';
      
      const nextBtn = document.getElementById('next-btn');
      if (currentQuestion === questions.length - 1) {
        nextBtn.textContent = 'See Results 🏆';
      } else {
        nextBtn.textContent = 'Next Question →';
      }
      
      feedbackContainer.classList.remove('hidden');
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

    // Initialize on page load
    loadUsers();
