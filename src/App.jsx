import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Icon from './assets/Icon.svg'

const App = () => {
  const [responses, setResponses] = useState(Array(12).fill(''));
  const [loading, setLoading] = useState(Array(12).fill(false));
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const apiEndpoints = [
    '/public_api/v1/screenings',
    '/public_api/v1/screenings/status/{individual_screening_id}',
    '/public_api/v1/screenings/peps/{individual_screening_id}',
    '/public_api/v1/screenings/adverse_medias/{individual_screening_id}',
    '/public_api/v1/screenings/sanctions/{individual_screening_id}',
    '/public_api/v1/screenings/{individual_screening_id}/monitoring',
    '/public_api/v1/companies/search?company_name={companyName}&country={country}&page_number={pageNumber}&per_page={perPage}',
    '/public_api/v1/companies/search/{registration_number}?country=uk',
    '/public_api/v1/document_forensics',
    '/public_api/v1/document_forensics/{id}',
    '/public_api/v1/online_footprints',
    '/public_api/v1/online_footprints/{id}',
  ];

  const handleApiCall = async (index, method = 'GET', body = null, params = {}) => {
    setLoading((prev) => {
      const newLoading = [...prev];
      newLoading[index] = true;
      return newLoading;
    });

    const endpoint = apiEndpoints[index].replace(/{(\w+)}/g, (_, key) => params[key] || key);
    console.log(`Calling ${method} ${endpoint}`);

    try {
      const response = await axios({
        method,
        url: `https://api.regulon.io${endpoint}`,
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        data: body,
      });
      console.log('Response:', response.data);
      setResponses((prev) => {
        const newResponses = [...prev];
        newResponses[index] = JSON.stringify(response.data, null, 2);
        return newResponses;
      });
    } catch (error) {
      console.error('Error:', error);
      setResponses((prev) => {
        const newResponses = [...prev];
        newResponses[index] = `Error: ${error.message}`;
        return newResponses;
      });
    } finally {
      setLoading((prev) => {
        const newLoading = [...prev];
        newLoading[index] = false;
        return newLoading;
      });
    }
  };

  return (
    <div className={`App ${theme}`}>
      <img src={Icon} alt="Icon"/>
      <h1>Regulon Client API Tester</h1>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <div className="button-container">
        <div key={0} className="endpoint-section">
          <label>Start bulk Anti-Money Laundering screening of individuals</label>
          <button onClick={() => handleApiCall(0, 'POST', { "individuals": [{ "full_name": "John Doe", "nationality": "American", "date_of_birth": "2019-08-24", "gender": "male" }] })} disabled={loading[0]}>
            {loading[0] ? 'Loading...' : 'Test Endpoint'}
          </button>
          <pre>{responses[0]}</pre>
        </div>
        <div key={1} className="endpoint-section">
          <label>Fetch status of Anti-Money Laundering screening</label>
          <button onClick={() => handleApiCall(1, 'GET', null, { individual_screening_id: '40bdc96e-3a2a-451c-91db-bd85278e33cd' })} disabled={loading[1]}>
            {loading[1] ? 'Loading...' : 'Test Endpoint'}
          </button>
          <pre>{responses[1]}</pre>
        </div>
        <div key={2} className="endpoint-section">
          <label>Fetch Political data of individual</label>
          <button onClick={() => handleApiCall(2, 'GET', null, { individual_screening_id: '40bdc96e-3a2a-451c-91db-bd85278e33cd' })} disabled={loading[2]}>
            {loading[2] ? 'Loading...' : 'Test Endpoint'}
          </button>
          <pre>{responses[2]}</pre>
        </div>
        <div key={3} className="endpoint-section">
          <label>Fetch Adverse Media data of individual</label>
          <button onClick={() => handleApiCall(3, 'GET', null, { individual_screening_id: '40bdc96e-3a2a-451c-91db-bd85278e33cd' })} disabled={loading[3]}>
            {loading[3] ? 'Loading...' : 'Test Endpoint'}
          </button>
          <pre>{responses[3]}</pre>
        </div>
        <div key={4} className="endpoint-section">
          <label>Fetch sanctions data of an individual</label>
          <button onClick={() => handleApiCall(4, 'GET', null, { individual_screening_id: '40bdc96e-3a2a-451c-91db-bd85278e33cd' })} disabled={loading[4]}>
            {loading[4] ? 'Loading...' : 'Test Endpoint'}
          </button>
          <pre>{responses[4]}</pre>
        </div>
        <div key={5} className="endpoint-section">
          <label>Update monitoring status of a screened individual</label>
          <button onClick={() => handleApiCall(5, 'PATCH', { "monitoring": true }, { individual_screening_id: '517b2242-2f48-4a06-ab36-5694a4066cee' })} disabled={loading[5]}>
            {loading[5] ? 'Loading...' : 'Test Endpoint'}
          </button>
          <pre>{responses[5]}</pre>
        </div>
        <div key={6} className="endpoint-section">
          <label>Search for company by name</label>
          <button onClick={() => handleApiCall(6, 'GET', null, { companyName: 'Pepsi', country: 'uk', pageNumber: 1, perPage: 10 })} disabled={loading[6]}>
            {loading[6] ? 'Loading...' : 'Test Endpoint'}
          </button>
          <pre>{responses[6]}</pre>
        </div>
        <div key={7} className="endpoint-section">
          <label>Fetch details of company by registration number</label>
          <button onClick={() => handleApiCall(7, 'GET', null, { registration_number: '04073082', country: 'uk' })} disabled={loading[7]}>
            {loading[7] ? 'Loading...' : 'Test Endpoint'}
          </button>
          <pre>{responses[7]}</pre>
        </div>
        <div key={8} className="endpoint-section">
          <label>Request signed url to upload document</label>
          <button onClick={() => handleApiCall(8, 'POST', { "filename": "Name of file to upload", "byte_size": "6788", "checksum": "VtVrTvbyW7L2DOsRBsh0UQ==", "content_type": "application/pdf", "type_of_document": "proof_of_address" })} disabled={loading[8]}>
            {loading[8] ? 'Loading...' : 'Test Endpoint'}
          </button>
          <pre>{responses[8]}</pre>
        </div>
        <div key={9} className="endpoint-section">
          <label>Fetch results of document indicators</label>
          <button onClick={() => handleApiCall(9, 'GET', { id: '3b984512-42e9-4007-a334-0e97c3cf3a63' }, { id: '3b984512-42e9-4007-a334-0e97c3cf3a63' })} disabled={loading[9]}>
            {loading[9] ? 'Loading...' : 'Test Endpoint'}
          </button>
          <pre>{responses[9]}</pre>
        </div>
        <div key={10} className="endpoint-section">
          <label>Start Online Footprint Process</label>
          <button onClick={() => handleApiCall(10, 'POST', { "company_website_url": "https://regulon.io" })} disabled={loading[10]}>
            {loading[10] ? 'Loading...' : 'Test Endpoint'}
          </button>
          <pre>{responses[10]}</pre>
        </div>
        <div key={11} className="endpoint-section">
          <label>Retrieve Online Footprint report</label>
          <button onClick={() => handleApiCall(11, 'GET', null, { id: '38403223-7bed-4e5f-a339-bd1cb96931c4' })} disabled={loading[11]}>
            {loading[11] ? 'Loading...' : 'Test Endpoint'}
          </button>
          <pre>{responses[11]}</pre>
        </div>
      </div>
      <p>Created with ✌️ Regulon</p>
    </div>
  );
};

export default App;
