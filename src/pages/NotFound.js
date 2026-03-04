import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="relative overflow-hidden min-h-screen flex items-center justify-center bg-off-white" style={{ backgroundImage: "url('/dot_overlay.png')" }}>
      <div className="text-center z-10 relative flex flex-col items-center gap-6 px-8">
        <h1 className="text-[#4c0080] text-[10rem] leading-none font-normal uppercase font-anton-sc">404</h1>
        <p className="font-dinish text-2xl text-[#4d4d4d] font-bold uppercase">Page Not Found</p>
        <p className="font-dinish text-lg text-[#4d4d4d]">Looks like you took a wrong turn. This page doesn't exist.</p>
        <Link to="/">
          <div className="group border-[#4c0080] hover:border-[#9886d0] border-2 p-[2px]">
            <div className="px-8 py-3 bg-[#4c0080] group-hover:bg-[#9886d0] text-white uppercase font-bold text-xl font-dinish transition-colors duration-300">
              Back to Home
            </div>
          </div>
        </Link>
      </div>
      <h1
        className="absolute top-[-5vh] left-0 w-full text-center text-[40vw] z-0 font-bold select-none pointer-events-none"
        aria-hidden="true"
        style={{
          color: "white",
          WebkitTextStroke: "3px rgba(152, 134, 208, 0.2)",
          textTransform: "uppercase",
        }}
      >
        404
      </h1>
    </div>
  );
}

export default NotFound;
