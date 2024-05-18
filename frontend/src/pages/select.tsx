import { backend_url } from "@/shared";
import { useEffect, useState } from "react";

function useScenes() {
    const [scenes, setScenes] = useState<string[] | null>(null);

    useEffect(() => {
        fetch(`${backend_url}/scene/list`).then(r => r.json()).then(setScenes);
    }, []);

    return scenes;
}

interface SceneComponentProps {
    scene: string;
    onClick: (scene: string) => void;
}

function SceneComponent(props: SceneComponentProps) {
    return <div onClick={() => props.onClick(props.scene)}>props.scene</div>;
}

function SelectPage() {
    const scenes = useScenes();
    const [selectedScene, setSelectedScene] = useState<string | null>(null);
    return <div>{scenes?.map(s => <SceneComponent scene={s} onClick={(s) => setSelectedScene(s)} />)} </div>;
}

export default SelectPage;
