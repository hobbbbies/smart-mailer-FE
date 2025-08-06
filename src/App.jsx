import { useState, useEffect, useRef } from 'react'
import './App.css'
import EmailResponse from './components/EmailResponse'
import ToggleButtons from './components/ToggleButtons'
import { useSearchParams } from 'react-router-dom'
import Google from './components/Google/Google'
import AccountToggle from './components/AccountToggle'
import { UserProvider } from './contexts/UserContext'

function App() {
  const [formData, setFormData] = useState({
    sender: '',
    senderName: '',
    receiver: '',
    receiverName: '',
    subject: '',
    descriptionPrompt: '',
    tone: 'Professional',
  })
  const [attachments, setAttachments] = useState([]);
  const [serviceType, setServiceType] = useState('Gmail')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResponse, setShowResponse] = useState(false)
  const [responseHistory, setResponseHistory] = useState([]);
  const [promptHistory, setPromptHistory] = useState([]);
  const [user, setUser] = useState(null);

  const fileInputRef = useRef(null);
  
  const [searchParams] = useSearchParams();
  const id_token_params = searchParams.get('token');
  const denied = searchParams.get('denied');
  const [id_token, setId_token] = useState(null);

  useEffect(() => {
    if (id_token_params) {
      localStorage.setItem('id_token', id_token_params);
      setId_token(id_token_params);      
      // Clean up the URL by removing the token parameter
      const url = new URL(window.location);
      url.searchParams.delete('token');
      window.history.replaceState({}, '', url);
    } else {
      // Check if token exists in localStorage on initial load
      const storedToken = localStorage.getItem('id_token');
      if (storedToken) {
        setId_token(storedToken);
      }
    }
  }, [id_token_params]);

  // Gets user from JWT 
  useEffect(() => {
    const handleTokenValidation = async () => {
      if (id_token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/validate-token`, {
            headers: { Authorization: `Bearer ${id_token}` }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.id_token);
          }
        } catch (error) {
          console.error('Token validation error:', error);
          localStorage.removeItem('id_token');
        }
      }
    };    
    handleTokenValidation();
  }, [id_token]);

  useEffect(() => {
    if (showResponse) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showResponse]);

  // Reset file input when attachments change to allow adding more files
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [attachments]);

  const handleClose = () => {
    setShowResponse(false); 
    setPromptHistory([]);
    setResponseHistory([]);
  }

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData,
           sender: serviceType === 'Gmail' ?  user.email : formData.sender,
           senderName: serviceType === 'Gmail' ?  user.given_name : formData.senderName })
      })
      
      if (response.ok) {
        const result = await response.json()
        setResponseHistory(prev => [...prev, result.email]);
        setPromptHistory(prev => [...prev, formData.descriptionPrompt]);
        setShowResponse(true);
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

  // if (serviceType != 'Gmail') {
  //   return (
  //     <main>
  //       <div className='main-container'>
  //         <AccountToggle serviceType={serviceType} setServiceType={setServiceType}/>
  //         <div className='container'>
  //           <h2>Coming soon!</h2>
  //           <p>It's hard to find an SMPT provider that offers a good free tier... Difficult to justify 15$ a month unless I get real users.</p>
  //           <p>Until then, Enjoy the gmail service! I promise I'm not going to maliciously use your gmail credentials.</p>
  //         </div>
  //       </div>
  //     </main>
  //   )
  // }


  return (
    <UserProvider user={user}>
      <main>
        <div className="main-container">
          <AccountToggle serviceType={serviceType} setServiceType={setServiceType}/>
          <div className="container">
            {/* <button onClick={handleOauth}>Log In with google</button> */}
            {serviceType==="Gmail" ? <Google user={user} setUser={setUser} denied={denied} /> : <div><i>Emails will be sent through a third party domain</i></div>}
            <h1>Smart Mailer</h1>
            <form onSubmit={handleSubmit} className="email-form">
             {serviceType !== 'Gmail' && (
               <>
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
               </>
             )}
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
              <div className="form-group">
                <label htmlFor="attachments">Attachments (optional):</label>
                <input
                  type="file"
                  id="attachments"
                  name="attachments"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files);
                    setAttachments(prev => [...prev, ...newFiles]);
                  }}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  multiple
                />
                {attachments.length > 0 && (
                  <div className="selected-files">
                    <h4>Selected Files:</h4>
                    <ul>
                      {attachments.map((file, index) => (
                        <li key={index} className="file-item">
                          <span>{file.name} ({(file.size / 1024).toFixed(1)}KB)</span>
                          <button 
                            type="button" 
                            onClick={() => {
                              setAttachments(prev => prev.filter((_, i) => i !== index));
                            }}
                            className="remove-file-btn"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <ToggleButtons tone={formData.tone} handleChange={handleChange}/>
              <button
                type="submit"
                disabled={isSubmitting || (serviceType === 'Gmail' && !user)}
                className="submit-btn"
              >
                {user ? (isSubmitting ? 'Generating...' : 'Generate Email') :'Please log in first'}
              </button>
          </form>
          <EmailResponse
            responseHistory={responseHistory}
            setResponseHistory={setResponseHistory}
            promptHistory={promptHistory}
            setPromptHistory={setPromptHistory}
            isVisible={showResponse}
            onClose={handleClose}
            previousPrompt={formData.descriptionPrompt}
            serviceType={serviceType}
            attachments={attachments}
            setAttachments={setAttachments}
            setFormData={setFormData}
          />
        </div>
      </div>
    </main>
    </UserProvider>
  )
}

export default App
