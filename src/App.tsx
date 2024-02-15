/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const boxRef = useRef<HTMLDivElement>(null);
  const boxWrapperRef = useRef<HTMLDivElement>(null);
  const rightMidRef = useRef<HTMLDivElement>(null);
  const leftMidRef = useRef<HTMLDivElement>(null);
  const topMidRef = useRef<HTMLDivElement>(null);
  const bottomMidRef = useRef<HTMLDivElement>(null);
  const leftTopRef = useRef<HTMLDivElement>(null);
  const rightTopRef = useRef<HTMLDivElement>(null);
  const rightBottomRef = useRef<HTMLDivElement>(null);
  const leftBottomRef = useRef<HTMLDivElement>(null);
  const rotateRef = useRef<HTMLDivElement>(null);
  const span = useRef<HTMLDivElement>(null);

  const [show, setShow] = useState(true);

  const minWidth = 40;
  const minHeight = 40;
  const [globalWidth, setGlobalWidth] = useState(40);
  const [globalHeight, setGlobalHeight] = useState(40);
  const [rotate, setRotate] = useState(0);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  var initX: any,
    initY: any,
    mousePressX: any,
    mousePressY: any,
    initW: any,
    initH: any,
    initRotate: any;

  function repositionElement(x: any, y: any) {
    if (boxWrapperRef.current) {
      boxWrapperRef.current.style.left = x + "px";
      boxWrapperRef.current.style.top = y + "px";
      // setGlobal({ ...global, left: x, top: y });
      setLeft(x);
      setTop(y);
    }
  }

  function resize(w: any, h: any) {
    if (boxRef.current) {
      boxRef.current.style.width = w + "px";
      boxRef.current.style.height = h + "px";
      setGlobalWidth(w);
      setGlobalHeight(h);
    }
  }

  function getCurrentRotation(el: any) {
    var st = window.getComputedStyle(el, null);
    var tm =
      st.getPropertyValue("-webkit-transform") ||
      st.getPropertyValue("-moz-transform") ||
      st.getPropertyValue("-ms-transform") ||
      st.getPropertyValue("-o-transform") ||
      st.getPropertyValue("transform") ||
      "none";

    if (tm !== "none") {
      var values = tm.split("(")[1].split(")")[0].split(",");
      var angle = Math.round(
        Math.atan2(+values[1], +values[0]) * (180 / Math.PI)
      );
      return angle < 0 ? angle + 360 : angle;
    }
    return 0;
  }

  function rotateBox(deg: any) {
    if (boxWrapperRef.current) {
      boxWrapperRef.current.style.transform = `rotate(${deg}deg)`;
      // setGlobal({ ...global, rotate: deg });
      setRotate(deg);
    }
  }

  boxWrapperRef.current?.addEventListener(
    "mousedown",
    function (event: any) {
      if (event.target.className.indexOf("dot") > -1) {
        return;
      }

      initX = this.offsetLeft;
      initY = this.offsetTop;
      mousePressX = event.clientX;
      mousePressY = event.clientY;

      function eventMoveHandler(event: any) {
        repositionElement(
          initX + (event.clientX - mousePressX),
          initY + (event.clientY - mousePressY)
        );
      }

      boxWrapperRef.current?.addEventListener(
        "mousemove",
        eventMoveHandler,
        false
      );
      window.addEventListener(
        "mouseup",
        function eventEndHandler() {
          // setGlobal({...global,rotate: boxWrapperRef.current?.style.rotate!})

          boxWrapperRef.current?.removeEventListener(
            "mousemove",
            eventMoveHandler,
            false
          );
          window.removeEventListener("mouseup", eventEndHandler);
        },
        false
      );
    },
    false
  );

  function resizeHandler(
    event: any,
    left = false,
    top = false,
    xResize = false,
    yResize = false
  ) {
    initX = boxWrapperRef.current?.offsetLeft;
    initY = boxWrapperRef.current?.offsetTop;
    mousePressX = event.clientX;
    mousePressY = event.clientY;

    initW = boxRef.current?.offsetWidth;
    initH = boxRef.current?.offsetHeight;

    initRotate = getCurrentRotation(boxWrapperRef.current);
    var initRadians = (initRotate * Math.PI) / 180;
    var cosFraction = Math.cos(initRadians);
    var sinFraction = Math.sin(initRadians);
    function eventMoveHandler(event: any) {
      var wDiff = event.clientX - mousePressX;
      var hDiff = event.clientY - mousePressY;
      var rotatedWDiff = cosFraction * wDiff + sinFraction * hDiff;
      var rotatedHDiff = cosFraction * hDiff - sinFraction * wDiff;

      var newW = initW,
        newH = initH,
        newX = initX,
        newY = initY;

      if (xResize) {
        if (left) {
          newW = initW - rotatedWDiff;
          if (newW < minWidth) {
            newW = minWidth;
            rotatedWDiff = initW - minWidth;
          }
        } else {
          newW = initW + rotatedWDiff;
          if (newW < minWidth) {
            newW = minWidth;
            rotatedWDiff = minWidth - initW;
          }
        }
        newX += 0.5 * rotatedWDiff * cosFraction;
        newY += 0.5 * rotatedWDiff * sinFraction;
      }

      if (yResize) {
        if (top) {
          newH = initH - rotatedHDiff;
          if (newH < minHeight) {
            newH = minHeight;
            rotatedHDiff = initH - minHeight;
          }
        } else {
          newH = initH + rotatedHDiff;
          if (newH < minHeight) {
            newH = minHeight;
            rotatedHDiff = minHeight - initH;
          }
        }
        newX -= 0.5 * rotatedHDiff * sinFraction;
        newY += 0.5 * rotatedHDiff * cosFraction;
      }

      resize(newW, newH);
      repositionElement(newX, newY);
    }

    window.addEventListener("mousemove", eventMoveHandler, false);
    window.addEventListener(
      "mouseup",
      function eventEndHandler() {
        window.removeEventListener("mousemove", eventMoveHandler, false);
        window.removeEventListener("mouseup", eventEndHandler);
      },
      false
    );
  }

  rightMidRef.current?.addEventListener("mousedown", (e) =>
    resizeHandler(e, false, false, true, false)
  );
  leftMidRef.current?.addEventListener("mousedown", (e) =>
    resizeHandler(e, true, false, true, false)
  );
  topMidRef.current?.addEventListener("mousedown", (e) =>
    resizeHandler(e, false, true, false, true)
  );
  bottomMidRef.current?.addEventListener("mousedown", (e) =>
    resizeHandler(e, false, false, false, true)
  );
  leftTopRef.current?.addEventListener("mousedown", (e) =>
    resizeHandler(e, true, true, true, true)
  );
  rightTopRef.current?.addEventListener("mousedown", (e) =>
    resizeHandler(e, false, true, true, true)
  );
  rightBottomRef.current?.addEventListener("mousedown", (e) =>
    resizeHandler(e, false, false, true, true)
  );
  leftBottomRef.current?.addEventListener("mousedown", (e) =>
    resizeHandler(e, true, false, true, true)
  );

  rotateRef.current?.addEventListener(
    "mousedown",
    function (event: any) {
      // if (event.target.className.indexOf("dot") > -1) {
      //     return;
      // }

      initX = this.offsetLeft;
      initY = this.offsetTop;
      mousePressX = event.clientX;
      mousePressY = event.clientY;

      var arrow = document.querySelector("#box");
      var arrowRects = arrow?.getBoundingClientRect()!;
      var arrowX = arrowRects.left + arrowRects.width / 2;
      var arrowY = arrowRects.top + arrowRects.height / 2;

      function eventMoveHandler(event: any) {
        var angle =
          Math.atan2(event.clientY - arrowY, event.clientX - arrowX) +
          Math.PI / 2;
        rotateBox((angle * 180) / Math.PI);
      }

      window.addEventListener("mousemove", eventMoveHandler, false);

      window.addEventListener(
        "mouseup",
        function eventEndHandler() {
          window.removeEventListener("mousemove", eventMoveHandler, false);
          window.removeEventListener("mouseup", eventEndHandler);
        },
        false
      );
    },
    false
  );

  useEffect(() => {
    resize(300, 200);
    repositionElement(600, 600);
  }, []);

  return (
    <>
      <div>
        <div
          ref={boxWrapperRef}
          className="box-wrapper"
          id="box-wrapper"
          style={{ display: !show ? "none" : "block" }}
          onDoubleClick={() => {
            if (span.current) {
              span.current.style.width = globalWidth + "px";
              span.current.style.minHeight = globalHeight + "px";
              span.current.style.top = top - globalHeight / 2 + "px";
              span.current.style.left = left - globalWidth / 2 + "px";
              span.current.style.transform = `rotate(${rotate}deg)`;
            }
            setShow(false);
          }}
        >
          <div ref={boxRef} className="box" id="box">
            <div ref={rotateRef} className="dot rotate" id="rotate" />
            <div ref={leftTopRef} className="dot left-top" id="left-top" />
            <div
              ref={leftBottomRef}
              className="dot left-bottom"
              id="left-bottom"
            />
            <div ref={topMidRef} className="dot top-mid" id="top-mid" />
            <div
              ref={bottomMidRef}
              className="dot bottom-mid"
              id="bottom-mid"
            />
            <div ref={leftMidRef} className="dot left-mid" id="left-mid" />
            <div ref={rightMidRef} className="dot right-mid" id="right-mid" />
            <div
              ref={rightBottomRef}
              className="dot right-bottom"
              id="right-bottom"
            />
            <div ref={rightTopRef} className="dot right-top" id="right-top" />
            <div className="rotate-link" />

            <div className="word-wrap">{span.current?.innerHTML}</div>
            {/* <div>
              <div>
                <div id="card-div">
                  <span>
                    <strong>Width:</strong> {globalWidth}
                  </span>{" "}
                  <br />
                  <span>
                    <strong>Height:</strong> {globalHeight}
                  </span>{" "}
                  <br />
                  <span>
                    <strong>Rotate:</strong> {rotate}
                  </span>{" "}
                  <br />
                  <span>
                    <strong>Left:</strong> {left - globalWidth / 2}
                  </span>{" "}
                  <br />
                  <span>
                    <strong>Top:</strong> {top - globalHeight / 2}
                  </span>{" "}
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <div
          onDoubleClick={() => {
            debugger;

            let mleft = 0,
              mtop = 0;

            if (boxRef.current && boxWrapperRef.current && span.current) {
              mtop =
                +span.current.offsetHeight / 2 -
                +boxRef.current.style.height.split("px")[0] / 2;
              boxRef.current.style.height = span.current?.offsetHeight + "px";
              boxRef.current.style.width = span.current?.offsetWidth + "px";
              if (mleft !== 0) {
                boxWrapperRef.current.style.left = left + mleft * 2 + "px";
              } else {
                boxWrapperRef.current.style.left = left + "px";
              }

              if (mtop !== 0) {
                boxWrapperRef.current.style.top = top + mtop + "px";
              } else {
                boxWrapperRef.current.style.top = top + "px";
              }

              setGlobalHeight(span.current?.offsetHeight!);
              setTop(top + mtop);
              setShow(true);
            }
          }}
          style={{ display: show ? "none" : "block" }}
          className="card-body"
        >
          <div
            style={{
              position: "absolute",
              // width: globalWidth + "px",
              // minHeight: globalHeight + "px",
              // top: top - globalHeight / 2 + "px",
              // left: left - globalWidth / 2 + "px",
              // transform: `rotate(${rotate}deg)`,
              border: "1px solid black",
            }}
            id="card-div"
            ref={span}
            onClick={() => {
              debugger;
              if (span.current) {
                span.current.style.minHeight = "0px";
              }
            }}
          >
            <span className="textInput word-wrap" contentEditable>
              ain
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
