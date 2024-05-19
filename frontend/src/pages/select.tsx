import { backend_url } from "@/shared";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function useScenes() {
    const [scenes, setScenes] = useState<string[] | null>(null);

    useEffect(() => {
        fetch(`${backend_url}/scene/list`)
            .then((r) => r.json())
            .then(setScenes);
    }, []);

    return scenes;
}

interface SceneComponentProps {
    scene: string;
    selected: boolean;
    onClick: (scene: string) => void;
}

function SceneComponent(props: SceneComponentProps) {
    return (
        <div
            onClick={() => props.onClick(props.scene)}
            className={
                "cursor-pointer" + (props.selected ? " font-semibold flex flex-col  bg-[#d5c891]" : " bg-[#d5c891]")
            }>
            {props.scene}
        </div>
    );
}

function SelectPage() {
    const scenes = useScenes();
    const [selectedScene, setSelectedScene] = useState<string | null>(null);
    const [visualizeClicked, setVisualizeClicked] = useState(false);

    if (visualizeClicked) {
        return <Navigate to={`/scene?scene=${selectedScene}`} />;
    }

    return (
        <div className="mx-4 my-6 flex flex-col">
            <div className="text-3xl font-semibold">Available Scenes</div>
            <div className="mt-2">
                {scenes?.map((s, idx) => (
                    <SceneComponent
                        scene={s}
                        selected={s == selectedScene}
                        onClick={(s) => setSelectedScene(s)}
                        key={idx}
                    />
                ))}
            </div>
            <div className="flex-1" />
            <div
                className="cursor-pointer"
                onClick={() => {
                    if (selectedScene) {
                        setVisualizeClicked(true);
                    }
                }}>
                Visualize Scene
            </div>
        </div>
    );
}

export default SelectPage;
