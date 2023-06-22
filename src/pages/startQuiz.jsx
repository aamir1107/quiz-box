import React, { useEffect, useState } from 'react'
import classes from "./../scss/startQuiz.module.scss"
import datas from "./../data/quizQuestionBank.json";
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: '500px',
    width: '800px',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    p: 1,
};



const optionMap = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

function StartQuiz() {
    const navigate = useNavigate();
    const { categories, subCatogeries } = useParams(); // console.log('categories', categories)  // console.log('subCatogeries', subCatogeries)
    const [questionSet, setQuestionSet] = useState([]); // console.log('questionSet', questionSet)
    const [shownQuestionIndex, setShownQuestionIndex] = useState(0); console.log('shownQuestionIndex', shownQuestionIndex)
    const [selectedQuestion, setSelectedQuestion] = useState(null);  // console.log('selectedQuestion', selectedQuestion)
    const [timeDuration, setTimeDuration] = useState(0);   // console.log('timeDuration', timeDuration)
    const [openSubmitPopup, setOpenSubmitPopup] = useState(false);
    const [isTimerStarted, setIsTimerStarted] = useState(false);


    useEffect(() => {
        let questionDetails = datas?.[categories]?.[subCatogeries] || null;
        if (questionDetails) {
            let _questionSet = questionDetails.questions;
            let duration = questionDetails.timeDuration;
            _questionSet = _questionSet.map(eachQuestion => {
                eachQuestion.userSelectedAnswer = []
                console.log('eachQuestion.userSelectedAnswer', eachQuestion.userSelectedAnswer)
                return eachQuestion
            })
            setQuestionSet(_questionSet)
            setTimeDuration(duration * 60)
            setSelectedQuestion(_questionSet[shownQuestionIndex])
            setIsTimerStarted(true)
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
        // eslint-disable-next-line 
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

    const handleSubmit = () => {
        setIsTimerStarted(false)
        setOpenSubmitPopup(true)
    }

    const handleClose = () => {
        setOpenSubmitPopup(false)
    }

    const renderTime = ({ remainingTime }) => {
        if (remainingTime === 0) {
            handleSubmit()
            return <div className="timer">Too lale...</div>;
        }


        return (
            <div className="timer">
                <div className="text">Remaining</div>
                <div className="value">{remainingTime}</div>
            </div>
        );
    };

    const getScore = (userSelectedAnswer, answer) => {
        if (userSelectedAnswer.length) {
            let isCorrect = true;
            for (let i = 0; i < answer.length; i++) {
                if (!userSelectedAnswer.includes(answer[i])) {
                    isCorrect = false;
                    break;
                }
            }
            return isCorrect ? "1" : "0"
        } else {
            return "0"
        }
    }



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
                                {`(${optionMap[idx]}) ${e}`}

                            </div>
                        ))}
                    </div>

                    <div className={classes.buttonSection}>

                        <div className={classes.previousButton}>
                            <Button variant="outlined" className={classes.previous}
                                onClick={handlePrevious}
                            >PREVIOUS</Button>
                        </div>

                        <div className={classes.nextButton} >
                            <Button variant="outlined" className={classes.next}
                                onClick={handleNext}
                            >NEXT</Button>
                        </div>

                        <div className={classes.submitButton}>
                            <Button className={classes.submit}
                                onClick={handleSubmit}
                            >SUBMIT</Button>
                        </div>

                        <div className={classes.timerWrapper}>
                            <CountdownCircleTimer
                                isPlaying={isTimerStarted}
                                duration={timeDuration}
                                colors={["#ff0303",]}
                                onComplete={() => ({ shouldRepeat: false, delay: 1 })}>
                                {renderTime}
                            </CountdownCircleTimer>
                        </div>

                    </div>

                </div>

                : null}


            {openSubmitPopup ? <Modal
                className={classes.resultPopUp}
                open={openSubmitPopup}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h5" sx={{
                        textAlign: 'center',
                        color: 'red'
                    }}>
                        {`${categories} -  ${subCatogeries}`}
                    </Typography>



                    <div className={classes.resultTable}>

                        <span className={classes.resultText}>Result</span>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th style={{
                                        width: "100px",
                                        color: "red"
                                    }
                                    }>
                                        S.No
                                    </th>

                                    <th style={{
                                        width: "150px",
                                        color: "red"
                                    }
                                    }>
                                        Selected Answer
                                    </th>

                                    <th style={{
                                        width: "100px",
                                        color: "red"
                                    }
                                    }>
                                        Answer
                                    </th>

                                    <th style={{
                                        width: "100px",
                                        color: "red"
                                    }
                                    }>
                                        Score
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {questionSet.map((question, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>{question.userSelectedAnswer.map(e => optionMap[e]).join(' ')}</td>
                                        <td>{question.answer.map(e => optionMap[e]).join(',')}</td>
                                        <td>{getScore(question.userSelectedAnswer, question.answer)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Box>
            </Modal> : null
            }
        </div >
    )
}

export default StartQuiz;
