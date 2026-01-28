import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

/*
  Meet Our Developers - ARC Events
  --------------------------------
  ID Card Style Design
*/

const developers = [
  {
    name: "Garv Noor Sandha",
    role: "Full Stack Developer",
    photo: "https://res.cloudinary.com/dbl2so7ff/image/upload/v1762839758/Profile_LINK_x49mdb.jpg",
    linkedin: "https://www.linkedin.com/in/garvsandha/",
    github: "https://github.com/Garrvvvvvv",
    id: "001928"
  },
 
];

export default function MeetOurDevelopers() {
  return (
    <div className="min-h-screen bg-[#f0f2f5] py-24 px-4 sm:px-6 lg:px-8 font-sans">

      {/* Header */}
      <div className="text-center mb-24 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
          Meet the  <span className="text-[#EB1B24]"> WEB DEVELOPER</span>
        </h1>
        <div className="h-1 w-24 bg-[#EB1B24] mx-auto rounded-full"></div>
      </div>

      {/* Grid */}
      <div className="flex flex-wrap justify-center gap-16 lg:gap-24 max-w-7xl mx-auto items-center">
        {developers.map((dev, index) => (
          <div key={index} className="group relative w-[300px] h-[450px] transition-all duration-500 hover:scale-105">

            {/* Lanyard Clip Simulation */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 flex flex-col items-center z-0 opacity-80">
              {/* Strap */}
              <div className="w-6 h-24 bg-gray-900 rounded-b-lg shadow-sm"></div>
              {/* Metal Clip Ring */}
              <div className="-mt-4 w-10 h-10 border-4 border-gray-400 rounded-full bg-transparent z-10"></div>
              {/* Clip Hook */}
              <div className="-mt-6 w-4 h-12 bg-gray-300 rounded-full shadow-inner border border-gray-400"></div>
            </div>

            {/* Back Card (Dark Layer) */}
          

            {/* Front Card (White Layer) */}
            <div className="absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden z-20 flex flex-col">

              {/* Photo Section */}
              <div className="relative h-[65%] bg-gray-100 overflow-hidden">
                <img
                  src={dev.photo}
                  alt={dev.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Text Section (Simulating the curved cutout visually with CSS not easy perfectly, so using clean modern block) */}
              <div className="relative flex-1 bg-white p-6 flex flex-col justify-center">

                {/* Decorative Curve Element (Optional sophisticated touch) */}
                <div className="absolute -top-10 right-0 w-20 h-20 bg-white rounded-tl-[80px] z-10 pointer-events-none"></div>

                <div className="relative z-20">
                  <h2 className="text-2xl font-bold text-gray-900 leading-none mb-1">
                    {dev.name.split(' ')[0]}
                  </h2>
                  <h2 className="text-2xl font-light text-gray-600 leading-none mb-3">
                    {dev.name.split(' ').slice(1).join(' ')}
                  </h2>

                  <p className="text-[#EB1B24] font-medium text-sm tracking-wide uppercase mb-4">
                    {dev.role}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">

                    {/* Socials */}
                    <div className="flex gap-4">
                      <a href={dev.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#0077b5] transition-colors text-xl">
                        <FaLinkedin />
                      </a>
                      <a href={dev.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors text-xl">
                        <FaGithub />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
