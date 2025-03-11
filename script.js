import { getData } from './swimming-county-times.js';
import { getResults } from './swimming-results.js';
console.log("times", getData())
console.log("results", getResults())

const countyTimesData = getData();
const results = getResults();

function saveData() {
  console.log("Saving")
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

export function loadData() {
  console.log("loading")
  document.getElementById("times-table").innerHTML = "";
  const age = localStorage.getItem("child1-age");
  const name = localStorage.getItem("child1-name");
  const category = localStorage.getItem("child1-category");
  const swimmerNumber = localStorage.getItem("child1-swimmer-number");
  console.log("loading age is", age)
  if (!age?.length > 0 || !name?.length > 0 || !category?.length) {
    document.getElementById("output").innerHTML =
      "Select a name, age and category to continue";
    document.getElementById("enter-times-row").style.display = "none";
    return;
  }

  const swimmersEvents = results.events.filter(event => event.results.some(result => result[0] === swimmerNumber));
  console.log("Events entered", swimmersEvents);
  console.log("Results", swimmersEvents.filter(event => event.results.filter(result => result[0] === swimmerNumber)));
  // console.log("Evs", const targetID = "ID1";

const matchingResults = events.flatMap(event =>
    event.results.filter(result => result[0] === swimmerNumber)
);

console.log("EVS", matchingResults);

  
  document.getElementById("output").innerHTML = "";
  document.getElementById("enter-times-row").style.display = "block";
  document.getElementById("age").value = age;
  document.getElementById("name").value = name;
  document.getElementById("swimmerNumber").value = swimmerNumber;
  document.getElementById("category").value = category;
  
  const distances = ["50m", "100m", "200m", "400m"];
  const types = ["Back", "Breast", "Butterfly", "Free"];
  
  let rowHtml = "";
  
  for (const distance of distances) {
    for (const type of types) {
      rowHtml = "";
      let thisTime = localStorage.getItem(
        `child1-event-${type}-${distance}`
      );
      if (thisTime !== null) {
        rowHtml = "<tr>";
        rowHtml += `<td>${distance}</td><td>${type}</td><td class="time-cell">${thisTime}</td>`;
        
        if (thisTime.includes(":")) {
          thisTime =
            parseFloat(thisTime.split(":")[0]) * 60 +
            parseFloat(thisTime.split(":")[1]);
        }
        try {
          let countyTime = countyTimesData[category][distance][type][age];
          rowHtml += `<td class="time-cell">${countyTime}</td>`;
          if (countyTime?.includes(":")) {
            countyTime =
              parseFloat(countyTime.split(":")[0]) * 60 +
              parseFloat(countyTime.split(":")[1]);
          }
          const delta =
            Number.parseFloat(thisTime) - Number.parseFloat(countyTime);
          rowHtml += `<td class="time-cell ${
                  isNaN(delta) || delta > 0
                    ? "negative-delta"
                    : "positive-delta"
                }">${
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

function deleteTime(child, type, distance) {
  localStorage.removeItem(`child1-event-${type}-${distance}`);
  loadData();
}

loadData();
window.saveTime = saveTime;
window.deleteTime = deleteTime;
window.saveData = saveData;
