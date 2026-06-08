import { getData } from "./swimming-county-times.js";
import { getRegionalTimes } from "./swimming-regional-times.js";
import { getResults } from "./swimming-results-2026.js";
import { get2025Results } from "./swimming-2025-pbs.js";

const countyTimesData = getData();
const regionalTimesData = getRegionalTimes();
const results = getResults();
const BIRTH_YEAR_OFFSET = 1999;

const swimmersSeedMap = new Map([
  ["1732229|Noah Race|14|Open/Male", ["1732229", "Noah Race", "14", "Open/Male"]],
  ["1468588|Leah Rhodes|13|Female", ["1468588", "Leah Rhodes", "13", "Female"]],
  ["1518045|Frankie Anderson|15|Female", ["1518045", "Frankie Anderson", "15", "Female"]],
  ["1503220|Ewan Wilcox|11|Open/Male", ["1503220", "Ewan Wilcox", "11", "Open/Male"]],
  ["1662020|Nathanel Ilie|11|Open/Male", ["1662020", "Nathanel Ilie", "11", "Open/Male"]],
  ["1680628|Toby Thomas|11|Open/Male", ["1680628", "Toby Thomas", "11", "Open/Male"]],
  ["1647375|Hannah Smith|10|Female", ["1647375", "Hannah Smith", "10", "Female"]],
  ["1761783|Mya Smith|13|Female", ["1761783", "Mya Smith", "13", "Female"]],
  ["1680629|Harriet Thomas|13|Female", ["1680629", "Harriet Thomas", "13", "Female"]],
  ["1742684|Ivy-Rose Clark|13|Female", ["1742684", "Ivy-Rose Clark", "13", "Female"]],
  ["1737305|Phoebe Gallagher|15|Female", ["1737305", "Phoebe Gallagher", "15", "Female"]],
  ["1576896|Emma Lindsey|15|Female", ["1576896", "Emma Lindsey", "15", "Female"]],
  ["1732278|Bernardo Silva|12|Open/Male", ["1732278", "Bernardo Silva", "12", "Open/Male"]],
  ["1786899|Violet Gallagher|14|Female", ["1786899", "Violet Gallagher", "14", "Female"]],
  ["1803614|Fareed Omotosho|11|Open/Male", ["1803614", "Fareed Omotosho", "11", "Open/Male"]],
  ["1813869|Aliona Rebello|12|Female", ["1813869", "Aliona Rebello", "12", "Female"]],
  ["1281250|Owen Young|7|Open/Male", ["1281250", "Owen Young", "7", "Open/Male"]],
  ["1822118|Samad Omotosho|15|Open/Male", ["1822118", "Samad Omotosho", "15", "Open/Male"]],
  ["1813873|Jessica Smith|15|Female", ["1813873", "Jessica Smith", "15", "Female"]],
  ["1816617|Emmy Morley|15|Female", ["1816617", "Emmy Morley", "15", "Female"]],
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

/**
 * Reads swimmer details from form inputs and persists them to localStorage.
 */
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

/**
 * Handles swimmer selection change from the dropdown, calculates age, and refreshes the UI.
 */
export function changeSwimmer() {
  const swimmerId = $("#recordedSwimmers").val();
  const thisSwimmer = uniqueSwimmers.find((s) => s.ID === swimmerId);
  const category = thisSwimmer.category === "Female" ? "Female" : "Male";
  const today = new Date();
  let childAge = today.getFullYear() - BIRTH_YEAR_OFFSET - thisSwimmer.yearOfBirth;
  if (childAge > 17) {
    childAge = 17;
  }
  writeSwimmerToLocalStorage(childAge, thisSwimmer.name, category, thisSwimmer.ID);
  showSwimmerDetailsInBoxes(childAge, thisSwimmer?.name, thisSwimmer?.ID);

  loadData();
}

/**
 * Persists swimmer details to localStorage.
 *
 * @param {number|string} age - The swimmer's age.
 * @param {string} name - The swimmer's full name.
 * @param {string} category - The swimmer's category ("Male" or "Female").
 * @param {string} id - The swimmer's unique ID.
 */
function writeSwimmerToLocalStorage(age, name, category, id) {
  localStorage.setItem("child1-age", age);
  localStorage.setItem("child1-name", name);
  localStorage.setItem("child1-category", category);
  localStorage.setItem("child1-swimmer-number", id);
}

/**
 * Renders the swimmer's name, ID link, and age into the swimmer output section.
 *
 * @param {number|string} age - The swimmer's age.
 * @param {string} name - The swimmer's full name.
 * @param {string} id - The swimmer's unique ID.
 */
function showSwimmerDetailsInBoxes(age, name, id) {
  $("#swimmerOutput").empty();
  $("#swimmerOutput").append(`
  <p class="margin-bottom--none">
    ${name} (<a href="https://www.swimmingresults.org/individualbest/personal_best.php?mode=A&tiref=${id}" target="_blank" rel="noopener">${id}</a>) is swimming as a ${age} year old in the next counties.
  </p>
`);
}

/**
 * Looks up a swimmer by their ID from the input field, populates their details
 * from results data, saves to localStorage, and refreshes the UI.
 */
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
      const age = today.getFullYear() - BIRTH_YEAR_OFFSET - swimmerEntry[2];
      localStorage.setItem("child1-age", age);
      $("#age").val(age);
      const category = swimmerEntry[3] === "Female" ? "Female" : "Male";
      localStorage.setItem("child1-category", category);
      document.getElementById("category").value = category;
      loadData();
    }
  }
}

