import React from "react";

function StickyNavBar() {
    return (
        <div className="absolute top-0 left-0 pt-8 h-0 mx-auto w-full hidden md:block">
            <div className="py-0 sticky top-0 z-10">
                <nav aria-label="Section navigation">
                    <ul className="max-w-full px-[5%] py-2.5 bg-purple-900/70 rounded-[47px] outline outline-2 outline-offset-[-2px] outline-zinc-400 backdrop-blur-[10px] inline-flex justify-start items-start gap-10 lg:gap-16 overflow-hidden">
                        <li>
                            <a href="#join" className="text-nowrap justify-start text-white text-xl md:text-2xl lg:text-3xl font-bold font-['DINish'] hover:text-yellow-200">JOIN A GAME</a>
                        </li>
                        <li>
                            <a href="#about" className="text-nowrap justify-start text-white text-xl md:text-2xl lg:text-3xl font-bold font-['DINish'] hover:text-yellow-200">ABOUT</a>
                        </li>
                        <li>
                            <a href="#play" className="text-nowrap justify-start text-white text-xl md:text-2xl lg:text-3xl font-bold font-['DINish'] hover:text-yellow-200">WAYS TO PLAY</a>
                        </li>
                        <li>
                            <a href="#officers" className="text-nowrap justify-start text-white text-xl md:text-2xl lg:text-3xl font-bold font-['DINish'] hover:text-yellow-200">OFFICERS</a>
                        </li>
                        <li>
                            <a href="#sponsors" className="text-nowrap justify-start text-white text-xl md:text-2xl lg:text-3xl font-bold font-['DINish'] hover:text-yellow-200">SPONSORS</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default StickyNavBar;