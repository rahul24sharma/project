import React, { useEffect, useState, useRef } from "react";
import * as PIXI from "pixi.js";
import io from "socket.io-client";
import "@pixi/gif";
import { Assets } from "pixi.js";
import { gsap } from "gsap";
import gifImage from "../gifImage.gif";
import "./Canvas.css"

const socket = io.connect("http://localhost:3005");

function App() {
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    const app = new PIXI.Application({
      width: 900,
      height: 400,
      backgroundColor: 0x0e0e0e,
    });

    appRef.current = app;

    canvasRef.current.appendChild(app.view);
    const xline = new PIXI.Graphics();
    app.stage.addChild(xline);
    xline.lineStyle(1, 0xffffff).moveTo(900, 370).lineTo(24, 370);
    // xline.visible = false;

    const yline = new PIXI.Graphics();
    app.stage.addChild(yline);
    yline.lineStyle(1, 0xffffff).moveTo(25, 370).lineTo(25, 0);
    // yline.visible = false;

    const fun = new PIXI.Graphics();
    fun.beginFill(0xffa500);
    fun.drawRoundedRect(0, 0, 900, 30, 0);
    fun.endFill();
    const mode = new PIXI.Text("FUN MODE", {
      fill: 0xffffff,
      fontSize: 15,
      fontWeight: "bold",
    });
    mode.anchor.set(0.5);
    mode.position.set(fun.width / 2, fun.height / 2);

    fun.addChild(mode);

    app.stage.addChild(fun);
    const loadingText = new PIXI.Text("Loading...", {
      fontFamily: "Arial",
      fontSize: 16,
      fill: 0xffffff,
      align: "center",
    });
    loadingText.x = app.screen.width / 2.17;
    loadingText.y = app.screen.height / 3.4;
    app.stage.addChild(loadingText);
    const rect = new PIXI.Graphics();
    rect.beginFill(0x000000);
    rect.lineStyle(1, 0x00ced1);
    const width = 250;
    const height = 10;
    const rad = 10;
    rect.drawRoundedRect(0, 0, width, height, rad);
    rect.endFill();
    rect.x = app.screen.width / 2 - rect.width / 2;
    rect.y = app.screen.height / 2 - rect.height / 2;
    app.stage.addChild(rect);
    const circle = new PIXI.Graphics();
    circle.beginFill(0x00ced1);
    circle.drawCircle(0, 0, 3);
    circle.endFill();
    circle.x = rect.x + rect.width / 2;
    circle.y = rect.y + rect.height / 2.12;
    app.stage.addChild(circle);
    const loaderContainer = new PIXI.Container();
    loaderContainer.position.set(app.screen.width / 2, app.screen.height / 3.2);
    app.stage.addChild(loaderContainer);
    const loader = new PIXI.Graphics();
    loader.lineStyle(4, 0x00ced1);
    loader.drawRect(-40, -40, 80, 80);
    loaderContainer.addChild(loader);
    // loader.position.set(app.screen.width / 2, app.screen.height / 3.2);

    let direction = 1;
    const speed = 2;

    // Game loop for animation
    app.ticker.add(() => {
      loader.rotation += 0.1;
      circle.x += speed * direction;

      if (circle.x + circle.width / 2 > rect.x + rect.width) {
        circle.x = rect.x + rect.width - circle.width / 2;
        direction = -1;
      } else if (circle.x - circle.width / 2 < rect.x) {
        circle.x = rect.x + circle.width / 2;
        direction = 1;
      }
      socket.emit("update9", circle.x);
      socket.emit("update10", loader.rotation);
    });
    socket.on("message9", (data) => {
      circle.x = data;
    });
    socket.on("message10", (data1) => {
      loader.rotation = data1;
    });
    async function displayTimerText(randomNumber) {
      socket.on("randomNumber", (data) => {
        // console.log("Received random number:", data);
        randomNumber = data;
      });
      let ui = new PIXI.Graphics();

      ui.beginFill(0xffffff);
      for (let i = 0; i < 50000; i++) {
        let x = i * 90 + 42;
        let y = 385;
        let d = 2;
        ui.drawCircle(x, y, d);
        app.stage.addChild(ui);
      }

      let uiy = new PIXI.Graphics();

      uiy.beginFill(0x00ffff);
      for (let i = 50000; i > 1; i--) {
        let x = 10;
        let y = i * 50 - 5850;
        let radius = 2;
        uiy.drawCircle(x, y, radius);
        app.stage.addChild(uiy);
      }
      const displayText = new PIXI.Text("", {
        fontFamily: "Times New Roman",
        fontSize: 50,
        fill: 0x00ced1,
        align: "center",
        stroke: 0xffffff, // Specify the color of the stroke
        strokeThickness: 2.5,
      });
      displayText.position.set(50, 50);

      app.stage.addChild(displayText);

      let value = 1;
      let intervalId;
      let timerValue = 0;

      socket.on("timerValue", (newValue) => {
        // Update the timer value from the server
        timerValue = newValue;
      });

      function startTimer() {
        clearInterval(intervalId2);

        const timerId = setTimeout(() => {
          intervalId = setInterval(() => {
            value += 0.01;
            displayText.text = value.toFixed(2) + "x";
            if (value >= randomNumber) {
              console.log(randomNumber);
              clearInterval(intervalId);
              clearInterval(intervalId2);
              loadingtext.visible = false;
              displayText.visible = false;
              txt2.visible = true;
              txt2.visible = true;
              gsap.to(txt2, {
                alpha: 0,
                delay: 2,
                duration: 0.1,
                onComplete: () => {
                  app.stage.removeChild(txt2);
                },
              });
              gsap.delayedCall(1.5, () => {
                // Remove the image after 3 seconds
                gsap.to(image, { alpha: 1, onComplete: () => {
                  app.stage.removeChild(image);
                }});
              });
              gsap.delayedCall(3, () => {
                resetGame();
              });
            }

            timerValue += 1;
            socket.emit("timerValue", timerValue); // send the updated timer value to the server
          }, 100);
        });

        socket.on("timerValue", (newValue) => {
          value = newValue / 100 + 1;
          displayText.text = value.toFixed(2) + "x";
        });

        return () => {
          clearTimeout(timerId);
          clearInterval(intervalId);
        };
      }

      const cleanup = startTimer();
      let image = await Assets.load(gifImage);
      console.log("Loaded image:", image);
      app.stage.addChild(image);
      image.width = 90;
      image.height = 90;
      image.x = 25;
      image.y = 280;
      let txt2 = new PIXI.Text("PLANE FLEW AWAY", {
        fontFamily: "Times New Roman",
        fontSize: 30,
        fill: 0x00ced1,
        align: "center",
      });
      txt2.anchor.set(0.5);
      app.stage.addChild(txt2);
      txt2.position.set(app.screen.width / 2, app.screen.height / 2);
      txt2.visible = false;
      let xVel = 1.7;
      let angle = 0;
      let amplitude = 85;
      let frequency = 0.007;
      let curve = new PIXI.Graphics();
      curve.lineStyle(2, 0x0e0e0e);
      curve.moveTo(0, 0);
      curve.bezierCurveTo(0, 0, 0, 0, 0, 0);
      app.stage.addChild(curve);

      let area = new PIXI.Graphics();
      area.beginFill(0x0e0e0e);
      area.moveTo(0, 270);
      area.quadraticCurveTo(0, 220, 5, image.y - 55);
      area.lineTo(image.x, 100);
      area.lineTo(0, 220);
      area.lineTo(0, 220);
      area.endFill();
      app.stage.addChild(area);
      function update() {
        image.x += xVel;
        image.y = 195 + Math.cos(angle) * amplitude;
        angle += frequency;
        socket.emit("update3", image.x);
        socket.emit("update4", image.y);
        socket.emit("update5", angle);
        socket.emit("update6", frequency);
        socket.emit("update7", amplitude);
        socket.emit("updatePosition", { x: image.x, y: image.y });

        // socket.emit("update8", xVel);

        if (value < randomNumber) {
          if (image.x < 800) {
            // console.log("true",xVel)
          } else {
            image.x = 800;
          }
          image.y = 195 + Math.cos(angle) * amplitude;
        }
        // else{
        //   // gsap.to([curve, area], { alpha: 0, delay: 0 });
        // }
        else if (value >= randomNumber) {
          // clearInterval(intervalId)
          image.x += 2;
          // image.y += 1;
          // angle += frequency;
          socket.emit("updatePosition", { x: image.x, y: image.y });
          gsap.to([curve, area], { alpha: 0, delay: 0 });
          uiy.y = 0;
          ui.x = 0;
        }
        if (image.x >= 400) {
          uiy.y += 0.7;
          ui.x -= 0.7;
          socket.emit("update11", ui.x);
          socket.emit("update12", uiy.y);
        }
        curve.clear();
        curve.lineStyle(5, 0x00ced1);
        curve.moveTo(25, 369);
        curve.bezierCurveTo(
          50,
          370,
          image.x,
          image.y + 85,
          image.x,
          image.y + 85
        );
        area.clear();
        area.beginFill(0x009092);
        area.moveTo(25, 370);
        area.quadraticCurveTo(50, 370, image.x, image.y + 85);
        area.lineTo(image.x, 370);
        area.lineTo(25, 370);
        area.lineTo(25, 370);
        area.endFill();
      }

      app.ticker.add(update);
      socket.on("imagePosition", (position) => {
        image.x = position.x;
        image.y = position.y;
      });
      socket.on("message3", (data) => {
        image.x = data;
      });
      socket.on("message4", (data) => {
        image.y = data;
      });
      socket.on("message5", (data) => {
        angle = data;
      });
      socket.on("message6", (data) => {
        frequency = data;
      });
      socket.on("message7", (data) => {
        amplitude = data;
      });
      socket.on("message8", (data) => {
        xVel = data;
      });
      socket.on("message11", (data) => {
        ui.x = data;
      });
      socket.on("message12", (data) => {
        uiy.y = data;
      });

      function resetGame() {
        clearInterval(intervalId);
        clearInterval(intervalId2); // Clear the interval for the countdownTimer function
        loadingvalue = 15;
        loadingtext.visible = true;
        app.stage.addChild(area);
        app.stage.addChild(loader);
        app.stage.addChild(loaderContainer);
        loader.position.set(app.screen.width / 2, app.screen.height / 3.2);
        app.stage.addChild(loadingText);
        app.stage.addChild(rect);
        app.stage.addChild(circle);
        countdownTimer();
      }
    }

    const loadingtext = new PIXI.Text("", {
      fontFamily: "Times New Roman",
      fontSize: 45,
      fill: 0xffffff,
      align: "center",
      stroke: 0x00ced1, // Specify the color of the stroke
      strokeThickness: 5,
    });
    loadingtext.position.set(285, 215);

    app.stage.addChild(loadingtext);

    let loadingvalue = 16;
    let intervalId2;
    let timerValue = 0;

    socket.on("load", (newValue) => {
      // Update the timer value from the server
      timerValue = newValue;
    });

    function countdownTimer(intervalId) {
      clearInterval(intervalId);

      // start the timer after 6 seconds
      const timerId2 = setTimeout(() => {
        intervalId2 = setInterval(() => {
          loadingvalue -= 0.1;
          console.log(loadingvalue);

          loadingtext.text = "STARTING IN " + loadingvalue.toFixed(0);
          if (loadingvalue <= 1) {
            loadingtext.visible = false;
            clearInterval(intervalId2);
            clearInterval(intervalId);
            displayTimerText();
            socket.emit("generateRandomNumber");
            app.stage.removeChild(loader);
            app.stage.removeChild(loaderContainer);
            app.stage.removeChild(loadingText);
            app.stage.removeChild(rect);
            app.stage.removeChild(circle);
          }
          if(loadingvalue === 0 || loadingText === -1){
            loadingText.visible = false
          }

          // Update the timer value on the server
          timerValue = loadingvalue * 100 - 100;
          socket.emit("load", timerValue); // send the updated timer value to the server
        }, 1000);
      });

      socket.on("load", (newValue) => {
        loadingvalue = newValue / 100;
        loadingtext.text = "STARTING IN " + loadingvalue.toFixed(0);
      });

      return () => {
        clearTimeout(timerId2);
        clearInterval(intervalId2);
      };
    }

    const cleanup = countdownTimer();

    return () => {
      app.destroy();
    };
  }, []);

  return (
    <div>
      <div ref={canvasRef}></div>
    </div>
  );
}

export default App;
export let randomNumber;
console.log(randomNumber);
socket.on("connect", () => {
  console.log("Connected to server");
  socket.emit("generateHashValue", 10); // Generate a hash value with length 10
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});