/**
 * Builds a nested map of personal best times for a swimmer across a set of events.
 *
 * @param {Array<{eventName: string, date: string, results: string[][]}>} events - Events to search through.
 * @param {string} swimmerNumber - The swimmer's unique ID to filter results by.
 * @returns {Object<string, Object<string, {time: string, eventName: string, date: string, points: string}>>} Map keyed by distance then stroke.
 */
function buildBestTimesMap(events, swimmerNumber) {
  const map = {};
  for (const event of events) {
    for (const result of event.results.filter((r) => r[0] === swimmerNumber)) {
      const [distanceNum, ...styleParts] = result[5].split(" ");
      const distance = distanceNum + "m";
      const style = styleParts.join(" ");
      map[distance] ??= {};
      map[distance][style] ??= {};
      if (!map[distance][style].time || getTimeAsSeconds(result[7]) < getTimeAsSeconds(map[distance][style].time)) {
        map[distance][style] = { time: result[7], eventName: event.eventName, date: event.date, points: result[8] };
      }
    }
  }
  return map;
}

/**
 * Main render function. Loads the selected swimmer from localStorage, computes
 * personal bests, county/regional deltas, and renders all UI sections.
 */
export function loadData() {
  $("#recordedSwimmers").empty();
  $("#recordedSwimmers").append(
    $("<option>", {
      value: "",
      text: "Select a swimmer",
      disabled: true,
    }),
  );
  $.each(uniqueSwimmers, function (i, swimmer) {
    $("#recordedSwimmers").append(
      $("<option>", {
        value: swimmer.ID,
        text: swimmer.name,
      }),
    );
  });

  const swimmerNumber = localStorage.getItem("child1-swimmer-number");
  $("#recordedSwimmers").val(swimmerNumber || "");

  document.getElementById("times-table").innerHTML = "";
  $("#recorded-times-cards").empty();
  $("#recorded-l4-times-cards").empty();
  document.getElementById("events-entered-cards").innerHTML = "";

  const swimmersEvents = results.events.filter((event) => event.results.some((result) => result[0] === swimmerNumber));

  const age = localStorage.getItem("child1-age");
  const name = localStorage.getItem("child1-name");
  const category = localStorage.getItem("child1-category");

  // if (!age?.length > 0 || !name?.length > 0 || !category?.length) {
  //   document.getElementById("output").innerHTML = "Select a name, age and category to continue";
  //   document.getElementById("enter-times-row").style.display = "none";
  //   return;
  // }

  document.getElementById("events-entered-cards").innerHTML = swimmersEvents
    .map((swimmersEvent) => `<div class="event-card">${swimmersEvent.eventName} - ${swimmersEvent.date}</div>`)
    .join("");

  const swimmerMapL3Plus = buildBestTimesMap(
    results.events.filter((e) => Number(e.level) < 4),
    swimmerNumber,
  );
  const swimmerMapL4 = buildBestTimesMap(
    results.events.filter((e) => Number(e.level) === 4),
    swimmerNumber,
  );

  document.getElementById("output").innerHTML = "";
  document.getElementById("enter-times-row").style.display = "block";
  showSwimmerDetailsInBoxes(age, name, swimmerNumber);

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

  let allDataMap = Object.fromEntries(
    distances.map((d) => [d, Object.fromEntries(recordedTypes.map((t) => [t, { lastYear: "", thisYear: "", countyDelta: "", regionalDelta: "" }]))]),
  );

  let rowHtml = "";
  let timesTableHtml = "";

  // Render personal bests
  for (const distance of distances) {
    for (const type of personalTypes) {
      rowHtml = "";
      let thisTime = localStorage.getItem(`child1-event-${type}-${distance}`);
      if (thisTime !== null) {
        rowHtml = "<tr>";
        rowHtml += `<td>${distance}</td><td>${type}</td><td class="time-cell">${thisTime}</td>`;

        thisTime = getTimeAsSeconds(thisTime);
        try {
          const typeMapped = personalToCountyTypeMap[type];
          let countyTime = countyTimesData[category][distance][typeMapped][age];
          rowHtml += `<td class="time-cell">${countyTime}</td>`;
          countyTime = getTimeAsSeconds(countyTime);
          const delta = Number.parseFloat(thisTime) - Number.parseFloat(countyTime);
          rowHtml += `<td class="time-cell ${isNaN(delta) || delta > 0 ? "negative-delta" : "positive-delta"}">${
            isNaN(delta) ? "n/a" : delta.toFixed(2)
          }</td><td class="delete-cross" onClick="deleteTime('child1', '${type}', '${distance}')">X</td>`;
        } catch (err) {
          console.log("err", err);
          rowHtml += `<td class="time-cell"></td><td class="time-cell"></td><td class="delete-cross" onClick="deleteTime('child1', '${type}', '${distance}')">X</td>`;
          continue;
        }
        rowHtml += "</tr>";
      }
      timesTableHtml += rowHtml;
    }
  }
  document.getElementById("times-table").innerHTML = timesTableHtml;

  const eventTimesTypeMap = {
    Backstroke: "Back",
    "Individual Medley": "IM",
    Freestyle: "Free",
    Breaststroke: "Breast",
    Butterfly: "Fly",
  };

  const countyTimesAchieved = {};
  const regionalTimesAchieved = {};

  let numberOfEventsSwum = 0;
  let totalDistanceCompleted = 0;
  const recordedTimesCards = [];

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
        numberOfEventsSwum += 1;
        totalDistanceCompleted += parseInt(distance.replace("m", ""));
        const printableTime = thisTime;
        allDataMap[distance][type].thisYear = printableTime;
        allDataMap[distance][type].points = swimmerMapL3Plus[distance][type].points;

        thisTime = getTimeAsSeconds(thisTime);
        try {
          let countyTime = getTimeAsSeconds(countyTimesData[category][distance][type][age]);
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
          continue;
        }

        try {
          let regionalTime = getTimeAsSeconds(regionalTimesData[category][distance][type][age]);
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

        recordedTimesCards.push(cardHtml);
      }
    }
  }

  document.getElementById("recorded-times-cards").innerHTML = recordedTimesCards.length > 0
    ? recordedTimesCards.join("")
    : "No swims found";

  if (Object.keys(swimmerMapL4).length !== 0) {
    renderLevel4Times(swimmerMapL4, distances, recordedTypes, eventTimesTypeMap, category, age);
  } else {
    document.getElementById("recorded-l4-times-cards").innerHTML = "No swims found";
  }

  allDataMap = render2026PBs(swimmerNumber, allDataMap);
  renderCountyTargets(recordedTypes, age, category, countyTimesAchieved);
  renderRegionalTargets(recordedTypes, age, category, regionalTimesAchieved);
  renderAllData(allDataMap);
  renderClubRecords();
  if (numberOfEventsSwum > 0) {
    renderSummaryInfo(numberOfEventsSwum, totalDistanceCompleted, name?.split(" ")[0]);
  }
}

