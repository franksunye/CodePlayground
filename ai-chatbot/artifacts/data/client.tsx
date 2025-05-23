import { Artifact } from '@/components/create-artifact';
import { DocumentSkeleton } from '@/components/document-skeleton';
import { DataAnalysisResults } from '@/components/data-analysis/data-results';
import { DataAnalysisQueryViewer } from '@/components/data-analysis/query-viewer';
import type { DataAnalysisResult, ChartConfig } from '@/components/data-analysis/dynamic-chart';
import { CopyIcon, LoaderIcon } from '@/components/icons';
import { toast } from 'sonner';

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

interface DataArtifactMetadata {
  isVisible: boolean;
  status: 'streaming' | 'complete' | 'error';
  title: string;
}

export const dataArtifact = new Artifact<'data', DataArtifactMetadata>({
  kind: 'data',
  description: 'Interactive data analysis with charts and tables',

  initialize: async ({ setMetadata }) => {
    setMetadata({
      isVisible: false,
      status: 'streaming',
      title: '',
    });
  },

  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === 'data-delta') {
      setArtifact((draftArtifact) => ({
        ...draftArtifact,
        content: streamPart.content as string,
        isVisible: true, // Always show artifact when data content is received
        status: 'streaming',
      }));
    }
  },

  content: ({
    content,
    title,
    status,
    isLoading,
  }) => {
    if (isLoading) {
      return <DocumentSkeleton artifactKind="data" />;
    }

    // Add debugging for content
    console.log('🔍 Data artifact content:', { content, length: content?.length, status });

    if (!content || content.trim() === '') {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
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
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <div className="animate-pulse mb-2">📊</div>
              <p>Loading data analysis...</p>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-4 p-4">
          {/* Query Viewer */}
          {parsedContent.sqlQuery && (
            <DataAnalysisQueryViewer
              activeQuery={parsedContent.sqlQuery}
              inputValue={title}
            />
          )}

          {/* Data Results */}
          <DataAnalysisResults
            results={parsedContent.data}
            columns={parsedContent.columns}
            chartConfig={parsedContent.chartConfig}
          />

          {/* Metadata */}
          {parsedContent.metadata && (
            <div className="text-xs text-muted-foreground border-t pt-2">
              <div className="flex justify-between items-center">
                <span>
                  {parsedContent.metadata.rowCount} rows • {parsedContent.metadata.executionTime.toFixed(0)}ms
                </span>
                <span className="capitalize">
                  {parsedContent.metadata.queryType.replace(/_/g, ' ')}
                  {parsedContent.metadata.confidence && (
                    <span className="ml-1">
                      ({Math.round(parsedContent.metadata.confidence * 100)}% confidence)
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    } catch (error) {
      console.error('Error rendering data artifact:', error);
      console.error('Content that failed to parse:', { content, length: content?.length });
      return (
        <div className="flex items-center justify-center h-64 text-destructive">
          <div className="text-center">
            <div className="mb-2">⚠️</div>
            <p>Error loading data analysis</p>
            <p className="text-xs text-muted-foreground mt-1">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Content length: {content?.length || 0}
            </p>
          </div>
        </div>
      );
    }
  },

  actions: [
    {
      icon: <CopyIcon size={18} />,
      description: 'Copy SQL query',
      onClick: ({ content }) => {
        try {
          const parsedContent: DataArtifactContent = JSON.parse(content);
          if (parsedContent.sqlQuery) {
            navigator.clipboard.writeText(parsedContent.sqlQuery);
            toast.success('SQL query copied to clipboard!');
          }
        } catch (error) {
          toast.error('Failed to copy SQL query');
        }
      },
    },
    {
      icon: <CopyIcon size={18} />,
      description: 'Copy data as JSON',
      onClick: ({ content }) => {
        try {
          const parsedContent: DataArtifactContent = JSON.parse(content);
          if (parsedContent.data) {
            navigator.clipboard.writeText(JSON.stringify(parsedContent.data, null, 2));
            toast.success('Data copied to clipboard!');
          }
        } catch (error) {
          toast.error('Failed to copy data');
        }
      },
    },
  ],

  toolbar: [
    {
      icon: <LoaderIcon />,
      description: 'Refresh data',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content: 'Please refresh the data analysis with the latest data.',
        });
      },
    },
    {
      icon: <LoaderIcon />,
      description: 'Modify query',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content: 'Please modify the data analysis query to show different insights.',
        });
      },
    },
  ],
});
