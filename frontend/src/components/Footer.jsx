const Footer = () => (
  <footer className="bg-gray-900 text-white mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-primaryDark rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <span className="text-xl font-bold">SkillSwap</span>
        </div>
        
        {/* Description */}
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Connect with skilled individuals, learn new abilities, and share your expertise.
        </p>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6">
          <p className="text-gray-400 text-sm">
            © 2025 SkillSwap. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
