import { z } from 'zod';
import { streamObject } from 'ai';
import { myProvider } from '@/lib/ai/providers';
import { codePrompt, updateDocumentPrompt } from '@/lib/ai/prompts';
import { createDocumentHandler } from '@/lib/artifacts/server';

export const codeDocumentHandler = createDocumentHandler<'code'>({
  kind: 'code',
  onCreateDocument: async ({ title, dataStream }) => {
    console.log('🔧 Starting code generation for:', title);

    // Generate mock code based on the title
    let fullContent = '';

    if (title.toLowerCase().includes('dijkstra')) {
      fullContent = `# Dijkstra's Algorithm Implementation
def dijkstra(graph, start):
    """
    Find shortest paths from start node to all other nodes using Dijkstra's algorithm.

    Args:
        graph: Dictionary representing the graph {node: {neighbor: weight}}
        start: Starting node

    Returns:
        Dictionary with shortest distances to all nodes
    """
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    visited = set()

    while len(visited) < len(graph):
        # Find unvisited node with minimum distance
        current_node = None
        for node in graph:
            if node not in visited:
                if current_node is None or distances[node] < distances[current_node]:
                    current_node = node

        if current_node is None:
            break

        visited.add(current_node)
        current_distance = distances[current_node]

        # Update distances to neighbors
        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance

    return distances

# Example usage
if __name__ == "__main__":
    # Create a sample graph
    graph = {
        'A': {'B': 1, 'C': 4},
        'B': {'A': 1, 'C': 2, 'D': 5},
        'C': {'A': 4, 'B': 2, 'D': 1},
        'D': {'B': 5, 'C': 1}
    }

    # Find shortest paths from node 'A'
    result = dijkstra(graph, 'A')

    print("Shortest distances from A:")
    for node, distance in result.items():
        print(f"A -> {node}: {distance}")`;
    } else {
      // Default code for other prompts
      fullContent = `# Generated Code Example
def hello_world():
    """
    A simple hello world function.
    """
    message = "Hello, World!"
    print(message)
    return message

def fibonacci(n):
    """
    Generate Fibonacci sequence up to n terms.
    """
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]

    sequence = [0, 1]
    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])

    return sequence

# Example usage
if __name__ == "__main__":
    # Execute hello world
    result = hello_world()
    print(f"Function returned: {result}")

    # Generate Fibonacci sequence
    fib_sequence = fibonacci(10)
    print(f"Fibonacci sequence (10 terms): {fib_sequence}")`;
    }

    console.log('💻 Mock code generated:', { codeLength: fullContent.length });

    // Simulate streaming by sending the code in chunks to trigger the artifact visibility
    const chunkSize = 50; // Send in small chunks
    let currentContent = '';

    for (let i = 0; i < fullContent.length; i += chunkSize) {
      const chunk = fullContent.slice(i, i + chunkSize);
      currentContent += chunk;

      // Send the accumulated content so far
      dataStream.writeData({
        type: 'code-delta',
        content: currentContent,
      });

      // Add a small delay to simulate real streaming
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    console.log('✅ Code generation completed:', { draftContentLength: fullContent.length });
    return fullContent;
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    console.log('🔧 Starting code update for:', description);

    // For mock purposes, just return the original content with a comment
    const fullContent = `${document.content}

# Updated based on: ${description}
# This is a mock update - in production, AI would modify the code based on the description`;

    console.log('💻 Mock code updated:', { codeLength: fullContent.length });

    // Simulate streaming by sending the updated code in chunks
    const chunkSize = 50;
    let currentContent = '';

    for (let i = 0; i < fullContent.length; i += chunkSize) {
      const chunk = fullContent.slice(i, i + chunkSize);
      currentContent += chunk;

      dataStream.writeData({
        type: 'code-delta',
        content: currentContent,
      });

      // Add a small delay to simulate real streaming
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    console.log('✅ Code update completed:', { draftContentLength: fullContent.length });
    return fullContent;
  },
});
