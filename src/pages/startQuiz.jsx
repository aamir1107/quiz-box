import React, { useEffect, useState } from 'react'
import classes from "./../scss/startQuiz.module.scss"
import datas from "./../data/quizQuestionBank.json";
import { useParams, useNavigate, useBeforeUnload } from 'react-router-dom';
import Button from '@mui/material/Button';
import ReactDOM from "react-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const optionMap = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

function StartQuiz() {
    const navigate = useNavigate();
    const { categories, subCatogeries } = useParams();
    const [questionSet, setQuestionSet] = useState([]);
    const [shownQuestionIndex, setShownQuestionIndex] = useState(0);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [timeDuration, setTimeDuration] = useState(0);


    useEffect(() => {
        let questionDetails = datas?.[categories]?.[subCatogeries] || null;
        if (questionDetails) {
            let _questionSet = questionDetails.questions;
            let duration = questionDetails.timeDuration;
            _questionSet = _questionSet.map(eachQuestion => {
                eachQuestion.userSelectedAnswer = []
                return eachQuestion
            })
            setQuestionSet(_questionSet)
            setTimeDuration(duration * 60)
            setSelectedQuestion(_questionSet[shownQuestionIndex])

        } else {
            navigate('/')
        }


        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = 'fgddd'; // This line is necessary for some browsers
        };

        // Add the event listener when the component mounts
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);


        };

    }, [])

    const handleUserAction = (idx) => {
        let _questionSet = JSON.parse(JSON.stringify(questionSet));
        if (selectedQuestion.isMultiple) {
            _questionSet[shownQuestionIndex].userSelectedAnswer.push(idx)
        } else {
            _questionSet[shownQuestionIndex].userSelectedAnswer = [idx];
        }
        console.log("selected Question", _questionSet[shownQuestionIndex])
        setSelectedQuestion(_questionSet[shownQuestionIndex])
        setQuestionSet(_questionSet)
    }

    const handleNext = () => {
        if (shownQuestionIndex < questionSet.length - 1) {
            setShownQuestionIndex(shownQuestionIndex + 1)
            setSelectedQuestion(questionSet[shownQuestionIndex + 1])
        }

    }

    const handlePrevious = () => {
        if (shownQuestionIndex > 0) {
            setShownQuestionIndex(shownQuestionIndex - 1)
            setSelectedQuestion(questionSet[shownQuestionIndex - 1])
        }
    }


    const renderTime = ({ remainingTime }) => {
        if (remainingTime === 0) {
            return <div className="timer">Too lale...</div>;
        }

        return (
            <div className="timer">
                <div className="text">Remaining</div>
                <div className="value">{remainingTime}</div>

            </div>
        );
    };



    return (
        <div className={classes.startQuestionContainer}>
            {selectedQuestion ?
                <div className={classes.questionAnswerSection} >

                    <div className={classes.questionSection}>
                        <span style={{
                            color: "black",
                            fontWeight: "bold",

                        }}>
                            (Q)</span>  {selectedQuestion.question}
                    </div>


                    <div className={classes.optionsSection}>
                        {selectedQuestion.options.map((e, idx) => (
                            <div key={e} className={`${classes.option}${selectedQuestion.userSelectedAnswer.includes(idx) ? ` ${classes.selectedOption}` : ''}`}
                                onClick={() => handleUserAction(idx)}
                            >
                                {"(" + optionMap[idx] + ") " + " " + e}

                            </div>
                        ))}
                    </div>

                    <div >

                        <div>
                            <Button variant="outlined" className={classes.startButton}
                                onClick={handlePrevious}
                            >PREVIOUS</Button>
                        </div>

                        <div >
                            <Button variant="outlined" className={classes.startButton}
                                onClick={handleNext}
                            >NEXT</Button>
                        </div>

                        <div className="timer-wrapper">
                            <CountdownCircleTimer
                                isPlaying
                                duration={timeDuration}
                                colors={["#004777",]}

                                colorsTime={[10, 6, 3, 0]}
                                onComplete={() => ({ shouldRepeat: true, delay: 1 })}
                            >
                                {renderTime}
                            </CountdownCircleTimer>
                        </div>

                    </div>

                </div>

                : null}

        </div>
    )
}

export default StartQuiz;
