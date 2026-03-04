
    // Quiz Questions Data
    const questions = [
      {
        category: "Geography",
        question: "What is the capital of Japan?",
        options: ["Seoul", "Tokyo", "Beijing", "Bangkok"],
        correct: 1
      },
      {
        category: "Science",
        question: "What planet is known as the Red Planet?",
        options: ["Venus", "Jupiter", "Mars", "Saturn"],
        correct: 2
      },
      {
        category: "History",
        question: "In which year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        correct: 2
      },
      {
        category: "Literature",
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correct: 1
      },
      {
        category: "Science",
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Fe", "Au", "Cu"],
        correct: 2
      },
      {
        category: "Geography",
        question: "Which is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correct: 3
      },
      {
        category: "Entertainment",
        question: "Which movie features the character 'Jack Sparrow'?",
        options: ["The Mummy", "Pirates of the Caribbean", "Treasure Island", "Master and Commander"],
        correct: 1
      },
      {
        category: "Nature",
        question: "What is the fastest land animal?",
        options: ["Lion", "Cheetah", "Gazelle", "Horse"],
        correct: 1
      },
      {
        category: "Technology",
        question: "Who co-founded Apple Inc.?",
        options: ["Bill Gates", "Mark Zuckerberg", "Steve Jobs", "Jeff Bezos"],
        correct: 2
      },
      {
        category: "Music",
        question: "Which band performed 'Bohemian Rhapsody'?",
        options: ["The Beatles", "Led Zeppelin", "Queen", "Pink Floyd"],
        correct: 2
      }
    ];

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

    // Default Config
    const defaultConfig = {
      quiz_title: "Quiz Master",
      start_button_text: "Start Quiz",
      correct_message: "Correct! 🎉",
      wrong_message: "Oops! Wrong answer 😅",
      background_color: "#1a1a2e",
      primary_color: "#e94560",
      text_color: "#f1f1f1",
      surface_color: "rgba(241, 241, 241, 0.05)",
      font_family: "Outfit",
      font_size: 16
    };

    let config = { ...defaultConfig };

    // Initialize SDK
    async function initializeSDK() {
      // Load users from localStorage
      loadAllUsers();

      if (window.elementSdk) {
        window.elementSdk.init({
          defaultConfig,
          onConfigChange: async (newConfig) => {
            config = { ...defaultConfig, ...newConfig };
            applyConfig();
          },
          mapToCapabilities: (cfg) => ({
            recolorables: [
              {
                get: () => cfg.background_color || defaultConfig.background_color,
                set: (value) => window.elementSdk.setConfig({ background_color: value })
              },
              {
                get: () => cfg.surface_color || defaultConfig.surface_color,
                set: (value) => window.elementSdk.setConfig({ surface_color: value })
              },
              {
                get: () => cfg.text_color || defaultConfig.text_color,
                set: (value) => window.elementSdk.setConfig({ text_color: value })
              },
              {
                get: () => cfg.primary_color || defaultConfig.primary_color,
                set: (value) => window.elementSdk.setConfig({ primary_color: value })
              }
            ],
            borderables: [],
            fontEditable: {
              get: () => cfg.font_family || defaultConfig.font_family,
              set: (value) => window.elementSdk.setConfig({ font_family: value })
            },
            fontSizeable: {
              get: () => cfg.font_size || defaultConfig.font_size,
              set: (value) => window.elementSdk.setConfig({ font_size: value })
            }
          }),
          mapToEditPanelValues: (cfg) => new Map([
            ["quiz_title", cfg.quiz_title || defaultConfig.quiz_title],
            ["start_button_text", cfg.start_button_text || defaultConfig.start_button_text],
            ["correct_message", cfg.correct_message || defaultConfig.correct_message],
            ["wrong_message", cfg.wrong_message || defaultConfig.wrong_message]
          ])
        });
      }
    }

    // localStorage Functions
    function loadAllUsers() {
      const stored = localStorage.getItem('quizGameUsers');
      allUsers = stored ? JSON.parse(stored) : [];
    }

    function saveAllUsers() {
      localStorage.setItem('quizGameUsers', JSON.stringify(allUsers));
    }

    function saveCurrentUser() {
      if (currentUser) {
        const index = allUsers.findIndex(u => u.username === currentUser.username);
        if (index !== -1) {
          allUsers[index] = currentUser;
          saveAllUsers();
        }
      }
    }

    function applyConfig() {
      const bgColor = config.background_color || defaultConfig.background_color;
      const primaryColor = config.primary_color || defaultConfig.primary_color;
      const textColor = config.text_color || defaultConfig.text_color;
      const fontFamily = config.font_family || defaultConfig.font_family;
      const fontSize = config.font_size || defaultConfig.font_size;

      const wrapper = document.getElementById('app-wrapper');
      wrapper.style.background = `linear-gradient(135deg, ${bgColor} 0%, ${adjustColor(bgColor, 20)} 50%, ${adjustColor(bgColor, 40)} 100%)`;

      document.getElementById('main-title').textContent = config.quiz_title || defaultConfig.quiz_title;
      document.getElementById('header-title').textContent = config.quiz_title || defaultConfig.quiz_title;

      document.querySelectorAll('[style*="color: #e94560"]').forEach(el => {
        el.style.color = primaryColor;
      });

      updateOptionStyles();
    }

    function adjustColor(hex, amount) {
      let color = hex.replace('#', '');
      let num = parseInt(color, 16);
      let r = Math.min(255, Math.max(0, (num >> 16) + amount));
      let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
      let b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }

    function updateOptionStyles() {
      const primaryColor = config.primary_color || defaultConfig.primary_color;
      const textColor = config.text_color || defaultConfig.text_color;
      
      document.querySelectorAll('.option-btn[data-option]').forEach(btn => {
        if (!btn.classList.contains('correct') && !btn.classList.contains('wrong')) {
          btn.style.borderColor = `${primaryColor}33`;
          btn.style.color = textColor;
        }
      });
    }

    function getRank(points) {
      return ranks.find(r => points >= r.minPoints && points <= r.maxPoints) || ranks[0];
    }

    async function createAccount(event) {
      event.preventDefault();
      const username = document.getElementById('username').value.trim();

      if (!username) {
        alert('Please enter a username');
        return;
      }

      if (allUsers.some(u => u.username === username)) {
        alert('Username already taken');
        return;
      }

      const newUser = {
        username: username,
        total_points: 0,
        rank_tier: "Egg",
        quizzes_completed: 0,
        best_score: 0,
        created_at: new Date().toISOString()
      };

      allUsers.push(newUser);
      saveAllUsers();
      
      currentUser = newUser;
      document.getElementById('account-screen').classList.add('hidden');
      document.getElementById('menu-screen').classList.remove('hidden');
      updateProfileDisplay();
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

    function startQuiz() {
      currentQuestion = 0;
      score = 0;
      answered = false;
      
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
      const primaryColor = config.primary_color || defaultConfig.primary_color;
      const textColor = config.text_color || defaultConfig.text_color;
      
      container.innerHTML = q.options.map((option, index) => `
        <button 
          data-option="${index}"
          onclick="selectAnswer(${index})"
          class="option-btn w-full p-3 sm:p-4 text-left rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-all"
          style="background: rgba(241, 241, 241, 0.05); border: 2px solid ${primaryColor}33; color: ${textColor}; font-family: 'Space Grotesk', sans-serif;"
        >
          <span class="inline-flex items-center justify-center w-7 sm:w-8 h-7 sm:h-8 rounded-lg mr-2 sm:mr-3 text-xs sm:text-sm font-bold" style="background: ${primaryColor}33; color: ${primaryColor};">
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
      
      feedbackMessage.textContent = isCorrect 
        ? (config.correct_message || defaultConfig.correct_message)
        : (config.wrong_message || defaultConfig.wrong_message);
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

    async function showResults() {
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

      // Update user stats in localStorage
      if (currentUser) {
        const newTotalPoints = (currentUser.total_points || 0) + points;
        const newBestScore = Math.max(currentUser.best_score || 0, score);
        const newRank = getRank(newTotalPoints).name;

        currentUser = {
          ...currentUser,
          total_points: newTotalPoints,
          best_score: newBestScore,
          rank_tier: newRank,
          quizzes_completed: (currentUser.quizzes_completed || 0) + 1
        };

        saveCurrentUser();
      }
    }

    function backToMenu() {
      document.getElementById('results-screen').classList.add('hidden');
      document.getElementById('menu-screen').classList.remove('hidden');
      updateProfileDisplay();
    }

    function exitQuiz() {
      if (confirm('Exit quiz without saving?')) {
        document.getElementById('quiz-screen').classList.add('hidden');
        document.getElementById('menu-screen').classList.remove('hidden');
      }
    }

    function logout() {
      currentUser = null;
      document.getElementById('menu-screen').classList.add('hidden');
      document.getElementById('account-screen').classList.remove('hidden');
      document.getElementById('username').value = '';
      document.getElementById('profile-card').classList.add('hidden');
    }

    // Initialize
    initializeSDK();
    applyConfig();