/**
 * Appends a summary paragraph showing total events swum and distance completed.
 *
 * @param {number} numberOfEventsSwum - Total number of Level 3+ events the swimmer competed in.
 * @param {number} totalDistanceCompleted - Total metres swum across all events.
 * @param {string} swimmerName - The swimmer's first name.
 */
function renderSummaryInfo(numberOfEventsSwum, totalDistanceCompleted, swimmerName) {
  document.getElementById("swimmerOutput").innerHTML += `
    <p class="margin-bottom--none">This season, ${swimmerName} has swum in <strong>${numberOfEventsSwum}</strong> Level 3+ events, completing a total distance of <strong>${totalDistanceCompleted}m</strong>.</p>
  `;
}

/**
 * Merges previous season (2025) personal bests into the all-data map for comparison display.
 *
 * @param {string} swimmerNumber - The swimmer's unique ID.
 * @param {Object} allDataMap - The current season data map to augment with last year's times.
 * @returns {Object} The updated allDataMap with lastYear fields populated.
 */
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
      console.log("Couldn't render allDataMap times", err);
      continue;
    }
  }

  return allDataMap;
}

/**
 * Renders the combined data view showing PBs, county deltas, regional deltas,
 * and previous season times as event cards.
 *
 * @param {Object} allDataMap - Nested map of distance > stroke > {thisYear, lastYear, countyDelta, regionalDelta, points}.
 */
