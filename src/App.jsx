import { useState } from 'react'
import './App.css'
import EmailResponse from './components/EmailResponse'

function App() {
  const [formData, setFormData] = useState({
    sender: '',
    senderName: '',
    receiver: '',
    receiverName: '',
    subject: '',
    descriptionPrompt: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedEmail, setGeneratedEmail] = useState(null)
  const [showResponse, setShowResponse] = useState(false)
  const [messageHistory, setMessageHistory] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Replace with your actual backend endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        const result = await response.json()
        setGeneratedEmail(result.email);
        setMessageHistory(prev => [...prev, result.email]);
        setShowResponse(true);
        setFormData({
          sender: '',
          senderName: '',
          receiver: '',
          receiverName: '',
          subject: '',
          descriptionPrompt: ''
        })
      } else {
        alert('Failed to send email. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <div className="container">
        <h1>Smart Mailer</h1>
        <form onSubmit={handleSubmit} className="email-form">
          <div className="form-group">
            <label htmlFor="sender">From (Email):</label>
            <input
              type="email"
              id="sender"
              name="sender"
              value={formData.sender}
              onChange={handleChange}
              required
              placeholder="your-email@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="senderName">From (Name):</label>
            <input
              type="text"
              id="senderName"
              name="senderName"
              value={formData.senderName}
              onChange={handleChange}
              required
              placeholder="Your Name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="receiver">To (Email):</label>
            <input
              type="email"
              id="receiver"
              name="receiver"
              value={formData.receiver}
              onChange={handleChange}
              required
              placeholder="recipient@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="receiverName">To (Name):</label>
            <input
              type="text"
              id="receiverName"
              name="receiverName"
              value={formData.receiverName}
              onChange={handleChange}
              required
              placeholder="Recipient Name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Enter email subject"
            />
          </div>

          <div className="form-group">
            <label htmlFor="descriptionPrompt">AI Description Prompt:</label>
            <textarea
              id="descriptionPrompt"
              name="descriptionPrompt"
              value={formData.descriptionPrompt}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe what you want the AI to write about..."
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? 'Generating...' : 'Generate Email'}
          </button>
        </form>

        <EmailResponse 
          messageHistory={messageHistory}
          setMessageHistory={setMessageHistory}
          isVisible={showResponse}
          onClose={() => setShowResponse(false)}
          previousPrompt={formData.descriptionPrompt}
        />
      </div>
    </main>
  )
}

export default App
