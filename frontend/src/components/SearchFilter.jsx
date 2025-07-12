const SearchFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedSkillFilter, 
  setSelectedSkillFilter, 
  allSkills,
  isLoading,
  displayedProfiles,
  filteredProfiles,
  profiles
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-slideUp">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search by name/location */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search by Name or Location
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., Sarah, Mumbai, Delhi..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200"
            />
            <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filter by skill */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Skill
          </label>
          <select
            value={selectedSkillFilter}
            onChange={(e) => setSelectedSkillFilter(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200"
          >
            <option value="">All Skills</option>
            {allSkills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        {/* Clear filters */}
        {(searchTerm || selectedSkillFilter) && (
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSkillFilter('');
              }}
              className="px-6 py-3 text-brand-primary border border-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition-all duration-200 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-gray-600">
        {isLoading ? (
          <span>Loading profiles...</span>
        ) : (
          <span>
            Showing {displayedProfiles.length} of {filteredProfiles.length} profiles
            {filteredProfiles.length !== profiles.length && (
              <span className="text-gray-500"> (filtered from {profiles.length} total)</span>
            )}
            {(searchTerm || selectedSkillFilter) && (
              <span className="ml-1">
                {searchTerm && `matching "${searchTerm}"`}
                {searchTerm && selectedSkillFilter && ' and '}
                {selectedSkillFilter && `with skill "${selectedSkillFilter}"`}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
