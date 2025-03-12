// Script to check the current server state
import http from 'http';

// Function to make HTTP requests and log results
function makeRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method
    };

    const req = http.request(options, (res) => {
      console.log(`STATUS: ${res.statusCode} for ${path}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (data && data.length < 2000) {
          console.log(`BODY (truncated): ${data.substring(0, 200)}...`);
        } else {
          console.log(`BODY: Too large to display`);
        }
        resolve();
      });
    });
    
    req.on('error', (e) => {
      console.error(`Error making request to ${path}: ${e.message}`);
      reject(e);
    });
    
    req.end();
  });
}

async function runTests() {
  try {
    console.log('------ DEBUGGING SERVER CONNECTION ------');
    
    // Check the main page
    console.log('\n1. Testing main page:');
    await makeRequest('/');
    
    // Check the cephalometric route
    console.log('\n2. Testing cephalometric route:');
    await makeRequest('/cephalometric');
    
    // Check the API health endpoint
    console.log('\n3. Testing API health:');
    await makeRequest('/api/health');
    
    // Check static image
    console.log('\n4. Testing static image:');
    await makeRequest('/images/cephalometric.png');
    
    console.log('\n------ TESTING COMPLETED ------');
  } catch (err) {
    console.error('Error during tests:', err);
  }
}

// Run the tests
runTests();