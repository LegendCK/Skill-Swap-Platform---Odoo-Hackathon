import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';
import Navbar from '../components/Navbar';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  location: z.string().min(1, 'Location is required'),
  availability: z.string().min(1, 'Availability is required'),
  public_profile: z.boolean()
});

const availableSkills = [
  { skill_id: 1, skill_name: "Web Development" },
  { skill_id: 2, skill_name: "Graphic Design" },
  { skill_id: 3, skill_name: "Data Analysis" },
  { skill_id: 4, skill_name: "Python" },
  { skill_id: 5, skill_name: "JavaScript" },
  { skill_id: 6, skill_name: "UI/UX Design" },
  { skill_id: 7, skill_name: "Digital Marketing" },
  { skill_id: 8, skill_name: "Photography" },
  { skill_id: 9, skill_name: "Content Writing" },
  { skill_id: 10, skill_name: "Project Management" }
];

const Profile = () => {
  const { currentUser } = useAuth();

  // Profile form state
  const [profile, setProfile] = useState({
    user_id: null,
    name: "",
    email: "",
    location: null,
    availability: null,
    public_profile: true,
    profile_completed: false,
    skills_offered: [],
    skills_wanted: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [errors, setErrors] = useState({});

  // Skills from backend
  const [backendSkills, setBackendSkills] = useState(availableSkills); // Will be replaced with API call
  
  // Custom skills input
  const [customOfferedSkills, setCustomOfferedSkills] = useState('');
  const [customWantedSkills, setCustomWantedSkills] = useState('');

  // Dropdown states
  const [isOfferedDropdownOpen, setIsOfferedDropdownOpen] = useState(false);
  const [isWantedDropdownOpen, setIsWantedDropdownOpen] = useState(false);

  // Load user profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      if (!currentUser?.isLoggedIn) return;
      
      try {
        setIsLoading(true);
        const profileData = await apiService.getProfile();
        
        setProfile({
          user_id: profileData.id,
          name: profileData.name || "",
          email: profileData.email || "",
          location: profileData.location || "",
          availability: profileData.availability || "",
          public_profile: profileData.public_profile ?? true,
          skills_offered: profileData.skills_offered || [],
          skills_wanted: profileData.skills_wanted || []
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [currentUser]);

  // Form data for editing
  const [formData, setFormData] = useState({
    name: profile.name || '',
    email: profile.email || '',
    location: profile.location || '',
    availability: profile.availability || '',
    public_profile: profile.public_profile
  });

  // Skills management
  const [selectedOfferedSkills, setSelectedOfferedSkills] = useState(profile.skills_offered);
  const [selectedWantedSkills, setSelectedWantedSkills] = useState(profile.skills_wanted);

  useEffect(() => {
    // Check if profile needs completion
    if (!profile.profile_completed && !profile.location && !profile.availability) {
      setIsEditing(true);
    }
    
    // Fetch skills from backend when component mounts
    fetchSkillsFromBackend();
  }, [profile]);

  // Function to fetch skills from backend
  const fetchSkillsFromBackend = async () => {
    setIsLoadingSkills(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // const response = await fetch('/api/skills');
      // const skills = await response.json();
      // setBackendSkills(skills);
      
      setBackendSkills(availableSkills);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setIsLoadingSkills(false);
    }
  };

  const toPascalCase = (text) => {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const parseCustomSkills = (skillsString) => {
    if (!skillsString.trim()) return [];
    
    return skillsString
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)
      .map((skill, index) => ({
        skill_id: `custom_${Date.now()}_${index}`, // Generate unique ID for custom skills
        skill_name: toPascalCase(skill)
      }));
  };

  // Function to add custom skills to selected skills
  const addCustomSkills = (customSkillsString, type) => {
    const customSkills = parseCustomSkills(customSkillsString);
    
    if (type === 'offered') {
      setSelectedOfferedSkills(prev => {
        // Remove duplicates and merge with existing skills
        const existingSkillNames = prev.map(s => s.skill_name.toLowerCase());
        const newSkills = customSkills.filter(skill => 
          !existingSkillNames.includes(skill.skill_name.toLowerCase())
        );
        
        // Clear skills_offered error when adding skills
        if (newSkills.length > 0 && errors.skills_offered) {
          setErrors(prevErrors => {
            const { skills_offered: _skills_offered, ...rest } = prevErrors;
            return rest;
          });
        }
        
        return [...prev, ...newSkills];
      });
      setCustomOfferedSkills('');
    } else {
      setSelectedWantedSkills(prev => {
        const existingSkillNames = prev.map(s => s.skill_name.toLowerCase());
        const newSkills = customSkills.filter(skill => 
          !existingSkillNames.includes(skill.skill_name.toLowerCase())
        );
        
        // Clear skills_wanted error when adding skills
        if (newSkills.length > 0 && errors.skills_wanted) {
          setErrors(prevErrors => {
            const { skills_wanted: _skills_wanted, ...rest } = prevErrors;
            return rest;
          });
        }
        
        return [...prev, ...newSkills];
      });
      setCustomWantedSkills('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    
    try {
      profileSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError && error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => {
          if (err.path && err.path[0]) {
            newErrors[err.path[0]] = err.message;
          }
        });
      }
    }
    
    // Additional validation for empty fields during editing
    const requiredFields = ['name', 'email', 'location', 'availability'];
    const emptyFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
    
    if (emptyFields.length > 0) {
      emptyFields.forEach(field => {
        switch (field) {
          case 'name':
            newErrors[field] = 'Name is required';
            break;
          case 'email':
            newErrors[field] = 'Email is required';
            break;
          case 'location':
            newErrors[field] = 'Location is required';
            break;
          case 'availability':
            newErrors[field] = 'Availability is required';
            break;
        }
      });
    }
    
    // Skills validation - ensure at least one skill is selected in each category
    if (selectedOfferedSkills.length === 0) {
      newErrors.skills_offered = 'Please select at least one skill you can offer';
    }
    
    if (selectedWantedSkills.length === 0) {
      newErrors.skills_wanted = 'Please select at least one skill you want to learn';
    }
    
    return newErrors;
  };

  const handleSkillToggle = (skill, type) => {
    if (type === 'offered') {
      setSelectedOfferedSkills(prev => {
        const exists = prev.find(s => s.skill_id === skill.skill_id);
        if (exists) {
          return prev.filter(s => s.skill_id !== skill.skill_id);
        } else {
          // Clear skills_offered error when adding a skill
          if (errors.skills_offered) {
            setErrors(prevErrors => {
              const { skills_offered: _skills_offered, ...rest } = prevErrors;
              return rest;
            });
          }
          return [...prev, skill];
        }
      });
    } else {
      setSelectedWantedSkills(prev => {
        const exists = prev.find(s => s.skill_id === skill.skill_id);
        if (exists) {
          return prev.filter(s => s.skill_id !== skill.skill_id);
        } else {
          // Clear skills_wanted error when adding a skill
          if (errors.skills_wanted) {
            setErrors(prevErrors => {
              const { skills_wanted: _skills_wanted, ...rest } = prevErrors;
              return rest;
            });
          }
          return [...prev, skill];
        }
      });
    }
  };

  const handleSaveProfile = async () => {
    const newErrors = validateProfile();
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        // Prepare data for API
        const updateData = {
          name: formData.name,
          location: formData.location,
          availability: formData.availability,
          public_profile: formData.public_profile,
          skills_offered: selectedOfferedSkills.map(skill => skill.skill_name),
          skills_wanted: selectedWantedSkills.map(skill => skill.skill_name)
        };
        
        // Update profile via API
        const updatedProfile = await apiService.updateProfile(updateData);
        
        // Update local state with response
        setProfile({
          ...profile,
          ...updatedProfile,
          skills_offered: selectedOfferedSkills,
          skills_wanted: selectedWantedSkills,
          profile_completed: true
        });
        
        setIsEditing(false);
        console.log('Profile updated successfully');
      } catch (error) {
        console.error('Error updating profile:', error);
        // You could add a toast notification here
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
      
      // Show alert if there are validation errors
      const errorFields = Object.keys(newErrors);
      if (errorFields.length > 0) {
        const fieldNames = errorFields.map(field => {
          switch (field) {
            case 'name': return 'Name';
            case 'email': return 'Email';
            case 'location': return 'Location';
            case 'availability': return 'Availability';
            case 'skills_offered': return 'Skills You Offer';
            case 'skills_wanted': return 'Skills You Want to Learn';
            default: return field;
          }
        });
        
        const hasFieldErrors = errorFields.some(field => !['skills_offered', 'skills_wanted'].includes(field));
        const hasSkillErrors = errorFields.some(field => ['skills_offered', 'skills_wanted'].includes(field));
        
        let alertMessage = '';
        if (hasFieldErrors && hasSkillErrors) {
          alertMessage = `Please complete the following:\n• Fill in required fields: ${fieldNames.filter(name => !['Skills You Offer', 'Skills You Want to Learn'].includes(name)).join(', ')}\n• Select at least one skill for both offering and learning`;
        } else if (hasFieldErrors) {
          alertMessage = `Please fill in all required fields: ${fieldNames.join(', ')}`;
        } else if (hasSkillErrors) {
          alertMessage = `Please select at least one skill in both categories:\n• Skills you can offer\n• Skills you want to learn`;
        }
        
        alert(alertMessage);
      }
    }
  };

  const handleEditProfile = () => {
    setFormData({
      name: profile.name || '',
      email: profile.email || '',
      location: profile.location || '',
      availability: profile.availability || '',
      public_profile: profile.public_profile
    });
    setSelectedOfferedSkills(profile.skills_offered);
    setSelectedWantedSkills(profile.skills_wanted);
    setIsEditing(true);
  };

  const ProfileCompletionBanner = () => {
    if (profile.profile_completed) return null;
    
    return (
      <div className="bg-brand-amber text-white p-4 rounded-lg mb-6 animate-slideInLeft">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">Complete your profile</h3>
            <p className="text-sm opacity-90">Add your location, availability, and skills to get better matches!</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar currentUser={currentUser} />
      <div className="min-h-screen bg-gray-50 py-8 animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 animate-slideUp">
          <ProfileCompletionBanner />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-primaryDark rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-gray-600">{profile.email}</p>
                {profile.location && (
                  <p className="text-brand-primary font-medium">{profile.location}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  profile.profile_completed 
                    ? 'bg-brand-secondary text-white' 
                    : 'bg-brand-amber text-white'
                }`}>
                  {profile.profile_completed ? 'Profile Complete' : 'Profile Incomplete'}
                </div>
                
                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                  profile.public_profile 
                    ? 'bg-brand-primary text-white' 
                    : 'bg-gray-500 text-white'
                }`}>
                  {profile.public_profile ? (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                      </svg>
                      Public
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Private
                    </>
                  )}
                </div>
              </div>
              
              {!isEditing && (
                <button
                  onClick={handleEditProfile}
                  className="bg-brand-primary hover:bg-brand-primaryDark text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeInUp">
          {isEditing ? (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {profile.profile_completed ? 'Edit Profile' : 'Complete Your Profile'}
              </h2>

              {/* Personal Information Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>

                {/* Name Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-brand-primary">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300 ease-in-out transform focus:scale-105 ${
                      errors.name 
                        ? 'border-brand-accentRed focus:ring-brand-accentRed animate-shake' 
                        : 'border-gray-300 focus:ring-brand-primary hover:border-brand-primary'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-brand-accentRed animate-slideInLeft">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-brand-primary">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300 ease-in-out transform focus:scale-105 ${
                      errors.email 
                        ? 'border-brand-accentRed focus:ring-brand-accentRed animate-shake' 
                        : 'border-gray-300 focus:ring-brand-primary hover:border-brand-primary'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="mt-1 text-sm text-brand-accentRed animate-slideInLeft">{errors.email}</p>}
                </div>

                {/* Location Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-brand-primary">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300 ease-in-out transform focus:scale-105 ${
                      errors.location 
                        ? 'border-brand-accentRed focus:ring-brand-accentRed animate-shake' 
                        : 'border-gray-300 focus:ring-brand-primary hover:border-brand-primary'
                    }`}
                    placeholder="e.g., Mumbai, Delhi, Bangalore"
                  />
                  {errors.location && <p className="mt-1 text-sm text-brand-accentRed animate-slideInLeft">{errors.location}</p>}
                </div>

                {/* Availability Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-brand-primary">
                    Availability
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300 ease-in-out transform focus:scale-105 ${
                      errors.availability 
                        ? 'border-brand-accentRed focus:ring-brand-accentRed animate-shake' 
                        : 'border-gray-300 focus:ring-brand-primary hover:border-brand-primary'
                    }`}
                  >
                    <option value="">Select your availability</option>
                    <option value="Weekdays">Weekdays</option>
                    <option value="Weekends">Weekends</option>
                    <option value="Evenings">Evenings</option>
                    <option value="Flexible">Flexible</option>
                    <option value="Full-time">Full-time</option>
                  </select>
                  {errors.availability && <p className="mt-1 text-sm text-brand-accentRed animate-slideInLeft">{errors.availability}</p>}
                </div>

                {/* Profile Visibility Toggle */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-md font-medium text-gray-900 mb-1">Profile Visibility</h4>
                      <p className="text-sm text-gray-600">
                        {formData.public_profile 
                          ? 'Your profile is visible to other users and can be discovered through search'
                          : 'Your profile is private and only visible to you'
                        }
                      </p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="public_profile"
                          checked={formData.public_profile}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          {formData.public_profile ? 'Public' : 'Private'}
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-start">
                    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      formData.public_profile 
                        ? 'bg-brand-primary text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {formData.public_profile ? (
                        <>
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                          </svg>
                          Discoverable by others
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Only visible to you
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Skills Management</h3>
                
                {/* Skills I Can Offer */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Skills I Can Offer</h4>
                  
                  {/* Backend Skills Dropdown */}
                  <div className="relative mb-4">
                    <button
                      type="button"
                      onClick={() => setIsOfferedDropdownOpen(!isOfferedDropdownOpen)}
                      className={`w-full px-4 py-3 text-left border rounded-lg hover:border-brand-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200 ${
                        errors.skills_offered 
                          ? 'border-brand-accentRed' 
                          : 'border-gray-300'
                      }`}
                    >
                      <span className="block truncate">
                        {selectedOfferedSkills.filter(s => !s.skill_id.toString().startsWith('custom_')).length > 0
                          ? `${selectedOfferedSkills.filter(s => !s.skill_id.toString().startsWith('custom_')).length} skills selected`
                          : 'Select skills'
                        }
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOfferedDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>

                    {isOfferedDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {isLoadingSkills ? (
                          <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
                            <span className="ml-2 text-gray-600">Loading skills...</span>
                          </div>
                        ) : (
                          <div className="py-2">
                            {backendSkills.map((skill) => {
                              const isSelected = selectedOfferedSkills.find(s => s.skill_id === skill.skill_id);
                              return (
                                <label
                                  key={`offered-${skill.skill_id}`}
                                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={!!isSelected}
                                    onChange={() => handleSkillToggle(skill, 'offered')}
                                    className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
                                  />
                                  <span className="ml-3 text-gray-900">{skill.skill_name}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Custom Skills Input for Offered */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Other Skills (comma separated)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customOfferedSkills}
                        onChange={(e) => setCustomOfferedSkills(e.target.value)}
                        placeholder="e.g., React Native, Machine Learning, Blockchain"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => addCustomSkills(customOfferedSkills, 'offered')}
                        disabled={!customOfferedSkills.trim()}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          customOfferedSkills.trim()
                            ? 'bg-brand-primary text-white hover:bg-brand-primaryDark'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Display Selected Offered Skills */}
                  {selectedOfferedSkills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Selected skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedOfferedSkills.map((skill) => (
                          <span
                            key={`selected-offered-${skill.skill_id}`}
                            className={`px-3 py-1 rounded-full text-sm flex items-center ${
                              skill.skill_id.toString().startsWith('custom_')
                                ? 'bg-brand-primary bg-opacity-80 text-white border-2 border-brand-primary'
                                : 'bg-brand-primary text-white'
                            }`}
                          >
                            {skill.skill_name}
                            <button
                              type="button"
                              onClick={() => handleSkillToggle(skill, 'offered')}
                              className="ml-2 hover:bg-brand-primaryDark rounded-full p-1"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {errors.skills_offered && <p className="mt-1 text-sm text-brand-accentRed animate-slideInLeft">{errors.skills_offered}</p>}
                </div>

                {/* Skills I Want to Learn */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Skills I Want to Learn</h4>
                  
                  {/* Backend Skills Dropdown */}
                  <div className="relative mb-4">
                    <button
                      type="button"
                      onClick={() => setIsWantedDropdownOpen(!isWantedDropdownOpen)}
                      className={`w-full px-4 py-3 text-left border rounded-lg hover:border-brand-secondary focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all duration-200 ${
                        errors.skills_wanted 
                          ? 'border-brand-accentRed' 
                          : 'border-gray-300'
                      }`}
                    >
                      <span className="block truncate">
                        {selectedWantedSkills.filter(s => !s.skill_id.toString().startsWith('custom_')).length > 0
                          ? `${selectedWantedSkills.filter(s => !s.skill_id.toString().startsWith('custom_')).length} skills selected`
                          : 'Select skills'
                        }
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isWantedDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>

                    {isWantedDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {isLoadingSkills ? (
                          <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-secondary"></div>
                            <span className="ml-2 text-gray-600">Loading skills...</span>
                          </div>
                        ) : (
                          <div className="py-2">
                            {backendSkills.map((skill) => {
                              const isSelected = selectedWantedSkills.find(s => s.skill_id === skill.skill_id);
                              const isOffered = selectedOfferedSkills.find(s => s.skill_id === skill.skill_id);
                              return (
                                <label
                                  key={`wanted-${skill.skill_id}`}
                                  className={`flex items-center px-4 py-2 cursor-pointer ${
                                    isOffered ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={!!isSelected}
                                    disabled={!!isOffered}
                                    onChange={() => handleSkillToggle(skill, 'wanted')}
                                    className="h-4 w-4 text-brand-secondary focus:ring-brand-secondary border-gray-300 rounded disabled:opacity-50"
                                  />
                                  <span className={`ml-3 ${isOffered ? 'text-gray-400' : 'text-gray-900'}`}>
                                    {skill.skill_name}
                                    {isOffered && <span className="text-xs ml-1">(already offering)</span>}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Other Skills to Learn (comma separated)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customWantedSkills}
                        onChange={(e) => setCustomWantedSkills(e.target.value)}
                        placeholder="e.g., Flutter, DevOps, Cloud Computing"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => addCustomSkills(customWantedSkills, 'wanted')}
                        disabled={!customWantedSkills.trim()}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          customWantedSkills.trim()
                            ? 'bg-brand-secondary text-white hover:bg-brand-secondaryDark'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {selectedWantedSkills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Skills to learn:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedWantedSkills.map((skill) => (
                          <span
                            key={`selected-wanted-${skill.skill_id}`}
                            className={`px-3 py-1 rounded-full text-sm flex items-center ${
                              skill.skill_id.toString().startsWith('custom_')
                                ? 'bg-brand-secondary bg-opacity-80 text-white border-2 border-brand-secondary'
                                : 'bg-brand-secondary text-white'
                            }`}
                          >
                            {skill.skill_name}
                            <button
                              type="button"
                              onClick={() => handleSkillToggle(skill, 'wanted')}
                              className="ml-2 hover:bg-brand-secondaryDark rounded-full p-1"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-500 mt-2">Note: You cannot select skills you're already offering to learn.</p>
                  {errors.skills_wanted && <p className="mt-1 text-sm text-brand-accentRed animate-slideInLeft">{errors.skills_wanted}</p>}
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 relative ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed scale-95'
                      : Object.keys(errors).length > 0
                      ? 'bg-brand-accentRed hover:bg-red-600 text-white hover:scale-105 hover:shadow-lg active:scale-95'
                      : 'bg-brand-primary hover:bg-brand-primaryDark text-white hover:scale-105 hover:shadow-lg active:scale-95'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : Object.keys(errors).length > 0 ? (
                    'Please Fill All Fields'
                  ) : (
                    'Save Profile'
                  )}
                </button>
                
                {profile.profile_completed && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Location</h4>
                    <p className="text-gray-900">{profile.location || 'Not specified'}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Availability</h4>
                    <p className="text-gray-900">{profile.availability || 'Not specified'}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Profile Visibility</h4>
                    <p className="text-gray-900">{profile.public_profile ? 'Public' : 'Private'}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Member Since</h4>
                    <p className="text-gray-900">January 2025</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                
                {/* Skills Offered */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Offered</h4>
                  {profile.skills_offered.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {profile.skills_offered.map((skill) => (
                        <span
                          key={`display-offered-${skill.skill_id}`}
                          className={`px-4 py-2 rounded-full font-medium ${
                            skill.skill_id.toString().startsWith('custom_')
                              ? 'bg-brand-primary bg-opacity-80 text-white border-2 border-brand-primary'
                              : 'bg-brand-primary text-white'
                          }`}
                        >
                          {skill.skill_name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No skills offered yet</p>
                  )}
                </div>

                {/* Skills Wanted */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Wanted</h4>
                  {profile.skills_wanted.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {profile.skills_wanted.map((skill) => (
                        <span
                          key={`display-wanted-${skill.skill_id}`}
                          className={`px-4 py-2 rounded-full font-medium ${
                            skill.skill_id.toString().startsWith('custom_')
                              ? 'bg-brand-secondary bg-opacity-80 text-white border-2 border-brand-secondary'
                              : 'bg-brand-secondary text-white'
                          }`}
                        >
                          {skill.skill_name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No skills selected to learn yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default Profile;
