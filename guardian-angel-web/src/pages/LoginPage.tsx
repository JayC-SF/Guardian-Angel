import { useAuth0 } from '@auth0/auth0-react';
import { Baby, Heart, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-rose-50 via-blue-50 to-amber-50'
    }`}>
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <div className={`p-4 rounded-2xl transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-rose-900/30 to-blue-900/30' 
              : 'bg-gradient-to-br from-rose-100 to-blue-100'
          }`}>
            <Baby className={`w-12 h-12 transition-colors duration-200 ${
              isDarkMode ? 'text-rose-300' : 'text-rose-500'
            }`} />
          </div>
        </div>

        {/* Main Card */}
        <div className={`rounded-2xl shadow-xl p-8 border transition-colors duration-200 ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-rose-100'
        }`}>
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className={`text-4xl font-bold bg-clip-text text-transparent mb-2 transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-rose-300 to-blue-300' 
                : 'bg-gradient-to-r from-rose-400 to-blue-400'
            }`}>
              Guardian Angel
            </h1>
            <p className={`text-lg transition-colors duration-200 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Care for your little one with confidence</p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Heart className={`w-5 h-5 transition-colors duration-200 ${
                  isDarkMode ? 'text-rose-300' : 'text-rose-400'
                }`} />
              </div>
              <p className={`transition-colors duration-200 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Real-time health monitoring</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Shield className={`w-5 h-5 transition-colors duration-200 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-400'
                }`} />
              </div>
              <p className={`transition-colors duration-200 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>24/7 activity tracking</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Baby className={`w-5 h-5 transition-colors duration-200 ${
                  isDarkMode ? 'text-amber-300' : 'text-amber-400'
                }`} />
              </div>
              <p className={`transition-colors duration-200 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Peace of mind for parents</p>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={() => loginWithRedirect()}
            className={`w-full font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg ${
              isDarkMode
                ? 'bg-gradient-to-r from-rose-600 to-blue-600 hover:from-rose-500 hover:to-blue-500 text-white'
                : 'bg-gradient-to-r from-rose-400 to-blue-400 hover:from-rose-500 hover:to-blue-500 text-white'
            }`}
          >
            Sign In with Auth0
          </button>

          {/* Footer */}
          <p className={`text-center text-sm mt-6 transition-colors duration-200 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Secure login powered by Auth0
          </p>
        </div>

        {/* Security Note */}
        <div className={`mt-8 backdrop-blur-sm rounded-xl p-4 border transition-colors duration-200 ${
          isDarkMode 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white/50 border-rose-100/50'
        }`}>
          <p className={`text-center text-sm transition-colors duration-200 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Your data is encrypted and secured with enterprise-grade protection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
