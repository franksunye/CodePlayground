import { tool } from 'ai';
import { z } from 'zod';
import { dataAnalysisService } from '@/lib/data-analysis';
import { generateUUID } from '@/lib/utils';
import { documentHandlersByArtifactKind } from '@/lib/artifacts/server';

export const createDataAnalysis = ({
  session,
  dataStream,
}: {
  session: any;
  dataStream: any;
}) =>
  tool({
    description: `MANDATORY tool for creating data analysis artifacts with interactive charts and tables.

    **ALWAYS use this tool for ANY query containing these keywords or patterns:**
    - "unicorn" companies (any mention)
    - "compare", "comparison", "vs", "versus"
    - "show", "display", "visualize", "chart"
    - "top", "highest", "most", "best", "largest"
    - "countries", "industries", "valuations", "funding"
    - "statistics", "data", "analysis", "trends"
    - Business intelligence or market analysis questions

    **Examples that MUST trigger this tool:**
    - "Show me the top countries with most unicorns"
    - "Compare unicorn valuations in US vs China"
    - "Which industries have the highest valuations?"
    - "Display unicorn growth over time"
    - "Countries with highest unicorn density"
    - "Compare fintech vs other industries"

    This tool creates interactive visualizations in a dedicated artifact panel, similar to code artifacts.`,

    parameters: z.object({
      title: z.string().describe('A concise title for the data analysis (max 80 characters)'),
    }),

    execute: async ({ title }) => {
      console.log('🎯 [DATA ANALYSIS TOOL TRIGGERED] ===================================');
      console.log('🔧 Creating data analysis artifact for query:', title);
      console.log('🎯 This should create an interactive artifact panel similar to code artifacts');
      console.log('🎯 ================================================================');

      try {
        // Check if this is actually a data analysis query
        if (!dataAnalysisService.isDataQuery(title)) {
          return {
            id: null,
            title: title,
            kind: 'data',
            message: 'This query does not appear to be data-related. Please ask about unicorn companies, valuations, industries, or countries.',
          };
        }

        const id = generateUUID();

        // Send the required stream data to initialize the artifact (like createDocument does)
        dataStream.writeData({
          type: 'kind',
          content: 'data',
        });

        dataStream.writeData({
          type: 'id',
          content: id,
        });

        dataStream.writeData({
          type: 'title',
          content: title,
        });

        dataStream.writeData({
          type: 'clear',
          content: '',
        });

        // Use the standard document handler system (like createDocument does)
        const documentHandler = documentHandlersByArtifactKind.find(
          (handler) => handler.kind === 'data'
        );

        if (!documentHandler) {
          throw new Error('No document handler found for kind: data');
        }

        await documentHandler.onCreateDocument({
          id,
          title,
          dataStream,
          session,
        });

        dataStream.writeData({ type: 'finish', content: '' });

        console.log('✅ [DATA ANALYSIS SUCCESS] ===================================');
        console.log('📊 Data analysis artifact created successfully with ID:', id);
        console.log('🎯 Artifact should now be visible in the right panel');
        console.log('✅ =========================================================');

        return {
          id,
          title: title,
          kind: 'data',
          message: 'Data analysis has been created with interactive charts and tables.',
        };

      } catch (error) {
        console.error('❌ Failed to create data analysis artifact:', error);

        return {
          id: null,
          title: title,
          kind: 'data',
          message: `Failed to create data analysis: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
      }
    },
  });
