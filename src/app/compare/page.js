"use client";

import Chart from "@/components/Charts/LineChart/index";
import axios, { all } from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import React from "react";

export default function Explore() {
  const [username, setUsername] = useState([
    { id: 1, name: "" },
    { id: 2, name: "" },
  ]);
  const [nameArray, setNameArray] = useState([]);
  const [totalUsers, setTotalUsers] = useState(2);
  const [userInfo, setUserInfo] = useState({});
  const [errorInFetch, setErrorInFetch] = useState(true);
  const [firstTime, setFirstTime] = useState(true);
  const [loader, setLoader] = useState(false);
  const [numContests, setNumContests] = useState(5);
  const [rows, setRows] = useState(0);
  const [lastNContests, setLastNContests] = useState([]);
  const [dropdownHidden, setDropdownHidden] = useState(1);
  const [compare, setCompare] = useState("");
  const [finalRatingMap, setFinalRatingMap] = useState([]);
  const [finalPerformanceMap, setFinalPerformanceMap] = useState([]);
  const [finalRankMap, setFinalRankMap] = useState([]);
  const [totalCommon, setTotalCommon] = useState(0);
  const [stats, setStats] = useState([]);

  const submitHandler = async (e) => {
    try {
      setNameArray([]);
      setLoader(true);
      setErrorInFetch(false);
      setFirstTime(false);
      let allUsers = "";
      for (let ind = 0; ind < totalUsers; ind++) {
        allUsers += username[ind].name;
        allUsers += ";";
      }
      const userResponse = await axios.get(
        `https://codeforces.com/api/user.info?handles=${allUsers}`
      );
      const contestResponse = await axios.get(
        `https://codeforces.com/api/contest.list`
      );
      let userContestArray = [];
      for (let ind = 0; ind < totalUsers; ind++) {
        let name = username[ind].name;
        const userListResponse = await axios.get(
          `https://codeforces.com/api/user.rating?handle=${name}`
        );
        const userRatingChangesList = userListResponse.data.result;
        userContestArray.push(userRatingChangesList);
      }
      console.log(userResponse.data);
      console.log(userContestArray);
      // console.log(userContestArray.length);
      // console.log(userContestArray[0].length);
      let contestIdMap = {};
      for (let i = 0; i < userContestArray.length; i++) {
        for (let ind = 0; ind < userContestArray[i].length; ind++) {
          if (userContestArray[i][ind].contestId in contestIdMap) {
            contestIdMap[userContestArray[i][ind].contestId] += 1;
          } else {
            contestIdMap[userContestArray[i][ind].contestId] = 1;
          }
        }
      }

      // Calculate Performance
      const calculatePerfomance = (name, rank) => {
        let averageParticipantsInDiv1PlusDiv2 = 12485,
          averageParticipantsInDiv1 = 845,
          averageParticipantsInDiv2 = 12672,
          averageParticipantsInDiv3 = 18901,
          averageParticipantsInDiv4 = 24264,
          averageParticipantsInOthers = 2165;
        let curr_percentile = 0,
          performance_rating = 0;
        if (name.includes("Div. 1 + Div. 2")) {
          curr_percentile = parseFloat(
            ((1 - rank / averageParticipantsInDiv1PlusDiv2) * 100).toFixed(1)
          );
          performance_rating = parseFloat(
            ((913.3 * curr_percentile) / 100 + 953.3).toFixed(0)
          );
        } else if (name.includes("Div. 1")) {
          curr_percentile = parseFloat(
            ((1 - rank / averageParticipantsInDiv1) * 100).toFixed(1)
          );
          performance_rating = parseFloat(
            ((913.3 * curr_percentile) / 100 + 953.3).toFixed(0)
          );
        } else if (name.includes("Div. 2")) {
          curr_percentile = parseFloat(
            ((1 - rank / averageParticipantsInDiv2) * 100).toFixed(1)
          );
          performance_rating = parseFloat(
            ((913.3 * curr_percentile) / 100 + 953.3).toFixed(0)
          );
        } else if (name.includes("Div. 3")) {
          curr_percentile = parseFloat(
            ((1 - rank / averageParticipantsInDiv3) * 100).toFixed(1)
          );
          performance_rating = parseFloat(
            ((913.3 * curr_percentile) / 100 + 953.3).toFixed(0)
          );
        } else if (name.includes("Div. 4")) {
          curr_percentile = parseFloat(
            ((1 - rank / averageParticipantsInDiv4) * 100).toFixed(1)
          );
          performance_rating = parseFloat(
            ((913.3 * curr_percentile) / 100 + 953.3).toFixed(0)
          );
        } else {
          curr_percentile = parseFloat(
            ((1 - rank / averageParticipantsInOthers) * 100).toFixed(1)
          );
          performance_rating = parseFloat(
            ((913.3 * curr_percentile) / 100 + 953.3).toFixed(0)
          );
        }
        performance_rating -= 100;
        if (performance_rating <= 100) {
          performance_rating = 1200;
        }
        return performance_rating;
      };

      // console.log(contestIdMap);
      let ratingMap = {};
      let performanceMap = {};
      let rankMap = {};
      let bestRank = { name: "Best Rank" };
      let bestPerformance = { name: "Best Performance" };
      let bestRating = { name: "Best Rating" };
      for (let ind = 0; ind < userContestArray.length; ind++) {
        for (let j = 0; j < userContestArray[ind].length; j++) {
          if (contestIdMap[userContestArray[ind][j].contestId] === totalUsers) {
            if (userContestArray[ind][j].handle in ratingMap) {
              ratingMap[userContestArray[ind][j].handle].push(
                userContestArray[ind][j].newRating
              );
              bestRating[userContestArray[ind][j].handle] = Math.max(
                bestRating[userContestArray[ind][j].handle],
                userContestArray[ind][j].newRating
              );
            } else {
              ratingMap[userContestArray[ind][j].handle] = [
                userContestArray[ind][j].oldRating,
                userContestArray[ind][j].newRating,
              ];
              bestRating[userContestArray[ind][j].handle] = Math.max(
                userContestArray[ind][j].oldRating,
                userContestArray[ind][j].newRating
              );
            }
            if (userContestArray[ind][j].handle in performanceMap) {
              let name = userContestArray[ind][j].contestName;
              let rank = userContestArray[ind][j].rank;
              let performance_rating = calculatePerfomance(name, rank);
              performanceMap[userContestArray[ind][j].handle].push(
                performance_rating
              );
              bestPerformance[userContestArray[ind][j].handle] = Math.max(
                bestPerformance[userContestArray[ind][j].handle],
                performance_rating
              );
            } else {
              let name = userContestArray[ind][j].contestName;
              let rank = userContestArray[ind][j].rank;
              let performance_rating = calculatePerfomance(name, rank);
              performanceMap[userContestArray[ind][j].handle] = [
                performance_rating,
              ];
              bestPerformance[userContestArray[ind][j].handle] =
                performance_rating;
            }
            if (userContestArray[ind][j].handle in rankMap) {
              rankMap[userContestArray[ind][j].handle].push(
                userContestArray[ind][j].rank
              );
              bestRank[userContestArray[ind][j].handle] = Math.min(
                bestRank[userContestArray[ind][j].handle],
                userContestArray[ind][j].rank
              );
            } else {
              rankMap[userContestArray[ind][j].handle] = [
                userContestArray[ind][j].rank,
              ];
              bestRank[userContestArray[ind][j].handle] =
                userContestArray[ind][j].rank;
            }
            // console.log(userContestArray[ind][j]);
          }
        }
      }

      setStats([bestRank, bestPerformance, bestRating]);
      setNameArray((prev) => [...prev, "Category"]);
      for (let ind in username) {
        setNameArray((prev) => [...prev, username[ind].name]);
      }
      for (let key in ratingMap) {
        setTotalCommon(ratingMap[key].length);
      }
      console.log(totalCommon);
      // console.log(nameArray);
      // console.log(ratingMap);
      // console.log(ratingArray);
      setFinalRatingMap(ratingMap);
      setFinalPerformanceMap(performanceMap);
      setFinalRankMap(rankMap);
      console.log(ratingMap);
      // setUsername((prev) =>
      //   prev.map((element) =>
      //     element.name !== "" ? { ...element, name: "" } : element
      //   )
      // );
      // setNameArray([]);
    } catch (e) {
      setErrorInFetch(true);
      console.error("Could not fetch account info", e);
    } finally {
      setNumContests(5);
      setLoader(false);
    }
  };

  const addUser = () => {
    if (totalUsers < 3) {
      setUsername((prev) => [...prev, { id: totalUsers + 1, name: "" }]);
      setTotalUsers((prev) => prev + 1);
    }
  };
  useEffect(() => {});

  return (
    <div className="flex flex-col justify-start p-4 pt-10 m-auto items-center">
      <div className="flex flex-col items-center w-[50%] mx-auto justify-between text-xl border-2 border-slate-900 p-7 rounded-xl">
        <h1 className="sm:text-3xl text-xl text-center border-2 border-slate-950 text-white rounded-lg bg-slate-950 px-5 py-2 mb-4">
          Add a user
        </h1>
        <div className="flex justify-center items-center mb-5 m-auto">
          <div className="flex flex-col ">
            {username.map((user) => (
              <div
                className="m-2 mb-5 flex flex-col sm:flex-row sm:justify-between sm:items-center"
                key={user.id}
              >
                <div className="sm:w-[30%] w-[80%]">Username {user.id}</div>
                <input
                  type="text"
                  placeholder="codeforces handle"
                  className="sm:w-[55%] w-[80%] h-10 px-4 outline-none border-2 border-slate-900 rounded-xl mr-5 text-lg"
                  value={user.name}
                  onChange={(e) => {
                    setUsername((prev) =>
                      prev.map((item) =>
                        item.id === user.id
                          ? { ...item, name: e.target.value }
                          : item
                      )
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          className="sm:h-5 h-10 m-4 p-3 pb-4 text-center box-content outline-none border-2 border-slate-900 rounded-xl text-lg bg-slate-950 text-white"
          onClick={addUser}
        >
          Add User
        </button>

        <button
          className="h-10 ml-5 px-5 py-2 box-content outline-none border-2 border-slate-900 rounded-xl mr-5 sm:text-3xl text-xl bg-slate-950 text-white"
          onClick={submitHandler}
        >
          Analyze
        </button>
      </div>
      {loader ? (
        <button
          disabled
          type="button"
          className="text-white bg-slate-900 hover:bg-slate-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-slate-900 dark:hover:bg-slate-900 inline-flex items-center w-[150px] m-10 justify-center"
        >
          <svg
            aria-hidden="true"
            role="status"
            className="inline w-4 h-4 me-3 text-white animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
          Fetching...
        </button>
      ) : null}

      {errorInFetch ? (
        <div
          className={`flex flex-col my-10 justify-center md:flex-row text-3xl ${
            loader == true ? "invisible" : "visible"
          }`}
        >
          {firstTime
            ? `Enter a codeforces username`
            : `Please enter a valid username`}
        </div>
      ) : (
        <div
          className={`${
            loader == true ? "invisible" : "visible"
          } flex flex-col items-center`}
        >
          <div className="text-2xl w-[50%] m-10">
            Here we compare the contests common to all the users and show the
            corresponding Rating, Rank and Performance Graph
          </div>
          <div className="flex items-center flex-col justify-between m-10 w-full">
            <div className="w-[80%] h-[500px] my-10 flex flex-col items-center">
              <div className="text-2xl">Rating Graph</div>
              <div className="w-full h-full flex items-center justify-center">
                <Chart common={totalCommon} dataset={finalRatingMap} />
              </div>
            </div>
            <div className="w-full h-[400px] my-10 flex flex-col items-center">
              <div className="text-2xl">Rank Graph</div>
              <div className="w-[80%] h-[500px] flex items-center justify-center">
                <Chart common={totalCommon} dataset={finalRankMap} />
              </div>
            </div>
            <div className="w-full h-[400px] my-10 flex flex-col items-center">
              <div className="text-2xl">Performance Graph</div>
              <div className="w-[80%] h-[500px] flex items-center justify-center">
                <Chart common={totalCommon} dataset={finalPerformanceMap} />
              </div>
            </div>
          </div>
          <div
            className={`grid grid-rows-4 grid-flow-row m-auto text-center w-[80%]`}
          >
            <div className="flex flex-row">
              {nameArray.map((name, index) => (
                <div
                  key={index}
                  className={`border-2 border-slate-900 bg-slate-900 text-white text-center p-5 ${
                    nameArray.length === 2 ? "w-[33%]" : "w-[25%]"
                  }`}
                >
                  {name}
                </div>
              ))}
            </div>
            {stats.map((element) => (
              <div className="flex flex-row" key={element.name}>
                {Object.entries(element).map(([key, value]) => (
                  <div
                    className={`border-2 border-slate-900 text-center p-5 ${
                      nameArray.length === 2 ? "w-[33%]" : "w-[25%]"
                    }`}
                    key={key}
                  >
                    {value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
