import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';
import { Navbar, Footer, LoadingSpinner } from '../components';

// Mock data for swap requests (keeping for potential fallback)
const _mockSwapRequests = {
  sent: [
    {
      id: 1,
      receiver: {
        user_id: 2,
        name: "Sarah Wilson",
        profile_pic: null
      },
      offered_skill: {
        skill_id: 4,
        skill_name: "UI/UX Design"
      },
      requested_skill: {
        skill_id: 1,
        skill_name: "Web Development"
      },
      message: "I'd love to learn web development from you! I have 3+ years of UI/UX experience.",
      status: "pending", // pending, accepted, rejected, cancelled, completed
      created_at: "2024-12-10T10:30:00Z",
      updated_at: "2024-12-10T10:30:00Z"
    },
    {
      id: 3,
      receiver: {
        user_id: 4,
        name: "Emily Chen",
        profile_pic: null
      },
      offered_skill: {
        skill_id: 28,
        skill_name: "Graphic Design"
      },
      requested_skill: {
        skill_id: 7,
        skill_name: "Digital Marketing"
      },
      message: "Looking to learn digital marketing strategies.",
      status: "rejected",
      created_at: "2024-12-05T16:45:00Z",
      updated_at: "2024-12-06T11:20:00Z"
    }
  ],
  received: [
    {
      id: 4,
      sender: {
        user_id: 5,
        name: "Alex Rivera",
        profile_pic: null
      },
      offered_skill: {
        skill_id: 8,
        skill_name: "Python Programming"
      },
      requested_skill: {
        skill_id: 4,
        skill_name: "UI/UX Design"
      },
      message: "Hi! I'm a Python developer looking to learn UI/UX. I can help you with automation and web scraping.",
      status: "pending",
      created_at: "2024-12-11T08:15:00Z",
      updated_at: "2024-12-11T08:15:00Z"
    },
    {
      id: 5,
      sender: {
        user_id: 6,
        name: "Maria Garcia",
        profile_pic: null
      },
      offered_skill: {
        skill_id: 9,
        skill_name: "Content Writing"
      },
      requested_skill: {
        skill_id: 5,
        skill_name: "Photography"
      },
      message: "I can help with content writing and copywriting in exchange for photography lessons.",
      status: "pending",
      created_at: "2024-12-10T19:30:00Z",
      updated_at: "2024-12-10T19:30:00Z"
    }
  ],
  accepted: [
    {
      id: 2,
      receiver: {
        user_id: 3,
        name: "John Davis",
        profile_pic: null
      },
      offered_skill: {
        skill_id: 5,
        skill_name: "Photography"
      },
      requested_skill: {
        skill_id: 6,
        skill_name: "Video Editing"
      },
      message: "I can teach photography basics in exchange for video editing skills.",
      status: "accepted",
      created_at: "2024-12-08T14:20:00Z",
      updated_at: "2024-12-09T09:15:00Z",
      type: "sent" // indicates this was originally a sent request
    },
    {
      id: 6,
      sender: {
        user_id: 7,
        name: "David Kim",
        profile_pic: null
      },
      offered_skill: {
        skill_id: 10,
        skill_name: "Data Analysis"
      },
      requested_skill: {
        skill_id: 28,
        skill_name: "Graphic Design"
      },
      message: "I'm a data analyst wanting to learn graphic design for better data visualization.",
      status: "accepted",
      created_at: "2024-11-28T12:00:00Z",
      updated_at: "2024-12-05T15:30:00Z",
      type: "received", // indicates this was originally a received request
      feedback: {
        rating: 5,
        comment: "Excellent teacher! David was very patient and taught me advanced Excel techniques."
      }
    }
  ]
};

