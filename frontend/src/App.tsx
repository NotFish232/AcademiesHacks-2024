import MainPage from "./pages/main";
import ScenePage from "./pages/scene";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import UploadPage from "./pages/upload";
import SelectPage from "./pages/select";
import Navbar from "./components/navbar";

function App() {
    return (
        <BrowserRouter>
            <div className="flex h-full w-full flex-row">
                <Navbar />
                <div className="h-[85vh] w-[80vw]  text-[#1E1E1E]">
                    <Routes>
                        <Route path="/" Component={MainPage} />
                        <Route path="/scene" Component={ScenePage} />
                        <Route path="/upload" Component={UploadPage} />
                        <Route path="/select" Component={SelectPage} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
