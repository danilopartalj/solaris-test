const fs = require('fs'),
  axios = require('axios'),
  FormData = require('form-data'),
  token =
    '7vi0aw8xuut2ydop7dbq136lkfnei1vid1gnch7fy7vdofbbdgdx2ydvwyu32uuaypereq',
  solaris_api_proxy = axios.create({
    maxRedirects: 0,
    baseURL: 'https://api.solaris-sandbox.de/v1/'
  });
solaris_api_proxy.defaults.headers.common.Authorization = `Bearer ${token}`;

async function invokeServiceOnSolaris(fileName) {
  const request = {
    method: 'post',
    url: 'businesses/38a731c55122e609e2a7ce75a033f862cbiz/documents'
  };

  const form = new FormData();
  form.append('file', fs.createReadStream(fileName));
  form.append('document_type', 'FOUNDATION_DOCUMENT');

  request.headers = form.getHeaders();
  request.data = form;

  try {
    let response = await solaris_api_proxy.request(request);
    console.log('Response from solaris:', JSON.stringify(response.data));
  } catch (error) {
    if (error.response) {
      let errorLog = Object.assign({}, error.response);
      errorLog.config = { ...error.response.config };
      delete errorLog.config.transformRequest;
      delete errorLog.config.transformResponse;
      if (error.response.request) {
        errorLog.request = { ...error.response.request };
        delete errorLog.request.socket;
        delete errorLog.request.connection;
        delete errorLog.request.agent;
        delete errorLog.request.res;
      }
      console.error('Error in solaris call', JSON.stringify(errorLog));
    } else {
      console.error('Error', JSON.stringify(error));
    }
  }
}


const fileName = `./${process.argv[2]}.pdf`;

invokeServiceOnSolaris(fileName);
