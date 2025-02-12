// made by 2ky(@s2skky)
// https://raw.githubusercontent.com/cyperdark/osu-counters/master/quickstart/js/socket.js

// no touch
let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
socket.onopen = () => console.log("Successfully Connected");
socket.onclose = event => {
  console.log("Socket Closed Connection: ", event);
  socket.send("Client Closed!");
};
socket.onerror = error => console.log("Socket Error: ", error);


let hitcountBox = document.getElementById("hitcount_box");
//let pp = document.getElementById("pp");
//let ur = document.getElementById("ur");
//let ratio = document.getElementById("ratio");

let marv = document.getElementById("ma");
let perfect = document.getElementById("pa");
let sr = document.getElementById("sr");
let bpm = document.getElementById("bpm");

let h300g = document.getElementById("h300g");
let h300 = document.getElementById("h300");
let h200 = document.getElementById("h200");
let h100 = document.getElementById("h100");
let h50 = document.getElementById("h50");
let miss = document.getElementById("miss");
let totalHit = document.getElementById("totalHit");


let curBPMMin = 0;
let curBPMMax = 0;
let curBPMCommon = 0;
let curH320;
let curH300;
let curH200;
let curH100;
let curH50;
let curH0;
//let curUR;
let curTotalNote = 0;
let curScore = 0;
//let curPP;
let curSR = 0.00;

let state;


function display_section(){   
    hitcountBox.style.opacity = 1;
}

socket.onmessage = event => {
    try {
        let data = JSON.parse(event.data);
        let menu = data.menu;
        let play = data.gameplay;


        if (state !== menu.state) {
            state = menu.state;

            if (state === 2) {
                setTimeout(display_section, 1000);
            } else {
                if (curTotalNote !== 0) {
                    curTotalNote = 0;
                }

                hitcountBox.style.opacity = 0;
                return;
            }

        }

        // not mania
        if (menu.gameMode !== 3) return;

        /* we will comment out the code here to prevent memory leak; uncomment this part if you wish to display ratio
         if (curPP !== play.pp.current){
         curPP = play.pp.current;
         pp.innerHTML = curPP + 'pp';
         }
         if (curUR !== play.hits.unstableRate){
         curUR = play.hits.unstableRate;
         ur.innerHTML = 'UR: ' + curUR.toFixed(2);
         }
         */

        if (curBPMMin !== menu.bm.stats.BPM.min) {
            curBPMMin = menu.bm.stats.BPM.min;
        }

        if (curBPMMax !== menu.bm.stats.BPM.max) {
            curBPMMax = menu.bm.stats.BPM.max;
        }

        if (state === 2 && curBPMMin !== 0 && curBPMMax !== 0) {
            /* uncomment this if you want static bpm instead and comment out the line below
            if (curBPMMin === curBPMMax) {
                bpm.innerHTML = "BPM: " + menu.bm.stats.BPM.common;
            } else {
                bpm.innerHTML = `BPM: ${curBPMMin}-${curBPMMax} (${menu.bm.stats.BPM.common})`;
            }
             */
            bpm.innerHTML = "BPM: " + menu.bm.stats.BPM.realtime;
        }

        if (curSR !== menu.bm.stats.SR) {
            curSR = menu.bm.stats.SR;
            sr.innerHTML = "SR: " + curSR + "*";
        } else if (curSR === 0) {
            sr.innerHTML = "SR: " + curSR + "*";
        }

        if (play.hits.geki - play.hits[300] !== 0) {
            const marvRatio = play.hits.geki / play.hits[300];
            const marvPercent = ((play.hits.geki - play.hits[300]) / play.hits.geki) * 100;

            marv.innerHTML = 'MA: ' + marvRatio.toFixed(2) + " (" + marvPercent.toFixed(2) + "%)";
        } else {
            marv.innerHTML = 'MA: Infinity';
        }

        if (play.hits.geki + play.hits[300] > 0) {
            const perfRatio = (play.hits.geki + play.hits[300]) / (play.hits.katu + play.hits[100] + play.hits[50] + play.hits[0]);

            perfect.innerHTML= "PA: " + perfRatio.toFixed(2);
        } else {
            perfect.innerHTML= "PA: Infinity";
        }

        if (curH320 !== play.hits.geki) {
            curH320 = play.hits.geki;
            h300g.innerHTML = '320: ' + curH320;
        }

        if (curH300 !== play.hits[300]) {
            curH300 = play.hits[300];
            h300.innerHTML = '300: ' + curH300;
        }

        if (curH200 !== play.hits.katu) {
            curH200 = play.hits.katu;
            h200.innerHTML = '200: ' + curH200;
        }

        if (curH100 !== play.hits[100]) {
            curH100 = play.hits[100];
            h100.innerHTML = '100: ' + curH100;
        }

        if (curH50 !== play.hits[50]) {
            curH50 = play.hits[50];
            h50.innerHTML = '050: ' + curH50;
        }

        if (curH0 !== play.hits[0]) {
            curH0 = play.hits[0];
            miss.innerHTML = '000: ' + curH0;
        }

        if (curTotalNote === 0) {
            totalHit.innerHTML = "Total Hit: " + curTotalNote;
        }

        if (curTotalNote !== play.hits.geki + play.hits[300] + play.hits.katu + play.hits[100] + play.hits[50] + play.hits[0]) {
            curTotalNote = play.hits.geki + play.hits[300] + play.hits.katu + play.hits[100] + play.hits[50] + play.hits[0];
            totalHit.innerHTML = "Total Hit: " + curTotalNote;
        }

        if(curScore !== play.score){
            curScore = play.score;
        }

  } catch (err) { console.log(err); }
};