import { getData } from "./swimming-county-times.js";
import { getRegionalTimes } from "./swimming-regional-times.js";
import { getResults } from "./swimming-results-2026.js";
import { get2025Results } from "./swimming-2025-pbs.js";

const countyTimesData = getData();
const regionalTimesData = getRegionalTimes();
const results = getResults();

const swimmersSeedMap = new Map([
  ["1732229|Noah Race|14|Open/Male", ["1732229", "Noah Race", "14", "Open/Male"]],
  ["1468588|Leah Rhodes|13|Female", ["1468588", "Leah Rhodes", "13", "Female"]],
  ["1518045|Frankie Anderson|15|Female", ["1518045", "Frankie Anderson", "15", "Female"]],
  ["1503220|Ewan Wilcox|11|Open/Male", ["1503220", "Ewan Wilcox", "11", "Open/Male"]],
  ["1662020|Nathanel Ilie|11|Open/Male", ["1662020", "Nathanel Ilie", "11", "Open/Male"]],
  ["1680628|Toby Thomas|11|Open/Male", ["1680628", "Toby Thomas", "11", "Open/Male"]],
  ["1707520|Yannick Crowther|12|Open/Male", ["1707520", "Yannick Crowther", "12", "Open/Male"]],
  ["1796777|Remus Chinery|12|Open/Male", ["1796777", "Remus Chinery", "12", "Open/Male"]],
  ["1647375|Hannah Smith|10|Female", ["1647375", "Hannah Smith", "10", "Female"]],
  ["1761783|Mya Smith|13|Female", ["1761783", "Mya Smith", "13", "Female"]],
  ["1680629|Harriet Thomas|13|Female", ["1680629", "Harriet Thomas", "13", "Female"]],
  ["1742684|Ivy-Rose Clark|13|Female", ["1742684", "Ivy-Rose Clark", "13", "Female"]],
  ["1737305|Phoebe Gallagher|15|Female", ["1737305", "Phoebe Gallagher", "15", "Female"]],
  ["1576896|Emma Lindsey|15|Female", ["1576896", "Emma Lindsey", "15", "Female"]],
  ["1732278|Bernardo Silva|12|Open/Male", ["1732278", "Bernardo Silva", "12", "Open/Male"]],
  ["1613655|Paige Westlake|15|Female", ["1613655", "Paige Westlake", "15", "Female"]],
  ["1786909|Sofia Briscan|12|Female", ["1786909", "Sofia Briscan", "12", "Female"]],
  ["1786899|Violet Gallagher|14|Female", ["1786899", "Violet Gallagher", "14", "Female"]],
  ["1807307|Maria Briscan|14|Female", ["1807307", "Maria Briscan", "14", "Female"]],
  ["1766536|Erica Barabas|13|Female", ["1766536", "Erica Barabas", "13", "Female"]],
  ["1803614|Fareed Omotosho|11|Open/Male", ["1803614", "Fareed Omotosho", "11", "Open/Male"]],
  ["1589228|Brandon Newton|9|Open/Male", ["1589228", "Brandon Newton", "9", "Open/Male"]],
  ["1813869|Aliona Rebello|12|Female", ["1813869", "Aliona Rebello", "12", "Female"]],
  ["1281250|Owen Young|7|Open/Male", ["1281250", "Owen Young", "7", "Open/Male"]],
  ["1625109|Eva Wilcox|14|Female", ["1625109", "Eva Wilcox", "14", "Female"]],
  ["1822118|Samad Omotosho|15|Open/Male", ["1822118", "Samad Omotosho", "15", "Open/Male"]],
  ["1822121|Ella Thorndyke|14|Female", ["1822121", "Ella Thorndyke", "14", "Female"]],
  ["1813873|Jessica Smith|15|Female", ["1813873", "Jessica Smith", "15", "Female"]],
  ["1816617|Emmy Morley|15|Female", ["1816617", "Emmy Morley", "15", "Female"]],
  ["1836038|George Tymoshenko|14|Open/Male", ["1836038", "George Tymoshenko", "14", "Open/Male"]],
]);

