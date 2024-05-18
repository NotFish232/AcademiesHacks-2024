import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function ScenePage() {
    const gltf_ref = useRef();
    const gltf = useLoader(GLTFLoader, "/test.gltf");

    return (
            <Canvas className="border border-black">
                <ambientLight intensity={0.25} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />

                <primitive
                    ref={gltf_ref}
                    object={gltf.scene}
                    position={[0, 0, 0]}
                />
                <OrbitControls />
            </Canvas>

    );
}

export default ScenePage;
