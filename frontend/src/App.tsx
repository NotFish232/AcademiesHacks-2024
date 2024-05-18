import MainPage from "./pages/main";
import ScenePage from "./pages/scene";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import UploadPage from "./pages/upload";
import SelectPage from "./pages/select";



function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" Component={MainPage} />
                    <Route path="/scene" Component={ScenePage} />
                    <Route path="/upload" Component={UploadPage} />
                    <Route path="/select" Component={SelectPage} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
