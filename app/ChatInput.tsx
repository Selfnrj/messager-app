"use client";

import { FormEvent, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Message } from "../typings";
import useSWR from "swr";
import fetcher from "../utils/fetchMessages";

function ChatInput() {
  const [input, setInput] = useState("");
  const { data: messages, error, mutate } = useSWR("/api/getMessages", fetcher);

  console.log(messages);

  const addMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input) return;

    const messageToSend = input;

    setInput("");

    const id = uuidv4();

    const message: Message = {
      id,
      message: messageToSend,
      created_at: Date.now(),
      username: 'ambjorn',
      profilePic: 'https://scontent-arn2-1.xx.fbcdn.net/v/t39.30808-6/275938799_10160102867642146_1702076762429506794_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=qQ2YHjcMmfgAX8j68jY&_nc_ht=scontent-arn2-1.xx&oh=00_AfCuLdYyBHLbAbJ2PwIRJvgHR_VnFLzgthSS31SDmlHG0A&oe=639B0EA9',
      email: 'ambjorn89@gmail.com'
    };

    const uploadMessageToUpstash = async () => {
      const data = await fetch("/api/addMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      }).then(res => res.json());

      return [data.message, ...messages!];
    };

    await mutate(uploadMessageToUpstash, {
      optimisticData: [message, ...messages!],
      rollbackOnError: true,
    })
  };

  return (
    <form onSubmit={addMessage} className="fixed bottom-0 z-50 w-full flex px-10 py-5 space-x-2 
    border-t bg-white border-gray-100">
      <input  
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter message here..." 
        className="flex-1 rounded border border-gray-300 focus:outline-none
        focus:ring-2 focus:ring-blue-600 focus:border-transparent px-5 py-3
        disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button 
        type="submit"
        disabled={!input}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold 
        py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </form>
  )
}

export default ChatInput