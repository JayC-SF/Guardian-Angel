import { useAuth0 } from '@auth0/auth0-react';
import { Baby, Heart, Shield } from 'lucide-react';

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-rose-100 to-blue-100 p-4 rounded-2xl">
            <Baby className="w-12 h-12 text-rose-500" />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-rose-100">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Guardian Angel
            </h1>
            <p className="text-gray-500 text-lg">Care for your little one with confidence</p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Heart className="w-5 h-5 text-rose-400" />
              </div>
              <p className="text-gray-700">Real-time health monitoring</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-gray-700">24/7 activity tracking</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Baby className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-gray-700">Peace of mind for parents</p>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={() => loginWithRedirect()}
            className="w-full bg-gradient-to-r from-rose-400 to-blue-400 hover:from-rose-500 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Sign In with Auth0
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Secure login powered by Auth0
          </p>
        </div>

        {/* Security Note */}
        <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-rose-100/50">
          <p className="text-center text-sm text-gray-600">
            Your data is encrypted and secured with enterprise-grade protection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
