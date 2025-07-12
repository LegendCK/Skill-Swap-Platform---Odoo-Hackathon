import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';
import { 
  Navbar, 
  Footer, 
  ProfileCard, 
  LoginSignupCTA, 
  SearchFilter, 
  LoadingSpinner, 
  EmptyState 
} from '../components';

// Pagination constants
const PROFILES_PER_PAGE = 6;

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [displayedProfiles, setDisplayedProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Extract all unique skills for filter dropdown from loaded profiles
  const allSkills = [...new Set(
    profiles.flatMap(profile => 
      [...profile.skills_offered, ...profile.skills_wanted].map(skill => skill.skill_name)
    )
  )].sort();

  useEffect(() => {
    // Fetch public profiles from API
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        const profilesData = await apiService.getPublicProfiles();
        
        // Transform API data to match component expectations
        const transformedProfiles = profilesData.map(profile => ({
          user_id: profile.user_id,
          name: profile.name,
          location: profile.location || "Location not specified",
          profile_pic: null, // API doesn't include this yet
          rating: profile.rating || 0,
          total_swaps: 0, // Will be calculated from backend later
          is_public: true, // Only public profiles are returned
          skills_offered: Array.isArray(profile.skills_offered) ? 
            profile.skills_offered.map((skill, index) => ({
              skill_id: index + 1,
              skill_name: skill
            })) : [],
          skills_wanted: Array.isArray(profile.skills_wanted) ? 
            profile.skills_wanted.map((skill, index) => ({
              skill_id: index + 1000, // Offset to avoid conflicts
              skill_name: skill
            })) : []
        }));

        setProfiles(transformedProfiles);
        setFilteredProfiles(transformedProfiles);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        // Fallback to empty array on error
        setProfiles([]);
        setFilteredProfiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    // Filter profiles based on search term and selected skill
    let filtered = profiles;

    // Filter by search term (name or location)
    if (searchTerm) {
      filtered = filtered.filter(profile =>
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by skill
    if (selectedSkillFilter) {
      filtered = filtered.filter(profile =>
        [...profile.skills_offered, ...profile.skills_wanted].some(skill =>
          skill.skill_name.toLowerCase().includes(selectedSkillFilter.toLowerCase())
        )
      );
    }

    setFilteredProfiles(filtered);
    
    // Reset pagination when filters change
    setCurrentPage(1);
    const newTotalPages = Math.ceil(filtered.length / PROFILES_PER_PAGE);
    setTotalPages(newTotalPages);
    
    // Set initial displayed profiles
    setDisplayedProfiles(filtered.slice(0, PROFILES_PER_PAGE));
  }, [searchTerm, selectedSkillFilter, profiles]);

  // Handle pagination when currentPage changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * PROFILES_PER_PAGE;
    const endIndex = startIndex + PROFILES_PER_PAGE;
    setDisplayedProfiles(filteredProfiles.slice(0, endIndex));
  }, [currentPage, filteredProfiles]);

  const handleSwapRequest = (profile) => {
    if (!currentUser.isLoggedIn) {
      // Navigate to login page with return URL
      navigate('/login', { 
        state: { 
          returnTo: '/',
          message: 'Please login to send swap requests' 
        }
      });
      return;
    }
    
    // Navigate to the user's profile page and pass current user data
    navigate(`/profile/${profile.user_id}`, { 
      state: { currentUser: currentUser }
    });
  };

  const handleLoadMore = async () => {
    if (currentPage >= totalPages || isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCurrentPage(prev => prev + 1);
    setIsLoadingMore(false);
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar currentUser={currentUser} />
      
      {/* Main Content */}
      <main className="flex-grow py-8 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeInDown">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing Skills & Talents
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Connect with skilled individuals in your area and start meaningful skill exchanges today.
          </p>
        </div>

        {/* Login/Signup CTA for non-logged-in users */}
        {!currentUser.isLoggedIn && <LoginSignupCTA onAuthAction={handleAuthAction} />}

        {/* How It Works Section - Show only for non-logged-in users */}
        {!currentUser.isLoggedIn && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 animate-fadeInUp">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">How SkillSwap Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Create Your Profile</h3>
                <p className="text-gray-600">Sign up and list the skills you can teach and what you'd like to learn.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Find Perfect Matches</h3>
                <p className="text-gray-600">Browse profiles and find people whose skills complement yours.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Start Learning Together</h3>
                <p className="text-gray-600">Connect, exchange skills, and grow your knowledge through collaboration.</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSkillFilter={selectedSkillFilter}
          setSelectedSkillFilter={setSelectedSkillFilter}
          allSkills={allSkills}
          isLoading={isLoading}
          displayedProfiles={displayedProfiles}
          filteredProfiles={filteredProfiles}
          profiles={profiles}
        />

        {/* Profiles Section Header */}
        {!isLoading && profiles.length > 0 && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentUser.isLoggedIn ? 'Connect with Skilled Individuals' : 'Featured Skill Swappers'}
            </h2>
            <p className="text-gray-600">
              {currentUser.isLoggedIn 
                ? 'Click on any profile to view details and send a swap request' 
                : 'Join our community to connect with these amazing people'
              }
            </p>
          </div>
        )}

        {/* Profiles Grid */}
        {isLoading ? (
          <LoadingSpinner />
        ) : filteredProfiles.length === 0 ? (
          <EmptyState 
            onClearFilters={() => {
              setSearchTerm('');
              setSelectedSkillFilter('');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeInUp">
            {displayedProfiles.map((profile, index) => (
              <div
                key={profile.user_id}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProfileCard
                  profile={profile}
                  currentUser={currentUser}
                  onSwapRequest={handleSwapRequest}
                  onAuthAction={handleAuthAction}
                />
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (for pagination) */}
        {displayedProfiles.length > 0 && currentPage < totalPages && (
          <div className="text-center mt-12 animate-fadeInUp">
            <button 
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${
                isLoadingMore
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-white border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white hover:scale-105'
              }`}
            >
              {isLoadingMore ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Loading More...
                </div>
              ) : (
                `Load More Profiles (${filteredProfiles.length - displayedProfiles.length} remaining)`
              )}
            </button>
          </div>
        )}

        {/* Pagination Info */}
        {displayedProfiles.length > 0 && totalPages > 1 && (
          <div className="text-center mt-6 text-sm text-gray-600">
            Page {currentPage} of {totalPages} • 
            {displayedProfiles.length} of {filteredProfiles.length} profiles shown
          </div>
        )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
