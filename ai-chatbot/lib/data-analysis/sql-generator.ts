// SQL generation service for data analysis queries

import { IntentResult } from './intent-recognition';
import { QueryResult } from './mock-data';

export interface SQLQueryResult {
  query: string;
  explanation: string;
  estimatedRows: number;
  executionTime: number;
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'area' | 'pie';
  title: string;
  description?: string;
  takeaway?: string;
  xKey: string;
  yKeys: string[];
  legend?: boolean;
  multipleLines?: boolean;
  measurementColumn?: string;
}

export class SQLGeneratorService {
  // Generate SQL query based on intent
  generateSQL(intent: IntentResult): SQLQueryResult {
    const baseQuery = intent.sqlQuery || this.getDefaultQuery(intent.type);
    const optimizedQuery = this.optimizeQuery(baseQuery, intent.parameters);
    
    return {
      query: optimizedQuery,
      explanation: this.generateExplanation(optimizedQuery, intent),
      estimatedRows: this.estimateRowCount(intent.type),
      executionTime: Math.random() * 100 + 50 // Mock execution time in ms
    };
  }

  // Generate chart configuration based on query results and intent
  generateChartConfig(intent: IntentResult, results: QueryResult[]): ChartConfig | null {
    if (!results || results.length === 0) return null;

    const firstRow = results[0];
    const columns = Object.keys(firstRow);
    
    // Determine chart type based on intent and data structure
    const chartType = this.determineChartType(intent.type, columns, results.length);
    
    // Determine x and y keys
    const { xKey, yKeys } = this.determineAxes(columns, intent.type);
    
    return {
      type: chartType,
      title: this.generateChartTitle(intent),
      description: this.generateChartDescription(intent, results),
      takeaway: this.generateTakeaway(intent, results),
      xKey,
      yKeys,
      legend: yKeys.length > 1,
      multipleLines: chartType === 'line' && yKeys.length > 1
    };
  }

  private getDefaultQuery(intentType: string): string {
    const defaultQueries: Record<string, string> = {
      'unicorn_count_by_country': 'SELECT country, COUNT(*) as count FROM unicorns GROUP BY country ORDER BY count DESC',
      'unicorn_density': 'SELECT country, COUNT(*) as count FROM unicorns GROUP BY country ORDER BY count DESC',
      'valuation_by_industry': 'SELECT industry, SUM(valuation) as total_valuation, AVG(valuation) as average_valuation, COUNT(*) as count FROM unicorns GROUP BY industry ORDER BY total_valuation DESC',
      'unicorns_by_year': 'SELECT EXTRACT(YEAR FROM date_joined) as year, COUNT(*) as count FROM unicorns GROUP BY year ORDER BY year',
      'top_cities': 'SELECT city, country, COUNT(*) as count FROM unicorns GROUP BY city, country ORDER BY count DESC LIMIT 10',
      'fintech_vs_other': 'SELECT CASE WHEN industry = \'Fintech\' THEN \'Fintech\' ELSE \'Other\' END as category, COUNT(*) as count, SUM(valuation) as total_valuation FROM unicorns GROUP BY category',
      'sf_vs_ny': 'SELECT city, COUNT(*) as count, SUM(valuation) as total_valuation FROM unicorns WHERE city IN (\'San Francisco\', \'New York\') GROUP BY city',
      'us_vs_china': 'SELECT country, COUNT(*) as count, SUM(valuation) as total_valuation FROM unicorns WHERE country IN (\'United States\', \'China\') GROUP BY country',
      'general_data_query': 'SELECT company, valuation, country, industry FROM unicorns ORDER BY valuation DESC LIMIT 10'
    };

    return defaultQueries[intentType] || defaultQueries['general_data_query'];
  }

