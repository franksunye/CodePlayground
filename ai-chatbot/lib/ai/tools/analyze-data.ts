import { tool } from 'ai';
import { z } from 'zod';
import { dataAnalysisService } from '@/lib/data-analysis';

export const analyzeDataTool = tool({
  description: `Analyze data and generate charts based on natural language queries about unicorn companies. 
  Use this tool when users ask questions about:
  - Unicorn company statistics and comparisons
  - Data visualization requests
  - Business intelligence queries
  - Market analysis questions
  
  Examples of queries that should use this tool:
  - "Show me the top countries with most unicorns"
  - "Compare unicorn valuations in US vs China"
  - "Which industries have the highest valuations?"
  - "Display unicorn growth over time"
  - "Countries with highest unicorn density"`,
  
  parameters: z.object({
    query: z.string().describe('The natural language query about unicorn data to analyze'),
    title: z.string().describe('A concise title for the data analysis (max 80 characters)'),
  }),
  
  execute: async ({ query, title }) => {
    console.log('🔍 Executing data analysis tool:', { query, title });
    
    try {
      // Check if this is actually a data analysis query
      if (!dataAnalysisService.isDataQuery(query)) {
        return {
          success: false,
          message: 'This query does not appear to be data-related. Please ask about unicorn companies, valuations, industries, or countries.',
          type: 'not_data_query'
        };
      }

      // Process the query
      const result = await dataAnalysisService.processQuery(query);
      
      console.log('📊 Data analysis completed:', {
        queryType: result.intent.type,
        confidence: result.intent.confidence,
        rowCount: result.data.length
      });

      // Return the analysis results
      return {
        success: true,
        type: 'data_analysis',
        title: title,
        query: query,
        intent: result.intent,
        sqlQuery: result.sqlResult.query,
        sqlExplanation: result.sqlResult.explanation,
        data: result.data,
        columns: result.columns,
        chartConfig: result.chartConfig,
        metadata: result.metadata,
        message: `Found ${result.data.length} results for your query. The data shows ${result.intent.description.toLowerCase()}.`
      };
      
    } catch (error) {
      console.error('❌ Data analysis tool failed:', error);
      
      return {
        success: false,
        message: `Failed to analyze data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      };
    }
  },
});
