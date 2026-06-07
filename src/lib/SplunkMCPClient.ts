import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export class SplunkMCPClient {
  private client: Client | null = null;
  private connected: boolean = false;

  async connect() {
    if (this.connected) return;

    try {
      const transport = new StdioClientTransport({
        command: 'npx',
        args: ['-y', '@splunk/mcp-server']
      });

      this.client = new Client(
        {
          name: 'aegis-mcp-client',
          version: '1.0.0'
        },
        {
          capabilities: {}
        }
      );

      await this.client.connect(transport);
      this.connected = true;
      console.log('Connected to Splunk MCP Server');
    } catch (error) {
      console.warn('Failed to connect to Splunk MCP Server. Will use mock fallback.', error);
    }
  }

  async searchLogs(query: string, timeRange: string = '-15m') {
    if (!this.connected || !this.client) {
      console.warn('MCP Client not connected. Returning mock Splunk data.');
      return {
        results: [
          { _time: new Date().toISOString(), host: 'prod-api-1', message: 'Connection timeout', status: 500 },
          { _time: new Date().toISOString(), host: 'prod-api-2', message: 'Connection timeout', status: 500 }
        ]
      };
    }

    try {
      const result = await this.client.callTool({
        name: 'splunk_search',
        arguments: {
          search: query,
          earliest_time: timeRange,
          latest_time: 'now'
        }
      });
      return result;
    } catch (error) {
      console.error('Error executing Splunk search via MCP:', error);
      throw error;
    }
  }
}
