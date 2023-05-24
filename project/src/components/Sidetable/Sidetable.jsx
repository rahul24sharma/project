import React, { useState, useEffect } from "react";
import "./Sidetable.css";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { auth } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { 
  faUser,
  faCoins,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";
const Sidetable = ({ totalbets }) => {
  const [toggle, setToggle] = useState(false);
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [loggedInCount, setLoggedInCount] = useState(0); // Initialize the count to 0
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUsername(user.displayName);
        setLoggedInCount((count) => count + 1); // Increment the count when a user logs in
      } else {
        setUsername("");
        setLoggedInCount(0); // Decrement the count when a user logs out
      }
    });
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const postsRef = collection(db, "posts");
  //     const querySnapshot = await getDocs(postsRef);
  //     const documents = querySnapshot.docs.map((doc) => {
  //       const data = doc.data();
  //       data.id = doc.id;
  //       return data;
  //     });
  //     setData(documents);
  //   };

  //   fetchData();
  // }, []);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const documents = snapshot.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
      setData(documents);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggleChange = () => {
    setToggle(!toggle);
  };
  return (
    <div className="table">
      <div className="custom-tog">
        <ul className="nav-menu-main">
          <li className="cen">
            <Link to="/signup">Number of players</Link>
            <div className="won">
              <FontAwesomeIcon icon={faUser} />&nbsp;
              {loggedInCount}
            </div>
          </li>
          <li className="cen">
            <Link to="/play">Total bets</Link>
            <div className="won">
              <FontAwesomeIcon icon={faCoins} />&nbsp;
              {totalbets}$
            </div>
          </li>
          <li className="cen">
            <Link to="/results">Total winnings</Link>
            <div className="won">
              <FontAwesomeIcon icon={faSackDollar} />&nbsp;-
            </div>
          </li>
        </ul>
      </div>
      <div className="betting"></div>
      <table className="tab">
        <thead>
          <tr>
            <th>USER</th>
            <th>AMOUNT</th>
            {/* <th>MULTIPLIER</th> */}
            <th>CASH OUT</th>
          </tr>
        </thead>
        <tbody>
          {data
            .slice()
            .reverse()
            .map((row, index) => (
              <tr key={index}>
                <td>{row.username}</td>
                <td>{row.amount}</td>
                {/* <td>{row.point}</td> */}
                <td>{row.cash}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sidetable;
