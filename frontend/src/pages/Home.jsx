import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Navbar, 
  Footer, 
  ProfileCard, 
  LoginSignupCTA, 
  SearchFilter, 
  LoadingSpinner, 
  EmptyState 
} from '../components';

// Mock data for profiles (in a real app, this would come from an API)
const mockProfiles = [
  {
    user_id: 1,
    name: "Sarah Wilson",
    location: "Mumbai, India",
    profile_pic: null, // Will use initials
    rating: 4.8,
    total_swaps: 15,
    is_public: true, // Only public profiles will be shown
    skills_offered: [
      { skill_id: 1, skill_name: "Web Development" },
      { skill_id: 2, skill_name: "React" },
      { skill_id: 3, skill_name: "JavaScript" }
    ],
    skills_wanted: [
      { skill_id: 4, skill_name: "UI/UX Design" },
      { skill_id: 5, skill_name: "Photography" }
    ]
  },
  {
    user_id: 2,
    name: "Rajesh Kumar",
    location: "Delhi, India",
    profile_pic: null,
    rating: 4.6,
    total_swaps: 23,
    is_public: true,
    skills_offered: [
      { skill_id: 6, skill_name: "Python" },
      { skill_id: 7, skill_name: "Data Analysis" },
      { skill_id: 8, skill_name: "Machine Learning" }
    ],
    skills_wanted: [
      { skill_id: 1, skill_name: "Web Development" },
      { skill_id: 9, skill_name: "Cloud Computing" }
    ]
  },
  {
    user_id: 3,
    name: "Priya Sharma",
    location: "Bangalore, India",
    profile_pic: null,
    rating: 4.9,
    total_swaps: 31,
    is_public: true,
    skills_offered: [
      { skill_id: 4, skill_name: "UI/UX Design" },
      { skill_id: 10, skill_name: "Graphic Design" },
      { skill_id: 11, skill_name: "Adobe Photoshop" }
    ],
    skills_wanted: [
      { skill_id: 12, skill_name: "Digital Marketing" },
      { skill_id: 13, skill_name: "Content Writing" }
    ]
  },
  {
    user_id: 4,
    name: "Amit Patel",
    location: "Pune, India",
    profile_pic: null,
    rating: 4.7,
    total_swaps: 18,
    is_public: false, // This profile is private, won't be shown
    skills_offered: [
      { skill_id: 5, skill_name: "Photography" },
      { skill_id: 14, skill_name: "Video Editing" },
      { skill_id: 15, skill_name: "Drone Operation" }
    ],
    skills_wanted: [
      { skill_id: 16, skill_name: "Music Production" },
      { skill_id: 17, skill_name: "Sound Design" }
    ]
  },
  {
    user_id: 5,
    name: "Sneha Reddy",
    location: "Hyderabad, India",
    profile_pic: null,
    rating: 4.5,
    total_swaps: 12,
    is_public: true,
    skills_offered: [
      { skill_id: 12, skill_name: "Digital Marketing" },
      { skill_id: 18, skill_name: "Social Media Management" },
      { skill_id: 19, skill_name: "SEO" }
    ],
    skills_wanted: [
      { skill_id: 6, skill_name: "Python" },
      { skill_id: 20, skill_name: "Data Visualization" }
    ]
  },
  {
    user_id: 6,
    name: "Vikram Singh",
    location: "Chennai, India",
    profile_pic: null,
    rating: 4.4,
    total_swaps: 8,
    is_public: false, // This profile is private, won't be shown
    skills_offered: [
      { skill_id: 21, skill_name: "Project Management" },
      { skill_id: 22, skill_name: "Agile Methodology" },
      { skill_id: 23, skill_name: "Leadership" }
    ],
    skills_wanted: [
      { skill_id: 24, skill_name: "Blockchain" },
      { skill_id: 25, skill_name: "Cryptocurrency" }
    ]
  }];

// Mock current user state (in a real app, this would come from auth context)
const mockCurrentUser = {
  isLoggedIn: true, // Change to true to see logged-in user interface
  user_id: 100,
  name: "Current User"
};

// Pagination constants
const PROFILES_PER_PAGE = 6;

const Home = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [displayedProfiles, setDisplayedProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser] = useState(mockCurrentUser);
  
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
    // Simulate API call to fetch public profiles only
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Filter to show only public profiles
        const publicProfiles = mockProfiles.filter(profile => profile.is_public);
        setProfiles(publicProfiles);
        setFilteredProfiles(publicProfiles);
      } catch (error) {
        console.error('Error fetching profiles:', error);
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
    
    // Simulate sending swap request
    alert(`Swap request sent to ${profile.name}!`);
    console.log('Swap request sent to:', profile);
    
    // In a real app, you might navigate to a conversation or requests page
    // navigate('/requests');
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Skills & Talents
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with skilled individuals in your area and start meaningful skill exchanges today.
          </p>
        </div>

        {/* Login/Signup CTA for non-logged-in users */}
        {!currentUser.isLoggedIn && <LoginSignupCTA onAuthAction={handleAuthAction} />}

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