  private optimizeQuery(baseQuery: string, parameters?: Record<string, any>): string {
    let optimizedQuery = baseQuery;

    if (!parameters) return optimizedQuery;

    // Apply limit if specified
    if (parameters.limit && !optimizedQuery.includes('LIMIT')) {
      optimizedQuery += ` LIMIT ${parameters.limit}`;
    }

    // Apply year range filter
    if (parameters.yearRange) {
      const [startYear, endYear] = parameters.yearRange;
      if (!optimizedQuery.includes('WHERE')) {
        optimizedQuery = optimizedQuery.replace(
          'FROM unicorns',
          `FROM unicorns WHERE EXTRACT(YEAR FROM date_joined) BETWEEN ${startYear} AND ${endYear}`
        );
      } else {
        optimizedQuery = optimizedQuery.replace(
          'WHERE',
          `WHERE EXTRACT(YEAR FROM date_joined) BETWEEN ${startYear} AND ${endYear} AND`
        );
      }
    }

    // Apply country filter
    if (parameters.countries && parameters.countries.length > 0) {
      const countryList = parameters.countries.map((c: string) => `'${c}'`).join(', ');
      if (!optimizedQuery.includes('WHERE')) {
        optimizedQuery = optimizedQuery.replace(
          'FROM unicorns',
          `FROM unicorns WHERE country IN (${countryList})`
        );
      } else {
        optimizedQuery = optimizedQuery.replace(
          'WHERE',
          `WHERE country IN (${countryList}) AND`
        );
      }
    }

    // Apply industry filter
    if (parameters.industries && parameters.industries.length > 0) {
      const industryList = parameters.industries.map((i: string) => `'${i}'`).join(', ');
      if (!optimizedQuery.includes('WHERE')) {
        optimizedQuery = optimizedQuery.replace(
          'FROM unicorns',
          `FROM unicorns WHERE industry IN (${industryList})`
        );
      } else {
        optimizedQuery = optimizedQuery.replace(
          'WHERE',
          `WHERE industry IN (${industryList}) AND`
        );
      }
    }

    return optimizedQuery;
  }

  private generateExplanation(query: string, intent: IntentResult): string {
    const parts = [];
    
    // Explain SELECT clause
    if (query.includes('SELECT')) {
      const selectMatch = query.match(/SELECT\s+(.*?)\s+FROM/i);
      if (selectMatch) {
        const columns = selectMatch[1];
        if (columns.includes('COUNT(*)')) {
          parts.push('Count the number of records');
        }
        if (columns.includes('SUM(')) {
          parts.push('Calculate total values');
        }
        if (columns.includes('AVG(')) {
          parts.push('Calculate average values');
        }
      }
    }

    // Explain FROM clause
    parts.push('from the unicorns dataset');

    // Explain WHERE clause
    if (query.includes('WHERE')) {
      parts.push('filtered by specific conditions');
    }

    // Explain GROUP BY clause
    if (query.includes('GROUP BY')) {
      const groupMatch = query.match(/GROUP BY\s+(.*?)(?:\s+ORDER|\s+LIMIT|$)/i);
      if (groupMatch) {
        parts.push(`grouped by ${groupMatch[1]}`);
      }
    }

    // Explain ORDER BY clause
    if (query.includes('ORDER BY')) {
      const orderMatch = query.match(/ORDER BY\s+(.*?)(?:\s+LIMIT|$)/i);
      if (orderMatch) {
        const orderBy = orderMatch[1];
        if (orderBy.includes('DESC')) {
          parts.push('sorted in descending order');
        } else {
          parts.push('sorted in ascending order');
        }
      }
    }

    // Explain LIMIT clause
    if (query.includes('LIMIT')) {
      const limitMatch = query.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        parts.push(`limited to top ${limitMatch[1]} results`);
      }
    }

