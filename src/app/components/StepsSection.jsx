"use client";
import Image from "next/image";
import React from "react";
import styles from "../styling/StepsSection.module.css";
 // replace with your image path
 import Lottie from "lottie-react"
 import prgs from "../../lotti-img/prgs.json"

const StepsSection = () => {
  return (
    <section className={styles.stepsSection}>
      <div className={styles.left}>
        <h2>Just Follow Our Steps and Get Everything</h2>
        <p className={styles.desc}>
          Getting started with these steps to proceed with your booking.
We’ll guide you from choosing your hotel to checking in effortlessly.
        </p>

        <div className={styles.step}>
          <div className={styles.number}>01</div>
          <div>
            <h4>Find a Hotel You Want to Visit</h4>
            <p>
              Visit our website and browse your hotel, you can save and get
              ready to book.
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.number}>02</div>
          <div>
            <h4>Book Your Choice</h4>
            <p>
              Only by making a transaction you have managed to get all the
              facilities.
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.number}>03</div>
          <div>
            <h4>Check-in</h4>
            <p>
              Come to the hotel with proof of payment and get the service.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.imageWrapper}>
          <Lottie className="lott" animationData={prgs} />
          <div className={styles.circle}></div>
          <div className={styles.corner}></div>
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
