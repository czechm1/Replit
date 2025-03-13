import http from 'http';

// Options for the request
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/',
  method: 'GET',
  headers: {
    'User-Agent': 'debug-client'
  }
};

// Function to make the request
function makeRequest() {
  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response received');
      // Print first 200 chars to see what kind of response we're getting
      console.log(`First 200 chars of response: ${data.substring(0, 200)}`);
      
      if (data.includes('id="root"')) {
        console.log('✅ Found React root element - looks like the index.html file is being served');
      } else {
        console.log('❌ Did not find React root element');
      }
      
      if (data.includes('from vite') || data.includes('/@vite/')) {
        console.log('✅ Found Vite scripts - Vite development server is active');
      } else {
        console.log('❌ Did not find Vite scripts - Vite might not be properly serving the files');
      }
    });
  });
  
  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });
  
  // End the request
  req.end();
}

// Make the request
makeRequest();