import { useSearchParams } from "react-router-dom";
import Logo from "../assets/logo.png";
import { url } from "../shared";
import { Link } from "react-router-dom";

function Navbar() {
    const [searchParams, _setSearchParams] = useSearchParams();
    const scene = searchParams.get("scene");

    return (
        <div className="space flex h-[100vh] w-[20vw] flex-col items-center bg-slate-800">
            <div className="mx-3 mt-32 rounded-full bg-slate-100">
                <img src={Logo} />
            </div>
            <div className="mt-10 cursor-pointer font-semibold text-slate-100">
                <Link to={{ pathname: "/" }}>Home</Link>
            </div>
            <div className="mt-2 cursor-pointer font-semibold text-slate-100">
                <Link to={{ pathname: "/select" }}>Select Scene</Link>
            </div>
            <div className="mt-2 cursor-pointer font-semibold text-slate-100">
                <Link to={{ pathname: "/upload" }}>Upload Scene</Link>
            </div>
            <div className="flex-1" />
            <div className="text-slate-100 ">Share Scene</div>
            {scene ? (
                <div
                    className="mb-6 cursor-pointer text-blue-400"
                    onClick={() => {
                        navigator.clipboard.writeText(
                            `${url}/scene?scene=${scene}`,
                        );
                    }}>
                    {scene}
                </div>
            ) : (
                <div className="mb-6 text-slate-100">No Scene Selected</div>
            )}
        </div>
    );
}

export default Navbar;
