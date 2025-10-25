import { Progress } from "antd";
import React, { useEffect, useRef, useState } from "react";
const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);

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

  /* -------------------------------- varialbes ------------------------------- */
  const isDisabled = ws.readyState === 0 || cooldown > 0;

  /* --------------------------- web socket instance -------------------------- */
  ws.onmessage = (event) => {
    setHistory((prev) => [...prev, JSON.parse(event?.data)]);
  };

  ws.onclose = () => {
    console.log("Disconnected from server");
  };

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
  useEffect(() => {
    ws.onopen = () => {
      console.log("Connected to server");
    };
  }, [ws]) 

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

          ws.send(`${JSON.stringify({ user: currentUser, value })}`);
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
