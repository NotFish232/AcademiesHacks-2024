import { Canvas, useLoader } from "@react-three/fiber";
import { useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import CaretLeft from "../assets/svgs/caret_left.svg?react";
import CaretRight from "../assets/svgs/caret_right.svg?react";
import { Slider } from "@/components/ui/slider";

function ScenePage() {
    const gltf_ref = useRef();
    const gltf = useLoader(GLTFLoader, "/test.gltf");

    const [isOpened, setIsOpened] = useState(false);
    const [brightness, setBrightness] = useState(0.3);

    const Caret = isOpened ? CaretRight : CaretLeft;

    return (
        <div className="relative flex h-full w-full flex-col justify-center">
            <Canvas className="border border-black">
                <ambientLight intensity={brightness} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />

                <primitive
                    ref={gltf_ref}
                    object={gltf.scene}
                    position={[0, 0, 0]}
                />
                <OrbitControls />
            </Canvas>
            <div className="absolute right-2 flex flex-row items-center">
                <div
                    className="group mr-2 flex flex-row items-center"
                    onClick={() => setIsOpened(!isOpened)}>
                    <Caret className="duration-200 group-hover:mr-2 group-hover:scale-125" />
                    <div className="h-20 border border-black duration-200 group-hover:scale-125" />
                </div>
                <div
                    className={
                        "flex w-32 flex-col justify-center" +
                        (!isOpened ? " hidden" : "")
                    }>
                    <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        defaultValue={[brightness]}
                        onValueChange={(v) => setBrightness(v[0])}
                    />
                </div>
            </div>
        </div>
    );
}

export default ScenePage;
