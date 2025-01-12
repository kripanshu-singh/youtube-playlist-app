"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  videoId: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  const formatDescription = (description: string) => {
    // Regular expression to match URLs (both HTTP and HTTPS)
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split the description by lines and then map over each line
    return description.split("\n").map((line, lineIndex) => (
      <p key={lineIndex}>
        {line.split(" ").map((word, wordIndex) => {
          // Check if the word is a URL
          const isUrl = urlRegex.test(word);

          return (
            <motion.span
              key={wordIndex}
              initial={{
                filter: "blur(10px)",
                opacity: 0,
                y: 5,
              }}
              animate={{
                filter: "blur(0px)",
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
                delay: 0.02 * wordIndex,
              }}
              className="inline-block"
            >
              {isUrl ? (
                <a
                  href={word}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {word}
                </a>
              ) : (
                word
              )}
              &nbsp; {/* Add space between words */}
            </motion.span>
          );
        })}
      </p>
    ));
  };

  return (
    <div className="flex flex-col content-center container items-center flex-wrap justify-center w-screen antialiased font-sans">
      <div className="relative grid grid-cols-1 md:grid-cols-2 ">
        <div>
          <div className="relative" style={{}}>
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 999
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <Image
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={540}
                    height={380}
                    draggable={false}
                    className="rounded-3xl object-cover object-center"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex justify-between flex-col gap-6">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <a
              href={`https://www.youtube.com/watch?v=${testimonials[active].videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 mt-2 inline-block"
            >
              <h3 className="text-2xl font-bold  text-blue-700 w-full">
                {testimonials[active].name}
              </h3>
            </a>
            <div className="text-sm text-gray-500 ">
              {testimonials[active].designation}
            </div>
            <motion.p className="text-lg text-gray-500 mt-8 ">
              <div className="group relative">
                <div className="font-normal text-sm text-gray-900 relative z-10 my-4 px-2 py-1 border-l-4 border-blue-500 opacity-90 overflow-auto max-h-48 w-full text-ellipsis whitespace-pre-line group-hover:whitespace-normal">
                  <div>{formatDescription(testimonials[active].quote)}</div>
                </div>
              </div>
            </motion.p>
          </motion.div>
        </div>
      </div>
      <div className=" flex gap-4 md:pt-0">
        <button
          onClick={handlePrev}
          className="h-7 w-7 rounded-full bg-gray-100  flex items-center justify-center group/button"
        >
          <IconArrowLeft className="h-5 w-5 text-black  group-hover/button:rotate-12 transition-transform duration-300" />
        </button>
        <button
          onClick={handleNext}
          className="h-7 w-7 rounded-full bg-gray-100  flex items-center justify-center group/button"
        >
          <IconArrowRight className="h-5 w-5 text-black  group-hover/button:-rotate-12 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};
