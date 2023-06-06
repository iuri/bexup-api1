require('dotenv').config({path: __dirname + '/.env'})

const { CloudTasksClient } = require('@google-cloud/tasks');

// const client = new CloudTasksClient();
const client = new CloudTasksClient({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });


// Cloud Run URL https://bexup-pepakk62hq-uc.a.run.app
async function createTask(item=null) {
    const project = String(process.env.GOOGLE_PROJECT_ID);
    const location = String(process.env.LOCATION_ID);
    const queue = String(process.env.GCP_QUEUE);
  
    const parent = client.queuePath(project, location, queue);

    // console.log('item:', item.nome);


    const task = {
      appEngineHttpRequest: {
        httpMethod: 'POST',
        relativeUri: '//bexup-api2-pepakk62hq-uc.a.run.app/add',
        body: Buffer.from(JSON.stringify({
          code: item.codigo,
          name: item.nome,
          details: []
        })),
        headers: {
          'Content-Type': 'application/json',
        }
      }
    };
  
    const [response] = await client.createTask({ parent, task });
    console.log(`Task created: ${response.name}`);
  }
  
  //createTask().catch(console.error);
  module.exports = createTask;