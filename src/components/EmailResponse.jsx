import { useState, useEffect } from 'react'

const EmailResponse = ({ messageHistory, setMessageHistory, isVisible, onClose, previousPrompt }) => {
  const [isSending, setIsSending] = useState(false);
  const [descriptionPrompt, setDescriptionPrompt] = useState('');
  const [email, setEmail] = useState(null);

  useEffect(() => {
    if (messageHistory && messageHistory.length > 0) {
      setEmail(messageHistory[messageHistory.length - 1]); // Newest generatedEmail
    }
  }, [messageHistory])

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
          senderName: email.senderName,
          receiver: email.receiver,
          subject: email.subject,
          body: email.body
        })
      });

      if (response.ok) {
        setMessageHistory([]);
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

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/email/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descriptionPrompt,
          responseHistory: messageHistory,
          previousPrompt
        })
      });

      if (response.ok) {
        const data = await response.json()
        setEmail({...email, body: data.body});
        setDescriptionPrompt(''); // Clear input after successful update
      } else {
        alert('Failed to update email. Please try again.');
      }
    } catch (error) {
      console.error('Error updating email:', error);
      alert('An error occurred while updating the email.');
    } finally {
      setIsSending(false);
    }
  }


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
                      value={email.body}
                      onChange={(e) => {
                        setEmail({...email, body: e.target.value});
                      }}
                    ></textarea>
                    <button type="submit" className="submit-btn" disabled={isSending}>
                      {isSending ? 'Loading...' : 'Send Email'}
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
          <form className="followup-form" onSubmit={handleUpdateEmail}>
            <div className="form-group">
              <label htmlFor='prompt'>Additional Instructions:</label>
              <input 
                type="text"
                value={descriptionPrompt}
                name="descriptionPrompt" 
                id="prompt"
                placeholder="e.g., Make it more formal, add urgency, shorter..."
                onChange={(e) => {
                    setDescriptionPrompt(e.target.value);
                }}
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
