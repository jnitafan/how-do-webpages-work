"use client";

import styles from "./page.module.scss";
import Link from "next/link";

const NUM_STARS = 500;
const CONNECT_THRESHOLD = 16; // Distance threshold for connecting stars
const RESET_DISTANCE = 30; // Distance at which stars reset
const SPEED = 0.08;

export default function Home() {
  return (
    <>
      <Link href="/1"> Banana </Link>;
    </>
  );
}
