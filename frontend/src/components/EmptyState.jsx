const EmptyState = ({ onClearFilters }) => (
  <div className="text-center py-12 animate-fadeInUp">
    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.464-.881-6.08-2.33M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No profiles found</h3>
    <p className="text-gray-600 mb-4">
      Try adjusting your search terms or filters to find more profiles.
    </p>
    <button
      onClick={onClearFilters}
      className="text-brand-primary hover:text-brand-primaryDark font-medium"
    >
      Clear all filters
    </button>
  </div>
);

export default EmptyState;
