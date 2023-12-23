"use client";

import Chart from "@/components/Charts/LineChart/index";
import axios from "axios";
import {
  Averia_Gruesa_Libre,
  Electrolize,
  Petit_Formal_Script,
} from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Explore() {
  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [errorInFetch, setErrorInFetch] = useState(true);
  const [firstTime, setFirstTime] = useState(true);
  const [loader, setLoader] = useState(false);
  const [numContests, setNumContests] = useState(5);
  const [rows, setRows] = useState(0);
  const [lastNContests, setLastNContests] = useState([]);
  const [ratingList, setRatingList] = useState([]);
  const [contestList, setContestList] = useState([]);
  const [performanceRating, setPerformanceRating] = useState([]);
  const [bestRank, setBestRank] = useState(0);
  const [highestRating, setHighestRating] = useState(0);
  const [bestPerformance, setBestPerformance] = useState(0);
  const [maxRatingIncrease, setMaxRatingIncrease] = useState(0);
  const [totalRatingChange, setTotalRatingChange] = useState(0);
  const [lowestRating, setLowestRating] = useState(0);
  const [finalRatingMap, setFinalRatingMap] = useState({});
  const [finalPerformanceMap, setFinalPerformanceMap] = useState({});

  const submitHandler = async (e) => {
    try {
      setLoader(true);
      setErrorInFetch(false);
      setFirstTime(false);
      const userResponse = await axios.get(
        ` https://codeforces.com/api/user.info?handles=${username}`
      );
      const contestResponse = await axios.get(
        `https://codeforces.com/api/contest.list`
      );
      const userListResponse = await axios.get(
        `https://codeforces.com/api/user.rating?handle=${username}`
      );
      const userRatingChangesList = userListResponse.data.result;
      const fullList = contestResponse.data.result;
      const result = userResponse.data.result[0];
      let finalList = [];
      let ratingChangesList = [];
      let finalContestList = [];
      // console.log(finalList);
      let count = 0;
      for (
        let ind = userRatingChangesList.length - 1;
        ind >= 0 && count < numContests;
        ind--
      ) {
        finalList.push(userRatingChangesList[ind]);
        ratingChangesList.push(userRatingChangesList[ind].newRating);
        finalContestList.push(userRatingChangesList[ind].contestName);
        count++;
      }
      setLastNContests(finalList);
      setRatingList(ratingChangesList);
      setContestList(finalContestList);

      let performance_array = [];
      // let div1plusdiv2 = 0,
      //   div1plusdiv2_num = 0;
      // let div1 = 0,
      //   div1_num = 0;
      // let div2 = 0,
      //   div2_num = 0;
      // let div3 = 0,
      //   div3_num = 0;
      // let div4 = 0,
      //   div4_num = 0;
      // let other = 0,
      //   other_num = 0;

      // let new_array = fullList.slice(0, 75);
      // for (let element of new_array) {
      //   try {
      //     let contestStandings = await axios.get(
      //       `https://codeforces.com/api/contest.standings?contestId=${element.id}&from=1&count=30000&showUnofficial=false`
      //     );
      //     let totalParticipants = contestStandings.data.result.rows.length;
      //     let name = contestStandings.data.result.contest.name;
      //     if (name.includes("Div. 1 + Div. 2")) {
      //       div1plusdiv2 += totalParticipants;
      //       div1plusdiv2_num++;
      //     } else if (name.includes("Div. 2")) {
      //       div2 += totalParticipants;
      //       div2_num++;
      //     } else if (name.includes("Div. 1")) {
      //       div1 += totalParticipants;
      //       div1_num++;
      //     } else if (name.includes("Div. 4")) {
      //       div4 += totalParticipants;
      //       div4_num++;
      //     } else if (name.includes("Div. 3")) {
      //       div3 += totalParticipants;
      //       div3_num++;
      //     } else {
      //       other += totalParticipants;
      //       other_num++;
      //     }
      //     console.log(name, totalParticipants);
      //   } catch (error) {
      //     console.log("Could not fetch contest id: ", element.id);
      //   }
      // }

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
      for (let ind in finalList) {
        let name = finalList[ind].contestName;
        let rank = finalList[ind].rank;
        let performance_rating = calculatePerfomance(name, rank);
        performance_array.push(performance_rating);
        finalList[ind] = {
          ...finalList[ind],
          performance_rating,
        };
      }

      // Rating Map

      let ratingMap = {};
      let performanceMap = {};
      ratingMap[finalList[0].handle] = [finalList[0].oldRating];
      performanceMap[finalList[0].handle] = [];

      for (let element of finalList) {
        ratingMap[element.handle].push(element.newRating);
      }
      // console.log(ratingMap);
      for (let element of performance_array) {
        performanceMap[finalList[0].handle].push(element);
      }
      setFinalRatingMap(ratingMap);
      setFinalPerformanceMap(performanceMap);
      // averageParticipantsInDiv2 = isNaN(Math.round(div2 / div2_num))
      //   ? 0
      //   : Math.round(div2 / div2_num);
      // averageParticipantsInDiv1 = isNaN(Math.round(div1 / div1_num))
      //   ? 0
      //   : Math.round(div1 / div1_num);
      // averageParticipantsInDiv3 = isNaN(Math.round(div3 / div3_num))
      //   ? 0
      //   : Math.round(div3 / div3_num);
      // averageParticipantsInDiv4 = isNaN(Math.round(div4 / div4_num))
      //   ? 0
      //   : Math.round(div4 / div4_num);
      // averageParticipantsInDiv1PlusDiv2 = isNaN(
      //   Math.round(div1plusdiv2 / div1plusdiv2_num)
      // )
      //   ? 0
      //   : Math.round(div1plusdiv2 / div1plusdiv2_num);
      // averageParticipantsInOthers = isNaN(Math.round(other / other_num))
      //   ? 0
      //   : Math.round(other / other_num);
      // console.log("Div 1 + Div 2 ", averageParticipantsInDiv1PlusDiv2);
      // console.log("Div 1 ", averageParticipantsInDiv1);
      // console.log("Div 2 ", averageParticipantsInDiv2);
      // console.log("Div 3 ", averageParticipantsInDiv3);
      // console.log("Div 4 ", averageParticipantsInDiv4);
      // console.log("Others ", averageParticipantsInOthers);

      console.log(finalList);
      setLastNContests(finalList);
      setPerformanceRating(performance_array);
      let rank = 50000,
        rating = finalList[0].oldRating,
        lowest = finalList[0].oldRating,
        performance = 0,
        ratingIncrease = Number.MIN_VALUE,
        totalDiff = 0;
      for (let element of finalList) {
        rank = Math.min(rank, element.rank);
        rating = Math.max(rating, element.newRating);
        performance = Math.max(performance, element.performance_rating);
        ratingIncrease = Math.max(
          ratingIncrease,
          element.newRating - element.oldRating
        );
        totalDiff += element.newRating - element.oldRating;
        lowest = Math.min(lowest, element.newRating);
      }
      setBestRank(rank);
      setHighestRating(rating);
      setBestPerformance(performance);
      setMaxRatingIncrease(ratingIncrease);
      setTotalRatingChange(totalDiff);
      setLowestRating(lowest);

      // console.log(lastNContests);
      // console.log(ratingList);
      // console.log(performanceRating);
      setRows(parseInt(numContests) + 1);
      setUserInfo(result);
    } catch (e) {
      setErrorInFetch(true);
      console.error("Could not fetch account info", e);
    } finally {
      setNumContests(5);
      setLoader(false);
    }
  };

  return (
    <div className="flex flex-col justify-start p-10">
      <div className="flex flex-col items-center w-[50%] mx-auto justify-between text-xl border-2 border-slate-900 p-7 rounded-xl">
        <h1 className="text-3xl text-center border-2 border-slate-950 text-white rounded-lg bg-slate-950 px-5 py-2 mb-4">
          Add a user
        </h1>
        <div className="flex justify-center items-center m-4 mb-5">
          <div className="w-[150px]">Username</div>
          <input
            type="text"
            placeholder="codeforces handle"
            className="h-10 px-4 outline-none border-2 border-slate-900 rounded-xl mr-5 text-lg"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className="flex justify-center items-center m-4 mb-5">
          <div className="w-[150px]">Number of contests</div>
          <input
            type="number"
            placeholder="Last N contests"
            className="h-10 px-4 outline-none border-2 border-slate-900 rounded-xl mr-5 text-lg"
            value={numContests}
            min="0"
            onChange={(e) => {
              // if (isNaN(e.target.value) || e.target.value <= 0) {
              //   e.target.value = 0;
              // }
              setNumContests(e.target.value);
            }}
          />
        </div>
        <button
          className="h-10 px-5 py-2 box-content outline-none border-2 border-slate-900 rounded-xl mr-5 text-2xl bg-slate-950 text-white"
          onClick={submitHandler}
        >
          Analyze
        </button>
      </div>
      {loader ? (
        <button
          disabled
          type="button"
          className="text-white bg-slate-900 hover:bg-slate-900 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-slate-900 dark:hover:bg-slate-900 inline-flex items-center w-[10%] ml-[45%] mt-10"
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
          <div
            className={`flex flex-col my-10 justify-center items-center md:flex-row border-2 border-slate-900 mx-[23%] rounded-xl px-10 min-h-[400px] `}
          >
            <div className="flex justify-center mr-4 h-[300px] w-[50%]">
              <img src={userInfo.titlePhoto} />
            </div>
            <ul className="flex flex-col w-[50%]">
              <li className="m-2">Handle : {userInfo.handle || username}</li>
              <li className="m-2">Friends : {userInfo.friendOfCount || 0}</li>
              <li className="m-2">
                Max Rank : {userInfo.maxRank || "No contests"}
              </li>
              <li className="m-2">Max Rating : {userInfo.maxRating || 0}</li>
              <li className="m-2">
                Current Rank : {userInfo.rank || "No contests"}
              </li>
              <li className="m-2">Current Rating : {userInfo.rating || 0}</li>
              <li className="m-2">
                Contribution : {userInfo.contribution || 0}
              </li>
              <li className="m-2">
                Organization : {userInfo.organization || "Not mentioned"}
              </li>
            </ul>
          </div>
          <div className="flex flex-row justify-between w-full">
            <div className="w-[50%] h-[300px] flex justify-center flex-col items-center m-10">
              <h1>Rating Changes Graph</h1>
              <Chart dataset={finalRatingMap} common={lastNContests.length} />
            </div>
            <div className="w-[50%] h-[300px] flex justify-center flex-col items-center m-10">
              <h1>Performance Graph</h1>
              <Chart
                dataset={finalPerformanceMap}
                common={lastNContests.length}
              />
            </div>
          </div>
          <div className="flex flex-wrap w-full h-[200px] justify-around m-10">
            <div className="border-2 border-slate-900 w-[30%] h-[50px] rounded-xl flex justify-center items-center m-4 bg-slate-900 text-white">
              Best Rank - {bestRank}
            </div>
            <div className="border-2 border-slate-900 w-[30%] h-[50px] rounded-xl flex justify-center items-center m-4 bg-slate-900 text-white">
              Best Rating - {highestRating}
            </div>
            <div className="border-2 border-slate-900 w-[30%] h-[50px] rounded-xl flex justify-center items-center m-4 bg-slate-900 text-white">
              Best Performance - {bestPerformance}
            </div>
            <div className="border-2 border-slate-900 w-[30%] h-[50px] rounded-xl flex justify-center items-center m-4 bg-slate-900 text-white">
              Maximum Rating Increase - {maxRatingIncrease}
            </div>
            <div className="border-2 border-slate-900 w-[30%] h-[50px] rounded-xl flex justify-center items-center m-4 bg-slate-900 text-white">
              Lowest Rating - {lowestRating}
            </div>
            <div className="border-2 border-slate-900 w-[30%] h-[50px] rounded-xl flex justify-center items-center m-4 bg-slate-900 text-white">
              Total Rating Change - {Math.abs(totalRatingChange)}
              {totalRatingChange >= 0 ? (
                <svg
                  className="h-8 w-8 text-green-500 mr-2"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {" "}
                  <path stroke="none" d="M0 0h24v24H0z" />{" "}
                  <path d="M18 15l-6-6l-6 6h12" />
                </svg>
              ) : (
                <svg
                  className="h-8 w-8 text-red-500"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {" "}
                  <path stroke="none" d="M0 0h24v24H0z" />{" "}
                  <path d="M18 15l-6-6l-6 6h12" transform="rotate(180 12 12)" />
                </svg>
              )}
            </div>
          </div>
          <div className={`flex flex-col border-2 border-slate-800 w-full`}>
            <div className="grid grid-cols-6 w-full text-center text-xl">
              <div className="border-2 border-slate-900 p-3 bg-slate-900 text-white">
                Contest Name
              </div>
              <div className="border-2 border-slate-900 p-3 bg-slate-900 text-white">
                Rank
              </div>
              <div className="border-2 border-slate-900 p-3 bg-slate-900 text-white">
                Old Rating
              </div>
              <div className="border-2 border-slate-900 p-3 bg-slate-900 text-white">
                New Rating
              </div>
              <div className="border-2 border-slate-900 p-3 bg-slate-900 text-white">
                Rating Change
              </div>
              <div className="border-2 border-slate-900 p-3 bg-slate-900 text-white">
                Performance
              </div>
            </div>
            {lastNContests.map((contestItem) => (
              <div
                className="flex flex-row w-full text-center"
                key={contestItem.contestId}
              >
                <div className="border-2 border-slate-900 p-2 flex items-center justify-center w-[16.667%] h-[125px]">
                  {contestItem.contestName}
                </div>
                <div className="border-2 border-slate-900 p-2 flex items-center justify-center w-[16.667%] h-[125px]">
                  {contestItem.rank}
                </div>
                <div className="border-2 border-slate-900 p-2 flex items-center justify-center w-[16.667%] h-[125px]">
                  {contestItem.oldRating}
                </div>
                <div className="border-2 border-slate-900 p-2 flex items-center justify-center w-[16.667%] h-[125px]">
                  {contestItem.newRating}
                </div>
                <div className="border-2 border-slate-900 p-2 flex items-center justify-center w-[16.667%] h-[125px]">
                  {contestItem.newRating - contestItem.oldRating >= 0 ? (
                    <svg
                      className="h-8 w-8 text-green-500 mr-2"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {" "}
                      <path stroke="none" d="M0 0h24v24H0z" />{" "}
                      <path d="M18 15l-6-6l-6 6h12" />
                    </svg>
                  ) : (
                    <svg
                      className="h-8 w-8 text-red-500"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {" "}
                      <path stroke="none" d="M0 0h24v24H0z" />{" "}
                      <path
                        d="M18 15l-6-6l-6 6h12"
                        transform="rotate(180 12 12)"
                      />
                    </svg>
                  )}

                  {contestItem.newRating - contestItem.oldRating}
                </div>
                <div className="border-2 border-slate-900 p-2 flex items-center justify-center w-[16.667%] h-[125px]">
                  {contestItem.performance_rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
