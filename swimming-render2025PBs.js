import { get2025Results } from "./swimming-2025-pbs.js";

function renderPBCell(achieved) {
  if (achieved.length === 0) {
    return `<td class='center not-applicable-cell'>n/a</td>`;
  } else {
    return `<td class='center'>${achieved}</td>`;
  }
  // }
}

/**
 * Renders a table of personal bests for a given set of times achieved
 * Updates the inner HTML of the element with ID "county-targets-table".
 *
 * @param {string[]} timesAchieved - The times achieved as a string array
 */
function renderPersonalBests(timesAchieved) {
  document.getElementById("2025-personal-bests-table").innerHTML = "";
  const recordedTypes = ["Backstroke", "Breaststroke", "Butterfly", "Freestyle", "Individual Medley"];
  for (const type of recordedTypes) {
    let rowHtml = "<tr>";
    rowHtml += "<td>" + type + "</td>";
    const time50 = timesAchieved.find((t) => t[5] === `50 ${type}`) ? timesAchieved.find((t) => t[5] === `50 ${type}`)[7] : "";
    const time100 = timesAchieved.find((t) => t[5] === `100 ${type}`) ? timesAchieved.find((t) => t[5] === `100 ${type}`)[7] : "";
    const time200 = timesAchieved.find((t) => t[5] === `200 ${type}`) ? timesAchieved.find((t) => t[5] === `200 ${type}`)[7] : "";
    const time400 = timesAchieved.find((t) => t[5] === `400 ${type}`) ? timesAchieved.find((t) => t[5] === `400 ${type}`)[7] : "";
    rowHtml += renderPBCell(time50);
    rowHtml += renderPBCell(time100);
    rowHtml += renderPBCell(time200);
    rowHtml += renderPBCell(time400);
    rowHtml += "</tr>";
    document.getElementById("2025-personal-bests-table").innerHTML += rowHtml;
  }
}

const swimmerNumber = localStorage.getItem("child1-swimmer-number");

const pbs = get2025Results();

const timesAchieved = pbs.filter((s) => s[0] === swimmerNumber);

renderPersonalBests(timesAchieved);
