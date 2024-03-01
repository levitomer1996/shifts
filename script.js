var submittedShifts;
async function uploadFile() {
  var fileInput = document.getElementById("fileInput");
  var file = fileInput.files[0];
  var reader = new FileReader();
  var availableShifts = [
    [[], [], [], []],
    [[], [], [], []],
    [[], [], [], []],
    [[], [], [], []],
    [[], [], [], []],
    [[], [], [], []],
    [[], [], [], []],
  ];
  reader.onload = async function (e) {
    try {
      var data = new Uint8Array(e.target.result);
      var workbook = await new Promise((resolve, reject) => {
        try {
          resolve(XLSX.read(data, { type: "array" }));
        } catch (error) {
          reject(error);
        }
      });
      var worksheet = workbook.Sheets[workbook.SheetNames[0]];
      var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log(jsonData); // Log jsonData to console
    
      let fullName;
      const workers = [];
      let worker;
  
      for (let i = 1; i < jsonData.length; i++) {
        worker = {
          id: i,
          name: jsonData[i][6],
          shifts: 0,
          isWorkedToday: null,
        };
        workers.push(worker);
  
        fullName = jsonData[i][0];
        for (let j = 7; j < jsonData[i].length; j++) {
          for (let k = 0; k < 4; k++) {
            if (isShiftSubmited(jsonData[i][j], k)) {
              availableShifts[j - 7][k].push(worker);
            }
          }
        }
      }
     
      // Assuming setToShifts() function accepts availableShifts as its parameter
      
    } catch (error) {
      console.error(error);
    }
  };
  
  console.log(availableShifts);
  setToShifts(availableShifts);
  reader.readAsArrayBuffer(file);
}

//Set wokers to final shift.
function setToShifts(availableShifts, workers) {
  console.log(availableShifts)
  let tempAvailableShifts = availableShifts; // Make a copy of availableShifts
  let shifts = [
    [[], [], [], []],
    [[], [], [], []],
    [[], [], [], []],
    [[], [], [], []],
    [[], [], [], []],
    [[], [], [], []],
    [[], [], [], []],
  ];
  let m;
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 4; j++) {
      // console.log("i- " +i + " j " + j)
      // console.log(availableShifts[i][j]);
      
      m = getMinShiftsWorker(availableShifts[i][j])
      console.log(m);
      if(m !== undefined){
      // console.log("Day - "+i+" shift - " +j + " W - " + m.name)
      shifts[i][j] = m;
      m.shifts++;
      removeFromDay(m, availableShifts[i])
    }
    }
  }
  
  return shifts; 
}

//Check if user submited this shift.
function isShiftSubmited(text, index) {
  if (!text) return false;
  switch (index) {
    case 0:
      if (text.includes("Morning")) return true;
      else return false;
    case 1:
      if (text.includes("Middle")) return true;
      else return false;
    case 2:
      if (text.includes("Evening")) return true;
      else return false;
    case 3:
      if (text.includes("Night")) return true;
      else return false;
    default:
      return false;
  }
  
}
function getMinShiftsWorker(workers){
  let m = workers[0]

   for (let i = 1; i < workers.length; i++) {
    if(workers[i].shifts < m.shifts){
     m =workers[i]
    }
   }
   return m;
}

function removeFromDay(worker, day){
  for (let i = 0; i < day.length; i++) {
      day[i] = day.filter(w => w.id !== worker.id);
  }
}
