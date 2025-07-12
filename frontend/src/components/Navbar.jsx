import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = ({ currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    // Add confirmation dialog to prevent accidental signouts
    const confirmed = window.confirm('Are you sure you want to sign out?');
    if (!confirmed) {
      return;
    }

    try {
      console.log('🚪 User initiated sign out');
      const result = await logout();
      if (result.success) {
        console.log('✅ Sign out successful, redirecting to home');
        navigate('/');
      } else {
        console.warn('⚠️ Logout returned unsuccessful result, but proceeding anyway');
        navigate('/');
      }
    } catch (error) {
      console.error('❌ Sign out failed:', error);
      // Still navigate even if logout fails to ensure user isn't stuck
      navigate('/');
    }
  };

  const getNotificationCount = () => {
    // 1. Fetch from API: GET /api/notifications/unread-count
    // 2. Use React Context: const { unreadCount } = useNotifications();
    // 3. Subscribe to WebSocket for real-time updates
    // 4. Cache in localStorage for offline experience
    
    // Mock notification data based on current swap requests:
    const pendingReceivedRequests = 2; // Alex Rivera & Maria Garcia requests
    const acceptedRequestsNotifications = 0; // All seen
    const newMessages = 0; // No chat feature yet
    const systemNotifications = 0; // No system alerts
    
    return pendingReceivedRequests + acceptedRequestsNotifications + newMessages + systemNotifications;
  };

  const notificationCount = getNotificationCount();

  // Get notification badge styling based on count and urgency
  const getNotificationBadgeClass = (size = 'normal') => {
    const baseClass = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';
    const urgencyClass = notificationCount > 5 ? 'bg-red-600' : notificationCount > 0 ? 'bg-red-500' : 'bg-gray-400';
    const animationClass = notificationCount > 0 ? 'animate-pulse' : '';
    
    return `${baseClass} ${urgencyClass} text-white text-xs rounded-full flex items-center justify-center ${animationClass}`;
  };

  // Handle click on swap requests link - could be used to mark notifications as read
  const handleSwapRequestsClick = () => {
    // 1. Mark notifications as read: POST /api/notifications/mark-read
    // 2. Update global state/context
    // 3. Clear the notification badge
    console.log('Navigating to swap requests - notifications would be marked as read');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isActiveTab = (path) => {
    return location.pathname === path;
  };

  const handleAuthAction = (action) => {
    // Navigate to login or signup with return URL
    navigate(`/${action}`, { 
      state: { 
        returnTo: '/',
        message: action === 'login' 
          ? 'Login to connect with skilled individuals' 
          : 'Join our community to start skill exchanges'
      }
    });
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-primaryDark rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">SkillSwap</span>
              </div>
            </div>
          </div>

          {/* Navigation Links - Show only for logged-in users */}
          {currentUser.isLoggedIn && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {/* Logged in user tabs */}
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActiveTab('/') 
                      ? 'text-brand-primary bg-brand-primary bg-opacity-10 border border-brand-primary border-opacity-20' 
                      : 'text-gray-700 hover:text-brand-primary hover:bg-brand-primary hover:bg-opacity-10'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/swap-requests"
                  onClick={handleSwapRequestsClick}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative ${
                    isActiveTab('/swap-requests') 
                      ? 'text-brand-primary bg-brand-primary bg-opacity-10 border border-brand-primary border-opacity-20' 
                      : 'text-gray-700 hover:text-brand-primary hover:bg-brand-primary hover:bg-opacity-10'
                  }`}
                >
                  Swap Requests
                  {/* Notification badge - show only if there are pending requests */}
                  {notificationCount > 0 && (
                    <span 
                      className={`absolute -top-1 -right-1 ${getNotificationBadgeClass()}`}
                      title={`${notificationCount} unread notification${notificationCount !== 1 ? 's' : ''}`}
                    >
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActiveTab('/profile') 
                      ? 'text-brand-primary bg-brand-primary bg-opacity-10 border border-brand-primary border-opacity-20' 
                      : 'text-gray-700 hover:text-brand-primary hover:bg-brand-primary hover:bg-opacity-10'
                  }`}
                >
                  My Profile
                </Link>
              </div>
            </div>
          )}

          {/* Auth Buttons - Show user avatar for logged in, auth buttons for guests */}
          <div className="flex items-center space-x-4">
            {currentUser.isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {/* User Avatar with Dropdown Menu */}
                <div className="relative group">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-primaryDark rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:shadow-lg transition-all duration-200">
                    {getInitials(currentUser.name)}
                  </div>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{currentUser.name}</div>
                      <div className="text-xs text-gray-500">View and edit profile</div>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/swap-requests"
                      onClick={handleSwapRequestsClick}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 relative"
                    >
                      Swap Requests
                      {notificationCount > 0 && (
                        <span 
                          className={`absolute right-4 top-2 ${getNotificationBadgeClass('small')}`}
                          title={`${notificationCount} unread notification${notificationCount !== 1 ? 's' : ''}`}
                        >
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Settings
                    </Link>
                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleAuthAction('login')}
                  className="text-brand-primary hover:text-brand-primaryDark px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 border border-brand-primary border-opacity-50 hover:border-opacity-100"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleAuthAction('signup')}
                  className="bg-brand-primary hover:bg-brand-primaryDark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </button>
              </>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-brand-primary p-2 rounded-md transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {currentUser.isLoggedIn ? (
                <>
                  {/* Logged in user mobile menu */}
                  <Link
                    to="/"
                    className={`px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActiveTab('/') 
                        ? 'text-brand-primary bg-brand-primary bg-opacity-10 border border-brand-primary border-opacity-20' 
                        : 'text-gray-700 hover:text-brand-primary hover:bg-brand-primary hover:bg-opacity-10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/swap-requests"
                    className={`px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 relative ${
                      isActiveTab('/swap-requests') 
                        ? 'text-brand-primary bg-brand-primary bg-opacity-10 border border-brand-primary border-opacity-20' 
                        : 'text-gray-700 hover:text-brand-primary hover:bg-brand-primary hover:bg-opacity-10'
                    }`}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSwapRequestsClick();
                    }}
                  >
                    Swap Requests
                    {notificationCount > 0 && (
                      <span 
                        className={`absolute -top-1 -right-1 ${getNotificationBadgeClass()}`}
                        title={`${notificationCount} unread notification${notificationCount !== 1 ? 's' : ''}`}
                      >
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/profile"
                    className={`px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActiveTab('/profile') 
                        ? 'text-brand-primary bg-brand-primary bg-opacity-10 border border-brand-primary border-opacity-20' 
                        : 'text-gray-700 hover:text-brand-primary hover:bg-brand-primary hover:bg-opacity-10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="text-gray-700 hover:text-brand-primary px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="text-left text-red-600 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  {/* Non-logged in user mobile menu - only auth buttons */}
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleAuthAction('login');
                      }}
                      className="block w-full text-left text-brand-primary px-3 py-2 rounded-md text-base font-medium border border-brand-primary border-opacity-50 mb-2"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleAuthAction('signup');
                      }}
                      className="block w-full text-left bg-brand-primary text-white px-3 py-2 rounded-md text-base font-medium"
                    >
                      Sign Up
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
