// Intent recognition service for data analysis queries

export interface IntentResult {
  type: string;
  confidence: number;
  query: string;
  parameters?: Record<string, any>;
  sqlQuery?: string;
  description?: string;
}

export interface IntentPattern {
  type: string;
  patterns: RegExp[];
  description: string;
  sqlTemplate: string;
  confidence: number;
}

// Define intent patterns for different types of data analysis queries
const intentPatterns: IntentPattern[] = [
  {
    type: 'unicorn_count_by_country',
    patterns: [
      /count.*unicorns.*country|unicorns.*per.*country|how many.*unicorns.*each.*country/i,
      /number.*unicorns.*country|unicorn.*distribution.*country/i,
      /countries.*most.*unicorns|which.*countries.*unicorns/i,
      /top.*countries.*unicorn|countries.*most.*unicorn.*companies/i,
      /show.*top.*countries.*unicorn|countries.*with.*most.*unicorn/i
    ],
    description: 'Count of unicorn companies by country',
    sqlTemplate: 'SELECT country, COUNT(*) as count FROM unicorns GROUP BY country ORDER BY count DESC',
    confidence: 0.9
  },
  {
    type: 'unicorn_density',
    patterns: [
      /countries.*highest.*density|density.*unicorns|unicorns.*per.*capita/i,
      /密度最高的国家|独角兽.*密度/i,
      /unicorn.*density.*country|countries.*dense.*unicorns/i
    ],
    description: 'Countries with highest unicorn density per capita',
    sqlTemplate: 'SELECT country, COUNT(*) as count, (COUNT(*) / population * 1000000) as density FROM unicorns GROUP BY country ORDER BY density DESC',
    confidence: 0.9
  },
  {
    type: 'valuation_by_industry',
    patterns: [
      /valuation.*industry|industry.*valuation|compare.*valuation.*industry/i,
      /估值.*行业|行业.*估值/i,
      /total.*valuation.*industry|industry.*worth/i
    ],
    description: 'Total and average valuation by industry',
    sqlTemplate: 'SELECT industry, SUM(valuation) as total_valuation, AVG(valuation) as average_valuation, COUNT(*) as count FROM unicorns GROUP BY industry ORDER BY total_valuation DESC',
    confidence: 0.85
  },
  {
    type: 'unicorns_by_year',
    patterns: [
      /unicorns.*year|year.*unicorns|founded.*year|joined.*year/i,
      /number.*unicorns.*founded|unicorns.*over.*time|yearly.*count/i,
      /past.*decades?|two.*decades|over.*time/i
    ],
    description: 'Number of unicorns founded or joined each year',
    sqlTemplate: 'SELECT EXTRACT(YEAR FROM date_joined) as year, COUNT(*) as count FROM unicorns GROUP BY year ORDER BY year',
    confidence: 0.8
  },
  {
    type: 'top_cities',
    patterns: [
      /cities.*most.*unicorns|top.*cities|which.*cities.*unicorns/i,
      /unicorns.*city|city.*unicorns|cities.*highest/i,
      /saas.*cities|cities.*saas/i
    ],
    description: 'Cities with the most unicorn companies',
    sqlTemplate: 'SELECT city, country, COUNT(*) as count FROM unicorns GROUP BY city, country ORDER BY count DESC LIMIT 10',
    confidence: 0.8
  },
  {
    type: 'fintech_vs_other',
    patterns: [
      /fintech.*vs|compare.*fintech|fintech.*other|fintech.*health/i,
      /fintech.*healthtech|fintech.*vs.*health/i,
      /funding.*fintech.*health/i
    ],
    description: 'Compare fintech companies with other industries',
    sqlTemplate: 'SELECT CASE WHEN industry = \'Fintech\' THEN \'Fintech\' ELSE \'Other\' END as category, COUNT(*) as count, SUM(valuation) as total_valuation FROM unicorns GROUP BY category',
    confidence: 0.85
  },
  {
    type: 'sf_vs_ny',
    patterns: [
      /sf.*vs.*ny|san francisco.*new york|compare.*sf.*ny/i,
      /sf.*ny|san francisco.*vs|new york.*vs/i,
      /unicorns.*sf.*ny/i
    ],
    description: 'Compare unicorns in San Francisco vs New York',
    sqlTemplate: 'SELECT city, COUNT(*) as count, SUM(valuation) as total_valuation FROM unicorns WHERE city IN (\'San Francisco\', \'New York\') GROUP BY city',
    confidence: 0.9
  },
  {
    type: 'us_vs_china',
    patterns: [
      /us.*vs.*china|united states.*china|america.*china/i,
      /compare.*us.*china|us.*china.*valuation|us.*china.*unicorns/i,
      /unicorns.*us.*china/i
    ],
    description: 'Compare unicorns in US vs China',
    sqlTemplate: 'SELECT country, COUNT(*) as count, SUM(valuation) as total_valuation FROM unicorns WHERE country IN (\'United States\', \'China\') GROUP BY country',
    confidence: 0.9
  },
  {
    type: 'top_investors',
    patterns: [
      /investors.*most.*unicorns|top.*investors|which.*investors/i,
      /investors.*unicorns|most.*active.*investors/i,
      /best.*investors|leading.*investors/i
    ],
    description: 'Investors with the most unicorn investments',
    sqlTemplate: 'SELECT select_investors, COUNT(*) as count FROM unicorns GROUP BY select_investors ORDER BY count DESC LIMIT 10',
    confidence: 0.7
  },
  {
    type: 'ai_vs_biotech',
    patterns: [
      /ai.*vs.*biotech|artificial intelligence.*biotech|ai.*biotech/i,
      /compare.*ai.*biotech|ai.*companies.*biotech/i,
      /valuation.*ai.*biotech/i
    ],
    description: 'Compare AI companies vs biotech companies',
    sqlTemplate: 'SELECT CASE WHEN industry LIKE \'%AI%\' OR industry LIKE \'%Artificial Intelligence%\' THEN \'AI\' WHEN industry LIKE \'%Biotech%\' OR industry LIKE \'%Healthcare%\' THEN \'Biotech\' ELSE \'Other\' END as category, AVG(valuation) as average_valuation, COUNT(*) as count FROM unicorns WHERE category != \'Other\' GROUP BY category',
    confidence: 0.8
  },
  {
    type: 'cumulative_valuation',
    patterns: [
      /cumulative.*valuation|total.*valuation.*time|valuation.*over.*time/i,
      /cumulative.*total|total.*value.*time/i,
      /display.*cumulative/i
    ],
    description: 'Cumulative total valuation of unicorns over time',
    sqlTemplate: 'SELECT EXTRACT(YEAR FROM date_joined) as year, SUM(SUM(valuation)) OVER (ORDER BY EXTRACT(YEAR FROM date_joined)) as cumulative_valuation FROM unicorns GROUP BY year ORDER BY year',
    confidence: 0.8
  }
];