    return parts.join(', ') + '.';
  }

  private estimateRowCount(intentType: string): number {
    const estimates: Record<string, number> = {
      'unicorn_count_by_country': 15,
      'unicorn_density': 10,
      'valuation_by_industry': 8,
      'unicorns_by_year': 12,
      'top_cities': 10,
      'fintech_vs_other': 2,
      'sf_vs_ny': 2,
      'us_vs_china': 2,
      'general_data_query': 10
    };

    return estimates[intentType] || 10;
  }

  private determineChartType(intentType: string, columns: string[], rowCount: number): 'bar' | 'line' | 'area' | 'pie' {
    // Time-based data should use line charts
    if (columns.includes('year') || intentType.includes('year') || intentType.includes('time')) {
      return 'line';
    }

    // Comparison data with few categories should use pie charts
    if (rowCount <= 5 && (intentType.includes('vs') || intentType.includes('comparison'))) {
      return 'pie';
    }

    // Cumulative data should use area charts
    if (intentType.includes('cumulative') || columns.some(col => col.includes('cumulative'))) {
      return 'area';
    }

    // Default to bar chart for most cases
    return 'bar';
  }

  private determineAxes(columns: string[], intentType: string): { xKey: string; yKeys: string[] } {
    // Find the categorical column (x-axis)
    const categoricalColumns = columns.filter(col => 
      ['country', 'city', 'industry', 'category', 'year', 'company'].some(cat => col.includes(cat))
    );
    
    // Find the numerical columns (y-axis)
    const numericalColumns = columns.filter(col => 
      ['count', 'valuation', 'total', 'average', 'density', 'cumulative'].some(num => col.includes(num))
    );

    const xKey = categoricalColumns[0] || columns[0];
    const yKeys = numericalColumns.length > 0 ? numericalColumns : [columns[1] || 'count'];

    return { xKey, yKeys };
  }

  private generateChartTitle(intent: IntentResult): string {
    const titleMap: Record<string, string> = {
      'unicorn_count_by_country': 'Unicorn Companies by Country',
      'unicorn_density': 'Unicorn Density by Country',
      'valuation_by_industry': 'Total Valuation by Industry',
      'unicorns_by_year': 'Unicorns Founded by Year',
      'top_cities': 'Top Cities by Unicorn Count',
      'fintech_vs_other': 'Fintech vs Other Industries',
      'sf_vs_ny': 'San Francisco vs New York',
      'us_vs_china': 'United States vs China',
      'general_data_query': 'Top Unicorn Companies'
    };

    return titleMap[intent.type] || 'Data Analysis Results';
  }

  private generateChartDescription(intent: IntentResult, results: QueryResult[]): string {
    const resultCount = results.length;
    const intentType = intent.type;

    if (intentType.includes('count')) {
      return `Showing ${resultCount} categories with their respective counts.`;
    }
    
    if (intentType.includes('valuation')) {
      return `Displaying valuation data across ${resultCount} categories.`;
    }
    
    if (intentType.includes('year') || intentType.includes('time')) {
      return `Time series data showing trends over ${resultCount} time periods.`;
    }
    
    if (intentType.includes('vs') || intentType.includes('comparison')) {
      return `Comparative analysis between ${resultCount} categories.`;
    }

    return `Analysis results showing ${resultCount} data points.`;
  }

  private generateTakeaway(intent: IntentResult, results: QueryResult[]): string {
    if (!results || results.length === 0) return '';

    const firstRow = results[0];
    const intentType = intent.type;

    // Generate takeaways based on intent type and data
    if (intentType === 'unicorn_count_by_country') {
      return `${firstRow.country} leads with ${firstRow.count} unicorn companies.`;
    }
    
    if (intentType === 'valuation_by_industry') {
      return `${firstRow.industry} has the highest total valuation at $${(firstRow.total_valuation / 1000).toFixed(1)}B.`;
    }
    
    if (intentType.includes('vs')) {
      const categories = results.map(r => Object.values(r)[0]);
      return `Comparison shows significant differences between ${categories.join(' and ')}.`;
    }
    
    if (intentType.includes('year')) {
      const years = results.map(r => r.year).sort();
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      return `Data spans from ${minYear} to ${maxYear}, showing growth trends over time.`;
    }

    return 'The data reveals interesting patterns worth exploring further.';
  }

  // Validate SQL query for security (basic validation)
  validateQuery(query: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const normalizedQuery = query.toLowerCase().trim();

    // Check for dangerous operations
    const dangerousOperations = ['drop', 'delete', 'insert', 'update', 'alter', 'truncate', 'create'];
    for (const operation of dangerousOperations) {
      if (normalizedQuery.includes(operation)) {
        errors.push(`Dangerous operation detected: ${operation}`);
      }
    }

    // Must start with SELECT
    if (!normalizedQuery.startsWith('select')) {
      errors.push('Query must start with SELECT');
    }

    // Basic syntax validation
    if (!normalizedQuery.includes('from')) {
      errors.push('Query must include FROM clause');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const sqlGeneratorService = new SQLGeneratorService();
