import MainPage from "./pages/main";
import ScenePage from "./pages/scene";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import UploadPage from "./pages/upload";
import SelectPage from "./pages/select";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

function App() {
    return (
        <>
            <Navbar />
            <BrowserRouter>
                <Routes>
                    <Route path="/" Component={MainPage} />
                    <Route path="/scene" Component={ScenePage} />
                    <Route path="/upload" Component={UploadPage} />
                    <Route path="/select" Component={SelectPage} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
            <Footer />
        </>
    );
}

export default App;
