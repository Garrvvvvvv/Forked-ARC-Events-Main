import { FaSpotify, FaFacebookF, FaTwitter } from 'react-icons/fa';
import { FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#EAEAEA] text-[#333333] font-sans">
      {/* Top Red Border */}
      <div className="h-1 bg-[#ca0002] w-full"></div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Column 1: Logo & About & Newsletter */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {/* TI Logo Box */}
              <div className="flex flex-col items-center">
                <img
                  src="/assets/ti-logo.png"
                  alt="TI Logo"
                  className="h-16 mb-1 object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
                {/* Fallback text if no logo */}
                <h2 className="text-[#8B0000] font-serif font-bold text-xl tracking-wide uppercase leading-none">
                  THAPAR
                </h2>
                <span className="text-[0.65rem] uppercase tracking-wider text-gray-600">Institute of Engineering & Technology</span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-gray-700">
              Thapar Institute of Engineering & Technology combines experience with new-age implementation.
              <br /><br />
              <strong>Alumni Relations Cell</strong><br />
              Connect | Create | Contribute.
            </p>
          </div>

          {/* Column 2: Quick Links (Part 1) */}
          <div>
            <h3 className="text-xl text-[#333] font-normal mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                { name: "Home", path: "/" },
                { name: "Events", path: "/events" },
                { name: "Memories", path: "/memories" },
                { name: "My Registrations", path: "/my-registrations" },
                { name: "About ARC", path: "/meetourteam" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-[#8B0000] flex items-start">
                    <span className="mr-2 text-gray-400">&gt;</span> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links (Part 2 - Education/Policy Placeholders) */}
          <div>
            <h3 className="text-xl text-[#333] font-normal mb-4 text-transparent select-none">.</h3> {/* Spacer title */}
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                { name: "Student Grievance Redressal", path: "#" },
                { name: "Internal Complaints Committee", path: "#" },
                { name: "TIET ADMISSIONS", path: "#" },
                { name: "Alumni Portal", path: "#" },
                { name: "Privacy Policy", path: "#" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a href={link.path} className="hover:text-[#8B0000] flex items-start">
                    <span className="mr-2 text-gray-400">&gt;</span> {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="text-xl text-[#333] font-normal mb-4">Contact Us</h3>
            <div className="text-sm text-gray-700 space-y-4">
              <div className="flex gap-3">
                <span className="text-[#8B0000] mt-1 text-lg">📍</span>
                <p>
                  Office of Alumni Relations,<br />
                  Thapar Institute of Engineering & Technology,<br />
                  P.O. Box 32, Bhadson Road, Patiala, Punjab, Pin -147004, India
                </p>
              </div>

              <div>
                <p className="font-bold">Email:</p>
                <a href="mailto:headalumni@thapar.edu" className="block hover:text-[#8B0000]">headalumni@thapar.edu</a>
                <a href="mailto:arctiet@thapar.edu" className="block hover:text-[#8B0000]">arctiet@thapar.edu</a>
              </div>

              <div>
                <p className="font-bold">Follow Us:</p>
                <div className="flex space-x-3 mt-2">
                  <a href="https://www.instagram.com/arc_tiet/" target="_blank" rel="noreferrer" className="bg-[#555] text-white p-2 rounded-full hover:bg-[#E1306C] transition-colors"><FaInstagram size={14} /></a>
                  <a href="https://www.linkedin.com/company/thapar-alumni-relations/" target="_blank" rel="noreferrer" className="bg-[#555] text-white p-2 rounded-full hover:bg-[#0077b5] transition-colors"><FaLinkedinIn size={14} /></a>
                  <a href="https://www.youtube.com/@AlumniRelationsCellTIET" target="_blank" rel="noreferrer" className="bg-[#555] text-white p-2 rounded-full hover:bg-[#FF0000] transition-colors"><FaYoutube size={14} /></a>
                  <a href="https://open.spotify.com/show/0Bu6ILKEXigkmP0fw82wm8" target="_blank" rel="noreferrer" className="bg-[#555] text-white p-2 rounded-full hover:bg-[#1DB954] transition-colors"><FaSpotify size={14} /></a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-[#DEDEDE] border-t border-gray-300 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>Copyright © 2025. Thapar Institute of Engineering & Technology. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            {/* Social Icons Repeat or other links can go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}