import { useState, useEffect, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./home.css";
import { FaClipboardList, FaRegCalendarAlt, FaImage, FaUsers } from "react-icons/fa";
import { api } from "../../lib/api";

/* ---------------- Cloudinary helpers ---------------- */
function isCloudinary(url) {
  return typeof url === "string" && /res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(url);
}

/**
 * Injects Cloudinary transformations after `/image/upload/`
 * Example addTransform(".../upload/v123/abc.jpg", "f_auto,q_auto,dpr_auto,w_1200") =>
 * ".../upload/f_auto,q_auto,dpr_auto,w_1200/v123/abc.jpg"
 */
function addTransform(url, transform) {
  if (!isCloudinary(url)) return url;
  return url.replace(/\/image\/upload\/(?!.*\/image\/upload\/)/, `/image/upload/${transform}/`);
}

/** Builds src + srcSet for responsive images */
function buildCloudinarySources(url, widths, { crop = "c_fill", gravity = "g_auto", quality = "q_auto", fmt = "f_auto", dpr = "dpr_auto" } = {}) {
  if (!isCloudinary(url)) {
    return { src: url, srcSet: undefined };
  }
  const baseTransform = [fmt, quality, dpr, gravity, crop].filter(Boolean).join(",");
  const srcSet = widths.map((w) => `${addTransform(url, `${baseTransform},w_${w}`)} ${w}w`).join(", ");
  const src = addTransform(url, `${baseTransform},w_${Math.max(...widths)}`);
  return { src, srcSet };
}

function Home() {
  const [posterImages, setPosterImages] = useState([]);
  const [jubileeImages, setJubileeImages] = useState([]);
  const token = (typeof window !== "undefined" && localStorage.getItem("adminToken")) || null;

  /* ---------------- Fetch images ---------------- */
  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    api
      .get("/api/images/public/home-images", { params: { category: "home_announcement" } })
      .then((res) => {
        const urls = Array.isArray(res.data) ? res.data.map((img) => img && img.url).filter(Boolean) : [];
        setPosterImages(Array.from(new Set(urls)));
      })
      .catch((err) => console.error("Error fetching poster images:", err));

    api
      .get("/api/images/public/home-images", { params: { category: "home_memories" } })
      .then((res) => {
        const urls = Array.isArray(res.data) ? res.data.map((img) => img && img.url).filter(Boolean) : [];
        setJubileeImages(Array.from(new Set(urls)));
      })
      .catch((err) => console.error("Error fetching memories images:", err));
  }, [token]);

  /* ------------- Falling-stars background ------------- */
  useEffect(() => {
    const background = document.getElementById("background-container");
    if (!background) return;
    background.innerHTML = "";
    const starCount = 150;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}vw`;
      star.style.animationDuration = `${Math.random() * 3 + 3}s`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      background.appendChild(star);
    }
    return () => {
      if (background) background.innerHTML = "";
    };
  }, []);

  /* ----------------- Slider settings ----------------- */
  const NextArrow = ({ onClick }) => (
    <div
      className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 cursor-pointer bg-[#f4f4f400] hover:bg-[#00000030] p-3 rounded-full shadow-md transition-transform duration-200 hover:scale-110"
      onClick={onClick}
      aria-label="Next"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5 sm:w-6 sm:h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div
      className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 cursor-pointer bg-[#f4f4f400] hover:bg-[#00000030] p-3 rounded-full shadow-md transition-transform duration-200 hover:scale-110"
      onClick={onClick}
      aria-label="Previous"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5 sm:w-6 sm:h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </div>
  );

  const posterSettings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 600,
      autoplay: true,
      autoplaySpeed: 4000,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      centerMode: true,
      centerPadding: "0px",
      lazyLoad: "ondemand", // react-slick lazy load
      responsive: [
        {
          breakpoint: 640,
          settings: {
            centerMode: false,
            arrows: true,
            dots: true,
            lazyLoad: "ondemand",
          },
        },
      ],
    }),
    []
  );

  const jubileeSettings = useMemo(
    () => ({
      dots: false,
      infinite: true,
      speed: 500,
      autoplay: true,
      autoplaySpeed: 2500,
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
      lazyLoad: "ondemand", // react-slick lazy load
      responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 2, lazyLoad: "ondemand" } },
        { breakpoint: 768, settings: { slidesToShow: 1, lazyLoad: "ondemand" } },
      ],
    }),
    []
  );

  /* --------------- Quick nav cards data --------------- */
  const navCards = [
    {
      href: "/register",
      title: "Register Now",
      desc: "Secure your spot for the Silver Jubilee celebration.",
    },
    {
      href: "/eventflow",
      title: "Event Schedule",
      desc: "See the full flow of the day’s programs and timings.",
    },
    {
      href: "/memories",
      title: "Gallery",
      desc: "Relive highlights and special moments through photos.",
    },
    {
      href: "/meetourteam",
      title: "Meet ARC Team",
      desc: "Get to know the organizers making it all happen.",
    },
  ];

  /* ---------- Responsive image intent (sizes + widths) ---------- */
  // Posters: large hero-style slides; we target up to ~1600px effective width
  const posterWidths = [480, 768, 1024, 1280, 1600, 1920];
  const posterSizes =
    "(max-width: 640px) 95vw, (max-width: 1024px) 90vw, (max-width: 1536px) 75vw, 70vw";

  // Memories: smaller cards inside carousel
  const memWidths = [360, 540, 720, 960, 1200];
  const memSizes =
    "(max-width: 768px) 90vw, (max-width: 1024px) 42vw, 28vw";

  return (
    <>
      <div id="background-container"></div>

      <div className="page-content">
        {/* Hero Section */}
        <section className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] flex flex-col justify-center items-center text-white text-center p-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 leading-tight">
            Silver Jubilee Celebration
          </h1>
          <p className="text-base sm:text-lg md:text-2xl font-medium text-[#C5CBD3]">
            25 Years of Legacy | Reunite | Relive | Rejoice
          </p>

          {/* CTA */}
          <a
            href="/register"
            aria-label="Register now for the Silver Jubilee Celebration"
            className="
              group mt-8 inline-flex items-center gap-3
              px-8 sm:px-12 py-3 sm:py-4
              rounded-full text-base sm:text-lg font-semibold tracking-wide
              bg-gradient-to-r from-[#EE634F] to-[#F79B28]
              text-black
              shadow-[0_8px_24px_rgba(238,99,79,0.35)]
              transition-all duration-300
              hover:shadow-[0_12px_32px_rgba(238,99,79,0.5)]
              hover:translate-y-[-2px]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F79B28] focus-visible:ring-offset-black
            "
          >
            <span>Register Now</span>
            <svg
              className="size-5 sm:size-6 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </section>

        {/* Posters */}
        <section className="relative w-[95%] sm:w-[90%] mx-auto my-8 sm:my-12">
          <h2 className="text-l sm:text-xl md:text-2xl xl:text-3xl font-bold text-center mb-6 sm:mb-8 text-[#EE634F]">
            Announcements & Posters
          </h2>

          <Slider {...posterSettings}>
            {posterImages.map((url, idx) => {
              const { src, srcSet } = buildCloudinarySources(url, posterWidths, {
                crop: "c_fill",
                gravity: "g_auto",
                quality: "q_auto",
                fmt: "f_auto",
                dpr: "dpr_auto",
              });
              return (
                <div key={idx} className="px-2 sm:px-4">
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl border border-[#352e2e] bg-black">
                    <img
                      src={src}
                      srcSet={srcSet}
                      sizes={posterSizes}
                      alt={`Poster ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="
                        w-full 
                        h-[200px]
                        sm:h-[320px] 
                        md:h-[450px] 
                        lg:h-[550px] 
                        xl:h-[650px]
                        object-cover 
                        rounded-xl 
                        transition-transform 
                        duration-300 
                        hover:scale-[1.01]
                      "
                    />
                  </div>
                </div>
              );
            })}
          </Slider>
        </section>

        {/* Quick Navigation – dark, accent top border, animated hover */}
        <section className="py-10 my-12 bg-[rgba(31,31,31,0.4)] shadow-md">
          <div className="w-[95%] sm:w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { href: "/register", text: "Register Now", desc: "Secure your spot for the celebration.", icon: <FaClipboardList /> },
              { href: "/eventflow", text: "Event Schedule", desc: "See the full day’s program flow.", icon: <FaRegCalendarAlt /> },
              { href: "/memories", text: "Gallery", desc: "Relive the memories & highlights.", icon: <FaImage /> },
              { href: "/meetourteam", text: "Meet ARC Team", desc: "Know the people behind the event.", icon: <FaUsers /> },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="
                  group relative overflow-hidden rounded-2xl p-6
                  bg-[linear-gradient(180deg,#242424_0%,#1b1b1b_100%)]
                  shadow-[0_10px_28px_rgba(0,0,0,0.45)]
                  transition-all duration-300
                  hover:-translate-y-[6px] hover:shadow-[0_18px_40px_rgba(238,99,79,0.25)]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EE634F]/60
                "
                aria-label={item.text}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#EE634F] via-[#F79B28] to-[#EE634F] opacity-80" />
                <div className="pointer-events-none absolute -top-10 right-[-40px] h-28 w-28 rotate-12 rounded-full blur-2xl opacity-0 bg-[conic-gradient(from_120deg,rgba(238,99,79,0.18),rgba(247,155,40,0.12),transparent)] transition-opacity duration-300 group-hover:opacity-100" />
                <div className="mb-4 text-3xl text-[#E2E8F0] transition-all duration-300 group-hover:text-[#EE634F] group-hover:scale-105">
                  {item.icon}
                </div>
                <h3 className="text-[#E2E8F0] text-lg sm:text-xl font-semibold tracking-tight mb-1">{item.text}</h3>
                <p className="text-[#C5CBD3]/90 text-sm leading-relaxed mb-5">{item.desc}</p>
                <span className="inline-flex items-center gap-2 text-[#EE634F] font-semibold">
                  Open
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-[#EE634F]/0 group-hover:ring-1 group-hover:ring-[#EE634F]/25 transition-all duration-300" />
              </a>
            ))}
          </div>
        </section>

        {/* Memories */}
        <section className="w-[95%] sm:w-[90%] mx-auto my-14">
          <h2 className="text-l sm:text-xl md:text-2xl xl:text-3xl font-bold text-center mb-8 text-[#EE634F]">
            Memories Through the Years
          </h2>
          <Slider {...jubileeSettings}>
            {jubileeImages.map((url, idx) => {
              const { src, srcSet } = buildCloudinarySources(url, memWidths, {
                crop: "c_fill",
                gravity: "g_auto",
                quality: "q_auto",
                fmt: "f_auto",
                dpr: "dpr_auto",
              });
              return (
                <div key={idx} className="px-2 sm:px-3">
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border-2 border-[#C5D7DC] p-0.5 bg-white">
                    <img
                      src={src}
                      srcSet={srcSet}
                      sizes={memSizes}
                      alt={`Memory ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-[200px] sm:h-[280px] md:h-[320px] lg:h-[400px] object-cover rounded-xl"
                    />
                  </div>
                </div>
              );
            })}
          </Slider>
        </section>
      </div>
    </>
  );
}

export default Home;
