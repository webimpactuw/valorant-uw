import React from "react";

const StickyNavBar = () => {
    return (
<div className="sticky top-0 z-10">
    <div className="px-14 py-2.5 bg-purple-900/70 rounded-[47px] outline outline-2 outline-offset-[-2px] outline-zinc-400 backdrop-blur-[10px] inline-flex justify-start items-start gap-16 overflow-hidden">
        <a href="#join" className="justify-start text-white text-3xl font-bold font-['DINish']">JOIN A GAME</a>
        <a href="#about" className="justify-start text-white text-3xl font-bold font-['DINish']">ABOUT</a>
        <a href="#play" className="justify-start text-white text-3xl font-bold font-['DINish']">WAYS TO PLAY</a>
        <a href="#officers" className="justify-start text-white text-3xl font-bold font-['DINish']">OFFICERS</a>
        <a href="#sponsors" className="justify-start text-white text-3xl font-bold font-['DINish']">SPONSORS</a>
    </div>
</div>
  );
};

export default StickyNavBar;