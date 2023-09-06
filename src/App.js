import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    searchText: '',
  });

  const [responseData, setResponseData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const username = 'holst@whcombo';
  const password = '482615973';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let url = `https://online.moysklad.ru/api/remap/1.2/entity/product/${formData.searchText}/images`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setResponseData(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // Function to fetch the access token from the API
    const fetchAccessToken = async () => {
      try {
        const basicAuth = `Basic ${btoa(`${username}:${password}`)}`;

        const response = await axios.post(  'https://online.moysklad.ru/api/remap/1.2/security/token', {}, {
          'Authorization': basicAuth,
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Request-Headers': 'Content-Type, Authorization'
        });
        const token = response.data.access_token;
        setAccessToken(token);
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };

    // Call the function to fetch the access token when the component mounts
    fetchAccessToken();
  }, []); // The empty dependency array ensures this runs once on component mount


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>
        <h1>API Request Example</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Search Text:
            <input
              type="text"
              name="searchText"
              value={formData.searchText}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
        {responseData && (
          <div className="response">
            <h2>Response:</h2>
            <pre>{JSON.stringify(responseData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
