import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Ensure the path is correct for your project structure
import { createUserWithEmailAndPassword } from 'firebase/auth';
import '../styles/index.css';
import '../App.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = (event) => setUsername(event.target.value);
    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Create a new user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User registered:', userCredential.user);
            
            alert('Registration successful!');
            navigate('/'); // Redirect to login page or home page after successful registration
        } catch (error) {
            console.error('Error during registration:', error.message);
            switch (error.code) {
                case 'auth/email-already-in-use':
                    alert('This email is already in use. Please use a different email.');
                    break;
                case 'auth/invalid-email':
                    alert('The email address is not valid.');
                    break;
                case 'auth/weak-password':
                    alert('The password is too weak. Please use a stronger password.');
                    break;
                default:
                    alert('Registration failed. Please try again.');
            }
        }
    };

    const goToLogin = () => {
        navigate('/'); // Navigate to the login page
    };

    return (
        <div className='body'>
             <div className='medpredict'>MEDPREDICT</div>
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h1>Register</h1>
                    <div className="input-box">
                        <input 
                            type="text" 
                            placeholder="Username" 
                            required 
                            value={username}
                            onChange={handleUsernameChange}
                        />
                    </div>
                    <div className="input-box">
                        <input 
                            type="email" 
                            placeholder="Email" 
                            required 
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div className="input-box">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            required 
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <button type="submit" className="btn">Register</button>

                    <div className="register-link">
                        <p>Already have an account? 
                            <button 
                                type="button" 
                                className="link_btn" onClick={goToLogin}> Go to Login</button>
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

export default Register;