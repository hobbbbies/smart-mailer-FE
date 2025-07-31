import { useState, useEffect } from 'react'

const EmailResponse = ({ email, isVisible, onClose }) => {
  const [emailContent, setEmailContent] = useState(email?.body || '');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setEmailContent(email?.body);
  }, [email])

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: email.sender,
          receiver: email.receiver,
          subject: email.subject,
          body: emailContent
        })
      });

      if (response.ok) {
        alert('Email sent successfully!');
        onClose(); // Close the email response component
      } else {
        alert('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('An error occurred while sending the email.');
    } finally {
      setIsSending(false);
    }
  }

  console.log("Email Content: ", emailContent);
  console.log("Email Body: ", email?.body)
  if (!isVisible || !email) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="email-response" onClick={(e) => e.stopPropagation()}>
        <div className="response-header">
          <h2>Generated Email</h2>
          <button 
            type="button" 
            onClick={onClose}
            className="close-btn"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="email-preview">
          <div className="email-meta">
            <p><strong>From:</strong> {email.sender || 'N/A'}</p>
            <p><strong>To:</strong> {email.receiver || 'N/A'}</p>
            <p><strong>Subject:</strong> {email.subject || 'N/A'}</p>
          </div>
          <div className="email-content">
            <h3>Email Content:</h3>
            <div className="content-body">
              {email.body ? (
                <form onSubmit={handleSendEmail}>
                    <textarea 
                      value={emailContent}
                      onChange={(e) => {
                        setEmailContent(e.target.value);
                      }}
                    ></textarea>
                    <button type="submit" className="submit-btn" disabled={isSending}>
                      {isSending ? 'Sending...' : 'Send Email'}
                    </button>
                </form>
              ) : (
                <p>No email content available</p>
              )}
            </div>
          </div>
        </div>
        <div className="followup-section">
          <h3>Follow-up Query</h3>
          <form className="followup-form">
            <div className="form-group">
              <label htmlFor='prompt'>Additional Instructions:</label>
              <input 
                type="text"
                value="Make it sound more casual..." 
                name="descriptionPrompt" 
                id="prompt"
                placeholder="e.g., Make it more formal, add urgency, shorter..."
              />
            </div>
            <button type="submit" className='submit-btn followup-btn'>Send Follow-up Query</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EmailResponse
