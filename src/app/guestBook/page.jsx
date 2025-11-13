"use client";
import { useEffect, useRef, useState } from "react";
import "../../../styles/guestBook.scss";
import { Footer } from "../../../components/footer";
import { CommentCard } from "../../../components/guestBookComponents";


export default function GuestBook() {
  const [allComment, setAllComment] = useState([[], [], [], []]);
  const [messageText, setMessageText] = useState("");
  const formRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API를 통해 댓글을 가져와 4열로 분배하는 함수
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/comment');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const columns = await response.json(); // API에서 이미 4개 열로 분배된 데이터를 반환
      setAllComment(columns);
      setError(null);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("댓글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!(form instanceof HTMLFormElement)) return;

    const f = new FormData(form);
    const nicName = f.get("nicName");
    const fromName = f.get("fromName");
    const message = f.get("message");

    if (!nicName || !fromName || !message || message.length < 10) {
      alert("모든 필드를 채우고, 메시지는 10자 이상 입력해주세요.");
      return;
    }

    try {
      const response = await fetch('/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nicName, fromName, message }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      form.reset();
      setMessageText("");
      await fetchComments(); // 댓글 목록 다시 불러오기

    } catch (err) {
      console.error("Error adding comment:", err);
      alert(`댓글을 등록하는 중 오류가 발생했습니다: ${err.message}`);
    }
  }

  return (
    <>
      <main className="GuestBook">
        <div className="addMassageContainer">
          <p className="title">새로운 축으로 나아갈 우리들에게<br></br>따뜻한 응원의 메시지를 남겨주세요.</p>
          <form className="messageContainer" ref={formRef} onSubmit={onSubmit}>
            <div className="nameInputBox">
              <div>
                TO. <input name="nicName" placeholder="" required />
              </div>
              <div className="FROM">
                FROM. <input name="fromName" placeholder="" required />
              </div>
            </div>
            <div className="textareaContainer">
              <div className="lengthLine left"><div></div></div>
              <div className="lengthLine right"><div></div></div>
              <div className="TransverseLine top"><div></div></div>
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
            <button type="submit" className={`submitBtn ${messageText.length >= 10 ? 'on' : 'off'}`}>SEND</button>
          </form>
        </div>

        <div className="commentList">
          {loading ? (
            <div>댓글을 불러오는 중...</div>
          ) : error ? (
            <div>{error}</div>
          ) : allComment.every((col) => col.length === 0) ? (
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
      <Footer />
    </>
  );
}
