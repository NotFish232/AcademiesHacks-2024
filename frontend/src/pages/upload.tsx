import { useEffect, useState } from "react";
import { backend_url } from "../shared";

function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!submitted) {
            return;
        }

        let formData = new FormData();
        formData.append("file", file!);

        fetch(`${backend_url}/scene/create`, {
            method: "POST",
            body: formData,
        });
    }, [submitted]);

    return (
        <div className="flex flex-col items-center">
            Upload Page
            <input
                type="file"
                onChange={(e) => setFile((e.target.files || [null])[0])}
            />
            <button
                onClick={() => {
                    if (file) {
                        setSubmitted(true);
                    }
                }}>
                submit
            </button>
        </div>
    );
}

export default UploadPage;
