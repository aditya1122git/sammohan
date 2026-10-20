import React, { useState, useEffect } from 'react';
import { X, Lock, User as UserIcon, Shield, Eye, EyeOff, RefreshCw, KeyRound, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  language: 'hi' | 'en';
}

type AuthMode = 'login' | 'forgot' | 'reset';

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  language
}) => {
  const [mode, setMode] = useState<AuthMode>('login');

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaId, setCaptchaId] = useState('');
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [generatedResetToken, setGeneratedResetToken] = useState<string | null>(null);

  // Reset password state
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status & feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCaptcha();
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  const loadCaptcha = async () => {
    setCaptchaLoading(true);
    try {
      const res = await api.getCaptcha();
      setCaptchaId(res.captchaId);
      setCaptchaSvg(res.svgDataUrl);
      setCaptchaInput('');
    } catch (e: any) {
      console.error('Failed to load CAPTCHA:', e);
    } finally {
      setCaptchaLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!identifier.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया यूजर आईडी या ईमेल दर्ज करें।' : 'Please enter User ID or Email.');
      return;
    }
    if (!password) {
      setErrorMsg(language === 'hi' ? 'कृपया पासवर्ड दर्ज करें।' : 'Please enter your password.');
      return;
    }
    if (!captchaInput.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया प्रदर्शित सुरक्षा कोड (CAPTCHA) दर्ज करें।' : 'Please enter the CAPTCHA security code.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login({
        username: identifier.trim(),
        email: identifier.trim(),
        password,
        captchaId,
        captchaCode: captchaInput.trim().toUpperCase()
      });
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || (language === 'hi' ? 'लॉगिन असफल रहा।' : 'Authentication failed. Please verify credentials.'));
      // Refresh captcha on failure
      loadCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!forgotEmail.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया अपना पंजीकृत ईमेल दर्ज करें।' : 'Please enter your registered email.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.forgotPassword(forgotEmail.trim());
      setSuccessMsg(res.message);
      if (res.resetToken) {
        setGeneratedResetToken(res.resetToken);
        setResetToken(res.resetToken);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to initiate password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!resetToken.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया रीसेट टोकन दर्ज करें।' : 'Please enter the reset token.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg(language === 'hi' ? 'नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg(language === 'hi' ? 'दोनों पासवर्ड मेल नहीं खाते हैं।' : 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.resetPassword(resetToken.trim(), newPassword);
      setSuccessMsg(res.message);
      setTimeout(() => {
        setMode('login');
        setPassword('');
        setSuccessMsg(language === 'hi' ? 'पासवर्ड सफलतापूर्वक बदल गया! कृपया नए पासवर्ड से लॉगिन करें।' : 'Password updated successfully! Please sign in with your new password.');
        loadCaptcha();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-gray-100 animate-scaleUp my-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition shadow-sm"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[540px]">
          {/* Left Column: Reference-Inspired Quote & Identity Panel */}
          <div className="md:col-span-5 bg-gradient-to-br from-[#0f2d57] via-[#163c6f] to-[#1C4D8D] text-white p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Background Decorative Rings */}
            <div className="absolute -top-16 -left-16 w-52 h-52 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Top Identity */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-300 mb-5 border border-white/10">
                <Shield className="w-3.5 h-3.5" />
                <span>Authorized Official Access</span>
              </div>

              {/* CM Samrat Choudhary Circular Photo */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/assets/Web_Images/cm_samrat_choudhary_portrait.png"
                  alt="CM Samrat Choudhary"
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md ring-2 ring-white/20"
                />
                <div>
                  <div className="text-xs font-bold text-amber-300">
                    {language === 'hi' ? 'श्री सम्राट चौधरी' : 'Shri Samrat Choudhary'}
                  </div>
                  <div className="text-[11px] text-blue-200 font-medium">
                    {language === 'hi' ? 'माननीय मुख्यमंत्री' : 'Hon’ble Chief Minister'}
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-black tracking-tight leading-snug">
                सम्मोहन &bull; Sammohana
              </h2>
              <p className="text-sm text-blue-200 mt-1 font-medium">
                Announcement & Project Tracking Dashboard
              </p>
              <p className="text-xs text-amber-300 font-semibold mt-1 italic">
                &ldquo;घोषणा से क्रियान्वयन, पारदर्शिता के साथ प्रमाण।&rdquo;
              </p>

              <div className="mt-6 pt-6 border-t border-white/10 text-xs text-blue-100/90 leading-relaxed space-y-3">
                <p className="italic">
                  &ldquo;Integrated monitoring dashboard tracking official announcements, project milestones, financial outlays, and delivery status across all 38 districts of Bihar.&rdquo;
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-[11px] text-blue-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Role-Based Multi-Tier Permissions</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-blue-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>11-Field Comprehensive Audit Trail</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-blue-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>District & Department Real-time Tracking</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Security Note */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 text-[11px] text-blue-300">
              <div>Government of Bihar &bull; Sammohana Portal</div>
              <div className="text-[10px] text-blue-300/70 mt-0.5">&copy; {new Date().getFullYear()} Government of Bihar. All Rights Reserved</div>
            </div>
          </div>

          {/* Right Column: Authentication Form Panel */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white">
            <div>
              {/* Form Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-[#1C4D8D] font-bold text-lg">
                  <KeyRound className="w-5 h-5 text-[#C35504]" />
                  <span>
                    {mode === 'login'
                      ? (language === 'hi' ? 'अधिकारी लॉगिन' : 'Official Portal Login')
                      : mode === 'forgot'
                      ? (language === 'hi' ? 'पासवर्ड पुनर्प्राप्ति' : 'Reset Password Request')
                      : (language === 'hi' ? 'नया पासवर्ड सेट करें' : 'Set New Password')}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {mode === 'login'
                    ? (language === 'hi' ? 'कृपया अपने अधिकृत क्रेडेंशियल्स और सुरक्षा कोड दर्ज करें।' : 'Enter your registered credentials and the CAPTCHA anti-bot verification code.')
                    : mode === 'forgot'
                    ? (language === 'hi' ? 'पासवर्ड रीसेट टोकन प्राप्त करने के लिए अपना आधिकारिक ईमेल दर्ज करें।' : 'Enter your registered official email to generate a password reset authorization token.')
                    : (language === 'hi' ? 'जारी किए गए रीसेट टोकन के साथ अपना नया पासवर्ड दर्ज करें।' : 'Enter your reset token alongside your new confidential password.')}
                </p>
              </div>

              {/* Alerts */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs mb-4 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-xl text-xs mb-4 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{successMsg}</span>
                </div>
              )}

              {/* --- MODE 1: LOGIN FORM --- */}
              {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4 text-xs">
                  {/* User ID / Username / Email */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      {language === 'hi' ? 'यूजर आईडी / ईमेल' : 'User ID / Official Email'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="admin@assembly.bihar.gov or admin"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1C4D8D] text-gray-900 bg-gray-50/50 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* Password with Show/Hide */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-gray-700">
                        {language === 'hi' ? 'पासवर्ड' : 'Password'} <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setErrorMsg(null);
                          setSuccessMsg(null);
                        }}
                        className="text-[#1C4D8D] hover:underline text-[11px] font-semibold"
                      >
                        {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1C4D8D] text-gray-900 bg-gray-50/50 focus:bg-white transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        title={showPassword ? 'Hide Password' : 'Show Password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* CAPTCHA anti-bot mechanism */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      {language === 'hi' ? 'सुरक्षा कोड (CAPTCHA)' : 'Security Anti-Bot CAPTCHA'} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center h-11 w-44 shadow-inner flex-shrink-0">
                        {captchaLoading ? (
                          <div className="text-[11px] text-gray-400">Loading...</div>
                        ) : captchaSvg ? (
                          <img src={captchaSvg} alt="CAPTCHA" className="h-full w-full object-cover select-none" />
                        ) : (
                          <div className="text-[11px] text-gray-400">No CAPTCHA</div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={loadCaptcha}
                        disabled={captchaLoading}
                        className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-600 transition disabled:opacity-50 flex-shrink-0"
                        title="Refresh CAPTCHA Code"
                      >
                        <RefreshCw className={`w-4 h-4 ${captchaLoading ? 'animate-spin' : ''}`} />
                      </button>

                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="Enter Code"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                        className="flex-grow py-2.5 px-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1C4D8D] font-mono font-bold tracking-widest text-center uppercase text-gray-900 bg-gray-50/50 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1C4D8D] hover:bg-[#163c6f] text-white py-2.5 rounded-lg font-bold shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{language === 'hi' ? 'प्रमाणीकरण हो रहा है...' : 'Authenticating Credentials...'}</span>
                      </>
                    ) : (
                      <span>{language === 'hi' ? 'पोर्टल में प्रवेश करें' : 'Sign In to Sammohana Project Tracking Portal'}</span>
                    )}
                  </button>
                </form>
              )}

              {/* --- MODE 2: FORGOT PASSWORD WORKFLOW --- */}
              {mode === 'forgot' && (
                <div className="space-y-4 text-xs">
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        {language === 'hi' ? 'पंजीकृत ईमेल आईडी' : 'Registered Official Email'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. admin@assembly.bihar.gov"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1C4D8D] text-gray-900"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#1C4D8D] hover:bg-[#163c6f] text-white py-2.5 rounded-lg font-bold shadow-md transition disabled:opacity-50"
                    >
                      {loading ? 'Generating Token...' : 'Generate Password Reset Token'}
                    </button>
                  </form>

                  {/* If Token Generated */}
                  {generatedResetToken && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                      <div className="text-[11px] font-bold text-blue-900 uppercase">
                        Password Reset Authorization Token Generated
                      </div>
                      <div className="bg-white border border-blue-300 rounded p-2 font-mono font-bold text-blue-950 text-center break-all select-all">
                        {generatedResetToken}
                      </div>
                      <p className="text-[10px] text-gray-500">
                        This token is valid for 15 minutes. Click below to apply your new confidential password.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('reset');
                          setErrorMsg(null);
                          setSuccessMsg(null);
                        }}
                        className="w-full bg-[#C35504] hover:bg-[#a64700] text-white py-2 rounded-lg font-bold shadow transition"
                      >
                        Proceed to Reset Password &rarr;
                      </button>
                    </div>
                  )}

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                        loadCaptcha();
                      }}
                      className="text-[#1C4D8D] hover:underline font-semibold"
                    >
                      &larr; Back to Sign In
                    </button>
                  </div>
                </div>
              )}

              {/* --- MODE 3: RESET PASSWORD WORKFLOW --- */}
              {mode === 'reset' && (
                <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Reset Token <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Paste 64-character reset token"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1C4D8D] font-mono text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      New Password (min 6 characters) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 pr-10 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1C4D8D] text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1C4D8D] text-gray-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1C4D8D] hover:bg-[#163c6f] text-white py-2.5 rounded-lg font-bold shadow-md transition disabled:opacity-50"
                  >
                    {loading ? 'Updating Password...' : 'Update Password & Return'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                        loadCaptcha();
                      }}
                      className="text-[#1C4D8D] hover:underline font-semibold"
                    >
                      &larr; Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Official Security Footer */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit Encrypted Session</span>
              </div>
              <div>Authorized Personnel Only</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