export class IntentRecognitionService {
  private patterns: IntentPattern[] = intentPatterns;

  recognizeIntent(message: string): IntentResult {
    const normalizedMessage = message.toLowerCase().trim();

    // Try to match against known patterns
    for (const pattern of this.patterns) {
      for (const regex of pattern.patterns) {
        if (regex.test(normalizedMessage)) {
          return {
            type: pattern.type,
            confidence: pattern.confidence,
            query: message,
            sqlQuery: pattern.sqlTemplate,
            description: pattern.description,
            parameters: this.extractParameters(message, pattern.type)
          };
        }
      }
    }

    // If no specific pattern matches, check for general data-related keywords
    const dataKeywords = [
      'show', 'display', 'chart', 'graph', 'data', 'analysis', 'compare',
      'unicorn', 'company', 'valuation', 'industry', 'country', 'city'
    ];

    const hasDataKeywords = dataKeywords.some(keyword =>
      normalizedMessage.includes(keyword)
    );

    if (hasDataKeywords) {
      return {
        type: 'general_data_query',
        confidence: 0.6,
        query: message,
        description: 'General data analysis query',
        sqlQuery: 'SELECT company, valuation, country, industry FROM unicorns ORDER BY valuation DESC LIMIT 10'
      };
    }

    // Default to general conversation
    return {
      type: 'general_conversation',
      confidence: 0.3,
      query: message,
      description: 'General conversation, not data-related'
    };
  }

  private extractParameters(message: string, intentType: string): Record<string, any> {
    const params: Record<string, any> = {};
    const normalizedMessage = message.toLowerCase();

    // Extract year ranges
    const yearMatch = normalizedMessage.match(/(\d{4})/g);
    if (yearMatch) {
      params.years = yearMatch.map(y => parseInt(y));
    }

    // Extract specific time periods
    if (normalizedMessage.includes('decade')) {
      const currentYear = new Date().getFullYear();
      params.yearRange = [currentYear - 10, currentYear];
    }
    if (normalizedMessage.includes('two decades')) {
      const currentYear = new Date().getFullYear();
      params.yearRange = [currentYear - 20, currentYear];
    }

    // Extract countries
    const countries = ['united states', 'china', 'uk', 'sweden', 'australia', 'brazil'];
    const mentionedCountries = countries.filter(country =>
      normalizedMessage.includes(country)
    );
    if (mentionedCountries.length > 0) {
      params.countries = mentionedCountries;
    }

    // Extract cities
    const cities = ['san francisco', 'new york', 'london', 'beijing', 'stockholm'];
    const mentionedCities = cities.filter(city =>
      normalizedMessage.includes(city)
    );
    if (mentionedCities.length > 0) {
      params.cities = mentionedCities;
    }

    // Extract industries
    const industries = ['fintech', 'software', 'healthcare', 'ai', 'biotech', 'saas'];
    const mentionedIndustries = industries.filter(industry =>
      normalizedMessage.includes(industry)
    );
    if (mentionedIndustries.length > 0) {
      params.industries = mentionedIndustries;
    }

    // Extract limit/top numbers
    const limitMatch = normalizedMessage.match(/top\s+(\d+)|first\s+(\d+)|(\d+)\s+most/);
    if (limitMatch) {
      params.limit = parseInt(limitMatch[1] || limitMatch[2] || limitMatch[3]);
    }

    return params;
  }

  // Get all available intent types for debugging
  getAvailableIntents(): string[] {
    return this.patterns.map(p => p.type);
  }

  // Get pattern details for a specific intent type
  getIntentDetails(intentType: string): IntentPattern | undefined {
    return this.patterns.find(p => p.type === intentType);
  }

  // Add custom intent pattern
  addIntentPattern(pattern: IntentPattern): void {
    this.patterns.push(pattern);
  }

  // Test a message against all patterns (for debugging)
  testAllPatterns(message: string): Array<{ type: string; matched: boolean; confidence: number }> {
    return this.patterns.map(pattern => {
      const matched = pattern.patterns.some(regex => regex.test(message.toLowerCase()));
      return {
        type: pattern.type,
        matched,
        confidence: matched ? pattern.confidence : 0
      };
    });
  }
}

// Export singleton instance
export const intentRecognitionService = new IntentRecognitionService();
