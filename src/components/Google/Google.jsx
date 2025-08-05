export default function Google({ user, setUser, denied }) {

    const handleOAuth = () => {
        const id_token = localStorage.getItem('id_token');
        if (!id_token) {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth`;
        } else {
        console.log('User already logged in');
        }
    }

    const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('id_token');
    }

    return (
        <div className="google">
          {!user && <button onClick={handleOAuth}>Sign in with Google</button>}
          {denied && <span className="warning">User didn't allow send email permissions; App won't work. Please sign in again.</span>}
          {user && < div className='user-info'>
            <button onClick={handleLogout}>Log Out</button>
            <div>Logged in as: <b>{user.email}</b></div>
            <div className='warning'>NOTE: Emails will be sent on your behalf</div>
          </div>}
        </div>
    )
}