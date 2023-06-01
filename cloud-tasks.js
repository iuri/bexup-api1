const { CloudTasksClient } = require('@google-cloud/tasks');

// const client = new CloudTasksClient();
const client = new CloudTasksClient({ keyFilename: './bexup-388513-d71b18d75c01.json' });


// Cloud Run URL https://bexup-pepakk62hq-uc.a.run.app
async function createTask() {
    const project = 'bexup-388513';
    const location = 'us-central1';
    const queue = 'bexup-marcas';
  
    const parent = client.queuePath(project, location, queue);
    const task = {
      appEngineHttpRequest: {
        httpMethod: 'POST',
        relativeUri: '/process_brand',
        body: Buffer.from(JSON.stringify({
          order_id: 123456789,
          customer_name: 'bexup',
          order_details: []
        })),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    };
  
    const [response] = await client.createTask({ parent, task });
    console.log(`Task created: ${response.name}`);
  }
  
  createTask().catch(console.error);
  