import React, { useEffect, useState } from 'react'
import classes from '../scss/mainPage.module.scss'
import Button from '@mui/material/Button';
import data from '../data/quizQuestionBank.json';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';



function MainPage() {
    const [categories] = useState(Object.keys(data))
    const [selectedCategory, setSelectedCategory] = useState('')
    const [subCategoryList, setSubCategoryList] = useState([])
    const [open, setOpen] = useState(false);
    const [selectedSubCategory, setSelectedSubCategory] = useState('')
    const navigate = useNavigate();

    const handleOpen = (category) => {
        setSelectedCategory(category)
        const subCatogeries = Object.keys(data[category])
        setSubCategoryList(subCatogeries)
        setOpen(true)
    };
    const handleClose = () => setOpen(false);

    const routeToStartQuiz = () => {
        navigate(`quiz/${selectedCategory}/${selectedSubCategory}`)
    }

    // useEffect(() => {
    //     for (let category in data) {
    //         let categoryData = data[category]
    //         for (let subCategory in categoryData) {
    //             let questionSet = [...categoryData[subCategory]]
    //             questionSet = questionSet.map(questopn => {
    //                 if (!Array.isArray(questopn.answer)) {
    //                     questopn.answer = [questopn.answer]
    //                 }
    //                 return questopn
    //             })
    //             categoryData[subCategory] = {
    //                 "timeDuration": questionSet.length,
    //                 "questions": questionSet
    //             }
    //         }
    //     }
    //     console.log(JSON.stringify(data))
    // }, [])



    return (
        <div className={classes.homePage}>

            <div className={classes.headingSection}>
                <div className={classes.animateCharcter}>
                    Quiz  Box
                </div>
            </div>

            <div className={classes.quizCategory}>
                {categories.map(cate => (<div key={cate} className={classes.categories} onClick={() => handleOpen(cate)} >{cate}</div>))}

            </div>


            <Modal
                open={open}

                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"

            >


                <div className={classes.subCategorySection}>

                    <div className={classes.heading}>
                        {selectedCategory} Section
                    </div>

                    <div className={classes.subSection}>
                        {subCategoryList.map(subCate => (<div key={subCate} className={`${classes.subCategories}${subCate === selectedSubCategory ? ` ${classes.selected}` : ""}`} onClick={() => { setSelectedSubCategory(subCate) }}>{subCate}</div>))}
                    </div>

                    <div className={classes.buttonSection}>

                        <div className={classes.startQuizButton}>
                            <Button variant="outlined" className={classes.startButton} onClick={routeToStartQuiz}>START QUIZ</Button>
                        </div>

                        <div className={classes.closeButtonSection}>
                            <Button variant="outlined" className={classes.closeButton} onClick={handleClose}>CLOSE</Button>
                        </div>

                    </div>




                </div>
            </Modal>



        </div >


    );
}

export default MainPage;