const uniqueSwimmersMap = new Map(results.events.flatMap((event) => event.results.map((result) => [result.slice(0, 4).join("|"), result])));

const mergedSwimmersMap = new Map([...swimmersSeedMap, ...uniqueSwimmersMap]);

const uniqueSwimmers = [...mergedSwimmersMap.values()]
  .map(([id, name, yearOfBirth, category]) => ({
    ID: id,
    name,
    yearOfBirth,
    category,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

function saveData() {
  const age = document.getElementById("age").value;
  const name = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const swimmerNumber = document.getElementById("swimmerNumber").value;
  localStorage.setItem("child1-age", age);
  localStorage.setItem("child1-name", name);
  localStorage.setItem("child1-category", category);
  localStorage.setItem("child1-swimmer-number", swimmerNumber);
  loadData();
}

export function changeSwimmer() {
  const swimmerId = $("#recordedSwimmers").val();
  const thisSwimmer = uniqueSwimmers.find((s) => s.ID === swimmerId);
  const category = thisSwimmer.category === "Female" ? "Female" : "Male";
  const today = new Date();
  const childAge = today.getFullYear() - 1999 - thisSwimmer.yearOfBirth;
  writeSwimmerToLocalStorage(childAge, thisSwimmer.name, category, thisSwimmer.ID);
  showSwimmerDetailsInBoxes();

  loadData();
}

function writeSwimmerToLocalStorage(age, name, category, id) {
  localStorage.setItem("child1-age", age);
  localStorage.setItem("child1-name", name);
  localStorage.setItem("child1-category", category);
  localStorage.setItem("child1-swimmer-number", id);
}

function showSwimmerDetailsInBoxes(age, name, category, id) {
  // document.getElementById("age").value = age;
  // document.getElementById("name").value = name;
  // document.getElementById("swimmerNumber").value = id;
  // document.getElementById("category").value = category;

  $("#swimmerOutput").empty();
  $("#swimmerOutput").append(`<p class="margin-bottom--none">${name} (${id}) is swimming as a ${age} year old in the next counties.</p>`);
}

export function lookupSwimmer() {
  const swimmerNumber = document.getElementById("swimmerNumber").value;

  if (swimmerNumber.length >= 7) {
    localStorage.setItem("child1-swimmer-number", swimmerNumber);
    const allResults = getResults();
    const swimmersEvents = allResults.events.filter((event) => event.results.some((result) => result[0] === swimmerNumber));
    if (swimmersEvents.length > 0) {
      const swimmerEntry = swimmersEvents[0].results.find((result) => result[0] === swimmerNumber);
      localStorage.setItem("child1-name", swimmerEntry[1]);
      document.getElementById("name").value = swimmerEntry[1];
      const today = new Date();
      const age = today.getFullYear() - 1999 - swimmerEntry[2];
      localStorage.setItem("child1-age", age);
      $("#age").val(age);
      const category = swimmerEntry[3] === "Female" ? "Female" : "Male";
      localStorage.setItem("child1-category", category);
      document.getElementById("category").value = category;
      loadData();
    }
  }
}

export function loadData() {
  $("#recordedSwimmers").empty();
  $.each(uniqueSwimmers, function (i, swimmer) {
    $("#recordedSwimmers").append(
      $("<option>", {
        value: swimmer.ID,
        text: swimmer.name,
      }),
    );
  });

  const swimmerNumber = localStorage.getItem("child1-swimmer-number");
  $("#recordedSwimmers").val(swimmerNumber);

  document.getElementById("times-table").innerHTML = "";
  $("#recorded-times-cards").empty();
  $("#recorded-l4-times-cards").empty();
  document.getElementById("events-entered-cards").innerHTML = "";

  const swimmersEvents = results.events.filter((event) => event.results.some((result) => result[0] === swimmerNumber));

  const age = localStorage.getItem("child1-age");
  const name = localStorage.getItem("child1-name");
  const category = localStorage.getItem("child1-category");

  if (!age?.length > 0 || !name?.length > 0 || !category?.length) {
    document.getElementById("output").innerHTML = "Select a name, age and category to continue";
    document.getElementById("enter-times-row").style.display = "none";
    return;
  }

  for (const swimmersEvent of swimmersEvents) {
    document.getElementById("events-entered-cards").innerHTML += `<div class="event-card">${swimmersEvent.eventName} - ${swimmersEvent.date}</div>`;
  }

  let matchingResults = swimmersEvents.flatMap((event) => event.results.filter((result) => result[0] === swimmerNumber));

  // Adding the same value to each object using map
  matchingResults = matchingResults.map((result) => {
    // Adding a new field 'location' with the same value
    result.location = results.eventName;
    result.date = results.date;
    return result;
  });

  let swimmerMapL3Plus = {};

  for (const event of results.events.filter((e) => e.level < 4)) {
    const swimmersResults = event.results.filter((result) => result[0] === swimmerNumber);
    for (const result of swimmersResults) {
      const distanceNum = result[5].split(" ")[0];
      const distance = result[5].split(" ")[0] + "m";
      const style = result[5].split(distanceNum + " ")[1];
      if (!swimmerMapL3Plus[distance]) {
        swimmerMapL3Plus[distance] = {};
      }

      if (!swimmerMapL3Plus[distance][style]) {
        swimmerMapL3Plus[distance][style] = {};
      }

      if (!swimmerMapL3Plus[distance][style].time || getTimeAsSeconds(result[7]) < getTimeAsSeconds(swimmerMapL3Plus[distance][style].time)) {
        swimmerMapL3Plus[distance][style].time = result[7];
        swimmerMapL3Plus[distance][style].eventName = event.eventName;
        swimmerMapL3Plus[distance][style].date = event.date;
        swimmerMapL3Plus[distance][style].points = result[8];
      }
    }
  }

  let swimmerMapL4 = {};

  for (const event of results.events.filter((e) => e.level === "4")) {
    const swimmersResults = event.results.filter((result) => result[0] === swimmerNumber);
    for (const result of swimmersResults) {
      const distanceNum = result[5].split(" ")[0];
      const distance = result[5].split(" ")[0] + "m";
      const style = result[5].split(distanceNum + " ")[1];
      if (!swimmerMapL4[distance]) {
        swimmerMapL4[distance] = {};
      }

      if (!swimmerMapL4[distance][style]) {
        swimmerMapL4[distance][style] = {};
      }

      if (!swimmerMapL4[distance][style].time || getTimeAsSeconds(result[7]) < getTimeAsSeconds(swimmerMapL4[distance][style].time)) {
        swimmerMapL4[distance][style].time = result[7];
        swimmerMapL4[distance][style].eventName = event.eventName;
        swimmerMapL4[distance][style].date = event.date;
      }
    }
  }

  document.getElementById("output").innerHTML = "";
  document.getElementById("enter-times-row").style.display = "block";
  showSwimmerDetailsInBoxes(age, name, category, swimmerNumber);

  const distances = ["50m", "100m", "200m", "400m"];
  const personalTypes = ["Back", "Breast", "Butterfly", "Free", "IM"];
  const recordedTypes = ["Backstroke", "Breaststroke", "Butterfly", "Freestyle", "Individual Medley"];

  const personalToCountyTypeMap = {
    Back: "Backstroke",
    Breast: "Breaststroke",
    Butterfly: "Butterfly",
    Free: "Freestyle",
    IM: "Individual Medley",
  };

  let allDataMap = {
    "50m": {
      Backstroke: { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
      Breaststroke: { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
      Butterfly: { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
      Freestyle: { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
      "Individual Medley": { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
    },
    "100m": {
      Backstroke: { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
      Breaststroke: { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
      Butterfly: { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
      Freestyle: { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
      "Individual Medley": { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
    },
    "200m": {
      Backstroke: { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
      Breaststroke: { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
      Butterfly: { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
      Freestyle: { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
      "Individual Medley": { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
    },
    "400m": {
      Backstroke: { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
      Breaststroke: { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
      Butterfly: { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
      Freestyle: { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
      "Individual Medley": { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" },
    },
  };

  let rowHtml = "";

  // Render personal bests
  for (const distance of distances) {
    for (const type of personalTypes) {
      rowHtml = "";
      let thisTime = localStorage.getItem(`child1-event-${type}-${distance}`);
      if (thisTime !== null) {
        rowHtml = "<tr>";
        rowHtml += `<td>${distance}</td><td>${type}</td><td class="time-cell">${thisTime}</td>`;

        if (thisTime.includes(":")) {
          thisTime = parseFloat(thisTime.split(":")[0]) * 60 + parseFloat(thisTime.split(":")[1]);
        }
        try {
          const typeMapped = personalToCountyTypeMap[type];
          let countyTime = countyTimesData[category][distance][typeMapped][age];
          rowHtml += `<td class="time-cell">${countyTime}</td>`;
          if (countyTime?.includes(":")) {
            countyTime = parseFloat(countyTime.split(":")[0]) * 60 + parseFloat(countyTime.split(":")[1]);
          }
          const delta = Number.parseFloat(thisTime) - Number.parseFloat(countyTime);
          rowHtml += `<td class="time-cell ${isNaN(delta) || delta > 0 ? "negative-delta" : "positive-delta"}">${
            isNaN(delta) ? "n/a" : delta.toFixed(2)
          }</td><td class="delete-cross" onClick="deleteTime('child1', '${type}', '${distance}')">X</td>`;
        } catch (err) {
          console.log("err", err);
          rowHtml += `<td class="time-cell"></td><td class="time-cell"></td><td class="delete-cross" onClick="deleteTime('child1', '${type}', '${distance}')">X</td>`;
        }
        rowHtml += "</tr>";
      }
      document.getElementById("times-table").innerHTML += rowHtml;
    }
  }

  const eventTimesTypeMap = {
    Backstroke: "Back",
    "Individual Medley": "IM",
    Freestyle: "Free",
    Breaststroke: "Breast",
    Butterfly: "Fly",
  };

  const countyTimesAchieved = {};
  const regionalTimesAchieved = {};

  // Render recorded times
  for (const distance of distances) {
    for (const type of recordedTypes) {
      rowHtml = "";
      let thisTime = null;
      let countyDelta;
      let regionalDelta;

      try {
        thisTime = swimmerMapL3Plus[distance][type].time;
      } catch (e) {
        // console.log("Nah", e)
      }

      if (thisTime !== null) {
        const printableTime = thisTime;
        allDataMap[distance][type].thisYear = printableTime;
        allDataMap[distance][type].points = swimmerMapL3Plus[distance][type].points;

        if (thisTime.includes(":")) {
          thisTime = parseFloat(thisTime.split(":")[0]) * 60 + parseFloat(thisTime.split(":")[1]);
        }
        try {
          let countyTime = countyTimesData[category][distance][type][age];
          if (countyTime?.includes(":")) {
            countyTime = parseFloat(countyTime.split(":")[0]) * 60 + parseFloat(countyTime.split(":")[1]);
          }
          countyDelta = Number.parseFloat(thisTime) - Number.parseFloat(countyTime);
          if (countyDelta < 0) {
            if (!countyTimesAchieved[type]) {
              countyTimesAchieved[type] = {};
            }
            countyTimesAchieved[type][distance] = {};
          }
          allDataMap[distance][type].countyDelta = countyDelta.toFixed(2);
        } catch (err) {
          console.log("err", err);
        }

        try {
          let regionalTime = regionalTimesData[category][distance][type][age];
          if (regionalTime?.includes(":")) {
            regionalTime = parseFloat(regionalTime.split(":")[0]) * 60 + parseFloat(regionalTime.split(":")[1]);
          }
          regionalDelta = Number.parseFloat(thisTime) - Number.parseFloat(regionalTime);
          if (regionalDelta < 0) {
            if (!regionalTimesAchieved[type]) {
              regionalTimesAchieved[type] = {};
            }
            regionalTimesAchieved[type][distance] = {};
          }
          allDataMap[distance][type].regionalDelta = regionalDelta.toFixed(2);
        } catch (err) {
          console.log("err", err);
        }

        let cardHtml = "";
        cardHtml += `<div class='event-card ${countyDelta < 0 ? "qualified" : ""}'>`;
        cardHtml += `<div class='event-card-top-row'><div class='event-title'>${distance} ${
          eventTimesTypeMap[type]
        }</div><div class="time-cell">${printableTime}</div> <div class="time-cell ${
          countyDelta > 0 ? "negative-delta" : "positive-delta"
        }">${countyDelta.toFixed(2)}</div></div>`;
        cardHtml += `<div>On ${swimmerMapL3Plus[distance][type].date} at ${swimmerMapL3Plus[distance][type].eventName}</div>`;
        cardHtml += "</div>";

        document.getElementById("recorded-times-cards").innerHTML += cardHtml;
      }
    }
  }

  if (Object.keys(swimmerMapL4).length === 0) {
    document.getElementById("recorded-l4-times-cards").innerHTML += "No swims found";
  } else {
    renderLevel4Times(swimmerMapL4, distances, recordedTypes, eventTimesTypeMap, category);
  }

  if (Object.keys(swimmerMapL3Plus).length === 0) {
    document.getElementById("recorded-times-cards").innerHTML += "No swims found";
  }

  console.log("2025", swimmerMapL3Plus);

  allDataMap = render2026PBs(swimmerNumber, allDataMap);
  renderCountyTargets(recordedTypes, age, category, countyTimesAchieved);
  renderRegionalTargets(recordedTypes, age, category, regionalTimesAchieved);
  renderAllData(allDataMap);
}

function render2026PBs(swimmerNumber, allDataMap) {
  const pbs = get2025Results();

  const timesAchieved = pbs.filter((s) => s[0] === swimmerNumber);

  for (const time of timesAchieved) {
    const parts = time[5].split(" "); // e.g., ["200", "Individual", "medley"]
    const distance = parts[0]; // "200"
    const type = parts.slice(1).join(" "); // "Individual medley"
    const points = time[8];

    try {
      allDataMap[distance + "m"][type].lastYear = time[7];
    } catch (err) {
      console.log("Couldn't render allDataMap times");
    }
  }

  return allDataMap;
}

function renderAllData(allDataMap) {
  document.getElementById("all-data-table").innerHTML = "";

  // Optional: control display order of strokes
  const strokeOrder = ["Backstroke", "Breaststroke", "Butterfly", "Freestyle", "Individual Medley"];

  // Optional: control display order of distances
  const distanceOrder = ["50m", "100m", "200m", "400m"];

  let totalPoints = 0;

  const rowsHtml = distanceOrder
    .flatMap((distance) => {
      const strokesObj = allDataMap[distance] || {};
      return strokeOrder.map((stroke) => {
        const entry = strokesObj[stroke] || {
          lastYear: "",
          thisYear: "",
          countyDelta: "",
          regionalDelta: "",
          points: "",
        };

        const eventLabel = `${distance} ${stroke}`;

        if (entry.thisYear.length === 0 && entry.lastYear.length === 0) {
          return "";
        }

        return `
          <tr><td colspan="4" class="event-title-cell">${eventLabel} ${entry.lastYear ? "(" + entry.lastYear + ")" : ""}</td></tr>
          <tr class="${entry.thisYear.length === 0 && entry.lastYear.length === 0 ? "not-applicable-row" : ""}">
            <td class="time-cell ${entry.thisYear.length === 0 ? "not-applicable-cell" : ""}">${entry.thisYear.length === 0 ? "Not swam" : entry.thisYear}</td>
            <td class="time-cell 
            ${entry.countyDelta.length === 0 || isNaN(entry.countyDelta) ? "not-applicable-cell" : ""}
            ${entry.countyDelta > 0 ? "negative-delta" : ""}
            ${entry.countyDelta < 0 ? "positive-delta" : ""}
            ">${entry.countyDelta ?? ""}&nbsp;</td>
            <td class="time-cell
            ${entry.regionalDelta.length === 0 || isNaN(entry.regionalDelta) ? "not-applicable-cell" : ""}
            ${entry.regionalDelta > 0 ? "negative-delta" : ""}
            ${entry.regionalDelta < 0 ? "positive-delta" : ""}
            ">${entry.regionalDelta ?? ""}&nbsp;</td>
            <td>${entry.thisYear.length === 0 ? "" : entry.points}</td>
          </tr>
        `;
      });
    })
    .join("");

  document.getElementById("all-data-table").innerHTML = rowsHtml;
}

function renderCountyTargetsCell(category, type, age, distance, achieved) {
  if (countyTimesData[category][distance][type][age] === "") {
    return "<td class='not-applicable-cell'>n/a</td>";
  } else {
    return `<td class='center ${achieved ? "positive-delta" : "negative-delta"}'>${countyTimesData[category][distance][type][age]}</td>`;
  }
}

/**
 * Renders a table of county targets for a given set of recorded types, age, and category.
 * Updates the inner HTML of the element with ID "county-targets-table".
 *
 * @param {string[]} recordedTypes - An array of stroke types (e.g., "Freestyle", "Backstroke").
 * @param {string} age - The age of the swimmer, used to determine target times.
 * @param {string} category - The category of the swimmer (e.g., "Open/Male", "Female").
 */
function renderCountyTargets(recordedTypes, age, category, timesAchieved) {
  document.getElementById("county-targets-table").innerHTML = "";
  for (const type of recordedTypes) {
    let rowHtml = "<tr>";
    rowHtml += "<td>" + type + "</td>";
    rowHtml += renderCountyTargetsCell(category, type, age, "50m", timesAchieved[type] && timesAchieved[type]["50m"]);
    rowHtml += renderCountyTargetsCell(category, type, age, "100m", timesAchieved[type] && timesAchieved[type]["100m"]);
    rowHtml += renderCountyTargetsCell(category, type, age, "200m", timesAchieved[type] && timesAchieved[type]["200m"]);
    rowHtml += renderCountyTargetsCell(category, type, age, "400m", timesAchieved[type] && timesAchieved[type]["400m"]);
    rowHtml += "</tr>";
    document.getElementById("county-targets-table").innerHTML += rowHtml;
  }
}

function renderRegionalTargetsCell(category, type, age, distance, achieved) {
  if (
    !regionalTimesData ||
    !regionalTimesData[category] ||
    !regionalTimesData[category][distance] ||
    !regionalTimesData[category][distance][type] ||
    regionalTimesData[category][distance][type][age] === ""
  ) {
    return "<td class='not-applicable-cell'>n/a</td>";
  } else {
    return `<td class='center ${achieved ? "positive-delta" : "negative-delta"}'>${regionalTimesData[category][distance][type][age]}</td>`;
  }
}

/**
 * Renders a table of county targets for a given set of recorded types, age, and category.
 * Updates the inner HTML of the element with ID "county-targets-table".
 *
 * @param {string[]} recordedTypes - An array of stroke types (e.g., "Freestyle", "Backstroke").
 * @param {string} age - The age of the swimmer, used to determine target times.
 * @param {string} category - The category of the swimmer (e.g., "Open/Male", "Female").
 */
function renderRegionalTargets(recordedTypes, age, category, timesAchieved) {
  document.getElementById("regional-targets-table").innerHTML = "";
  for (const type of recordedTypes) {
    let rowHtml = "<tr>";
    rowHtml += "<td>" + type + "</td>";
    rowHtml += renderRegionalTargetsCell(category, type, age, "50m", timesAchieved[type] && timesAchieved[type]["50m"]);
    rowHtml += renderRegionalTargetsCell(category, type, age, "100m", timesAchieved[type] && timesAchieved[type]["100m"]);
    rowHtml += renderRegionalTargetsCell(category, type, age, "200m", timesAchieved[type] && timesAchieved[type]["200m"]);
    rowHtml += renderRegionalTargetsCell(category, type, age, "400m", timesAchieved[type] && timesAchieved[type]["400m"]);
    rowHtml += "</tr>";
    document.getElementById("regional-targets-table").innerHTML += rowHtml;
  }
}

function renderLevel4Times(swimmerMapL4, distances, recordedTypes, eventTimesTypeMap, category) {
  // Render recorded times
  for (const distance of distances) {
    for (const type of recordedTypes) {
      let thisTime = null;
      let delta;

      try {
        thisTime = swimmerMapL4[distance][type].time;
      } catch (e) {
        // console.log("Nah", e)
      }

      if (thisTime !== null) {
        const printableTime = thisTime;

        if (thisTime.includes(":")) {
          thisTime = parseFloat(thisTime.split(":")[0]) * 60 + parseFloat(thisTime.split(":")[1]);
        }
        try {
          let countyTime = countyTimesData[category][distance][type][age];
          if (countyTime?.includes(":")) {
            countyTime = parseFloat(countyTime.split(":")[0]) * 60 + parseFloat(countyTime.split(":")[1]);
          }
          delta = Number.parseFloat(thisTime) - Number.parseFloat(countyTime);
        } catch (err) {
          console.log("err", err);
        }

        let cardHtml = "";
        cardHtml += "<div class='event-card'>";
        cardHtml += `<div class='event-card-top-row'><div class='event-title'>${distance} ${eventTimesTypeMap[type]}</div><div></div><div class="time-cell">${printableTime}</div></div>`;
        cardHtml += `<div>On ${swimmerMapL4[distance][type].date} at ${swimmerMapL4[distance][type].eventName}</div>`;
        cardHtml += "</div>";

        document.getElementById("recorded-l4-times-cards").innerHTML += cardHtml;
      }
    }
  }
}

function saveTime() {
  const type = document.getElementById("type").value;
  const distance = document.getElementById("distance").value;
  const timeEntry = document.getElementById("time-entry").value;

  const shortTimeRegExp = /^[0-5]?[0-9]\.[0-9]{2}$/;
  const minutesRegExp = /^([0-9]|10):[0-5][0-9]\.[0-9]{2}$/;

  if (shortTimeRegExp.test(timeEntry) || minutesRegExp.test(timeEntry)) {
    localStorage.setItem(`child1-event-${type}-${distance}`, timeEntry);
    loadData();
  } else {
    alert("Time entry must use the format 1:23.45 or 12.34");
  }
}

function getTimeAsSeconds(time) {
  if (time?.includes(":")) {
    return parseFloat(time.split(":")[0]) * 60 + parseFloat(time.split(":")[1]);
  } else {
    return time;
  }
}

function deleteTime(child, type, distance) {
  localStorage.removeItem(`child1-event-${type}-${distance}`);
  loadData();
}

loadData();
window.saveTime = saveTime;
window.deleteTime = deleteTime;
window.saveData = saveData;
window.lookupSwimmer = lookupSwimmer;
window.changeSwimmer = changeSwimmer;
