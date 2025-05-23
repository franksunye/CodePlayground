import { dataAnalysisService } from '@/lib/data-analysis';
import { createDocumentHandler } from '@/lib/artifacts/server';

export const dataDocumentHandler = createDocumentHandler<'data'>({
  kind: 'data',
  onCreateDocument: async ({ title, dataStream }) => {
    console.log('🔧 Starting data analysis for:', title);

    try {
      // Process the query using our data analysis service
      const result = await dataAnalysisService.processQuery(title);

      console.log('💻 Data analysis completed:', {
        rowCount: result.data.length,
        queryType: result.intent.type,
        confidence: result.intent.confidence
      });

      // Prepare the content for the artifact
      const artifactContent = {
        data: result.data,
        columns: result.columns,
        chartConfig: result.chartConfig,
        sqlQuery: result.sqlResult.query,
        queryExplanation: result.sqlResult.explanation,
        metadata: result.metadata
      };

      // Simulate streaming by sending the data in chunks
      const contentString = JSON.stringify(artifactContent);
      const chunkSize = 100;
      let currentContent = '';

      for (let i = 0; i < contentString.length; i += chunkSize) {
        const chunk = contentString.slice(i, i + chunkSize);
        currentContent += chunk;

        // Try to parse as valid JSON, if not, continue building
        try {
          JSON.parse(currentContent);
          // If we can parse it, send this chunk
          dataStream.writeData({
            type: 'data-delta',
            content: currentContent,
          });
        } catch {
          // If we can't parse it yet, continue building
          continue;
        }

        // Add a small delay to simulate real streaming
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Ensure we send the final complete content
      dataStream.writeData({
        type: 'data-delta',
        content: JSON.stringify(artifactContent),
      });

      console.log('✅ Data analysis streaming completed');
      return JSON.stringify(artifactContent);

    } catch (error) {
      console.error('❌ Data analysis failed:', error);

      // Send error state
      const errorContent = {
        data: [],
        columns: [],
        chartConfig: null,
        sqlQuery: '',
        queryExplanation: 'Failed to process query',
        metadata: {
          executionTime: 0,
          rowCount: 0,
          queryType: 'error',
          confidence: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };

      dataStream.writeData({
        type: 'data-delta',
        content: JSON.stringify(errorContent),
      });

      return JSON.stringify(errorContent);
    }
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    console.log('🔧 Starting data analysis update for:', description);

    try {
      // Parse current document content
      const currentContent = JSON.parse(document.content);

      // Process the new query/description
      const result = await dataAnalysisService.processQuery(description);

      // Update the content
      const updatedContent = {
        data: result.data,
        columns: result.columns,
        chartConfig: result.chartConfig,
        sqlQuery: result.sqlResult.query,
        queryExplanation: result.sqlResult.explanation,
        metadata: {
          ...result.metadata,
          updatedAt: new Date().toISOString()
        }
      };

      console.log('💻 Data analysis update completed:', {
        rowCount: result.data.length,
        queryType: result.intent.type
      });

      // Stream the updated content
      dataStream.writeData({
        type: 'data-delta',
        content: JSON.stringify(updatedContent),
      });

      console.log('✅ Data analysis update streaming completed');
      return JSON.stringify(updatedContent);

    } catch (error) {
      console.error('❌ Data analysis update failed:', error);

      // Return original content on error
      dataStream.writeData({
        type: 'data-delta',
        content: document.content,
      });

      return document.content;
    }
  },
});


