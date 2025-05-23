// Data Analysis Services Export
import { MockDataService, mockDataService } from './mock-data';
import { IntentRecognitionService, intentRecognitionService } from './intent-recognition';
import { SQLGeneratorService, sqlGeneratorService } from './sql-generator';

// Services
export { MockDataService, mockDataService } from './mock-data';
export { IntentRecognitionService, intentRecognitionService } from './intent-recognition';
export { SQLGeneratorService, sqlGeneratorService } from './sql-generator';

// Types
export type { UnicornCompany, QueryFilters, QueryResult } from './mock-data';
export type { IntentResult, IntentPattern } from './intent-recognition';
export type { SQLQueryResult, ChartConfig } from './sql-generator';

// Combined service for easy integration
export class DataAnalysisService {
  private mockData: MockDataService;
  private intentRecognition: IntentRecognitionService;
  private sqlGenerator: SQLGeneratorService;

  constructor(
    mockData?: MockDataService,
    intentRecognition?: IntentRecognitionService,
    sqlGenerator?: SQLGeneratorService
  ) {
    this.mockData = mockData || mockDataService;
    this.intentRecognition = intentRecognition || intentRecognitionService;
    this.sqlGenerator = sqlGenerator || sqlGeneratorService;
  }

  // Main method to process a natural language query
  async processQuery(message: string) {
    console.log('🔍 Processing data analysis query:', message);

    // Step 1: Recognize intent
    const intent = this.intentRecognition.recognizeIntent(message);
    console.log('🎯 Intent recognized:', intent);

    // Step 2: Generate SQL query
    const sqlResult = this.sqlGenerator.generateSQL(intent);
    console.log('📝 SQL generated:', sqlResult);

    // Step 3: Execute query (mock execution)
    const data = this.mockData.executeQuery(intent.type, intent.parameters);
    console.log('📊 Data retrieved:', { rowCount: data.length, preview: data.slice(0, 2) });

    // Step 4: Generate chart configuration
    const chartConfig = this.sqlGenerator.generateChartConfig(intent, data);
    console.log('📈 Chart config generated:', chartConfig);

    return {
      intent,
      sqlResult,
      data,
      chartConfig,
      columns: data.length > 0 ? Object.keys(data[0]) : [],
      metadata: {
        executionTime: sqlResult.executionTime,
        rowCount: data.length,
        queryType: intent.type,
        confidence: intent.confidence
      }
    };
  }

  // Check if a message is data-related
  isDataQuery(message: string): boolean {
    const intent = this.intentRecognition.recognizeIntent(message);
    return intent.confidence > 0.5 && intent.type !== 'general_conversation';
  }

  // Get available query examples
  getQueryExamples(): Array<{ query: string; description: string }> {
    return [
      {
        query: "Show me the top 10 countries with the most unicorns",
        description: "Count unicorn companies by country"
      },
      {
        query: "Compare unicorn valuations in the US vs China",
        description: "Compare two major markets"
      },
      {
        query: "Which countries have the highest unicorn density?",
        description: "Unicorn density per capita analysis"
      },
      {
        query: "Show the number of unicorns founded each year over the past two decades",
        description: "Time series analysis of unicorn growth"
      },
      {
        query: "Compare fintech vs other industries",
        description: "Industry comparison analysis"
      },
      {
        query: "Which cities have the most SaaS unicorns?",
        description: "Geographic distribution by industry"
      }
    ];
  }
}

// Export singleton instance
export const dataAnalysisService = new DataAnalysisService();
