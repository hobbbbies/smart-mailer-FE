import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", lineHeight: 1.6, backgroundColor: "white" }}>
      <h1>Privacy Policy</h1>
      <p style={{ marginBottom: "1rem" }}>
        <Link to="/">← Home</Link>
      </p>
      <p><strong>Effective Date:</strong> August 14, 2025</p>

      <p>
        Smart Mailer (“I”, “me”, “my”) respects your privacy. This Privacy Policy
        explains how I collect, use, and protect your information when you use
        the Smart Mailer web app.
      </p>

      <h2>1. Information I Collect</h2>
      <p>When you sign in with Google OAuth, Smart Mailer requests the following permissions:</p>
      <ul>
        <li>
          <code>https://www.googleapis.com/auth/gmail.send</code> — Allows Smart Mailer to send emails on your behalf.
        </li>
        <li>
          <code>openid</code>, <code>profile</code>, <code>email</code> — Provides your Google account ID, name, and email address.
        </li>
      </ul>
      <p>
        No other Gmail access is requested. Smart Mailer does not read, store, or
        access the content of your emails.
      </p>

      <h2>2. How I Use Your Information</h2>
      <ul>
        <li>Authenticate you into Smart Mailer.</li>
        <li>Display your name and email address in the app interface.</li>
        <li>Send emails that you explicitly request Smart Mailer to send.</li>
      </ul>

      <h2>3. Data Storage and Security</h2>
      <ul>
        <li>Smart Mailer stores only the data necessary to operate the service.</li>
        <li>No Gmail content is permanently stored on my servers.</li>
        <li>I use industry-standard encryption and security practices to protect your data.</li>
      </ul>

      <h2>4. Third-Party Sharing</h2>
      <ul>
        <li>I do not sell or rent your personal information.</li>
        <li>
          I may share your data with service providers that help operate the app
          (e.g., hosting, email sending infrastructure) under strict confidentiality agreements.
        </li>
      </ul>

      <h2>5. Revoking Access</h2>
      <p>
        You may revoke Smart Mailer’s access to your Google account at any time:{" "}
        <a
          href="https://myaccount.google.com/permissions"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Account Security Settings
        </a>
      </p>

      <h2>6. Your Rights</h2>
      <p>
        You may request deletion of any stored account data by contacting me at{" "}
        <a href="mailto:stefankvitanov@gmail.com">stefankvitanov@gmail.com</a>.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        I may update this Privacy Policy from time to time. Updates will be
        posted here with a new Effective Date.
      </p>

      <h2>Contact</h2>
      <p>
        If you have any questions about this Privacy Policy, please email me at{" "}
        <a href="mailto:stefankvitanov@gmail.com">stefankvitanov@gmail.com</a>.
      </p>
    </main>
  );
}