function renderAllData(allDataMap) {
  document.getElementById("all-data-table").innerHTML = "";

  // Optional: control display order of strokes
  const strokeOrder = ["Backstroke", "Breaststroke", "Butterfly", "Freestyle", "Individual Medley"];

  // Optional: control display order of distances
  const distanceOrder = ["50m", "100m", "200m", "400m"];

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

        const strokeMap = {
          Backstroke: "Back",
          Breaststroke: "Breast",
          Butterfly: "Fly",
          Freestyle: "Free",
          "Individual Medley": "IM",
        };

        const eventLabel = `${distance} ${strokeMap[stroke]}`;

        if (entry.thisYear.length === 0 && entry.lastYear.length === 0) {
          return "";
        }

        return `<div class="event-card">
          
          <div class="event-title-cell">${eventLabel}</div>
          
          <div class="event-data-row">
            <div class="event-data-label">PB:</div>
            <div class="event-data-output align-right">${entry.thisYear && entry.thisYear.length > 0 ? entry.thisYear : "--"}</div>
          </div>
          <div class="event-data-row">
            <div class="event-data-label">County:</div>
            <div class="event-data-output align-right
            ${entry.countyDelta.length === 0 || isNaN(entry.countyDelta) ? "not-applicable" : ""}
            ${entry.countyDelta > 0 ? "negative-delta" : ""}
            ${entry.countyDelta < 0 ? "positive-delta" : ""}
            ">${entry.countyDelta ? entry.countyDelta : "n/a"}</div>
          </div>
          <div class="event-data-row">
            <div class="event-data-label">Region:</div>
            <div class="event-data-output align-right
            ${entry.regionalDelta.length === 0 || isNaN(entry.regionalDelta) ? "not-applicable" : ""}
            ${entry.regionalDelta > 0 ? "negative-delta" : ""}
            ${entry.regionalDelta < 0 ? "positive-delta" : ""}
            ">${entry.regionalDelta && !isNaN(entry.regionalDelta) ? entry.regionalDelta : "n/a"}</div>
          </div>
          <div class="event-data-row">
            <div class="event-data-label not-applicable">2025:</div>
            <div class="event-data-output align-right not-applicable">${entry.lastYear ? entry.lastYear : "n/a"}</div>
          </div>
        </div>`;
      });
    })
    .join("");

  document.getElementById("all-data-table").innerHTML = rowsHtml;
}

