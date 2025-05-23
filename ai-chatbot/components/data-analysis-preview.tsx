'use client';

import { DataAnalysisResults } from './data-analysis/data-results';
import { DataAnalysisQueryViewer } from './data-analysis/query-viewer';
import type { DataAnalysisResult, ChartConfig } from './data-analysis/dynamic-chart';

interface DataAnalysisPreviewProps {
  content: string;
  isCurrentVersion: boolean;
  currentVersionIndex: number;
  status: 'streaming' | 'complete' | 'error';
  saveContent: () => void;
  suggestions: any[];
}

interface DataArtifactContent {
  data: DataAnalysisResult[];
  columns: string[];
  chartConfig: ChartConfig | null;
  sqlQuery: string;
  queryExplanation?: string;
  metadata?: {
    executionTime: number;
    rowCount: number;
    queryType: string;
    confidence: number;
  };
}

export function DataAnalysisPreview({
  content,
  status,
}: DataAnalysisPreviewProps) {
  // Add debugging
  console.log('🔍 DataAnalysisPreview content:', { content, length: content?.length, status });

  if (!content || content.trim() === '') {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <div className="animate-pulse mb-2">📊</div>
          <p>Loading data analysis...</p>
          <p className="text-xs mt-1">Waiting for content...</p>
        </div>
      </div>
    );
  }

  try {
    const parsedContent: DataArtifactContent = JSON.parse(content);

    if (!parsedContent.data || parsedContent.data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <div className="animate-pulse mb-2">📊</div>
            <p>No data available</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full overflow-auto space-y-4 p-2">
        {/* Query Viewer - Compact version for preview */}
        {parsedContent.sqlQuery && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
            <div className="font-mono truncate">
              {parsedContent.sqlQuery.length > 100
                ? `${parsedContent.sqlQuery.substring(0, 100)}...`
                : parsedContent.sqlQuery
              }
            </div>
          </div>
        )}

        {/* Data Results - Compact version for preview */}
        <div className="flex-1 min-h-0">
          <DataAnalysisResults
            results={parsedContent.data}
            columns={parsedContent.columns}
            chartConfig={parsedContent.chartConfig}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error parsing data analysis content:', error);
    console.error('Content that failed to parse:', { content, length: content?.length });
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <div className="mb-2">⚠️</div>
          <p>Error loading data analysis</p>
          <p className="text-xs mt-1">Invalid content format</p>
          <p className="text-xs mt-1">Content length: {content?.length || 0}</p>
        </div>
      </div>
    );
  }
}
