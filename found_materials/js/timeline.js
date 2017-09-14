// Timeline

let intervals = document.getElementById('intervals');
let windowWidth = window.innerWidth;
let deltaTime = [];
let deltaAttribute = [];
let complaints = require('./../data/complaints.json');

// populate deltatime
for(let i = 0; i < 12; i++){
  if (i == 0){
    deltaTime.push('12AM');
    deltaAttribute.push('12');
  } else {
    deltaTime.push(i + 'AM');
    i < 10 ? deltaAttribute.push('0' + i) : deltaAttribute.push(String(i));
  } 
}

for(let i = 0; i <= 12; i++){
  if (i == 0){
    deltaTime.push('12PM');
    deltaAttribute.push('12');
  } else if (i == 12){
    deltaTime.push('12AM')
    deltaAttribute.push('12');
  } else  {
    deltaTime.push(i + 'PM')
    i < 10 ? deltaAttribute.push('0' + i) : deltaAttribute.push(String(i));
  }
}

deltaTime.forEach((delta, i)=>{

  let interval = document.createElement('div');
  interval.className += 'interval';
  interval.style.left =  (i / deltaTime.length)*100 +'%';

  let line = document.createElement('div');
  line.className += 'vertical-line'
  line.dataset.time = deltaAttribute[i];
  line.dataset.format = delta.slice(-2);
  interval.appendChild(line);
  line.addEventListener('mouseover', (e) => {
    mapSounds(e.srcElement.dataset.time, e.srcElement.dataset.format);
  })
  line.addEventListener('mouseout', (e) => {
    clearCanvas();
  })

  let time = document.createElement('p');
  time.appendChild(document.createTextNode(delta))
  time.className += 'time';
  interval.appendChild(time);
  intervals.appendChild(interval);

});

let mapSounds = (time, format) => {
  let amount = 0;
  let currentComplaints = {};
  let largest = 0;

  for(let i in complaints){
    let complain = complaints[i].type;
    if(time == i.substring(0,2) && format == i.substring(9,12)){
      if (currentComplaints[complain] != undefined){
        currentComplaints[complain] = currentComplaints[complain] + 1;
      } else {
        currentComplaints[complain] = {};
        currentComplaints[complain] = 1;
      }
      if (currentComplaints[complain] > largest) {
        largest = currentComplaints[complain];
      }
      drawComplaints(complaints[i].lat, complaints[i].lng);
    }
  }
  makeSound(currentComplaints, largest);
}