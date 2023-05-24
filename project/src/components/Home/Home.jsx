import React from "react";
import Navbar from "../Navbar/Navbar";
import poster from "../poster.jpeg";
import aviator from "../aviator.png";
import av from '../av.jpeg'

import "./Home.css";
const Home = () => {
  return (
    <div>
      <Navbar />
      <img className="poster" src={av} alt="Image" />
      <div className="inf">
        <h3>What is Aviator Game?</h3>
        <p className="det">
          The Aviator is a popular money entertainment produced by Spribe on
          numerous well-known websites. You may win big money with a coefficient
          of up to x100. In the game, players get the most enjoyment and have
          the opportunity to make a lot of money in little time. In the game,
          Aviator players can be risky pilots who must reach maximum altitude in
          order to achieve a successful win. The coefficient is multiplied by
          the amount invested to determine how much money is earned. To withdraw
          your funds, you must quit the flight in time.
        </p>
        <img className="aviator" src={aviator} alt="" />
        <h3>How to play aviator?</h3>
        <p className="det">
          To play the game Aviator, you need to register at the casino.
          Different casinos host Aviator games. Find a casino you can trust and
          create an account with it. Once registered, make your first deposit
          and get ready to get active in the Aviator game. Playing Aviator for
          money is very easy once you are in the casino. Choose the amount
          you’re willing to bet, place a bet or multiple bets if you like, and
          watch the events unfold in the Aviator game. When the plane reaches a
          level you are happy with, cash in your winnings. If you wait too long
          you could lose your deposit and your profits. Some Aviator casinos
          also allow you to play for free before betting for real money. If you
          are new to the Aviator game, you can try playing in demo mode before
          moving on to playing for real money.
        </p>
      </div>
    </div>
  );
};

export default Home;
