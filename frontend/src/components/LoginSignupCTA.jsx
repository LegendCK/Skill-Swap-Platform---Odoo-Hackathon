const LoginSignupCTA = ({ onAuthAction }) => {
  return (
    <div className="bg-gradient-to-r from-brand-primary to-brand-primaryDark text-white p-6 rounded-2xl mb-8 animate-slideInLeft">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Join Our Skill-Sharing Community!</h2>
          <p className="text-brand-primary-light opacity-90 mb-4">
            Connect with talented individuals, learn new skills, and share your expertise.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => onAuthAction('signup')}
              className="bg-white text-brand-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              Sign Up Free
            </button>
            <button
              onClick={() => onAuthAction('login')}
              className="bg-white text-brand-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              Login
            </button>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupCTA;
