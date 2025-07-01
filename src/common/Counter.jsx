import React from "react";
import CountUp from "react-countup";

export default function Counter({ number, title }) {
  return (
    <span className="number">
      <CountUp duration={1} className="counter" end={number} />
      <span>{title}</span>
    </span>
  );
}
