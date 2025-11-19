"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import "../../../styles/guestBook.scss";
import { Footer } from "../../../components/footer";
import { CommentCard } from "../../../components/guestBookComponents";
import WindowIntroWrapper from "../../../components/loading";
const PAGE_LIMIT = 20;

export default function GuestBook() {
  const [allComment, setAllComment] = useState([[], [], [], []]);
  const [messageText, setMessageText] = useState("");
  const formRef = useRef(null);
  const commentListRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [lastDocId, setLastDocId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  
  const [newCommentIds, setNewCommentIds] = useState(new Set()); // 애니메이션을 위한 ID Set

  const loaderRef = useRef(null);

  const fetchComments = useCallback(
    async (isInitial = false) => {
      try {
        if (isInitial) {
          setLoading(true);
        } else {
          if (loadingMore || !hasMore) return;
          setLoadingMore(true);
        }

        const params = new URLSearchParams();
        params.set("limit", String(PAGE_LIMIT));

        if (!isInitial && lastDocId) {
          params.set("lastDocId", lastDocId);
        }

        const response = await fetch(`/api/comment?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const { comments, lastDocId: newLastDocId, hasMore: newHasMore } = data;

        setError(null);

        // 애니메이션을 위해 새로 불러온 ID들을 등록
        const newIds = new Set(comments.map(c => c.id));
        setNewCommentIds(newIds);
        // 애니메이션 시간 후 ID Set 비우기
        setTimeout(() => setNewCommentIds(new Set()), 800);

        if (isInitial) {
          const newColumns = [[], [], [], []];
          comments.forEach((item) => {
            const shortestColumn = newColumns.reduce(
              (shortest, current) =>
                current.length < shortest.length ? current : shortest,
              newColumns[0]
            );
            shortestColumn.push(item);
          });
          setAllComment(newColumns);
        } else {
          setAllComment((prevColumns) => {
            const newColumns = prevColumns.map(col => [...col]);
            comments.forEach((item) => {
              const shortestColumn = newColumns.reduce(
                (shortest, current) =>
                  current.length < shortest.length ? current : shortest,
                newColumns[0]
              );
              shortestColumn.push(item);
            });
            return newColumns;
          });
        }

        setLastDocId(newLastDocId);
        setHasMore(newHasMore);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("댓글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        if (isInitial) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [lastDocId, hasMore, loadingMore]
  );

  useEffect(() => {
    fetchComments(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasMore) return;
    if (loading || loadingMore) return;

    const target = loaderRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          fetchComments(false);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [fetchComments, hasMore, loading, loadingMore]);

  async function onSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget;
    if (!(form instanceof HTMLFormElement)) return;

    const f = new FormData(form);
    const nicName = f.get("nicName");
    const fromName = f.get("fromName");
    const message = f.get("message");

    if (!nicName || !fromName || !message || String(message).length < 10) {
      alert("모든 필드를 채우고, 메시지는 10자 이상 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(async () => {
      try {
        const response = await fetch("/api/comment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nicName, fromName, message }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const { id } = await response.json();

        const newComment = {
          id,
          nicName,
          fromName,
          message,
          createdAt: new Date().toISOString(),
        };

        // 새 댓글 애니메이션을 위해 ID 등록
        setNewCommentIds(new Set([id]));
        setTimeout(() => setNewCommentIds(new Set()), 800);

        setAllComment((prevColumns) => {
          const newColumns = prevColumns.map((col) => [...col]);
          const visibleColumns = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 4;
          let shortestColumnIndex = 0;
          for (let i = 1; i < visibleColumns; i++) {
            if (newColumns[i].length < newColumns[shortestColumnIndex].length) {
              shortestColumnIndex = i;
            }
          }
          newColumns[shortestColumnIndex].unshift(newComment);
          return newColumns;
        });

        form.reset();
        setMessageText("");

        const y = commentListRef.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: y - 120, behavior: "smooth" });

      } catch (err) {
        console.error("Error adding comment:", err);
        alert(`댓글을 등록하는 중 오류가 발생했습니다: ${err.message}`);
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  }

  const hasNoComments = allComment.every((col) => col.length === 0);

  return (
            <WindowIntroWrapper
            pageName={"메세지"}
            children={
    <>
      <main className="GuestBook">
        <div className="addMassageContainer">
          <p className="title">
            새로운 축으로 나아갈 우리들에게<br />
            따뜻한 응원의 메시지를 남겨주세요.
          </p>
          <form
            className={`messageContainer ${isSubmitting ? "submitting" : ""}`}
            ref={formRef}
            onSubmit={onSubmit}
          >
            <div className="nameInputBox">
              <div>
                TO. <input name="nicName" placeholder="" required maxLength={12}/>
              </div>
              <div className="FROM">
                FROM. <input name="fromName" placeholder="" required maxLength={12}/>
              </div>
            </div>
            <div className="textareaContainer">
              <div className="lengthLine left">
                <div></div>
              </div>
              <div className="lengthLine right">
                <div></div>
              </div>
              <div className="TransverseLine top">
                <div></div>
              </div>
              <div className="TransverseLine bottom">
                <div></div>
              </div>
              <textarea
                spellCheck={false}
                onChange={(e) => setMessageText(e.target.value)}
                className="messageInput"
                name="message"
                placeholder="10자 이상 250자 이하로 메세지를 남겨주세요"
                maxLength={250}
                required
              />
              <p className="maxLength">{`${messageText.length} / 250`}</p>
            </div>
            <button
              type="submit"
              className={`submitBtn ${messageText.length >= 10 ? "on" : "off"}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "SENDING..." : "SEND"}
            </button>
          </form>
        </div>

        <div className="commentList" ref={commentListRef}>

            <>
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
                        isNew={newCommentIds.has(co.id)}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div
                ref={loaderRef}
                className="infiniteScrollLoader"
                style={{ height: "40px" }}
              >
                {loadingMore && <span>더 불러오는 중...</span>}
                {!hasMore && <span>모든 메시지를 다 보았습니다.</span>}
              </div>
            </>
         
        </div>
      </main>
      <Footer />
    </>}/>
  );
}