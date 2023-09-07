import './App.css';
import React, { useEffect, useState } from "react";
import axios from 'axios';
import ProductCard from "./components/ProductCart";

function App() {
  const [formData, setFormData] = useState({
    searchText: '',
  });
  // const API_SERVER_URL = 'http://localhost:3001';
  const API_SERVER_URL = 'https://nikitaapp-server.onrender.com';

  const [responseData, setResponseData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('list');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // let url = `http://localhost:3001/api/getProducts`;
    let url = `${API_SERVER_URL}/api/getProducts`;
    if (searchType === 'product') {
      // url = `http://localhost:3001/api/getProduct`;
      url = `${API_SERVER_URL}/api/getProduct`;
    }

    try {
      const response = await axios.post(url, {
        accessToken,
        productID: formData.searchText
      });

      setResponseData(response.data);
    } catch (error) {
      console.error('Error:', error);
      setResponseData(null);
      setError(error.response.data.errors[0].error);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      // Function to fetch the access token from the API
      const fetchAccessToken = async () => {
        try {
          const token = await axios.post(`${API_SERVER_URL}/api/getToken`)
            .then((response) => {
              // Handle the response here
              console.log('Response:', response.data);
              return response.data.access_token;
            })
            .catch((error) => {
              // Handle any errors here
              console.error('Error:', error);
              setResponseData(null);
              setError(error.response.data.errors[0].error);
            });

          setAccessToken(token);
        } catch (error) {
          console.error('Error fetching access token:', error);
          setResponseData(null);
          setError(error.response.data.errors[0].error);
        }
      };

      // Call the function to fetch the access token when the component mounts
      fetchAccessToken();
    }
  }, [accessToken]); // The empty dependency array ensures this runs once on component mount


  return (
    <div className="App">
      <div className="form-wrapper">
        <div>
          <div className="wrap-form100">
            <h1>API Request Example</h1>
            <form onSubmit={handleSubmit}>

              <div className="wrap-input100 validate-input" data-validate="Name is required">
                <span className="label-input100">Search type</span>
                <div className="checkbox-wrapper">
                  <input className="input100"
                         type="radio"
                         name="searchType"
                         value="list"
                         checked={searchType === 'list'}
                         onChange={(e) => setSearchType(e.target.value)}
                  />
                  <span className="checkbox-label">Product list</span>
                </div>
                <div className="checkbox-wrapper">
                  <input className="input100"
                         type="radio"
                         name="searchType"
                         value="product"
                         checked={searchType === 'product'}
                         onChange={(e) => setSearchType(e.target.value)}
                  />
                  <span className="checkbox-label">Product ID</span>
                </div>
              </div>

              {searchType === 'product' && (
                <div className="wrap-input100 validate-input" data-validate="Name is required">
                  <span className="label-input100">Product ID</span>
                  <input className="input100"
                         type="text"
                         name="searchText"
                         placeholder="Enter product ID"
                         value={formData.searchText}
                         onChange={handleChange}
                  />
                  <span className="focus-input100"></span>
                </div>
              )}

              <div className="container-contact100-form-btn">
                <div className="wrap-contact100-form-btn">
                  <div className="contact100-form-bgbtn"></div>
                  <button className="contact100-form-btn">
                    <span>Submit</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
          {responseData && (
            <div className="wrap-form100">
              <h2>Response:</h2>
              <div>{JSON.stringify(responseData, null, 2)}</div>

              {searchType === 'product' && <ProductCard {...responseData} />}
            </div>
          )}
          {error && (
            <div className="wrap-form100">
              <h2>Error</h2>
              <div>{error}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
