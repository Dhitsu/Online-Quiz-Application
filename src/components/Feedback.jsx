import { useLocation } from 'react-router-dom';
import "../styles/feedback.css";

function Feedback() {
    const location = useLocation();
    const { result, username } = location.state || {};

    return (
        <div className="feedback-container">
            <h1>Final Score</h1>
            <p>Hi {username}, here's your result:</p>
            {result && <p>Final Score: {result}%</p>}
        </div>
    );
}

export default Feedback;
