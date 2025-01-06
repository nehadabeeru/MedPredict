import React, { useState } from 'react';
import { auth } from '../firebase'; // Ensure this path is correct for your project structure
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/index.css';
import '../App.css';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (event) => setEmail(event.target.value);

    const goToLogin = () => {
        navigate('/'); // Navigate to the login page
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email) {
            alert("Please enter your email.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            alert('Password reset link has been sent to your email.');
            navigate('/login'); // Redirect to the login page or another page after successful submission
        } catch (error) {
            console.error('Error sending password reset email:', error.message);
            switch (error.code) {
                case 'auth/user-not-found':
                    alert('No user found with this email.');
                    break;
                case 'auth/invalid-email':
                    alert('The email address is not valid.');
                    break;
                default:
                    alert('Failed to send reset link. Please try again.');
            }
        }
    };

    return (
        <div className='body'>
            <div className='medpredict'>MEDPREDICT</div>
        <div className="wrapper">
            <form onSubmit={handleSubmit}>
                <h1>Reset Password</h1>
                <div className="input-box">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        required 
                        value={email}
                        onChange={handleEmailChange}
                    />
                </div>
                <button type="submit" className="btn">Send Reset Link</button>

                <div className="register-link">
                    <p>Already have an account? 
                        <button type="button" className="link_btn" onClick={goToLogin}> Go to Login</button>
                    </p>
                </div>
            </form>
        </div>
        <footer className='fixed-footer'>
            <p>&copy; 2024 MedPredict. All rights reserved.</p>
        </footer>
        </div>
    );
};

export default ForgotPassword;