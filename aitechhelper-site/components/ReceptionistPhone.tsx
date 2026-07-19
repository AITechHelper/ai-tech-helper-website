"use client";

import { useEffect, useRef } from "react";

const PHONE_NUMBER = "+15722204756";
const PHONE_DISPLAY = "+1 572-220-4756";

export default function ReceptionistPhone() {
  const connectedRef = useRef(false);
  const secondsRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const label = document.getElementById("callLabel")!;
    const centerCircle = document.getElementById("centerCircle")!;
    const centerLabel = document.getElementById("centerLabel")!;
    const pulseRings = document.querySelectorAll<HTMLElement>(".pulse-ring");
    const callNumber = document.getElementById("callNumber")!;

    function setPulses(playing: boolean) {
      pulseRings.forEach((r) => (r.style.animationPlayState = playing ? "running" : "paused"));
      if (playing) {
        pulseRings.forEach((r) => (r.style.opacity = ""));
      } else {
        pulseRings.forEach((r) => (r.style.opacity = "0"));
      }
      callNumber.style.animationPlayState = playing ? "running" : "paused";
    }

    function startCall() {
      if (connectedRef.current) return;
      connectedRef.current = true;
      secondsRef.current = 0;
      label.textContent = "00:00";
      centerCircle.classList.remove("answer");
      centerCircle.classList.add("end");
      centerLabel.textContent = "End";
      setPulses(false);
      if (!tickingRef.current) {
        tickingRef.current = true;
        setInterval(() => {
          if (!connectedRef.current) return;
          secondsRef.current++;
          const m = String(Math.floor(secondsRef.current / 60)).padStart(2, "0");
          const s = String(secondsRef.current % 60).padStart(2, "0");
          label.textContent = m + ":" + s;
        }, 1000);
      }
    }

    function endCall() {
      connectedRef.current = false;
      secondsRef.current = 0;
      label.textContent = "Tap to call";
      centerCircle.classList.remove("end");
      centerCircle.classList.add("answer");
      centerLabel.textContent = "Call";
      setPulses(true);
    }

    function toggleCenter() {
      if (connectedRef.current) {
        endCall();
      } else {
        window.location.href = "tel:" + PHONE_NUMBER;
        startCall();
      }
    }

    const callBtnEls = document.querySelectorAll<HTMLElement>('[data-start-call="true"]');
    callBtnEls.forEach((el) => el.addEventListener("click", startCall));
    centerCircle.addEventListener("click", toggleCenter);

    return () => {
      callBtnEls.forEach((el) => el.removeEventListener("click", startCall));
      centerCircle.removeEventListener("click", toggleCenter);
    };
  }, []);

  return (
    <div className="phone-stage">
      <div className="pulse-ring" />
      <div className="pulse-ring r2" />
      <div className="pulse-ring r3" />

      <div className="phone-frame">
        <div className="phone-screen">
          <div className="status-row">
            <span>9:41</span>
            <div className="icons">
              <svg viewBox="0 0 20 12">
                <rect x="0" y="7" width="3" height="5" rx="0.5" />
                <rect x="5" y="5" width="3" height="7" rx="0.5" />
                <rect x="10" y="3" width="3" height="9" rx="0.5" />
                <rect x="15" y="0" width="3" height="12" rx="0.5" />
              </svg>
              <svg viewBox="0 0 20 14">
                <path d="M10 11.5a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8zM6.3 8.2a5.2 5.2 0 0 1 7.4 0l-1.5 1.5a3.1 3.1 0 0 0-4.4 0L6.3 8.2zM3 5a9.4 9.4 0 0 1 14 0L15.5 6.5a7.2 7.2 0 0 0-11 0L3 5z" />
              </svg>
              <svg viewBox="0 0 25 12">
                <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="#fff" fill="none" />
                <rect x="2" y="2" width="18" height="8" rx="1.5" />
                <rect x="22.5" y="4" width="1.8" height="4" rx="0.8" />
              </svg>
            </div>
          </div>
          <div className="notch" />

          <div className="avatar">AI</div>
          <div className="call-label" id="callLabel">
            Tap to call
          </div>
          <div className="call-title">AI Receptionist</div>
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="call-number"
            id="callNumber"
            data-start-call="true"
          >
            {PHONE_DISPLAY}
          </a>

          <div className="wave-circle">
            <div className="bar" />
            <div className="bar" />
            <div className="bar" />
            <div className="bar" />
            <div className="bar" />
            <div className="bar" />
            <div className="bar" />
            <div className="bar" />
          </div>

          <div className="ai-status">
            <div className="a">AI is answering…</div>
            <div className="b">How can I help you today?</div>
          </div>

          <div className="call-actions">
            <div className="action">
              <div className="circle">
                <svg viewBox="0 0 24 24">
                  <path d="M1 1l22 22M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6" />
                  <path d="M17 16.95A7 7 0 0 1 5 12v-2M19 10v2a7 7 0 0 1-.11 1.23" />
                  <path d="M12 19v3" />
                </svg>
              </div>
              <div className="label">Mute</div>
            </div>
            <div className="action">
              <button type="button" className="circle answer" id="centerCircle">
                <svg id="centerIcon" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </button>
              <div className="label" id="centerLabel">
                Call
              </div>
            </div>
            <div className="action">
              <div className="circle">
                <svg viewBox="0 0 24 24">
                  <path d="M11 5 6 9H2v6h4l5 4V5z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              </div>
              <div className="label">Speaker</div>
            </div>
          </div>
          <div className="home-indicator" />
        </div>
      </div>
    </div>
  );
}
