import React, { useState, useEffect } from "react";
import "./Controls.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import { gsap } from "gsap";
import Sidetable from "../Sidetable/Sidetable"
import {
  faPlusCircle,
  faMinusCircle,
  faPlusSquare,
  faMinusSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  doc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { auth } from "../../firebase";

const socket = io.connect("http://localhost:3005");

const Controls = (props) => {
  const [amount, setAmount] = useState(10);
  const [amount2, setAmount2] = useState(10);
  const [show, setShow] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [fliped, setFliped] = useState(false);
  const [count, setCount] = useState(1);
  const [count2, setCount2] = useState(1);
  const cash = count.toFixed(2);
  const cash2 = count2.toFixed(2);
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [dataUpdated, setDataUpdated] = useState(false);


  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUsername(user.displayName);
      } else setUsername("");
    });
  }, []);


  let randomNumber;


  function resetgame() {
    gsap.delayedCall(3, () => {
      if (flipped) {
        setFlipped(false);
      }
      if (fliped) {
        setFliped(false);
      }
      countdownTimer();
    });
  }
  

  socket.on("randomNumber", (data) => {
    randomNumber = data;
  });

  let loadingValue = 15;
  let intervalId2;
  let timerValue = 0;

  function countdownTimer() {
    // Start the timer after 6 seconds
    const timerId2 = setTimeout(() => {
      intervalId2 = setInterval(() => {
        loadingValue -= 0.1;
        if (loadingValue <= 1) {
          clearInterval(intervalId2);
          startIncrementTimer1();
          startIncrementTimer2();
        }

        // Update the timer value on the server
        timerValue = loadingValue * 100 - 100;
        socket.emit("load", timerValue); // Send the updated timer value to the server
      }, 1000);
    });

    // Update the client timer with the server's timer value
    socket.on("load", (newValue) => {
      loadingValue = newValue / 100;
    });

    return () => {
      clearTimeout(timerId2);
      clearInterval(intervalId2);
    };
  }

  function startIncrementTimer1() {
    const timer = setInterval(() => {
      setCount((prevCount) => {
        const newCount = prevCount + 0.01;
        if (newCount >= randomNumber) {
          socket.emit("timerValue1", randomNumber); // Emit the timer value to the server
          clearInterval(timer);
          gsap.delayedCall(3, () => {
            setCount(1);
            resetgame();
          });
          return randomNumber;
        } else {
          socket.emit("timerValue1", newCount); // Emit the timer value to the server
          return newCount;
        }
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }
  useEffect(() => {
    socket.on("timerValue1", (value) => {
      setCount(value);
    });

    return () => {
      socket.off("timerValue1"); // Clean up the event listener when the component unmounts
    };
  }, []);

  function startIncrementTimer2() {
    const timer = setInterval(() => {
      setCount2((prevCount) => {
        const newCount2 = prevCount + 0.01;
        if (newCount2 >= randomNumber) {
          socket.emit("timerValue2", randomNumber); // Emit the timer value to the server
          clearInterval(timer);
          gsap.delayedCall(3, () => {
            setCount2(1);
          });

          return randomNumber; // Stop the timer and set the count to 3
        } else {
          socket.emit("timerValue2", newCount2); // Emit the timer value to the server
          return newCount2;
        }
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }
  useEffect(() => {
    socket.on("timerValue2", (value) => {
      setCount2(value);
    });

    return () => {
      socket.off("timerValue1"); // Clean up the event listener when the component unmounts
    };
  }, []);

  socket.on("load", (newValue) => {
    // Update the timer value from the server
    timerValue = newValue;
  });

  useEffect(() => {
    const cleanup = countdownTimer();
    return cleanup;
  }, []);

  const handleClick = () => {
    if ((count <= 1 && flipped) || (count > 1 && !flipped ) || (count >= randomNumber && flipped)) {
      return;
    }

    setFlipped(!flipped);

    if (!flipped) {
      toast(`Bet successful! ${amount}$`);
    } else {
      toast("Cashout successful!");
    }
  };

  const clicked = () => {
    if ((count2 <= 1 && fliped) || (count2 > 1 && !fliped)) {
      return;
    }
    setFliped(!fliped);
    if (!fliped) {
      toast(`Bet successful! ${amount2}$`);
    } else {
      toast("Cashout successful!");
    }
  };

  const handleIncrement = () => {
    setAmount((prevValue) => parseFloat((prevValue + 5).toFixed(2)));
  };

  const handleDecrement = () => {
    if (amount > 1.0) {
      setAmount((prevValue) => parseFloat((prevValue - 5).toFixed(2)));
    }
  };

  const handleIncrement2 = () => {
    setAmount2((prevValue) => parseFloat((prevValue + 5).toFixed(2)));
  };

  const handleDecrement2 = () => {
    if (amount2 > 1.0) {
      setAmount2((prevValue) => parseFloat((prevValue - 5).toFixed(2)));
    }
  };

  const handleValueButton = (value) => {
    setAmount((prevValue) => {
      const currentValue = parseFloat(prevValue);
      const newValue = parseFloat((currentValue + value).toFixed(2));
      return newValue.toString();
    });
  };

  const handleValueButton2 = (value2) => {
    setAmount2((prevValue2) => {
      const currentValue = parseFloat(prevValue2);
      const newValue = parseFloat((currentValue + value2).toFixed(2));
      return newValue.toString();
    });
  };

  const handleChange = (event) => {
    setAmount(event.target.value);
  };

  const handleChange2 = (event) => {
    setAmount2(event.target.value);
  };



  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   const postData = {
  //     username,
  //     amount,
  //     cash,
  //     // randomNumber
  //   };
  
  //   console.log(postData);
  
  //   try {
  //     const postsRef = collection(db, "posts");
    
  //     // Check if postData.id is defined and valid
  //     if (postData.id) {
  //       const q = query(postsRef, where("id", "==", postData.id));
  //       const querySnapshot = await getDocs(q);
    
  //       if (querySnapshot.docs.length > 0) {
  //         const existingData = querySnapshot.docs[0];
  //         await updateDoc(existingData.ref, {
  //           cash,
  //         });
  //         console.log("Data updated successfully");
  //       } else {
  //         await addDoc(postsRef, {
  //           ...postData,
  //           timestamp: serverTimestamp(),
  //         });
  //         console.log("Data saved successfully");
  //       }
  //     } else {
  //       await addDoc(postsRef, {
  //         ...postData,
  //         timestamp: serverTimestamp(),
  //       });
  //       console.log("Data saved successfully");
  //     }
    
  //     // Update the state locally with the new data
  //     if (!dataUpdated) {
  //       setData([...data, { ...postData, timestamp: serverTimestamp() }]);
  //       setDataUpdated(true);
  //     }
  //   } catch (err) {
  //     console.log(err.message);
  //   }
    
  // }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { username, amount, amount2, cash, cash2 };
  
    try {
      const postsRef = collection(db, "posts");
      const q = query(
        postsRef,
        where("username", "==", username)
      );
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.docs.length > 0) {
        const existingData = querySnapshot.docs[0];
        const docRef = doc(db, "posts", existingData.id);
        await updateDoc(docRef, {
          cash,
          // cash2,
          amount,
          amount2
        });
        console.log("Data updated successfully");
      } else {
        await addDoc(postsRef, {
          ...data,
          timestamp: serverTimestamp(),
        });
        console.log("Data saved successfully");
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  
  
  const handleSubmit2 = async (e) => {
    e.preventDefault();
    const postData = {
      username,
      cash2,
      amount2
    };
    console.log(postData);
  
    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.docs.length > 0) {
        const existingData = querySnapshot.docs[0];
        await updateDoc(existingData.ref, {
          cash2,
          amount2
        });
        console.log("Data updated successfully");
      } else {
        await addDoc(postsRef, {
          ...postData,
          timestamp: serverTimestamp(),
        });
        console.log("Data saved successfully");
      }
  
      // Update the state locally with the new data
      if (!dataUpdated) {
        setData([...data, { ...postData, timestamp: serverTimestamp() }]);
        setDataUpdated(true);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  


  
  

  return (
    <>
      <div className="cont">
        <div className="control">
          <div className="toggle-container">
            <div className="slider-container">
              <span className="stake">STAKE SELECTOR</span>
            </div>
            <FontAwesomeIcon
              className={show ? "minus" : "plus"}
              onClick={() => setShow(!show)}
              icon={show ? faMinusSquare : faPlusSquare}
            />
          </div>
          <div className="divide">
            <div className="buttons">
              <div className="wrapper">
                <FontAwesomeIcon
                  onClick={handleDecrement}
                  className="inc"
                  icon={faMinusCircle}
                />

                <div className="multiplier">
                  <input
                    className="number"
                    type="text"
                    value={amount}
                    onChange={handleChange}
                  />
                </div>
                <FontAwesomeIcon
                  onClick={handleIncrement}
                  className="inc"
                  icon={faPlusCircle}
                />
              </div>
              <div className="button-container">
                <div className="button-row">
                  <button
                    onClick={() => handleValueButton(10)}
                    className="dollar"
                  >
                    10$
                  </button>
                  <button
                    onClick={() => handleValueButton(20)}
                    className="dollar"
                  >
                    20$
                  </button>
                </div>

                <div className="button-row">
                  <button
                    onClick={() => handleValueButton(50)}
                    className="dollar"
                  >
                    50$
                  </button>
                  <button
                    onClick={() => handleValueButton(100)}
                    className="dollar"
                  >
                    100$
                  </button>
                </div>
              </div>
            </div>
             <form onClick={handleSubmit}>

            <div className="betx">
              <button
                style={{ borderRadius: "15px" }}
                className={`flip-button ${flipped ? "flipped" : ""}`}
                onClick={handleClick}
              >
                <div style={{ borderRadius: "15px" }} className="flip-front">
                  PLACE A BET
                </div>
                <div className="flip-back">
                  TAKE WINNINGS <br />
                  {cash + "x"}
                </div>
              </button>
            </div>
            <ToastContainer
            // autoClose={1000}
            // position={toast.POSITION.TOP_RIGHT}
            // className="toast"
            />
            </form>
          </div>
        </div>
        {show && (
          <div className="control">
            <div className="toggle-container">
              <div className="slider-container">
                <span className="stake">STAKE SELECTOR</span>
              </div>
            </div>
            <div className="divide">
              <div className="buttons">
                <div className="wrapper">
                  <FontAwesomeIcon
                    onClick={handleDecrement2}
                    className="inc"
                    icon={faMinusCircle}
                  />

                  <div className="multiplier">
                    <input
                      className="number"
                      type="text"
                      value={amount2}
                      onChange={handleChange2}
                    />
                  </div>
                  <FontAwesomeIcon
                    onClick={handleIncrement2}
                    className="inc"
                    icon={faPlusCircle}
                  />
                </div>
                <div className="money">
                  <div className="button-container">
                    <div className="button-row">
                      <button
                        onClick={() => handleValueButton2(10)}
                        className="dollar"
                      >
                        10$
                      </button>
                      <button
                        onClick={() => handleValueButton2(20)}
                        className="dollar"
                      >
                        20$
                      </button>
                    </div>

                    <div className="button-row">
                      <button
                        onClick={() => handleValueButton2(50)}
                        className="dollar"
                      >
                        50$
                      </button>
                      <button
                        onClick={() => handleValueButton2(100)}
                        className="dollar"
                      >
                        100$
                      </button>
                    </div>
                  </div>
                </div>
              </div>
             <form onClick={handleSubmit2}>
              <div className="betx">
                <button
                  style={{ borderRadius: "15px" }}
                  className={`flip-button ${fliped ? "fliped" : ""}`}
                  onClick={clicked}
                >
                  <div className="flip-front">PLACE A BET</div>
                  <div className="flip-back">
                    TAKE WINNINGS <br />
                    {cash2 + "x"}
                  </div>
                </button>
              </div>
              {/* <ToastContainer
                autoClose={1000}
                position={toast.POSITION.TOP_RIGHT}
                className="toast"
              /> */}
              </form>
            </div>
          </div>
        )}
      </div>
      <Sidetable/>
    </>
  );
};

export default Controls;
