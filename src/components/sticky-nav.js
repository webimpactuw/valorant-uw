import React from "react";

const StickyNavBar = () => {
    return (
     <div className="absolute top-0 left-0 pt-8 h-0 mx-auto w-full hidden md:block">
        <div className="py-0 sticky top-0 z-10">
<<<<<<< HEAD:valorant-site/src/components/sticky-nav.js
            <div className="px-14 py-2.5 bg-purple-900/70 rounded-[47px] outline outline-2 outline-offset-[-2px] outline-zinc-400 backdrop-blur-[10px] inline-flex justify-start items-start gap-16 overflow-hidden">
=======
            <div className="px-14 py-2.5 bg-purple-900/70 rounded-[47px] outline outline-2 outline-offset-[-2px] outline-zinc-400 backdrop-blur-[10px] inline-flex justify-start items-start gap-10 lg:gap-16 overflow-hidden">
>>>>>>> a539af89 (fix project folder structure):src/components/sticky-nav.js
                <a href="#join" className="text-nowrap justify-start text-white text-xl md:text-2xl lg:text-3xl font-bold font-['DINish']">JOIN A GAME</a>
                <a href="#about" className="text-nowrap justify-start text-white text-xl md:text-2xl lg:text-3xl font-bold font-['DINish']">ABOUT</a>
                <a href="#play" className="text-nowrap justify-start text-white text-xl md:text-2xl lg:text-3xl font-bold font-['DINish']">WAYS TO PLAY</a>
                <a href="#officers" className="text-nowrap justify-start text-white text-xl md:text-2xl lg:text-3xl font-bold font-['DINish']">OFFICERS</a>
                <a href="#sponsors" className="text-nowrap justify-start text-white text-xl md:text-2xl lg:text-3xl font-bold font-['DINish']">SPONSORS</a>
            </div>
        </div>
    </div>
  );
};

export default StickyNavBar;