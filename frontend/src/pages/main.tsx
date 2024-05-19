'use client'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';


function MainPage() {
    
    useGSAP( () => {
        gsap.to('.onload', {
            translateY: -10,
            opacity: 1,
            stagger: 0.2
        })
    })
    

    return (
        <div className="h-svh p-10 bg-[#d5c891] text-[#1E1E1E]">
            <div className="h-full flex flex-col justify-center items-center space-y-4">
                <div className=" w-full flex flex-col items-center">
                    <h1 className={`onload transate-y-2 opacity-0 font-bold text-4xl `}>Welcome to Watson.</h1>
                    <p className=" onload transate-y-2 opacity-0 font-semibold text-xl">Your AI Crime Assistant</p>
                </div>
                <div className="w-1/2 h-max flex flex-col items-center space-y-2">
                    <div className="onload transate-y-2 opacity-0 w-1/2 items-center text-center font-semibold">
                        <h1>To get started, navigate to <br/> 'Upload Scene in the navbar.'</h1>
                    </div>
                    <a href='/upload' className="onload transate-y-2 opacity-0 text-lg font-semibold px-4 py-2 bg-[#b5a45c] rounded-xl 
                    transition-all duration-150 ease-in-out hover:scale-110
                    " >Get Started</a>
                </div>
            </div>
            
        </div>
    )
}

export default MainPage;
