import "./index.scss";
import React from "react";

import imgLogo from './assets/logo.svg';
import imgBtn1 from './assets/btn1.svg';
import imgBtn2 from './assets/btn2.svg';

const Index = ({ progress, isLogin, handleClick }) => {

  return (
    <div className="h-screen flex items-center justify-center page-loading">
      <div>
        <img
          src={imgLogo}
          onClick={() => {

          }}
        />
      </div>
      <div className="h8"></div>
      <div className="title1">Lucky lottery</div>
      <div className="title2">Fair and Transparent Lottery</div>
      <div className="title3">Good Luck</div>

      <div className="title4">
        <div
          className="bg-blue-500 h-4 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Loading...</h1> */}
        {progress != 100 && <> <div className="w-64 bg-gray-300 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
          <div className="loading">Loading...</div></>
        }

        {progress >= 100 && isLogin && <div className="btn-box">
          <div >
            <img
              src={imgBtn1}
              onClick={() => {
                window.location.href = 'https://dfinity.org/'
              }}
            />
          </div>
          <div >
            <img
              src={imgBtn2}
              onClick={() => {
                handleClick()
              }}
            />
          </div>
        </div>}


        {/* <p className="text-center mt-2">{progress}%</p> */}

        <div className="h28"></div>
        <div className="info-box">
          This is an online lottery website.
          By opening it, you confirm that you are 18 years of age or older, or that you are of legal age in the jurisdiction where you are accessing lottery website.
        </div>
        <div className="h24"></div>

      </div>
    </div>
  );
};

export default Index;
