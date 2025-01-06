import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/index.css';
import '../App.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 

    const handleLogin = async (event) => {
        event.preventDefault();
        if (!email || !password) {
            alert("Both email and password are required."); // Display alert instead of just logging
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in user:", userCredential.user);
            navigate('/chat'); // Redirect on successful login
        } catch (error) {
            console.error("Error logging in with email and password:", error.message);
            alert(`Login failed: ${error.message}`); // Provide user feedback on error
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("Logged in with Google:", result.user);
            navigate('/chat'); // Redirect on successful login
        } catch (error) {
            console.error("Error logging in with Google:", error.message);
            alert(`Google Sign-In failed: ${error.message}`); // Provide user feedback on error
        }
    };

    const goToRegister = () => {
        navigate('/register'); // Navigation to the Register page
    };

    const goToForgotPassword = () => {
        navigate('/forgot-password'); // Navigation to the Forgot Password page
    };

    return (
        <div className='body'>
            <div className='medpredict'>MEDPREDICT</div>
        <div className="wrapper">
            <form onSubmit={handleLogin}>
                <h1>Login</h1>
                <div className="input-box">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        required 
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                    />
                    <i className='bx bxs-user'></i>
                </div>
                <div className="input-box">
                    <input 
                        type="password" 
                        placeholder="Password" 
                        required 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                    />
                    <i className='bx bxs-lock-alt'></i>
                </div>
                <div className="remember-forget">
                    <label><input type="checkbox" /> Remember me</label>
                    <button 
                        type="button" 
                        className="link_btn" 
                        onClick={goToForgotPassword}
                    >Forgot password?</button>
                </div>

                <button type="submit" className="btn">Login</button>

                <div className="divider">
                    <hr className="left" /><span>or</span><hr className="right" />
                </div>

                <button 
                    type="button" 
                    className="btn google-btn" 
                    onClick={handleGoogleSignIn}
                >Login with Google+</button>
                
                <div className="register-link">
                    <p> Don't have an account?
                        <button 
                            type="button" 
                            className="link_btn" 
                            onClick={goToRegister}
                        > Register</button>
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

export default Login;

