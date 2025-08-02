export default function Google({ user }) {

    const handleOAuth = () => {
        const id_token = localStorage.getItem('id_token');
        if (!id_token) {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth`;
        } else {
        console.log('User already logged in');
        }
    }

    return (
        <div className="google">
          {!user && <button onClick={handleOAuth}>Sign in with Google</button>}
          {user && < div className='user-info'>
            Logged in as: <b>{user.email}</b>
            <div className='warning'>NOTE: Emails will be sent on your behalf</div>
          </div>}
        </div>
    )
}