const MySwapRequests = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [swapRequests, setSwapRequests] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sent'); // 'sent', 'received', or 'accepted'
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (!currentUser?.isLoggedIn) {
      navigate('/login');
      return;
    }

    // Fetch swap requests from API
    const fetchSwapRequests = async () => {
      setIsLoading(true);
      try {
        const [sentRequests, receivedRequests] = await Promise.all([
          apiService.getSentSwapRequests(),
          apiService.getReceivedSwapRequests()
        ]);
        
        // Handle empty responses
        const sentData = Array.isArray(sentRequests) ? sentRequests : [];
        const receivedData = Array.isArray(receivedRequests) ? receivedRequests : [];
        
        setSwapRequests({
          sent: sentData,
          received: receivedData,
          accepted: [...sentData, ...receivedData].filter(req => req.status === 'accepted')
        });
      } catch (error) {
        console.error('Error fetching swap requests:', error);
        // Provide user-friendly error handling
        if (error.message.includes('404')) {
          console.log('No swap requests found (empty database) - showing empty state');
        } else if (error.message.includes('401')) {
          console.error('Authentication failed - redirecting to login');
          navigate('/login');
          return;
        } else {
          console.error('Network or server error:', error.message);
        }
        
        // Always set empty arrays as fallback to prevent crashes
        setSwapRequests({
          sent: [],
          received: [],
          accepted: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSwapRequests();
  }, [currentUser.isLoggedIn, navigate]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSwapAction = async (swapId, action) => {
    try {
      setIsSubmittingAction(true);
      
      // Call appropriate API endpoint
      switch (action) {
        case 'accept':
          await apiService.acceptSwapRequest(swapId);
          break;
        case 'reject':
          await apiService.rejectSwapRequest(swapId);
          break;
        case 'cancel':
          await apiService.cancelSwapRequest(swapId);
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      // Update local state based on the action
      setSwapRequests(prev => {
        if (!prev) {
          console.warn('No previous swap requests data available');
          return { sent: [], received: [], accepted: [] };
        }
        
        const newState = { ...prev };
        
        if (activeTab === 'sent') {
          const swapToMove = prev.sent?.find(swap => swap.id === swapId);
          if (action === 'accept') {
            // Move to accepted tab
            newState.accepted = [...(prev.accepted || []), { 
              ...swapToMove, 
              status: 'accepted', 
              updated_at: new Date().toISOString(),
              type: 'sent'
            }];
            // Remove from sent
            newState.sent = (prev.sent || []).filter(swap => swap.id !== swapId);
          } else {
            newState.sent = (prev.sent || []).map(swap => 
              swap.id === swapId 
                ? { ...swap, status: action === 'cancel' ? 'cancelled' : action, updated_at: new Date().toISOString() }
                : swap
            );
          }
        } else if (activeTab === 'received') {
          const swapToMove = prev.received?.find(swap => swap.id === swapId);
          if (action === 'accept') {
            // Move to accepted tab
            newState.accepted = [...(prev.accepted || []), { 
              ...swapToMove, 
              status: 'accepted', 
              updated_at: new Date().toISOString(),
              type: 'received'
            }];
            // Remove from received
            newState.received = (prev.received || []).filter(swap => swap.id !== swapId);
          } else {
            newState.received = (prev.received || []).map(swap => 
              swap.id === swapId 
                ? { ...swap, status: action, updated_at: new Date().toISOString() }
                : swap
            );
          }
        }
        
        return newState;
      });

      const actionMessages = {
        accept: 'Swap request accepted! 🎉 You can now provide feedback.',
        reject: 'Swap request rejected.',
        cancel: 'Swap request cancelled.'
      };
      
      alert(actionMessages[action] || 'Action completed.');
      
      // If accepted, switch to accepted tab
      if (action === 'accept') {
        setActiveTab('accepted');
      }
    } catch (error) {
      console.error(`Error ${action}ing swap request:`, error);
      let errorMessage = `Failed to ${action} swap request.`;
      
      if (error.message.includes('404')) {
        errorMessage = 'Swap request not found or no longer available.';
      } else if (error.message.includes('403')) {
        errorMessage = 'You are not authorized to perform this action.';
      } else if (error.message.includes('400')) {
        errorMessage = 'This swap request cannot be modified in its current state.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Your session has expired. Please log in again.';
        navigate('/login');
        return;
      }
      
      alert(errorMessage + ' Please try again.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const openFeedbackModal = (swap) => {
    setSelectedSwap(swap);
    setShowFeedbackModal(true);
    setFeedbackRating(5);
    setFeedbackComment('');
  };

  const submitFeedback = async () => {
    if (!feedbackComment.trim()) {
      alert('Please provide feedback before submitting.');
      return;
    }

    try {
      const feedbackData = {
        swap_id: selectedSwap.id,
        rating: feedbackRating,
        comment: feedbackComment.trim()
      };

      console.log('Submitting feedback:', feedbackData);

      // const response = await fetch('/api/swap-feedback', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(feedbackData)
      // });

      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state to show feedback submitted
      setSwapRequests(prev => {
        const newState = { ...prev };
        if (activeTab === 'sent') {
          newState.sent = prev.sent.map(swap => 
            swap.id === selectedSwap.id 
              ? { ...swap, feedback: { rating: feedbackRating, comment: feedbackComment } }
              : swap
          );
        } else if (activeTab === 'received') {
          newState.received = prev.received.map(swap => 
            swap.id === selectedSwap.id 
              ? { ...swap, feedback: { rating: feedbackRating, comment: feedbackComment } }
              : swap
          );
        } else if (activeTab === 'accepted') {
          newState.accepted = prev.accepted.map(swap => 
            swap.id === selectedSwap.id 
              ? { ...swap, feedback: { rating: feedbackRating, comment: feedbackComment } }
              : swap
          );
        }
        return newState;
      });

      alert('Feedback submitted successfully! 🌟');
      setShowFeedbackModal(false);
      setSelectedSwap(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-6 h-6 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } fill-current ${interactive ? 'cursor-pointer hover:text-yellow-300 transform hover:scale-110 transition-all duration-200' : ''}`}
            viewBox="0 0 20 20"
            onClick={interactive ? () => onRatingChange(star) : undefined}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const renderSwapCard = (swap, type) => {
    // For accepted tab, determine the type from the swap data
    const cardType = type === 'accepted' ? swap.type : type;
    const otherUser = cardType === 'sent' ? swap.receiver : swap.sender;
    const isAccepted = swap.status === 'accepted';
    const canLeaveFeedback = isAccepted && !swap.feedback;

    return (
      <div key={swap.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-primaryDark rounded-full flex items-center justify-center text-white text-sm font-bold">
              {getInitials(otherUser.name)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
              <p className="text-sm text-gray-500">
                {type === 'accepted' 
                  ? (cardType === 'sent' ? 'You requested from' : 'Requested from you')
                  : (type === 'sent' ? 'You requested from' : 'Requested from you')
                }
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(swap.status)}`}>
            {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
          </span>
        </div>

        {/* Skills Exchange */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-xs font-medium text-green-700 mb-1">
              {(type === 'accepted' ? cardType : type) === 'sent' ? 'You Offer' : 'They Offer'}
            </p>
            <p className="font-semibold text-gray-900">{swap.offered_skill.skill_name}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs font-medium text-blue-700 mb-1">
              {(type === 'accepted' ? cardType : type) === 'sent' ? 'You Want' : 'They Want'}
            </p>
            <p className="font-semibold text-gray-900">{swap.requested_skill.skill_name}</p>
          </div>
        </div>

        {/* Message */}
        {swap.message && (
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-gray-700">"{swap.message}"</p>
          </div>
        )}

        {/* Feedback (if exists) */}
        {swap.feedback && (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-yellow-800">Your Feedback</p>
              {renderStars(swap.feedback.rating)}
            </div>
            <p className="text-sm text-gray-700">"{swap.feedback.comment}"</p>
          </div>
        )}

        {/* Timestamps */}
        <div className="text-xs text-gray-500 mb-4">
          <p>Created: {formatDate(swap.created_at)}</p>
          <p>Updated: {formatDate(swap.updated_at)}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {type === 'received' && swap.status === 'pending' && (
            <>
              <button
                onClick={() => handleSwapAction(swap.id, 'accept')}
                disabled={isSubmittingAction}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 text-sm"
              >
                Accept
              </button>
              <button
                onClick={() => handleSwapAction(swap.id, 'reject')}
                disabled={isSubmittingAction}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 text-sm"
              >
                Reject
              </button>
            </>
          )}

          {type === 'sent' && swap.status === 'pending' && (
            <button
              onClick={() => handleSwapAction(swap.id, 'cancel')}
              disabled={isSubmittingAction}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 text-sm"
            >
              Cancel
            </button>
          )}

          {canLeaveFeedback && (
            <button
              onClick={() => openFeedbackModal(swap)}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primaryDark transition-colors duration-200 text-sm"
            >
              Leave Feedback
            </button>
          )}

          <button
            onClick={() => navigate(`/profile/${otherUser.user_id}`)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
          >
            View Profile
          </button>
        </div>
      </div>
    );
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

  const currentRequests = activeTab === 'sent' 
    ? swapRequests?.sent || [] 
    : activeTab === 'received' 
      ? swapRequests?.received || []
      : swapRequests?.accepted || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar currentUser={currentUser} />
      
      <main className="flex-grow py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Swap Requests</h1>
            <p className="text-gray-600">Manage your skill exchange requests and track their progress</p>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'sent'
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Requests Sent ({swapRequests?.sent?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('received')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'received'
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Requests Received ({swapRequests?.received?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('accepted')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'accepted'
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Accepted ({swapRequests?.accepted?.length || 0})
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          {currentRequests.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No {activeTab === 'sent' ? 'sent' : activeTab === 'received' ? 'received' : 'accepted'} requests
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'sent' 
                  ? "You haven't sent any swap requests yet."
                  : activeTab === 'received'
                    ? "You haven't received any swap requests yet."
                    : "You don't have any accepted swap requests yet."
                }
              </p>
              {activeTab === 'sent' && (
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primaryDark"
                  >
                    Browse Skills
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentRequests.map(swap => renderSwapCard(swap, activeTab))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Feedback Modal */}
      {showFeedbackModal && selectedSwap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Leave Feedback</h3>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-primaryDark rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {getInitials((activeTab === 'accepted' ? 
                      (selectedSwap.type === 'sent' ? selectedSwap.receiver : selectedSwap.sender) :
                      (activeTab === 'sent' ? selectedSwap.receiver : selectedSwap.sender)
                    ).name)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {(activeTab === 'accepted' ? 
                        (selectedSwap.type === 'sent' ? selectedSwap.receiver : selectedSwap.sender) :
                        (activeTab === 'sent' ? selectedSwap.receiver : selectedSwap.sender)
                      ).name}
                    </p>
                    <p className="text-sm text-gray-600">How was your experience?</p>
                  </div>
                </div>

                {/* Skills Exchange Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-xs font-medium text-green-700 mb-1">You Offered</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedSwap.offered_skill.skill_name}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-xs font-medium text-blue-700 mb-1">You Learned</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedSwap.requested_skill.skill_name}</p>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Rate Your Experience
                  </label>
                  <div className="flex items-center justify-center space-x-1">
                    {renderStars(feedbackRating, true, setFeedbackRating)}
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    {feedbackRating === 1 && "Poor"}
                    {feedbackRating === 2 && "Fair"}
                    {feedbackRating === 3 && "Good"}
                    {feedbackRating === 4 && "Very Good"}
                    {feedbackRating === 5 && "Excellent"}
                  </p>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Feedback <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Share your experience with this skill exchange... What did you learn? How was the teaching? Would you recommend this person?"
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {feedbackComment.length}/500 characters
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={submitFeedback}
                  disabled={!feedbackComment.trim()}
                  className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primaryDark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySwapRequests;
