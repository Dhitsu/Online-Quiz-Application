import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../styles/home.css";

function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [shuffledQuestions, setShuffledQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(null);
    const [username, setUsername] = useState(location.state?.username || '');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [remainingTime, setRemainingTime] = useState(10); // Time in seconds
    const [showSubmit, setShowSubmit] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5000/fetchQuestions");
                if (response.ok) {
                    const data = await response.json();
                    setQuestions(data);
                } else {
                    throw new Error('Failed to fetch questions');
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (questions.length > 0) {
            const shuffled = shuffleArray(questions);
            setShuffledQuestions(shuffled);
            setAnswers(new Array(shuffled.length).fill(null));
        }
    }, [questions]);

    useEffect(() => {
        if (username === '') {
            navigate('/');
        }
    }, [username, navigate]);

    useEffect(() => {
        let timer;
        if (remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime(prevTime => prevTime - 1);
            }, 1000);
        } else {
            clearInterval(timer);
            if (currentQuestionIndex === shuffledQuestions.length - 1) {
                calculateScore(); // Calculate score when time expires for last question
            } else {
                nextQuestion();
            }
        }

        return () => clearInterval(timer);
    }, [remainingTime]);

    const handleAnswer = (questionIndex, optionIndex) => {
        setAnswers(prevAnswers => {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[questionIndex] = optionIndex;
            return updatedAnswers;
        });
    };

    const nextQuestion = () => {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setRemainingTime(10); // Reset time for next question
    };

    const calculateScore = async () => {
        const correctAnswers = shuffledQuestions.filter((question, index) => {
            return question.answerIndex === answers[index];
        });
        const percentage = (correctAnswers.length / shuffledQuestions.length) * 100;
    
        try {
            const response = await fetch("http://localhost:5000/result", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ percentage, username }) // Include username in the body
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                const result = data.result;
                console.log('Result:', data.result);
                setScore(result);
                setShowSubmit(false);
                navigate("/feedback", { state: { username, result } });
            } else {
                throw new Error('Failed to fetch result');
            }
        } catch (error) {
            console.error('Error fetching result:', error);
        }
    };

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === shuffledQuestions.length - 1;

    return (
        <div className="quiz-app">
            <h2>Question {currentQuestionIndex + 1}</h2>
            <p>{currentQuestion?.question}</p>
            <ul>
                {currentQuestion?.options.map((option, optionIndex) => (
                    <li key={optionIndex}>
                        <label>
                            <input
                                type="radio"
                                value={optionIndex}
                                checked={answers[currentQuestionIndex] === optionIndex}
                                onChange={() => handleAnswer(currentQuestionIndex, optionIndex)}
                            />
                            {option}
                        </label>
                    </li>
                ))}
            </ul>
            {answers[currentQuestionIndex] !== null && (
                <p>Selected answer: {currentQuestion?.options[answers[currentQuestionIndex]]}</p>
            )}
            <p>Remaining Time: {remainingTime} seconds</p>
            {!isLastQuestion && (
                <button onClick={nextQuestion}>Next</button>
            )}
            {isLastQuestion && !showSubmit && (
                <button onClick={() => setShowSubmit(true)}>Submit</button>
            )}
            {showSubmit && (
                <button onClick={calculateScore}>Submit</button>
            )}
            {score !== null && (
                <p>Final Score: {score}%</p>
            )}
        </div>
    );
}

export default Home;
