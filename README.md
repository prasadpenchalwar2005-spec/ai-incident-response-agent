# 🤖 AI Incident Response Agent

A lightweight **Agentic AI MVP** that demonstrates how an AI agent can investigate a production incident, select relevant tools, analyze operational data, recommend an action, and verify the result.

Built as a hands-on project to explore **Agentic AI concepts with full-stack development and local LLMs**.

---

## 🚀 What I Built

The application simulates a production incident response workflow.

Instead of simply generating a response like a traditional chatbot, the agent follows a multi-step workflow:

**Incident → Tool Selection → Investigation → Analysis → Human Approval → Action → Verification**

The goal of this project is to demonstrate how an LLM can participate in a structured decision-making workflow and interact with tools.

---

## 🧠 Agentic AI Workflow

```text
┌─────────────────────┐
│   Incident Input    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│     AI Agent        │
│  Selects Tools      │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   Tool Execution    │
│                     │
│ • Logs              │
│ • Deployment Info   │
│ • Database Check    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│    AI Analysis      │
│                     │
│ • Root Cause        │
│ • Evidence          │
│ • Severity          │
│ • Action            │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   Human Approval    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Action Execution   │
│   (Rollback)        │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│     Verification    │
└─────────────────────┘
```

---

## ✨ Key Features

* 🧠 **AI-driven tool selection**
* 🔧 **Tool-based investigation**
* 📊 **Incident analysis using tool results**
* 👤 **Human-in-the-loop approval**
* ⚡ **Action execution through backend tools**
* ✅ **Post-action incident verification**
* 💻 **Local LLM execution**
* 🔌 **REST API based architecture**

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* CSS

### Backend

* Node.js
* Express.js
* REST APIs

### AI

* Ollama
* Llama 3.2 3B

---

## 🔧 Agent Tools

The current MVP contains simulated operational tools:

| Tool                  | Purpose                               |
| --------------------- | ------------------------------------- |
| `get_logs`            | Retrieves simulated application logs  |
| `get_deployment_info` | Provides deployment information       |
| `check_database`      | Checks simulated database health      |
| `rollback_deployment` | Simulates deployment rollback         |
| `verify_incident`     | Verifies the system after remediation |

These tools are currently simulated to demonstrate the **tool-calling and decision-making workflow**.

---

## 🔄 Example Flow

A user reports an issue such as:

> Customers are unable to complete payments after a recent deployment.

The agent then:

1. Receives the incident.
2. Selects relevant investigation tools.
3. Executes the selected tools.
4. Analyzes the collected information.
5. Identifies the likely root cause.
6. Recommends a remediation action.
7. Waits for human approval.
8. Executes the approved rollback.
9. Verifies whether the incident has been resolved.

---

## 👤 Human-in-the-Loop

The agent does **not** directly execute the rollback without approval.

The workflow intentionally includes a human approval step before taking a potentially impactful action.

This demonstrates how AI agents can be combined with **human oversight and controlled actions**.

---

## 💻 Running Locally

### Prerequisites

* Node.js
* npm
* Ollama

### 1. Clone the repository

```bash
git clone https://github.com/prasadpenchalwar2005-spec/ai-incident-response-agent.git

cd ai-incident-response-agent
```

### 2. Install and run the AI model

Make sure Ollama is installed and running.

Pull the model:

```bash
ollama pull llama3.2:3b
```

### 3. Start the backend

```bash
cd server
npm install
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### 4. Start the frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL provided by Vite.

---

## 📁 Project Structure

```text
ai-incident-response-agent/
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── tools/
│   │   └── incidentTools.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🎯 Project Goal

This project was built to gain practical experience with:

* Agentic AI architecture
* LLM integration
* Tool-based AI workflows
* AI decision-making
* Human-in-the-loop systems
* Local AI models
* REST API integration
* Full-stack application development

It is a small **proof-of-concept/MVP** rather than a production infrastructure system.

---

## 🔮 Future Improvements

The architecture can be extended with:

* Workflow-based incident detection
* Multiple incident types
* Real monitoring and logging integrations
* GitHub integrations
* Cloud infrastructure integrations
* Incident history and memory
* More advanced agent planning

---

## 👨‍💻 Built With

**React · Node.js · Express · Ollama · Llama 3.2 · Agentic AI**

A hands-on project exploring how modern AI agents can work with software tools and human approval to solve practical operational problems.
