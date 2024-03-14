import {useState, useEffect} from 'react';
import './App.css';
import { getLocations, isNameValid } from './mock-api/apis';

function App() {
  const [name, setName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [nameIsValid, setNameIsValid] = useState(true);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const locations = await getLocations();
      setSelectedLocation(locations[0] || '');
      setLocations(locations);
    }
    fetchData();
  }, [])

  useEffect(() => {
    async function validateName() {
      const isValid = await isNameValid(name);
      setNameIsValid(isValid);
    }
    if(name) validateName();
    else setNameIsValid(true); // Consider empty input as valid for initial state
  }, [name])

  function handleClearEntries() {
    setEntries([]);
    setNameIsValid(true);
    setName('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if(name && nameIsValid && selectedLocation) {
      setEntries([...entries, {
        name,
        location: selectedLocation
      }])
      setName('');
      setSelectedLocation(locations[0] || '');
    }
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <div className="form-label">
            <label htmlFor="name">Name</label>
          </div>
          <div className="form-input">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        {!nameIsValid && <div className="form-field" style={{ color: 'red', margin: 0 }}>
          <div className="form-label"></div>
          <div>this name has already been taken</div>
        </div>}

        <div className="form-field">
          <div className="form-label">
            <label htmlFor="location">Location</label>
          </div>
          <div className="form-input">
            <select
              id="location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-button">
          <button type="button" className="clear-btn" onClick={handleClearEntries}>
            Clear
          </button>
          <button type="submit" className="add-btn">
            Add
          </button>
        </div>


        <div className="entries">
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.name}</td>
                  <td>{entry.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {entries.length === 0 && <p>No entries added.</p>}
        </div>
      </form>


    </div>
  );
}

export default App;
