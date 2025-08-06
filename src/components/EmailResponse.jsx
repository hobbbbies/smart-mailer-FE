import { useState } from 'react'
import { useUser } from '../contexts/UserContext'

const EmailResponse = ({ responseHistory, setResponseHistory, promptHistory, setPromptHistory, isVisible, onClose, serviceType, attachments, setAttachments, setFormData }) => {
  const [isSending, setIsSending] = useState(false);
  const [promptButtonLoading, setPromptButtonLoading] = useState(false);
  const [descriptionPrompt, setDescriptionPrompt] = useState('');
  const user = useUser();

  const email = responseHistory[responseHistory.length-1];

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      let endpoint = 'send-third-party'
      if (serviceType === 'Gmail') endpoint = 'send-gmail' 
      const formData = new FormData();
      // Replace sender with user.email for FormData
      const emailData = { ...email };
      console.log('sender: ', email.sender);
      for (const [key, value] of Object.entries(emailData)) {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      }
      if (attachments && attachments.length > 0) {
       [ ...attachments].map((file) => {
            formData.append(`attachments`, file);
        });
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/email/${endpoint}`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        setResponseHistory([]);
        setPromptHistory([]);
        setAttachments([]);
         // Reset form data but preserve tone
        setFormData(prev => ({
          sender: '',
          senderName: '',
          receiver: '',
          receiverName: '',
          subject: '',
          descriptionPrompt: '',
          tone: prev.tone,
        }));
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
    setPromptButtonLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/email/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descriptionPrompt,
          responseHistory: responseHistory,
          promptHistory: promptHistory,
        })
      });

      if (response.ok) {
        const data = await response.json()
        const newEmail = {...email, body: data.body};
        setResponseHistory(prev => [...prev, newEmail]) // Add new response to history
        setPromptHistory(prev => [...prev, descriptionPrompt]); // Add new prompt to history
        setDescriptionPrompt(''); // Clear input after successful update
      } else {
        alert('Failed to update email. Please try again.');
      }
    } catch (error) {
      console.error('Error updating email:', error);
      alert('An error occurred while updating the email.');
    } finally {
      setPromptButtonLoading(false);
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
            <p><strong>From:</strong> {user?.email || 'N/A'}</p>
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
                        const updatedEmail = {...email, body: e.target.value};
                        const newHistory = [...responseHistory];
                        newHistory[newHistory.length - 1] = updatedEmail;
                        setResponseHistory(newHistory);
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
            {(attachments && attachments.length > 0) && <div className='attachments'>Attachments:
             <ul>
              {[...attachments].map((file, index) => <li key={index}>{file.name}</li>)
              }</ul>
            </div>}
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
            <button type="submit" className='submit-btn followup-btn' disabled={promptButtonLoading}>
                {promptButtonLoading ? "Loading...": "Send Follow-up Query"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EmailResponse