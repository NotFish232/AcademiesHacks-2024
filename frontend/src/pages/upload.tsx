import { useEffect, useState } from "react";
import { backend_url } from "../shared";
import '../assets/Upload.css'
import { Navigate } from "react-router-dom";

function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!submitted) {
            return;
        }

        let formData = new FormData();
        formData.append("file", file!);

        fetch(`${backend_url}/scene/create`, {
            method: "POST",
            body: formData,
        }).then(_r => {
            setRedirect(true);
        });
    }, [submitted]);

    if (redirect) {
        return <Navigate to="/select" />;
    }

    return (
        <div className="h-svh flex flex-col  bg-[#d5c891] p-10">
            <div className="w-full h-full flex flex-col items-center justify-center space-y-12">
                <div className="w-full flex items-center justify-center ">
                    <h1 className="text-4xl font-bold">Upload your Scene</h1>
                </div>
                <div className="flex flex-col items-center ">
                    <input
                        type="file"
                        onChange={(e) => setFile((e.target.files || [null])[0])}
                        className="text-lg font-semibold px-4 py-2 bg-[#b5a45c] rounded-xl transition-all duration-150 ease-in-out hover:scale-110"
                    />
                    <button
                        className="text-lg font-semibold px-4 py-2 bg-[#b5a45c] rounded-xl transition-all duration-150 ease-in-out hover:scale-110"
                        onClick={() => {
                            if (file) {
                                setSubmitted(true);
                            }
                        }}>
                        submit
                    </button>

                </div>
            </div>
        </div>
    );
}

export default UploadPage;
