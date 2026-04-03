#  MentorConnect

MentorConnect is a real-time 1-on-1 mentoring platform that enables students and mentors to communicate, collaborate, and learn together through chat, video calling, and a shared code editor.


##  Features

###  Real-time Chat
- Instant messaging between mentor and student
- Built using WebSockets for real-time communication

###  Live Code Editor
- Collaborative coding environment
- Real-time code synchronization between users

###  Cursor Tracking
- See where the other user is typing in the editor
- Improves collaboration experience

###  Video Calling
- Peer-to-peer video communication using WebRTC
- Call request, accept, and reject functionality

### Authentication System
- JWT-based login system
- Role-based access (Mentor / Student)

###  Session-Based Rooms
- Unique session codes for private mentoring sessions
- Isolated real-time communication per session



##  Tech Stack

### Frontend
- React.js
- Tailwind CSS

### Backend
- FastAPI
- WebSockets

### Database
- SQLite

### Real-time & Communication
- WebSocket (Chat, Code Sync, Cursor)
- WebRTC (Video Calling)



##  Project Structure


mentorconnect/
│
├── frontend/
│   ├── components/
│   │   ├── SessionPage.jsx
│   │   ├── CodeEditor.jsx
│   │   ├── ChatBox.jsx
│   │   ├── VideoCall.jsx
│   │   └── ...
│   └── App.jsx
│
├── backend/
│   ├── websocket/
│   │   ├── manager.py
│   │   └── routes.py
│   └── main.py
│
└── README.md


##  Installation & Setup

### 🔹 1. Clone the repository

git clone https://github.com/your-username/mentorconnect.git
cd mentorconnect




### 🔹 2. Backend Setup (FastAPI)

cd backend
pip install -r requirements.txt
uvicorn main:app --reload


Backend will run on:

http://localhost:8000

### 🔹 3. Frontend Setup (React)

cd frontend
npm install
npm start


Frontend will run on:


http://localhost:3000

##  WebSocket Endpoint

ws://localhost:8000/ws/session/{session_code}


Handles:

* Chat messages
* Code updates
* Cursor movement
* WebRTC signaling

---

##  How It Works

1. User logs in (Mentor / Student)
2. User joins or creates a session using a session code
3. WebSocket connection is established
4. Users can:

   * Chat in real-time
   * Collaborate on code
   * See each other's cursor
   * Start video calls


##  Future Enhancements

*  AI-powered code suggestions
*  Run code inside editor
*  Monaco Editor (VS Code-like UI)
*  Session recording
*  Mentor analytics dashboard


##  Author

Aryan Mestry

## Show Your Support

If you like this project, give it a ⭐ on GitHub!
