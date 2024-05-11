import { useEffect, useState } from 'react';
import "../styles/admin.css";

function Admin() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch("http://localhost:5000/getResults");
                if (response.ok) {
                    const data = await response.json();
                    setResults(data);
                } else {
                    throw new Error('Failed to fetch results');
                }
            } catch (error) {
                console.error('Error fetching results:', error);
            }
        };

        fetchResults();
    }, []);

    return (
        <div className="admin-container">
            <h1>Admin Panel</h1>
            <div className="results-list">
                {results.map((result, index) => (
                    <div className="result-item" key={index}>
                        <p>Username: {result.username}</p>
                        <p>Score: {result.result}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Admin;