/**
 * Generates a table cell HTML string for a single county target time.
 *
 * @param {string} category - The swimmer's category ("Male" or "Female").
 * @param {string} type - The stroke type (e.g., "Freestyle").
 * @param {string} age - The swimmer's age.
 * @param {string} distance - The distance (e.g., "50m").
 * @param {boolean} achieved - Whether the swimmer has achieved this county time.
 * @returns {string} HTML string for the table cell.
 */
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
 * @param {Object} timesAchieved - Map of stroke > distance for times that have been achieved.
 */
function renderCountyTargets(recordedTypes, age, category, timesAchieved) {
  let html = "";
  for (const type of recordedTypes) {
    let rowHtml = "<tr>";
    rowHtml += "<td>" + type + "</td>";
    rowHtml += renderCountyTargetsCell(category, type, age, "50m", timesAchieved[type] && timesAchieved[type]["50m"]);
    rowHtml += renderCountyTargetsCell(category, type, age, "100m", timesAchieved[type] && timesAchieved[type]["100m"]);
    rowHtml += renderCountyTargetsCell(category, type, age, "200m", timesAchieved[type] && timesAchieved[type]["200m"]);
    rowHtml += renderCountyTargetsCell(category, type, age, "400m", timesAchieved[type] && timesAchieved[type]["400m"]);
    rowHtml += "</tr>";
    html += rowHtml;
  }
  document.getElementById("county-targets-table").innerHTML = html;
}

/**
 * Generates a table cell HTML string for a single regional target time.
 *
 * @param {string} category - The swimmer's category ("Male" or "Female").
 * @param {string} type - The stroke type (e.g., "Freestyle").
 * @param {string} age - The swimmer's age.
 * @param {string} distance - The distance (e.g., "50m").
 * @param {boolean} achieved - Whether the swimmer has achieved this regional time.
 * @returns {string} HTML string for the table cell.
 */
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
 * Renders a table of regional targets for a given set of recorded types, age, and category.
 * Updates the inner HTML of the element with ID "regional-targets-table".
 *
 * @param {string[]} recordedTypes - An array of stroke types (e.g., "Freestyle", "Backstroke").
 * @param {string} age - The age of the swimmer, used to determine target times.
 * @param {string} category - The category of the swimmer (e.g., "Open/Male", "Female").
 * @param {Object} timesAchieved - Map of stroke > distance for times that have been achieved.
 */
function renderRegionalTargets(recordedTypes, age, category, timesAchieved) {
  let html = "";
  for (const type of recordedTypes) {
    let rowHtml = "<tr>";
    rowHtml += "<td>" + type + "</td>";
    rowHtml += renderRegionalTargetsCell(category, type, age, "50m", timesAchieved[type] && timesAchieved[type]["50m"]);
    rowHtml += renderRegionalTargetsCell(category, type, age, "100m", timesAchieved[type] && timesAchieved[type]["100m"]);
    rowHtml += renderRegionalTargetsCell(category, type, age, "200m", timesAchieved[type] && timesAchieved[type]["200m"]);
    rowHtml += renderRegionalTargetsCell(category, type, age, "400m", timesAchieved[type] && timesAchieved[type]["400m"]);
    rowHtml += "</tr>";
    html += rowHtml;
  }
  document.getElementById("regional-targets-table").innerHTML = html;
}

/**
 * Renders Level 4 personal best times as event cards.
 *
 * @param {Object} swimmerMapL4 - Best times map for Level 4 events (from buildBestTimesMap).
 * @param {string[]} distances - Array of distances to iterate (e.g., ["50m", "100m", ...]).
 * @param {string[]} recordedTypes - Array of stroke types.
 * @param {Object} eventTimesTypeMap - Map of full stroke names to abbreviated display names.
 * @param {string} category - The swimmer's category.
 * @param {string} age - The swimmer's age.
 */
