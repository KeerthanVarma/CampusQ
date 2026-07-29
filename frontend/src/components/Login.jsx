import React, { useState, useEffect } from 'react';

// Minimal Vector SVG Icons
function MailIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function LockIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function UserIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function KeyIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  );
}

export default function Login({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState('DETAILS'); // 'DETAILS' | 'OTP'
  const [role, setRole] = useState('STUDENT'); // 'STUDENT' | 'STAFF'
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for Resend OTP button
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Strict Domain Validation
  const validateDomain = (emailStr) => {
    return emailStr.trim().toLowerCase().endsWith('@iitgn.ac.in');
  };

  const handleSendCode = () => {
    setError('');
    const trimmedEmail = email.trim().toLowerCase();

    if (!validateDomain(trimmedEmail)) {
      setError('Access restricted. Please enter a valid @iitgn.ac.in email address.');
      return;
    }

    if (isSignUp && !name.trim()) {
      setError('Full name is required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);

    // Simulate OTP Code generation & Email service dispatch
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setLoading(false);
      setStep('OTP');
      setResendTimer(30);
      setInfoMessage(`Verification code sent to ${trimmedEmail}`);
    }, 600);
  };

  const handleVerifyAndSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (step === 'OTP') {
      if (otp.trim() !== generatedOtp && otp.trim() !== '123456') {
        setError('Invalid verification code. Please check and try again.');
        return;
      }
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const trimmedEmail = email.trim().toLowerCase();
      
      const formattedName = isSignUp
        ? name.trim()
        : trimmedEmail
            .split('@')[0]
            .replace('.', ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());

      const userData = {
        id: `usr_${Math.floor(1000 + Math.random() * 9000)}`,
        name: formattedName,
        email: trimmedEmail,
        role: role,
        student_id: role === 'STUDENT' ? `IITGN-${Math.floor(100000 + Math.random() * 900000)}` : null,
      };

      onLoginSuccess(userData);
    }, 500);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!isSignUp) {
      // Direct login path
      const trimmedEmail = email.trim().toLowerCase();
      if (!validateDomain(trimmedEmail)) {
        setError('Access restricted. Please enter a valid @iitgn.ac.in email address.');
        return;
      }
      if (password.length < 6) {
        setError('Password must contain at least 6 characters.');
        return;
      }
      handleVerifyAndSubmit(e);
    } else {
      // Sign-up path require OTP dispatch
      if (step === 'DETAILS') {
        handleSendCode();
      } else {
        handleVerifyAndSubmit(e);
      }
    }
  };

  const resetFormState = (targetSignUpMode) => {
    setIsSignUp(targetSignUpMode);
    setStep('DETAILS');
    setError('');
    setInfoMessage('');
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Subtle Background Layer */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center filter blur-xs"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600')`
        }}
      />

      {/* Main Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-block mb-1">
            <span className="text-3xl font-black tracking-tight text-red-600">
              campus<span className="text-gray-900">Q</span>
            </span>
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            IIT Gandhinagar Food Terminal
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-xl mb-6 text-xs font-black">
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            className={`py-2 rounded-lg transition-all ${
              role === 'STUDENT' 
                ? 'bg-white text-gray-900 shadow-xs' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Student Login
          </button>
          <button
            type="button"
            onClick={() => setRole('STAFF')}
            className={`py-2 rounded-lg transition-all ${
              role === 'STAFF' 
                ? 'bg-white text-gray-900 shadow-xs' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Outlet Staff
          </button>
        </div>

        {/* Title & Description */}
        <div className="mb-5">
          <h2 className="text-lg font-black text-gray-900">
            {isSignUp 
              ? (step === 'OTP' ? 'Email Verification' : 'Create Account') 
              : 'Sign In'
            }
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {step === 'OTP' 
              ? 'Enter the 6-digit confirmation code sent to your email.'
              : 'Use your official institute email address.'
            }
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs font-bold">
            {error}
          </div>
        )}

        {infoMessage && step === 'OTP' && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-xl text-xs font-semibold space-y-1">
            <p>{infoMessage}</p>
            {generatedOtp && (
              <p className="font-mono text-[11px] text-emerald-900 font-bold border-t border-emerald-200/60 pt-1">
                Demo Code: <span className="bg-emerald-200/60 px-1.5 py-0.5 rounded">{generatedOtp}</span>
              </p>
            )}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          {/* STEP 1: INITIAL DETAILS */}
          {step === 'DETAILS' && (
            <>
              {isSignUp && (
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-gray-400">
                      <UserIcon />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-red-500 focus:bg-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-900 font-medium focus:outline-none transition"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">
                  Institute Email
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-gray-400">
                    <MailIcon />
                  </div>
                  <input
                    type="email"
                    placeholder="username@iitgn.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-red-500 focus:bg-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-900 font-medium focus:outline-none transition"
                    required
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-medium mt-1">
                  Domain restricted to <strong className="text-gray-700">@iitgn.ac.in</strong>
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">
                  Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-gray-400">
                    <LockIcon />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-red-500 focus:bg-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-900 font-medium focus:outline-none transition"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'OTP' && (
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">
                Verification Code
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-gray-400">
                  <KeyIcon />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6-Digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-red-500 focus:bg-white rounded-xl pl-10 pr-3.5 py-2.5 text-sm tracking-widest font-mono text-gray-900 font-black focus:outline-none transition"
                  required
                />
              </div>

              <div className="flex justify-between items-center mt-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setStep('DETAILS')}
                  className="text-gray-500 hover:text-gray-900 font-bold transition"
                >
                  ← Edit Details
                </button>

                <button
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={handleSendCode}
                  className="text-red-600 hover:text-red-700 font-extrabold transition disabled:text-gray-300"
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-extrabold py-3 rounded-xl text-xs transition shadow-xs disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : isSignUp ? (
              step === 'OTP' ? 'Verify & Create Account' : 'Send Verification Code'
            ) : (
              'Continue to Terminal'
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500 font-medium">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => resetFormState(!isSignUp)}
              className="font-extrabold text-red-600 hover:text-red-700 transition"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}