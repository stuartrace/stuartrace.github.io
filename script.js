import { getData } from "./swimming-county-times.js";
import { getResults } from "./swimming-results.js";
console.log("times", getData());
console.log("results", getResults());

const countyTimesData = getData();
const results = getResults();

const uniqueSwimmersMap = new Map(results.events.flatMap((event) => event.results.map((result) => [result.slice(0, 4).join("|"), result])));

const uniqueSwimmers = [...uniqueSwimmersMap.values()]
  .map((result) => ({
    ID: result[0],
    name: result[1],
    yearOfBirth: result[2],
    category: result[3],
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
  document.getElementById("age").value = age;
  document.getElementById("name").value = name;
  document.getElementById("swimmerNumber").value = id;
  document.getElementById("category").value = category;

  $("#swimmerOutput").empty();
  $("#swimmerOutput").append(`${name} (${id}) is swimming as a ${age} year old in the next counties.`);
}

export function lookupSwimmer() {
  const swimmerNumber = document.getElementById("swimmerNumber").value;

  console.log("swimmerNumber", swimmerNumber);
  if (swimmerNumber.length >= 7) {
    localStorage.setItem("child1-swimmer-number", swimmerNumber);
    const allResults = getResults();
    console.log("Got a swim number", swimmerNumber, allResults.events);
    const swimmersEvents = allResults.events.filter((event) => event.results.some((result) => result[0] === swimmerNumber));
    console.log("Swimmer details", swimmersEvents);
    if (swimmersEvents.length > 0) {
      const swimmerEntry = swimmersEvents[0].results.find((result) => result[0] === swimmerNumber);
      console.log("SwimmerEntry", swimmerEntry);
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
      })
    );
  });

  const swimmerNumber = localStorage.getItem("child1-swimmer-number");
  $("#recordedSwimmers").val(swimmerNumber);

  document.getElementById("times-table").innerHTML = "";
  document.getElementById("recorded-times-cards").innerHTML = "";
  document.getElementById("events-entered-cards").innerHTML = "";

  const swimmersEvents = results.events.filter((event) => event.results.some((result) => result[0] === swimmerNumber));
  console.log("Events entered", swimmersEvents);

  const age = localStorage.getItem("child1-age");
  const name = localStorage.getItem("child1-name");
  const category = localStorage.getItem("child1-category");

  if (!age?.length > 0 || !name?.length > 0 || !category?.length) {
    document.getElementById("output").innerHTML = "Select a name, age and category to continue";
    document.getElementById("enter-times-row").style.display = "none";
    return;
  }

  for (const swimmersEvent of swimmersEvents) {
    document.getElementById("events-entered-cards").innerHTML += `<div class="card">${swimmersEvent.eventName} - ${swimmersEvent.date}</div>`;
  }

  let matchingResults = swimmersEvents.flatMap((event) => event.results.filter((result) => result[0] === swimmerNumber));

  // Adding the same value to each object using map
  matchingResults = matchingResults.map((result) => {
    // Adding a new field 'location' with the same value
    result.location = results.eventName;
    result.date = results.date;
    return result;
  });

  let swimmerMap = {};

  for (const event of results.events) {
    const swimmersResults = event.results.filter((result) => result[0] === swimmerNumber);
    for (const result of swimmersResults) {
      const distanceNum = result[5].split(" ")[0];
      const distance = result[5].split(" ")[0] + "m";
      const style = result[5].split(distanceNum + " ")[1];
      if (!swimmerMap[distance]) {
        swimmerMap[distance] = {};
      }

      if (!swimmerMap[distance][style]) {
        swimmerMap[distance][style] = {};
      }

      if (!swimmerMap[distance][style].time || getTimeAsSeconds(result[7]) < getTimeAsSeconds(swimmerMap[distance][style].time)) {
        swimmerMap[distance][style].time = result[7];
        swimmerMap[distance][style].eventName = event.eventName;
        swimmerMap[distance][style].date = event.date;
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
          rowHtml += `<td class="time-cell"></td><td class="time-cell"></td><td></td>`;
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

  // Render recorded times
  for (const distance of distances) {
    for (const type of recordedTypes) {
      rowHtml = "";
      let thisTime = null;
      let delta;

      try {
        thisTime = swimmerMap[distance][type].time;
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
        cardHtml += `<div class='event-card-top-row'><div class='event-title'>${distance} ${
          eventTimesTypeMap[type]
        }</div><div class="time-cell">${printableTime}</div> <div class="time-cell ${delta > 0 ? "negative-delta" : "positive-delta"}">${delta.toFixed(
          2
        )}</div></div>`;
        cardHtml += `<div>At: ${swimmerMap[distance][type].eventName} on: ${swimmerMap[distance][type].date}</div>`;
        cardHtml += "</div>";

        document.getElementById("recorded-times-cards").innerHTML += cardHtml;
      }
    }
  }

  if (Object.keys(swimmerMap).length === 0) {
    document.getElementById("recorded-times-cards").innerHTML += "No swims found";
  }
}

function saveTime() {
  const type = document.getElementById("type").value;
  const distance = document.getElementById("distance").value;
  const timeEntry = document.getElementById("time-entry").value;

  const secondsRegExp = /^[0-5]{1,2}\.[0-9]{1,2}$/g;
  const minutesRegExp = /^[0-9]{1}:[0-5]{2}\.[0-9]{1,2}$/g;
  if (!secondsRegExp.test(timeEntry) && !minutesRegExp.test(timeEntry)) {
    alert("Time entry must use the format 1:23.45 or 12.34");
    return;
  }

  localStorage.setItem(`child1-event-${type}-${distance}`, timeEntry);

  loadData();
}

function getFastestTime(firstTime, secondTime) {
  let time1 = getTimeAsSeconds(firstTime);
  let time2 = getTimeAsSeconds(secondTime);
  if (!time1?.length > 0) {
    return time2;
  }

  if (!time2?.length > 0) {
    return time1;
  }

  if (time1 < time2) {
    return time1;
  } else {
    return time2;
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
