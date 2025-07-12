const LoadingSpinner = ({ message = "Loading amazing profiles..." }) => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
    <span className="ml-4 text-lg text-gray-600">{message}</span>
  </div>
);

export default LoadingSpinner;
