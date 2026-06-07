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
      return [
        { _time: new Date().toISOString(), _raw: 'Mock log line 1' },
        { _time: new Date().toISOString(), _raw: 'Mock log line 2' }
      ];
    }

    return new Promise((resolve, reject) => {
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
  }
}
