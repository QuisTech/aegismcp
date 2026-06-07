// @ts-ignore
import splunkjs from 'splunk-sdk';

export class SplunkService {
  private service: any;
  private isConfigured: boolean = false;

  constructor() {
    if (process.env.SPLUNK_USERNAME && process.env.SPLUNK_PASSWORD && process.env.SPLUNK_HOST) {
      this.service = new splunkjs.Service({
        username: process.env.SPLUNK_USERNAME,
        password: process.env.SPLUNK_PASSWORD,
        scheme: 'https',
        host: process.env.SPLUNK_HOST,
        port: process.env.SPLUNK_PORT || '8089',
        version: '8'
      });
      this.isConfigured = true;
    } else {
      console.warn('Splunk credentials missing from .env. SplunkService will run in mock mode.');
    }
  }

  async executeSearch(searchQuery: string): Promise<any[]> {
    if (!this.isConfigured) {
      return this.getMockData();
    }

    const searchPromise = new Promise<any[]>((resolve, reject) => {
      this.service.search(searchQuery, { exec_mode: 'blocking' }, (err: any, job: any) => {
        if (err) {
          reject(err);
          return;
        }
        
        job.results({}, (err: any, results: any) => {
          if (err) {
            reject(err);
            return;
          }
          
          if (!results || !results.rows) {
             resolve([]);
             return;
          }
          
          const formattedResults = results.rows.map((row: any) => {
            const rowObj: any = {};
            results.fields.forEach((field: string, index: number) => {
              rowObj[field] = row[index];
            });
            return rowObj;
          });
          
          resolve(formattedResults);
        });
      });
    });

    const timeoutPromise = new Promise<any[]>((_, reject) =>
      setTimeout(() => reject(new Error("Splunk API Connection Timeout")), 5000)
    );

    try {
      return await Promise.race([searchPromise, timeoutPromise]);
    } catch (error) {
      console.warn("Splunk API request failed or timed out. Falling back to mock data.", error);
      return this.getMockData();
    }
  }

  private getMockData(): any[] {
    return [
      { _time: new Date().toISOString(), _raw: 'Mock log line 1 - Database connection refused' },
      { _time: new Date().toISOString(), _raw: 'Mock log line 2 - Connection Pool Exhausted' }
    ];
  }
}