function renderLevel4Times(swimmerMapL4, distances, recordedTypes, eventTimesTypeMap, category, age) {
  $("#recorded-l4-times-cards-holder").show();
  const cards = [];
  for (const distance of distances) {
    for (const type of recordedTypes) {
      let thisTime = null;

      try {
        thisTime = swimmerMapL4[distance][type].time;
      } catch (e) {
        continue;
      }

      if (thisTime !== null) {
        const printableTime = thisTime;

        thisTime = getTimeAsSeconds(thisTime);

        let cardHtml = "";
        cardHtml += "<div class='event-card'>";
        cardHtml += `<div class='event-card-top-row'><div class='event-title'>${distance} ${eventTimesTypeMap[type]}</div><div></div><div class="time-cell">${printableTime}</div></div>`;
        cardHtml += `<div>On ${swimmerMapL4[distance][type].date} at ${swimmerMapL4[distance][type].eventName}</div>`;
        cardHtml += "</div>";

        cards.push(cardHtml);
      }
    }
  }
  document.getElementById("recorded-l4-times-cards").innerHTML = cards.join("");
}

/**
 * Renders club record tables grouped by gender, showing the fastest time
 * for each age/stroke/distance combination across all events.
 */
function renderClubRecords() {
  const distances = ["50m", "100m", "200m", "400m"];
  const strokes = ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Individual Medley"];
  const strokeAbbrev = {
    Freestyle: "Free",
    Backstroke: "Back",
    Breaststroke: "Breast",
    Butterfly: "Fly",
    "Individual Medley": "IM",
  };
  const genders = [
    { label: "Male", filter: (cat) => cat !== "Female" },
    { label: "Female", filter: (cat) => cat === "Female" },
  ];

  const selectedName = localStorage.getItem("child1-name");

  const ages = new Set();
  for (const event of results.events) {
    for (const result of event.results) {
      ages.add(new Date().getFullYear() - BIRTH_YEAR_OFFSET - Number(result[2]));
    }
  }
  const sortedAges = [...ages].sort((a, b) => a - b);

  let html = "";

  for (const gender of genders) {
    const records = {};

    for (const event of results.events) {
      for (const result of event.results) {
        if (!gender.filter(result[3])) continue;
        const age = new Date().getFullYear() - BIRTH_YEAR_OFFSET - Number(result[2]);
        const key = result[5];
        records[key] ??= {};
        if (!records[key][age] || getTimeAsSeconds(result[7]) < getTimeAsSeconds(records[key][age].time)) {
          records[key][age] = { time: result[7], name: result[1] };
        }
      }
    }

    html += `<div class="sub-title">${gender.label}</div>`;

    for (const age of sortedAges) {
      const rows = [];
      for (const distance of distances) {
        for (const stroke of strokes) {
          const key = `${distance.replace("m", "")} ${stroke}`;
          if (!records[key] || !records[key][age]) continue;
          const isSelected = records[key][age].name === selectedName;
          const cellClass = isSelected ? " class=\"highlighted-swimmer\"" : "";
          rows.push(`<tr><td>${distance.replace("m", "")} ${strokeAbbrev[stroke]}</td><td${cellClass}>${records[key][age].name} (${records[key][age].time})</td></tr>`);
        }
      }
      if (rows.length === 0) continue;

      html += `<table class="club-records-table">`;
      html += `<thead><tr><th colspan="2">Age ${age}</th></tr>`;
      html += `<tr><th>Event</th><th>Record</th></tr></thead>`;
      html += `<tbody>${rows.join("")}</tbody></table>`;
    }
  }

  document.getElementById("club-records").innerHTML = html;
}

/**
 * Validates and saves a manually entered time to localStorage, then refreshes the UI.
 */
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

/**
 * Converts a swim time string to seconds.
 *
 * @param {string} time - Time in format "MM:SS.ss" or "SS.ss".
 * @returns {number} The time converted to total seconds.
 */
function getTimeAsSeconds(time) {
  if (time?.includes(":")) {
    return parseFloat(time.split(":")[0]) * 60 + parseFloat(time.split(":")[1]);
  }
  return parseFloat(time);
}

/**
 * Removes a manually entered time from localStorage and refreshes the UI.
 *
 * @param {string} child - The child identifier (currently always "child1").
 * @param {string} type - The stroke type abbreviation (e.g., "Back", "Free").
 * @param {string} distance - The distance (e.g., "50m").
 */
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
