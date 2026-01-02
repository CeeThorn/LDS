import React, { useState } from "react";

const Home = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState([]);

  // Search button click
  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Request failed");
      }

      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Live preview as user types
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setPreviews([]);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/previews?q=${encodeURIComponent(value)}`
      );
      const data = await res.json();
      setPreviews(data);
    } catch {
      setPreviews([]);
    }
  };

  return (
    <div className="home-container">
      <h1 className="page-title">Legal Document Search</h1>
      <p className="page-subtitle">
        Search for legal documents and case information
      </p>

      <div className="search-box">
        <input
          className="search-input"
          value={query}
          onChange={handleInputChange}
          placeholder="Search legal documents..."
        />

        {previews.length > 0 && (
          <div className="preview-grid">
            {previews.map((doc) => (
              <div
                key={doc.id}
                className="preview-card"
                onClick={() => {
                  setQuery(doc.title);
                  setPreviews([]);
                  handleSearch();
                }}
              >
                <img
                  src={doc.image}
                  alt={doc.title}
                  className="preview-image"
                />
                <div className="preview-content">
                  <h4 className="preview-title">{doc.title}</h4>
                  <p className="preview-summary">{doc.summary}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {loading && <p className="status loading">Loading...</p>}
      {error && <p className="status error">{error}</p>}

      <div className="results">
        {results.map((r, i) => (
          <div key={i} className="card">
            <h3 className="card-title">{r.title}</h3>
            <p className="card-summary">{r.summary}</p>
          </div>
        ))}

        {!loading && results.length === 0 && query && (
          <p className="status empty"></p>
        )}
      </div>
    </div>
  );
};

export default Home;
