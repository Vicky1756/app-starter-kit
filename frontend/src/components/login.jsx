import { useState } from 'react';
import mountainImg from '../assets/mountain_login.jpg';
import signupImg from '../assets/signup.jpg';

export default function Login({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    if (!isOpen) return null;

    const toggleAuth = (e) => {
        e.preventDefault();
        setIsLogin(!isLogin);
        // Clear fields on switch
        setEmail('');
        setPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLogin && (!firstName || !lastName)) {
            alert("Please enter both your first and last name.");
            return;
        }
        setIsLoading(true);
        
        const payload = isLogin 
        ? { email: email.toLowerCase(), password } 
        : { 
            name: `${firstName.trim()} ${lastName.trim()}`,
            email: email.toLowerCase(), 
            password 
          };
        const endpoint = isLogin ? '/login' : '/register';
      
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include',
            });
            
            const result = await response.json();
            if (response.ok) {
                if (!isLogin) {
                    setIsLogin(true);
                    setEmail('');
                    setPassword('');
                    setFirstName('');
                    setLastName('');
                    alert("Account created! Please sign in with your details.");
                } else {
                    if (result.access_token) {
                        localStorage.setItem('token', result.access_token);
                    }
                    onClose();
                }
            }else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Connection Error:", error);
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Container: This is where the side-switch happens! */}
            <div className={`relative bg-white flex w-full max-w-4xl h-[650px] rounded-[1rem] overflow-hidden shadow-2xl transition-all duration-700 ease-in-out ${
                isLogin ? 'flex-row' : 'flex-row-reverse'
            }`}>
                
                {/* 1. The Image Side */}
                <div className="hidden md:block w-1/2 relative">
                    <img 
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" 
                        src={isLogin 
                            ? mountainImg
                            : signupImg
                        } 
                        alt="Auth sidebar" 
                    />
                    {/* <div className="absolute inset-0 bg-black/10 flex items-end p-12">
                        <p className="text-white text-2xl font-light">
                            {isLogin ? "Welcome back to the gym!" : "Start your journey today."}
                        </p>
                    </div> */}
                </div>

                {/* 2. The Form Side */}
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-12 bg-white">
                    <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col items-center">
                        <h2 className="text-4xl text-gray-900 font-semibold tracking-tight">
                            {isLogin ? 'Sign in' : 'Create Account'}
                        </h2>
                        
                        {/* Conditional Inputs for Sign Up */}
                        {!isLogin && (
                            <div className="flex gap-3 w-full mt-8 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center border border-gray-200 h-12 rounded-full px-5 w-1/2 focus-within:border-indigo-500">
                                    <input 
                                        placeholder="First Name" 
                                        className="bg-transparent text-sm w-full outline-none"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="flex items-center border border-gray-200 h-12 rounded-full px-5 w-1/2 focus-within:border-indigo-500">
                                    <input 
                                        placeholder="Last Name" 
                                        className="bg-transparent text-sm w-full outline-none"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>
                        )}

                        {/* Standard Inputs (Email/Password) */}
                        <div className={`w-full space-y-4 ${isLogin ? 'mt-8' : 'mt-4'}`}>
                            <div className="flex items-center border border-gray-200 h-12 rounded-full px-5 focus-within:border-indigo-500">
                                <input 
                                    type="email" 
                                    placeholder="Email address" 
                                    className="bg-transparent text-sm w-full outline-none" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="flex items-center border border-gray-200 h-12 rounded-full px-5 focus-within:border-indigo-500">
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    className="bg-transparent text-sm w-full outline-none" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading} // Prevents double-clicks
                            className={`mt-8 w-full h-12 rounded-full text-white font-medium transition-all active:scale-[0.98] shadow-lg ${
                                isLoading 
                                    ? 'bg-indigo-400 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                            }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        {/* Simple SVG Spinner Circle */}
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                isLogin ? 'Login' : 'Join Now'
                            )}
                        </button>

                        <p className="text-gray-400 text-sm mt-8">
                            {isLogin ? "Don’t have an account?" : "Already a member?"}{" "}
                            <button 
                                onClick={toggleAuth}
                                className="text-indigo-600 font-semibold hover:underline"
                            >
                                {isLogin ? 'Sign up' : 'Login'}
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

        // <div className="flex h-[700px] w-full">
        //     <div className="w-full hidden md:inline-block">
        //         <img className="h-full" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png" alt="leftSideImage" />
        //     </div>
        
        //     <div className="w-full flex flex-col items-center justify-center">
        //         <form onSubmit={handleSubmit} className="md:w-96 w-80 flex flex-col items-center justify-center">
        //             <h2 className="text-4xl text-gray-900 font-medium">Sign in</h2>
        //             <p className="text-sm text-gray-500/90 mt-3">Welcome back! Please sign in to continue</p>
        
        //             <button type="button" className="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full">
        //                 <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg" alt="googleLogo" />
        //             </button>
        
        //             <div className="flex items-center gap-4 w-full my-5">
        //                 <div className="w-full h-px bg-gray-300/90"></div>
        //                 <p className="w-full text-nowrap text-sm text-gray-500/90 text-center">or sign in with email</p>
        //                 <div className="w-full h-px bg-gray-300/90"></div>
        //             </div>
        
        //             <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
        //                 {/* Email SVG ... */}
        //                 <input 
        //                     type="email" 
        //                     placeholder="Email id" 
        //                     className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full" 
        //                     required 
        //                     value={email}
        //                     onChange={(e) => setEmail(e.target.value)}
        //                 />                 
        //             </div>
        
        //             <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
        //                 {/* Password SVG ... */}
        //                 <input 
        //                     type="password" 
        //                     placeholder="Password" 
        //                     className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full" 
        //                     required 
        //                     value={password}
        //                     onChange={(e) => setPassword(e.target.value)}
        //                 />
        //             </div>
        
        //             <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
        //                 <div className="flex items-center gap-2">
        //                     <input className="h-5" type="checkbox" id="checkbox" />
        //                     <label className="text-sm" htmlFor="checkbox">Remember me</label>
        //                 </div>
        //                 <a className="text-sm underline" href="#">Forgot password?</a>
        //             </div>
        
        //             <button 
        //                 type="submit" 
        //                 disabled={isLoading}
        //                 className={`mt-8 w-full h-11 rounded-full text-white bg-indigo-500 transition-all ${
        //                     isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
        //                 }`}
        //             >
        //                 {isLoading ? 'Signing in...' : 'Login'}
        //             </button>

        //             <p className="text-gray-500/90 text-sm mt-4">Don’t have an account? <a className="text-indigo-400 hover:underline" href="#">Sign up</a></p>
        //         </form>
        //     </div>
        // </div>
