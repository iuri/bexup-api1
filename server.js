require('dotenv').config({path: __dirname + '/.env'})

const axios = require('axios');

const createTask = require('./cloud-tasks.js');

const queue = []






async function getToken() {
  try {
    const response = await axios.get(process.env.API2_URL+'/getToken');
    // console.log('Response:', response.data.token);
    return response.data.token;

  } catch (error) {
    // console.error('Error sending item:', item);
    // console.error(error);
  }
}

async function sendItem(item) {
    //console.log('Sending Item to API2:', item);
    token = await getToken();
    // console.log('TOKEN ', token)
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }

    const response = await axios.post(process.env.API2_URL + '/add', item, { headers })
      .then(response => {        
        console.log('Response:', response.data);
      })
      .catch(error => {
        console.error('Error sending item:', item);
        console.error(error);
      })
  }



function enqueue(item) {
    queue.push(item);
    // console.log('Item enqueued:', item);
}
  
function dequeue() {
    if (queue.length === 0) {
      // console.log('Queue is empty.');
      return null;
    }
    
    const item = queue.shift();
    // console.log('Item dequeued:', item);
    return item;
}
 


async function processQueue() {
  console.log('Sending Marcas to API2:');
  while (queue.length > 0) {
      // TODOD enhancement 
      // to be changed, to dequeue only if sending was successfull 
      try {
          const item = dequeue(); // Dequeue an item from the queue
          await sendItem(item); // Send the item to another endpoint
      } catch (error) {
          // console.log("Error processing Queue");
          enqueue(item);
      }
  }
}


async function fetchDataAndEnqueue() {
  console.log('Retrieving marcas from FIPE...')
  try {
    // console.log(process.env.API_FIPE_URL);
    const response = await axios.get(process.env.API_FIPE_URL+'carros/marcas');
    // console.log('RESP',response.data); // Display the retrieved data in the console
    response.data.forEach(item => {
        enqueue(item)
        // console.log('Item enqueued:', item);
        createTask(item)
    });

    processQueue();

  } catch (error) {
    console.error(error);
  }
}









 


// Example usage:
fetchDataAndEnqueue();
// search('marcas');
// search('codigos');
// console.log(queue)

