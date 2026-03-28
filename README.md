# ScamSpot 🛡️

ScamSpot is a comprehensive scam detection and education platform specifically designed to help older Australians (aged 65 and above) build digital confidence and identify potential scams. By combining interactive learning, gamified simulations, and an AI-powered scam detector, ScamSpot empowers users to navigate the digital landscape safely and independently.

> **⚠️ Project Status & Live Demo Note:**
> To optimise cloud infrastructure costs, the live backend services (AWS Elastic Beanstalk hosting the FastAPI/Node.js servers and AWS RDS for the PostgreSQL database) have been spun down. The frontend may still be accessible as a static site, but dynamic API connections to the machine learning detector and scam satistics are currently inactive. 
> 
> However, the complete data pipeline, AI model, and backend services are fully functional and can be run locally by following the setup instructions below.

## 🎥 Project Demo

Want to see ScamSpot in action? Check out our full project walkthrough and demonstration:
**[▶️ Watch the ScamSpot Demo on YouTube](https://youtu.be/yeT_EGo2Zhs?si=QGVbxMyCvOKTA_Yf)**

## 🌟 Key Features

* **Interactive Learning Module**: Step-by-step tutorials designed in a senior-friendly format to explain scam types and why people fall prey to them.
* **AI Scam Detector**: A tool where users can input suspicious SMS or email messages for instant analysis. It uses trained machine learning models to classify the text and integrates with Google Gemini 2.0 to provide a plain-language explanation of the results.
* **Simulation Games**: Three interactive games ('True or False', 'Choose the Clue', and 'Click and Match') that test and reinforce users' ability to identify scams.
* **Scenario Stories**: Simulated phone communications that guide users through realistic Romance, Investment, and Phishing scam scenarios.
* **Action Guide**: Step-by-step instructions on what to do and who to contact if a user suspects they have encountered a scam.
* **Scam Statistics**: Interactive dashboards displaying scam trends, common contact methods, and financial losses in Australia from 2021 to 2025.

## 🛠️ Tech Stack

### Frontend
* **Framework**: Vue.js 3 (Composition API)
* **Build Tool**: Vite
* **State Management & Routing**: Pinia & Vue Router
* **Styling**: TailwindCSS
* **Deployment**: AWS Amplify

### Backend (Microservices Architecture)
* **Node.js Service**: Handles routing for simulation games and queries question/answer pairs using Express.js.
* **Python Service**: Powered by FastAPI, this handles the Scam Detection Engine (ML models + Gemini integration) and data insights generation.
* **Deployment**: Hosted on AWS Elastic Beanstalk.

### Database
* **Relational Database**: PostgreSQL hosted on AWS RDS and Aurora.

## 📂 Project Structure

```text
📦 ScamSpot
├── 📁 frontend (src/)              # Vue.js Frontend
│   ├── 📁 assets                   # Website images and static assets
│   ├── 📁 components               # Reusable UI components and game cards
│   ├── 📁 data                     # Content for learning modules and scenarios
│   ├── 📁 router                   # Vue Router configuration
│   └── 📁 views                    # Page interfaces (Detector, Games, Stats, etc.)
│
└── 📁 backend                      # Backend Services
    ├── 📁 data_insight             # Python (FastAPI) endpoints for scam statistics
    ├── 📁 detector                 # Python (FastAPI) Scam Detection Engine & ML Models
    │   ├── 📁 app                  # Trained models (.pkl/.joblib) and Gemini LLM integration
    │   └── 📁 train                # Archived training datasets and ETL processes
    └── 📁 routes                   # Node.js routing for simulation games
```

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/ho0212/ScamSpot.git
cd ScamSpot
```
2. **Frontend Setup (Vue.js)**
```bash
npm install
npm run dev
```
(The frontend will be available at standard Vite local port)

3. **Backend Setup (Python FastAPI)**
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```
(Handles AI detection and statistics)

4. **Backend Setup (Node.js)**
```bash
node server.js
```
(Handles simulation game data)

**Notes:** You will need to configure your `.env` files for database connections and API keys before running the services locally.

## 🛡️ Security & Privacy
ScamSpot is built with user privacy and security as top priorities:
- **No Personal Data Stored**: The scam detector only analyzes the text provided; it does not access address books or personal data.
- **API Protection**: Backend APIs enforce HTTPS-only connections and are protected by rate-limiting (e.g., 100 requests/15 mins for Node.js, 15 requests/min for AI endpoints) to prevent abuse.
- **Input Sanitisation**: All user inputs are sanitized to prevent Cross-Site Scripting (XSS) and injection attacks.

## 👥 Meet the Team
- **Malone Ho** - Project Manager / Data Scientist / Visualisation Developer
- **Olivia Hui** - Data Engineer / Frontend Developer 
- **Reinald Audiel** - UI/UX Designer 
- **Ci Xu** - Full-Stack Developer 
- **Felix Tay Shi Hong** - Data/Machine Learning Developer 
- **Carl Goodwin** - Machine Learning Developer 

Built with ❤️ to protect and empower older Australians in the digital age.