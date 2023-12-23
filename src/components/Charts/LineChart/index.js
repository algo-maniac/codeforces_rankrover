"use client";

import { useState, useEffect } from "react";

import PieChart from "../PieChart/PieChart";
import LineChart from "./LineChart";
import BarChart from "../BarChart/BarChart";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { user } from "@nextui-org/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Chart({ dataset, common }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  };
  const [lineChart, setLineChart] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    console.log(dataset);
    const randomColourGenerator = () => {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      const colorString = "#" + randomColor;
      return colorString;
    };
    const colorArray = ["red", "blue", "green", "yellow"];
    const datasets = Object.keys(dataset).map((user, index) => ({
      label: user,
      data: dataset[user],
      borderColor: colorArray[index],
      backgroundColor: colorArray[index],
      fill: true,
    }));
    let ratingArray = setLineChart({
      labels: Array.from({ length: common }, (_, index) => index + 1),
      datasets: datasets,
    });
  }, [dataset]);
  return <LineChart chartData={lineChart} options={options} />;
}
