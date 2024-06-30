const analyzeCodeBase = require('./codeAnalysis');

const provideCodeSuggestions = async (codeBase) => {
  try {
    const analysisResults = await analyzeCodeBase(codeBase);
    if (!analysisResults || !analysisResults.suggestions) {
      console.error("No suggestions found or analysisResults is undefined.");
      return [];
    }

    console.log("Code suggestions provided based on analysis.");

    const groupedSuggestions = analysisResults.suggestions.reduce((acc, suggestion) => {
      if (!acc[suggestion.type]) {
        acc[suggestion.type] = [];
      }
      acc[suggestion.type].push(suggestion);
      return acc;
    }, {});

    const formattedSuggestions = Object.entries(groupedSuggestions).map(([type, suggestions]) => ({
      issueType: type,
      count: suggestions.length,
      suggestions: suggestions.map(s => ({
        severity: s.severity,
        description: s.description,
        location: s.location
      }))
    }));

    const totalIssues = analysisResults.suggestions.length;
    const severityCounts = analysisResults.suggestions.reduce((acc, s) => {
      acc[s.severity] = (acc[s.severity] || 0) + 1;
      return acc;
    }, {});

    return {
      summary: {
        totalIssues,
        severityCounts
      },
      detailedSuggestions: formattedSuggestions
    };
  } catch (error) {
    console.error("Error in provideCodeSuggestions:", error.message, error.stack);
    throw error;
  }
};

module.exports = { provideCodeSuggestions };