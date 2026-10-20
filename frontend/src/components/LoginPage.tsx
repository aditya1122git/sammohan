import React, { useState, useEffect } from 'react';
import { Lock, User as UserIcon, Shield, Eye, EyeOff, RefreshCw, KeyRound, CheckCircle2, AlertCircle, Globe, PhoneCall, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { User, SystemSettings } from '../types';
import { LoginSlider } from './LoginSlider';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  language: 'hi' | 'en';
  setLanguage: (lang: 'hi' | 'en') => void;
  settings: SystemSettings | null;
}

type AuthMode = 'login' | 'forgot' | 'reset';

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  language,
  setLanguage,
  settings
}) => {
  const [mode, setMode] = useState<AuthMode>('login');

  // Form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaId, setCaptchaId] = useState('');
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);

  // Forgot / Reset password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [generatedResetToken, setGeneratedResetToken] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status & feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadCaptcha();
    setErrorMsg(null);
    setSuccessMsg(null);
  }, []);

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
    } catch (err: any) {
      setErrorMsg(err.message || (language === 'hi' ? 'लॉगिन असफल रहा।' : 'Authentication failed. Please verify credentials.'));
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
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between relative overflow-x-hidden selection:bg-amber-400 selection:text-slate-900">
      {/* Bihar Government Style Top Tricolor Stripe */}
      <div className="w-full h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] z-30" />

      {/* Official Government-Portal Navigation Bar */}
      <header className="w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 z-20 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Portal Title & Authentic CM Samrat Choudhary Portrait */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex-shrink-0">
              <img
                src="/assets/Web_Images/cm_samrat_choudhary_portrait.png"
                alt="CM Samrat Choudhary"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-amber-400 shadow-md ring-2 ring-white/20"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" title="Active Portal Desk" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-white tracking-wide">Sammohan &bull; सम्मोहन</span>
                <span className="hidden md:inline-block bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {language === 'hi' ? 'परियोजना अनुश्रवण' : 'Project Monitoring'}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-blue-200 font-medium">
                Sammohan &bull; Announcement & Project Tracking Dashboard
              </div>
              <div className="text-[10px] text-amber-300/90 italic font-semibold sm:hidden">
                &ldquo;घोषणा से क्रियान्वयन, पारदर्शिता के साथ प्रमाण।&rdquo;
              </div>
            </div>
          </div>

          {/* Right Header Utilities: Tagline, Citizen Helpline & Language Toggle */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-end">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs text-amber-300 font-bold italic">
                &ldquo;जनता की बात, समाधान के साथ।&rdquo;
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/60 text-[11px] text-blue-200">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Helpline: 1800-3456-789</span>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-800 text-xs rounded-lg p-1 border border-slate-700 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-amber-400 ml-1.5 flex-shrink-0" />
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition ${
                  language === 'en' ? 'bg-[#1C4D8D] text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition ${
                  language === 'hi' ? 'bg-[#C35504] text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Top Banner Image Slider (Situated Above Login Container) */}
      <LoginSlider language={language} />

      {/* Government-Portal Style Marquee Ticker */}
      <div className="w-full bg-[#0a192f] border-b border-slate-800 text-white text-xs px-4 py-2 flex items-center gap-3 overflow-hidden shadow-inner z-10">
        <div className="flex-shrink-0 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
          {language === 'hi' ? 'महत्वपूर्ण सूचना' : 'PORTAL NOTICE'}
        </div>
        <div className="overflow-hidden whitespace-nowrap text-blue-100 text-[11px] font-medium">
          <span className="inline-block animate-marquee">
            सम्मोहन पोर्टल &mdash; बिहार सरकार: 38 जिलों में विकास परियोजनाओं एवं घोषणाओं का रियल-टाइम वित्तीय एवं भौतिक अनुश्रवण।
          </span>
        </div>
      </div>

      {/* Main Authentication Card Section */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10 my-4 sm:my-8">
        <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
            {/* Left Column: Official Branding & Overview */}
            <div className="md:col-span-5 bg-gradient-to-br from-[#0b2447] via-[#10305d] to-[#1C4D8D] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-16 -left-16 w-52 h-52 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-300 mb-5 border border-white/10">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Authorized Secure Access</span>
                </div>

                {/* CM Samrat Choudhary Circular Portrait */}
                <div className="flex items-center gap-3.5 mb-5 bg-black/20 p-2.5 rounded-xl border border-white/10">
                  <img
                    src="/assets/Web_Images/cm_samrat_choudhary_portrait.png"
                    alt="CM Samrat Choudhary"
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-lg ring-2 ring-white/20 flex-shrink-0"
                  />
                  <div>
                    <div className="text-sm font-bold text-amber-300">
                      {language === 'hi' ? 'श्री सम्राट चौधरी' : 'Shri Samrat Choudhary'}
                    </div>
                    <div className="text-[11px] text-blue-100 font-medium">
                      {language === 'hi' ? 'माननीय मुख्यमंत्री' : 'Hon’ble Chief Minister'}
                    </div>
                    <div className="text-[10px] text-blue-200/80">
                      Bihar State
                    </div>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                  सम्मोहन &bull; Sammohan
                </h1>
                <p className="text-xs sm:text-sm text-blue-200 mt-1 font-medium">
                  Announcement & Project Tracking Dashboard
                </p>
                <p className="text-xs text-amber-300 font-semibold mt-1 italic">
                  &ldquo;घोषणा से क्रियान्वयन, पारदर्शिता के साथ प्रमाण।&rdquo;
                </p>

                <div className="mt-5 pt-5 border-t border-white/10 text-xs text-blue-100 leading-relaxed space-y-3">
                  <p className="italic">
                    &ldquo;Unified development tracking platform mapping announcements, verified progress, milestones, and financial status across all 38 districts.&rdquo;
                  </p>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-[11px] text-blue-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>All 38 Districts & Official Departments</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-blue-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>11-Field Standard Project Records</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-blue-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Multi-Tier Role Access & Audit Trails</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Bottom Note */}
              <div className="relative z-10 pt-5 mt-5 border-t border-white/10 text-[11px] text-blue-300">
                <div>Government of Bihar &bull; Sammohan Portal</div>
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
                      ? (language === 'hi' ? 'कृपया अपने अधिकृत क्रेडेंशियल्स और सुरक्षा कोड दर्ज करें।' : 'Enter your registered credentials and the CAPTCHA anti-bot verification code to access Sammohan Portal.')
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
                        <span>{language === 'hi' ? 'पोर्टल में प्रवेश करें' : 'Sign In to Sammohan Portal'}</span>
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
                        placeholder="Paste reset token"
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
      </main>

      {/* Official Government-Portal Footer */}
      <footer className="w-full bg-slate-950/95 border-t border-slate-800 text-xs text-slate-400 z-20">
        <div className="w-full h-1 bg-gradient-to-r from-amber-500 via-white to-emerald-600 opacity-60" />
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div>
            <div className="font-bold text-slate-300 text-sm">
              सम्मोहन &mdash; घोषणा एवं परियोजना अनुश्रवण डैशबोर्ड | बिहार सरकार
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              घोषणा से क्रियान्वयन, पारदर्शिता के साथ प्रमाण।
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            Bihar State Development Platform &bull; 38 Districts &bull; 48 Departments &bull; Real-time Monitoring
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
