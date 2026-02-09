# Memory Game

A fun and interactive memory card matching game built with Express.js and vanilla JavaScript. Match pairs of cards to win!

**Authors:** Abirame, Niña, and Juliana  
**Project:** HackYourFuture Foundation

---

## 🎮 Features

- **Card Matching Gameplay** - Flip cards to find matching pairs
- **Timer** - Track how long it takes to complete the game
- **Reveal Counter** - Monitor how many cards you've flipped
- **Reset Button** - Restart the game at any time
- **Shuffle** - Cards are shuffled randomly each game
- **Win Alert** - Get a celebration message with your stats when you win
- **Auto-Reset** - Game automatically resets after winning
- **Persistent Database** - Card data stored in SQLite

---

## 📁 Project Structure

```
memoryGame/
├── app/
│   ├── html/
│   │   ├── index.html
│   │   └── css/
│   │       └── styles.css
│   ├── images/
│   │   ├── comet.jfif
│   │   ├── moon.jfif
│   │   ├── rocket.jfif
│   │   └── sun.jfif
│   └── scripts/
│       ├── script.js
│       └── script_.js
├── server/
│   ├── index.js
│   ├── package.json
│   ├── database.db
│   └── README.md
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone or navigate to the project directory:
```bash
cd memoryGame/server
```

2. Install dependencies:
```bash
npm install
```

### Running the Game

1. Start the server:
```bash
npm start
# or
node index.js
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. The game will load automatically in your browser

---

## 🎯 How to Play

1. **Start the Game** - Cards will be displayed face-down on startup
2. **Click a Card** - Click any card to flip it and reveal the image (this also starts the timer)
3. **Find a Match** - Click another card to try to find its matching pair
4. **Match Found** - If the cards match, they stay flipped and your reveal count increases
5. **No Match** - If cards don't match, they flip back after 1.5 seconds
6. **Win Condition** - Match all pairs to complete the game and see your stats
7. **Reset** - Click the "Reset" button to start over with shuffled cards

---

## 🛠️ Technologies Used

- **Frontend:**
  - HTML5
  - CSS3 (with card flip animations)
  - Vanilla JavaScript (ES6+)

- **Backend:**
  - Node.js
  - Express.js
  - SQLite3
  - Knex.js (query builder)

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cards` | Fetch all card data from database |
| GET | `/users` | Fetch all users |
| GET | `/config/:key` | Fetch configuration values |

---

## 🎨 Game Features Details

### Statistics Tracking
- **Reveals** - Counts total card flips
- **Timer** - Starts on first card click, counts in MM:SS format
- **Matched Pairs** - Tracks progress toward winning

### Visual Feedback
- Card flip animations
- Matched cards stay highlighted
- Unmatched cards flip back automatically

---

## 📝 Notes

- The game uses celestial-themed images (moon, sun, rocket, comet)
- Card front image is configurable via database settings
- Database is created automatically with sample card data
- All cards are shuffled randomly before each game

---

## 🔧 Customization

To customize card images or properties:
1. Add new images to `app/images/`
2. Update card data in the SQLite database
3. Modify card styling in `app/html/css/styles.css`

---

## 📄 License

Project created as part of HackYourFuture Foundation curriculum.

