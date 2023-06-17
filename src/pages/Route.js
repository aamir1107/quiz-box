import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./mainPage";
import StartQuiz from "./startQuiz"


function RoutePage() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route index element={< MainPage />} />
                    <Route path="quiz/:categories/:subCatogeries" element={< StartQuiz />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}
export default RoutePage;