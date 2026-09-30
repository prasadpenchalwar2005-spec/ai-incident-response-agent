const express = require("express");
const cors = require("cors");

const {
  getLogs,
  getDeploymentInfo,
  checkDatabase,
  rollbackDeployment,
  verifyIncident,
} = require("./tools/incidentTools");

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// AVAILABLE TOOLS
// ==========================================

const tools = {
  get_logs: getLogs,
  get_deployment_info: getDeploymentInfo,
  check_database: checkDatabase,
  rollback_deployment: rollbackDeployment,
  verify_incident: verifyIncident,
};

// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "AI Incident Agent API is running 🚀",
  });
});

// ==========================================
// INCIDENT INVESTIGATION AGENT
// ==========================================

app.post("/api/incident/investigate", async (req, res) => {
  try {
    const { incident } = req.body;

    if (!incident) {
      return res.status(400).json({
        error: "Incident description is required",
      });
    }

    // ==========================================
    // STEP 1: AI SELECTS TOOLS
    // ==========================================

    const ollamaResponse = await fetch(
      "http://localhost:11434/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2:3b",
          format: "json",

          messages: [
            {
              role: "system",
              content: `
You are an AI Incident Response Agent.

Available tools:

- get_logs
- get_deployment_info
- check_database

Choose the tools needed to investigate the incident.

Return ONLY JSON:

{
  "selected_tools": ["tool_name"]
}

Rules:
- Use only available tools.
- Select 1 to 3 tools.
- Do not explain anything.
              `,
            },
            {
              role: "user",
              content: `Incident: ${incident}`,
            },
          ],

          stream: false,

          options: {
            num_predict: 100,
          },
        }),
      }
    );

    if (!ollamaResponse.ok) {
      throw new Error(
        `Ollama error: ${ollamaResponse.status}`
      );
    }

    const aiData = await ollamaResponse.json();

    // ==========================================
    // PARSE TOOL SELECTION
    // ==========================================

    let agentDecision;

    try {
      agentDecision = JSON.parse(
        aiData.message.content
      );
    } catch (error) {
      console.error(
        "AI TOOL SELECTION RESPONSE:",
        aiData.message.content
      );

      throw new Error(
        "AI returned invalid tool selection"
      );
    }

    const selectedTools = agentDecision.selected_tools;

    if (
      !Array.isArray(selectedTools) ||
      selectedTools.length === 0
    ) {
      throw new Error(
        "AI did not select any tools"
      );
    }

    // ==========================================
    // STEP 2: EXECUTE TOOLS
    // ==========================================

    const toolResults = [];

    for (const toolName of selectedTools) {
      if (tools[toolName]) {
        const result = tools[toolName]();

        toolResults.push(result);
      }
    }

    // ==========================================
    // STEP 3: AI ANALYZES TOOL RESULTS
    // ==========================================

    const analysisResponse = await fetch(
      "http://localhost:11434/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          model: "llama3.2:3b",
          format: "json",

          messages: [
            {
              role: "system",
              content: `
You are an AI Incident Response Agent.

Analyze the incident using ONLY the provided tool results.

Return JSON with exactly these fields:

{
  "root_cause": "short explanation",
  "evidence": [
    "evidence 1",
    "evidence 2"
  ],
  "recommended_action": "short action",
  "severity": "high"
}

Rules:
- Do not invent facts.
- Keep it concise.
- Do not add extra fields.
              `,
            },

            {
              role: "user",
              content: `
Incident:
${incident}

Tool Results:
${JSON.stringify(toolResults)}
              `,
            },
          ],

          stream: false,

          options: {
            num_predict: 200,
          },
        }),
      }
    );

    if (!analysisResponse.ok) {
      throw new Error(
        `Ollama analysis error: ${analysisResponse.status}`
      );
    }

    const analysisData =
      await analysisResponse.json();

    // ==========================================
    // PARSE FINAL ANALYSIS
    // ==========================================

    let finalAnalysis;

    try {
      finalAnalysis = JSON.parse(
        analysisData.message.content
      );
    } catch (error) {
      console.error(
        "AI INCIDENT ANALYSIS RESPONSE:",
        analysisData.message.content
      );

      throw new Error(
        "AI returned invalid incident analysis"
      );
    }

    // ==========================================
    // FINAL RESPONSE
    // ==========================================

    res.json({
      incident,

      agent: {
        status: "investigation_complete",
        selectedTools,
      },

      toolResults,

      analysis: finalAnalysis,
    });

  } catch (error) {
    console.error("AGENT ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// ==========================================
// HUMAN APPROVAL + ACTION
// ==========================================

app.post("/api/incident/action", async (req, res) => {
  try {
    const { action, approved } = req.body;

    if (!action) {
      return res.status(400).json({
        error: "Action is required",
      });
    }

    if (!approved) {
      return res.json({
        status: "rejected",
        message: "Human approval was not provided",
      });
    }

    if (action === "rollback_deployment") {
      const result = rollbackDeployment();

      return res.json({
        status: "executed",
        action,
        result,
      });
    }

    return res.status(400).json({
      error: "Unknown action",
    });

  } catch (error) {
    console.error("ACTION ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// ==========================================
// INCIDENT VERIFICATION
// ==========================================

app.post("/api/incident/verify", async (req, res) => {
  try {
    const result = verifyIncident();

    res.json({
      status: "verification_complete",
      verification: result,
    });

  } catch (error) {
    console.error(
      "VERIFICATION ERROR:",
      error
    );

    res.status(500).json({
      error: error.message,
    });
  }
});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});
