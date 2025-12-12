import { Progress } from "antd";
import React, { useEffect, useRef, useState } from "react";
// const ws = new WebSocket("ws://" + window.location.host + "/ws/")

import { v4 as uuidv4 } from "uuid";

const currentUser = `USER-${uuidv4()?.split("-")?.[0]}`;

interface History {
  user: string;
  value: string;
}

const cooldownTime = 5;
export default function Child() {
  /* ---------------------------------- utils --------------------------------- */
  /* ---------------------------------- state --------------------------------- */
  const [value, setValue] = useState<string>("");
  const [history, setHistory] = useState<History[]>([]);
  const [cooldown, setCooldown] = useState(0);

  const ws = useRef(null);

  /* -------------------------------- varialbes ------------------------------- */
  const isDisabled = ws?.current?.readyState === 0 || cooldown > 0;

  useEffect(() => {
    // Connect to your WebSocket server URL (ws:// or wss://)
    ws.current = new WebSocket("ws://" + window.location.hostname + '/ws/'); // Or ws://localhost:port

    ws.current.onopen = () => {
      console.log('Connection opened');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setHistory((prevMessages) => [...prevMessages, data]);
    };

    ws.current.onclose = () => {
      console.log('Connection closed');
    };

    // Cleanup function to close the connection when the component unmounts
    return () => {
      ws.current.close();
    };
  }, []);

  /* --------------------------- web socket instance -------------------------- */

  /* -------------------------------- functions ------------------------------- */
  const cooldownFn = () => {
    setCooldown(cooldownTime);

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /* -------------------------------- useEffect ------------------------------- */ 


  return (
    <div>
      <div>{currentUser}</div>
      <input
        className="round-full border p-3 mr-2"
        placeholder="message"
        value={value}
        type="text"
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <button
        className="rounded-full border p-3 w-50"
        style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
        disabled={isDisabled}
        onClick={() => {
          if (!value) return;

          ws?.current?.send(`${JSON.stringify({ user: currentUser, value })}`);
          cooldownFn();

          setValue("");
        }}
      >
        send message
      </button>
      <Progress percent={cooldown * 20} showInfo={false} size="small" />
      <br />
      <br />
      <div
        className="round-full border"
        style={{ minHeight: 200, maxHeight: "500px" }}
      >
        {history?.map((each: History, index) => (
          <div key={index}>{`${each?.user} said ${each?.value}`}</div>
        ))}
      </div>
    </div>
  );
}
