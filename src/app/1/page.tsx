"use client";

import { useRef } from "react";

const Page1: React.FC = () => {
  const animatedRef = useRef(null!);
  return (
    <>
      <p>Banana 1</p>
      <div ref={animatedRef}> div I would like to animate. </div>
    </>
  );
};

export default Page1;
