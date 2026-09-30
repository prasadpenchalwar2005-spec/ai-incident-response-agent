import { useState } from "react";
import "./App.css";

function App() {
  const [incident, setIncident] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);
  const [verification, setVerification] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const investigateIncident = async () => {
    if (!incident.trim()) return;

    setLoading(true);
    setResult(null);
    setActionStatus(null);
    setVerification(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/incident/investigate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            incident,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Investigation failed");
      }

      setResult(data);
    } catch (error) {
      setResult({
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const approveAction = async () => {
    setActionStatus("executing");

    try {
      const response = await fetch(
        "http://localhost:5000/api/incident/action",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "rollback_deployment",
            approved: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Action failed");
      }

      setActionStatus(data);
    } catch (error) {
      setActionStatus({
        status: "error",
        message: error.message,
      });
    }
  };

  const verifyIncident = async () => {
    setVerifyLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/incident/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setVerification(data);
    } catch (error) {
      setVerification({
        status: "error",
        error: error.message,
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  const analysis = result?.analysis;
  const toolResults = result?.toolResults || [];
  const selectedTools = result?.agent?.selectedTools || [];

  return (
    <div className="app-shell">

      {/* Top Bar */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">IR</div>

          <div>
            <h1>Incident Response</h1>
            <span>AI-assisted operations</span>
          </div>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          System Online
        </div>
      </header>

      <main className="dashboard">

        {/* Page Heading */}
        <section className="page-heading">
          <div>
            <p className="eyebrow">PRODUCTION OPERATIONS</p>
            <h2>What's happening?</h2>
            <p className="subtitle">
              Describe the incident and let the agent investigate the issue.
            </p>
          </div>

          {result && !result.error && (
            <div className="investigation-status">
              <span className="status-dot"></span>
              Investigation complete
            </div>
          )}
        </section>

        {/* Incident Input */}
        <section className="incident-card">
          <div className="section-label">
            <span className="step-number">01</span>
            Report incident
          </div>

          <textarea
            value={incident}
            onChange={(e) => setIncident(e.target.value)}
            placeholder="Example: Payment API is returning 500 errors after the latest deployment..."
            rows={5}
          />

          <div className="input-footer">
            <span>
              {incident.length > 0
                ? `${incident.length} characters`
                : "Keep it short and specific"}
            </span>

            <button
              className="primary-button"
              onClick={investigateIncident}
              disabled={loading || !incident.trim()}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Investigating...
                </>
              ) : (
                <>
                  Investigate Incident
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Error */}
        {result?.error && (
          <div className="error-card">
            <strong>Investigation failed</strong>
            <span>{result.error}</span>
          </div>
        )}

        {/* Agent Investigation */}
        {result && !result.error && (
          <section className="investigation-section">

            <div className="section-header">
              <div>
                <p className="eyebrow">AGENT ACTIVITY</p>
                <h3>Investigation report</h3>
              </div>

              <span className="agent-badge">
                Agent completed
              </span>
            </div>

            {/* Tool Selection */}
            <div className="report-card">
              <div className="card-heading">
                <div>
                  <span className="card-kicker">TOOLS</span>
                  <h4>What the agent checked</h4>
                </div>

                <span className="tool-count">
                  {selectedTools.length} selected
                </span>
              </div>

              <div className="tool-list">
                {selectedTools.map((tool) => (
                  <div className="tool-item" key={tool}>
                    <span className="tool-check">✓</span>
                    <span>{tool.replaceAll("_", " ")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis */}
            {analysis && (
              <div className="report-card analysis-card">

                <div className="card-heading">
                  <div>
                    <span className="card-kicker">AI ANALYSIS</span>
                    <h4>What we know so far</h4>
                  </div>

                  <span
                    className={`severity ${
                      analysis.severity === "high"
                        ? "severity-high"
                        : "severity-normal"
                    }`}
                  >
                    {analysis.severity}
                  </span>
                </div>

                <div className="root-cause">
                  <span className="field-label">ROOT CAUSE</span>
                  <p>{analysis.root_cause}</p>
                </div>

                <div className="analysis-grid">

                  <div>
                    <span className="field-label">EVIDENCE</span>

                    <ul className="evidence-list">
                      {analysis.evidence?.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="field-label">
                      RECOMMENDED ACTION
                    </span>

                    <p className="recommended-action">
                      {analysis.recommended_action}
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* Tool Results */}
            {toolResults.length > 0 && (
              <details className="raw-data">
                <summary>
                  View investigation details
                </summary>

                <div className="raw-data-content">
                  {toolResults.map((tool, index) => (
                    <div key={index} className="tool-result">
                      <strong>{tool.tool}</strong>
                      <pre>
                        {JSON.stringify(tool, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </details>
            )}

            {/* Human Approval */}
            <div className="approval-card">

              <div className="approval-icon">!</div>

              <div className="approval-content">
                <span className="card-kicker">
                  HUMAN APPROVAL
                </span>

                <h4>Action requires your approval</h4>

                <p>
                  The agent recommends rolling back the latest
                  deployment to restore the previous stable version.
                </p>

                {!actionStatus && (
                  <button
                    className="approval-button"
                    onClick={approveAction}
                  >
                    Approve & Execute Rollback
                  </button>
                )}

                {actionStatus?.status === "executing" && (
                  <button
                    className="approval-button"
                    disabled
                  >
                    <span className="button-spinner"></span>
                    Executing rollback...
                  </button>
                )}

                {actionStatus?.status === "executed" && (
                  <div className="action-success">
                    <span>✓</span>

                    <div>
                      <strong>Rollback executed</strong>
                      <p>
                        Deployment rolled back to{" "}
                        {actionStatus.result?.rolledBackTo ||
                          "v2.4.0"}
                      </p>
                    </div>
                  </div>
                )}

                {actionStatus?.status === "error" && (
                  <div className="action-error">
                    {actionStatus.message}
                  </div>
                )}
              </div>
            </div>

            {/* Verification */}
            {actionStatus?.status === "executed" && (
              <div className="verification-card">

                <div className="section-header">
                  <div>
                    <p className="eyebrow">FINAL CHECK</p>
                    <h3>Verify the incident</h3>
                  </div>

                  {!verification && (
                    <button
                      className="secondary-button"
                      onClick={verifyIncident}
                      disabled={verifyLoading}
                    >
                      {verifyLoading
                        ? "Checking..."
                        : "Verify Incident"}
                    </button>
                  )}
                </div>

                {verification?.status ===
                  "verification_complete" && (
                  <div className="verification-result">

                    <div className="resolved-banner">
                      <div className="resolved-icon">✓</div>

                      <div>
                        <strong>Incident resolved</strong>
                        <p>
                          All monitored services are back to a
                          healthy state.
                        </p>
                      </div>
                    </div>

                    <div className="health-grid">

                      <div className="health-item">
                        <span>Payment API</span>
                        <strong>
                          {verification.verification?.checks
                            ?.paymentApi || "Healthy"}
                        </strong>
                      </div>

                      <div className="health-item">
                        <span>Error rate</span>
                        <strong>
                          {verification.verification?.checks
                            ?.errorRate || "Normal"}
                        </strong>
                      </div>

                      <div className="health-item">
                        <span>Database</span>
                        <strong>
                          {verification.verification?.checks
                            ?.databaseConnection || "Stable"}
                        </strong>
                      </div>

                    </div>
                  </div>
                )}

                {verification?.status === "error" && (
                  <div className="action-error">
                    {verification.error}
                  </div>
                )}
              </div>
            )}

          </section>
        )}

        {/* Empty State */}
        {!result && !loading && (
          <div className="empty-state">
            <div className="empty-icon">⌁</div>

            <h3>Ready when you are</h3>

            <p>
              Submit a production incident above to start an
              AI-assisted investigation.
            </p>
          </div>
        )}

      </main>

      <footer className="footer">
        <span>AI Incident Response Agent</span>
        <span>Local AI · Human controlled actions</span>
      </footer>
    </div>
  );
}

export default App;
