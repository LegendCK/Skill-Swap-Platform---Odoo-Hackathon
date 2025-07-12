const ProfileCard = ({ profile, currentUser, onSwapRequest, onAuthAction }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-brand-amber fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <svg className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <svg className="w-4 h-4 text-brand-amber fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        <span className="ml-2 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6">
      {/* Profile Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Profile Picture (Initials) */}
          <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-primaryDark rounded-full flex items-center justify-center text-white text-lg font-bold">
            {getInitials(profile.name)}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
            <p className="text-sm text-gray-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {profile.location}
            </p>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-4">
        {renderStars(profile.rating)}
        <p className="text-xs text-gray-500 mt-1">{profile.total_swaps} successful swaps</p>
      </div>

      {/* Skills Offered */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
          <span className="w-2 h-2 bg-brand-primary rounded-full mr-2"></span>
          Offers
        </h4>
        <div className="flex flex-wrap gap-1">
          {profile.skills_offered.slice(0, 3).map((skill) => (
            <span
              key={`offered-${skill.skill_id}`}
              className="px-2 py-1 bg-brand-primary text-white text-xs rounded-full"
            >
              {skill.skill_name}
            </span>
          ))}
          {profile.skills_offered.length > 3 && (
            <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
              +{profile.skills_offered.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Skills Wanted */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
          <span className="w-2 h-2 bg-brand-secondary rounded-full mr-2"></span>
          Wants to Learn
        </h4>
        <div className="flex flex-wrap gap-1">
          {profile.skills_wanted.slice(0, 3).map((skill) => (
            <span
              key={`wanted-${skill.skill_id}`}
              className="px-2 py-1 bg-brand-secondary text-white text-xs rounded-full"
            >
              {skill.skill_name}
            </span>
          ))}
          {profile.skills_wanted.length > 3 && (
            <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
              +{profile.skills_wanted.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* CTA Button */}
      {currentUser.isLoggedIn ? (
        <button
          onClick={() => onSwapRequest(profile)}
          className="w-full bg-gradient-to-r from-brand-primary to-brand-primaryDark text-white py-3 px-4 rounded-lg font-semibold hover:from-brand-primaryDark hover:to-brand-primary transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          Send Swap Request
        </button>
      ) : (
        <div className="space-y-2">
          <button
            onClick={() => onAuthAction('login')}
            className="block w-full bg-brand-primary text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-brand-primaryDark transition-all duration-200"
          >
            Login to Connect
          </button>
          <button
            onClick={() => onAuthAction('signup')}
            className="block w-full border border-brand-primary text-brand-primary py-2 px-4 rounded-lg text-center font-medium hover:bg-brand-primary hover:text-white transition-all duration-200"
          >
            Sign Up Free
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
