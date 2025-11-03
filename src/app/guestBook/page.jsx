"use client";
import { useEffect, useRef, useState } from "react";
import "../../../styles/guestBook.scss";

export function MessageBox ({to, from, message}){
  return(
    <div className="MessageBox">

      <p className="toFrom">TO.{to}</p>
      <p className="messageText">{message}</p>
      <p className="toFrom right">FROM.{from}</p>

      <div className="lengthLine left"> <div></div></div>
      <div className="lengthLine right"> <div></div></div>
      <div className="TransverseLine top"> <div></div></div>
      <div className="TransverseLine bottom"><div></div></div>

    </div>
  )
}

export default function GuestBook() {
  const [allComment, setAllComment] = useState([[], [], [], []]);
  const [messageText, setMessageText] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/comment", { cache: "no-store" });
      const data = await res.json();
      setAllComment(Array.isArray(data) ? data : []);
    })();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();

    // 폼 요소를 먼저 캡처
    const form = e.currentTarget; // or formRef.current
    if (!(form instanceof HTMLFormElement)) return;

    const f = new FormData(form);
    const nicName = f.get("nicName");
    const fromName = f.get("fromName");
    const message = f.get("message");

    await fetch("/api/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nicName, fromName, message }),
    });

    // 이벤트 객체를 다시 참조하지 말고, 캡처해둔 form으로 reset
    form.reset();

    const res = await fetch("/api/comment", { cache: "no-store" });
    const data = await res.json();
    setAllComment(Array.isArray(data) ? data : []);
  }

  return (
    <main className="GuestBook">
      <div className="addMassageContainer">
        <p className="title">새로운 축으로 나아갈 우리들에게<br></br>따뜻한 응원의 메시지를 남겨주세요.</p>
      <form className="messageContainer" ref={formRef} onSubmit={onSubmit}>
        
        <div className="nameInputBox">
        <div>
          TO. <input name="nicName" placeholder="" required />
        </div>
        <div className="FROM">
          FROM.
          <input name="fromName" placeholder="" required />
        </div>
        </div>
        <div className="textareaContainer">
          <div className="lengthLine left"> <div></div></div>
      <div className="lengthLine right"> <div></div></div>
      <div className="TransverseLine top"> <div></div></div>
      <div className="TransverseLine bottom"><div></div></div>
          <textarea
            spellCheck={false}
            onChange={(e) => setMessageText(e.target.value)}
            className="messageInput"
            name="message"
            placeholder="10자 이상 250자 이하로 메세지를 남겨주세요"
            maxLength="250"
            required
          />
          <p>{`${messageText.length} / 250`}</p>
        </div>
        <button type="submit" className={`submitBtn ${messageText.length > 10 ? `on` : `off` }`} >SEND</button>
      </form>
      </div>

      <div className="commentList">
        {allComment.every((col) => col.length === 0) ? (
          <div>아직 댓글이 없어요.</div>
        ) : (
          <div className="columns">
            {allComment.map((column, colIndex) => (
              <div key={colIndex} className="column">
                {column.map((co) => (
                  <CommentCard
                    key={co.id}
                    nicName={co.nicName}
                    fromName={co.fromName}
                    message={co.message}
                    createdAt={co.createdAt}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function CommentCard({ nicName, fromName, message, createdAt }) {
  return (
    <MessageBox
      to={nicName}
      from={fromName}
      message={message}
    />
  );
}
