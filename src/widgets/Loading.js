import React from 'react'

function Loading() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{margin: 'auto', height: '100vh', display: 'block', shapeRendering: 'auto', animationPlayState: 'running', animationDelay: '0s'}} width="80px" height="80px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
          <circle cx={50} cy={50} fill="none" stroke="#0a0a0a" strokeWidth={8} r={27} strokeDasharray="127.23450247038662 44.411500823462205" style={{animationPlayState: 'running', animationDelay: '0s'}}>
            <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1" style={{animationPlayState: 'running', animationDelay: '0s'}} />
          </circle>
        </svg>
      );
}

export default Loading;
