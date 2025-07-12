import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Footer, LoadingSpinner } from '../components';

// Mock data for a user profile
const mockUserProfile = {
  user_id: 1,
  name: "Sarah Wilson",
  location: "Mumbai, India",
  profile_pic: null,
  rating: 4.8,
  total_swaps: 15,
  member_since: "2023-06-15",
  bio: "Passionate web developer with 5+ years of experience. Love helping others learn React and JavaScript while exploring new technologies myself.",
  is_public: true,
  skills_offered: [
    { skill_id: 1, skill_name: "Web Development" },
    { skill_id: 2, skill_name: "React" },
    { skill_id: 3, skill_name: "JavaScript" },
    { skill_id: 26, skill_name: "Node.js" }
  ],
  skills_wanted: [
    { skill_id: 4, skill_name: "UI/UX Design" },
    { skill_id: 5, skill_name: "Photography" },
    { skill_id: 27, skill_name: "Digital Marketing" }
  ],
  feedback: [
    {
      rating: 5,
      comment: "Very knowledgeable and helpful! Sarah explained React concepts clearly and patiently.",
      from_user: "Bob Johnson",
      date: "2024-11-20",
      skill_exchanged: "React"
    },
    {
      rating: 4,
      comment: "Great experience working together. Learned a lot about modern JavaScript practices.",
      from_user: "Dan Smith", 
      date: "2024-10-15",
      skill_exchanged: "JavaScript"
    },
    {
      rating: 3,
      comment: "Good effort, but communication could improve. Still gained valuable insights.",
      from_user: "Grace Chen",
      date: "2024-09-08",
      skill_exchanged: "Web Development"
    },
    {
      rating: 5,
      comment: "Excellent teacher! Made complex concepts easy to understand.",
      from_user: "Alex Rivera",
      date: "2024-08-22",
      skill_exchanged: "React"
    },
    {
      rating: 4,
      comment: "Professional and well-prepared. Would definitely recommend.",
      from_user: "Maria Garcia",
      date: "2024-07-18",
      skill_exchanged: "JavaScript"
    }
  ]
};

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get current user from navigation state or use fallback
  const [currentUser] = useState(location.state?.currentUser || {
    isLoggedIn: true,
    user_id: 100,
    name: "Current User",
    skills_offered: [
      { skill_id: 4, skill_name: "UI/UX Design" },
      { skill_id: 5, skill_name: "Photography" },
      { skill_id: 28, skill_name: "Graphic Design" },
      { skill_id: 13, skill_name: "Content Writing" }
    ]
  });
  
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState('');
  const [selectedWantedSkill, setSelectedWantedSkill] = useState('');
  const [selectedOfferedSkillId, setSelectedOfferedSkillId] = useState('');
  const [selectedWantedSkillId, setSelectedWantedSkillId] = useState('');
  const [swapMessage, setSwapMessage] = useState('');
  const [swapSkillsData, setSwapSkillsData] = useState(null);
  const [isLoadingSwapData, setIsLoadingSwapData] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch user profile
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would fetch based on userId
        setUserProfile(mockUserProfile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

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
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {hasHalfStar && (
          <div className="relative">
            <svg className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const handleSwapRequest = async () => {
    if (!currentUser.isLoggedIn) {
      navigate('/login', { 
        state: { 
          returnTo: `/profile/${userId}`,
          message: 'Please login to send swap requests' 
        }
      });
      return;
    }
    
    // Check if current user has skills to offer
    if (!currentUser.skills_offered || currentUser.skills_offered.length === 0) {
      alert('You need to add skills to your profile before making swap requests. Please update your profile first.');
      return;
    }
    
    // Check if the profile user has skills to offer
    if (!userProfile.skills_offered || userProfile.skills_offered.length === 0) {
      alert('This user hasn\'t listed any skills they can teach yet.');
      return;
    }
    
    // Fetch skills data for the swap modal
    try {
      setIsLoadingSwapData(true);
      
      // Simulate API call to get swap skills data
      // In a real app, this would be an API call like:
      // const response = await fetch(`/api/swap-skills/${currentUser.user_id}/${userProfile.user_id}`);
      // const skillsData = await response.json();
      
      // Mock data that simulates the API response format you specified
      const mockSwapSkillsData = {
        sender_offered_skills: [
          { skill_id: 1, skill_name: "Web Development" },
          { skill_id: 2, skill_name: "Graphic Design" },
          { skill_id: 160, skill_name: "Some random skill3" },
          { skill_id: 161, skill_name: "Some random skill 4" }
        ],
        receiver_wanted_skills: [
          { skill_id: 4, skill_name: "Python" }
        ]
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSwapSkillsData(mockSwapSkillsData);
      setShowSwapModal(true);
    } catch (error) {
      console.error('Error fetching swap skills data:', error);
      alert('Failed to load skills data. Please try again.');
    } finally {
      setIsLoadingSwapData(false);
    }
  };

  const closeSwapModal = () => {
    setShowSwapModal(false);
    setSelectedOfferedSkill('');
    setSelectedWantedSkill('');
    setSelectedOfferedSkillId('');
    setSelectedWantedSkillId('');
    setSwapMessage('');
    setSwapSkillsData(null);
  };

  const submitSwapRequest = async () => {
    if (!selectedOfferedSkill || !selectedWantedSkill) {
      alert('Please select both skills for the exchange');
      return;
    }

    if (!selectedOfferedSkillId || !selectedWantedSkillId) {
      alert('Error: Skill IDs not found. Please try selecting the skills again.');
      return;
    }

    try {
      setIsSubmittingRequest(true);

      // Prepare the data in the format you specified
      const swapRequestData = {
        receiver_id: userProfile.user_id,
        offered_skill_id: selectedOfferedSkillId,
        requested_skill_id: selectedWantedSkillId,
        message: swapMessage
      };

      console.log('Sending swap request data:', swapRequestData);

      // In a real app, this would be an API call like:
      // const response = await fetch('/api/swap-requests', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${currentUser.token}` // if using auth tokens
      //   },
      //   body: JSON.stringify(swapRequestData)
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to send swap request');
      // }
      
      // const result = await response.json();
      // console.log('Swap request response:', result);

      // Simulate API call success
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert(`Swap request sent to ${userProfile.name}! 🎉\n\nYou offered: ${selectedOfferedSkill}\nYou want to learn: ${selectedWantedSkill}`);
      closeSwapModal();
    } catch (error) {
      console.error('Error sending swap request:', error);
      alert('Failed to send swap request. Please try again later.');
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar currentUser={currentUser} />
        <main className="flex-grow flex items-center justify-center">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar currentUser={currentUser} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">The user profile you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-brand-primary text-white px-6 py-3 rounded-lg hover:bg-brand-primaryDark transition-colors duration-200"
            >
              Back to Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar currentUser={currentUser} />
      
      <main className="flex-grow py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-brand-primary to-brand-primaryDark rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {getInitials(userProfile.name)}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-grow">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{userProfile.name}</h1>
                <p className="text-lg text-gray-600 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {userProfile.location}
                </p>
                
                {/* Rating and Stats */}
                <div className="flex flex-wrap items-center gap-6 mb-4">
                  <div className="flex items-center">
                    {renderStars(userProfile.rating)}
                    <span className="ml-2 text-lg font-semibold text-gray-800">
                      {userProfile.rating}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    <span className="font-semibold">{userProfile.total_swaps}</span> successful swaps
                  </div>
                  <div className="text-gray-600">
                    Member since {new Date(userProfile.member_since).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </div>
                </div>

                {/* Bio */}
                {userProfile.bio && (
                  <p className="text-gray-700 leading-relaxed mb-4">{userProfile.bio}</p>
                )}
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0">
                {currentUser.user_id !== userProfile.user_id && (
                  <button
                    onClick={handleSwapRequest}
                    disabled={isLoadingSwapData}
                    className="bg-brand-primary text-white px-8 py-3 rounded-lg hover:bg-brand-primaryDark transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoadingSwapData ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading...
                      </div>
                    ) : (
                      'Request Skill Swap'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skills Section */}
            <div className="space-y-6">
              {/* Skills Offered */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Skills Offered
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {userProfile.skills_offered.map((skill) => (
                    <div key={skill.skill_id} className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <span className="font-medium text-gray-900">{skill.skill_name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Wanted */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Skills Wanted
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {userProfile.skills_wanted.map((skill) => (
                    <div key={skill.skill_id} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <span className="font-medium text-gray-900">{skill.skill_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Feedback & Reviews ({userProfile.feedback.length})
              </h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userProfile.feedback.map((feedback, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold">
                          {getInitials(feedback.from_user)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{feedback.from_user}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(feedback.date).toLocaleDateString()} • {feedback.skill_exchanged}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {renderStars(feedback.rating)}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{feedback.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Swap Request Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Send Swap Request</h3>
                <button
                  onClick={closeSwapModal}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Skill I'm Offering */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill I'm Offering
                  </label>
                  <select
                    value={selectedOfferedSkill}
                    onChange={(e) => {
                      const selectedSkill = swapSkillsData?.sender_offered_skills?.find(
                        skill => skill.skill_name === e.target.value
                      );
                      setSelectedOfferedSkill(e.target.value);
                      setSelectedOfferedSkillId(selectedSkill ? selectedSkill.skill_id : '');
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  >
                    <option value="">Select a skill you can teach</option>
                    {swapSkillsData?.sender_offered_skills?.map((skill) => (
                      <option key={skill.skill_id} value={skill.skill_name}>
                        {skill.skill_name}
                      </option>
                    )) || <option disabled>No skills available</option>}
                  </select>
                </div>

                {/* Skill I Want */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill I Want to Learn
                  </label>
                  <select
                    value={selectedWantedSkill}
                    onChange={(e) => {
                      const selectedSkill = swapSkillsData?.receiver_wanted_skills?.find(
                        skill => skill.skill_name === e.target.value
                      );
                      setSelectedWantedSkill(e.target.value);
                      setSelectedWantedSkillId(selectedSkill ? selectedSkill.skill_id : '');
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  >
                    <option value="">Select a skill you want to learn</option>
                    {swapSkillsData?.receiver_wanted_skills?.map((skill) => (
                      <option key={skill.skill_id} value={skill.skill_name}>
                        {skill.skill_name}
                      </option>
                    )) || <option disabled>No skills available</option>}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={swapMessage}
                    onChange={(e) => setSwapMessage(e.target.value)}
                    placeholder="Introduce yourself and explain what you'd like to learn..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeSwapModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={submitSwapRequest}
                  disabled={isSubmittingRequest}
                  className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primaryDark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingRequest ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send Request'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
