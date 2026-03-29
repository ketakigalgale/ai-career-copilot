🚀 AI Career Copilot

An AI-powered career assistant that bridges the gap between your resume and your dream internship by analyzing job descriptions, identifying skill gaps, and generating personalized interview preparation.

✨ Features
Smart Match Analysis
Generates a compatibility score (0–100%) based on how well your profile aligns with the job description.
Skill Gap Detection
Identifies missing technical skills, frameworks, and tools required for the role.
Personalized Interview Questions
Generates tailored technical and behavioral questions based on your gaps and experience.
Modern UI/UX
Responsive, dark-themed interface with clean card layouts and visual score indicators.
🛠️ Tech Stack
Framework: Next.js 14 (App Router)
Language: TypeScript
AI Engine: Google Generative AI (Gemini)
Styling: Tailwind CSS
Icons: Lucide React
State Management: React Hooks
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/8850aa5c-4fcf-4804-ae11-886240da0442" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b5238b92-2db8-4123-9194-f76568d7c790" />

⚙️ Installation & Setup
1. Clone the repository
git clone https://github.com/ketakigalgale/ai-career-copilot.git
cd ai-career-copilot
2. Install dependencies
npm install
3. Environment Variables

Create a .env.local file in the root directory:

GEMINI_API_KEY=your_api_key_here
4. Run the development server
npm run dev

Open 👉 http://localhost:3000

🧠 How It Works
User uploads resume and enters job description
Backend processes input and sends it to Gemini AI
AI analyzes:
Skill alignment
Missing skills
Experience match
Returns structured JSON response
UI displays:
Match score
Skill gaps
Interview questions
📈 Roadmap
 Cover Letter Generator (Resume + JD → AI-generated letter)
 Skill Roadmap Generator (Personalized learning path)
 PDF Resume Parsing (enhanced extraction)
 Save Analysis History (Database integration)
💡 Challenges & Learnings
Handling structured AI responses (JSON parsing reliability)
Managing server-side AI calls in Next.js
Debugging deployment issues with Node-based libraries
Designing clean, user-friendly UI for data-heavy insights
👩‍💻 Developed By

Ketaki Galgale
B.Tech Student | Aspiring Software Development Engineer
