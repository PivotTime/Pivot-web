"use client";
import "../styles/guestBook.scss";

export function MessageBox({ to, from, message }) {
  return (
    <div className="MessageBox">
      <p className="toFrom">TO.{to}</p>
      <p className="messageText">{message}</p>
      <p className="toFrom right">FROM.{from}</p>
      <div className="lengthLine left"><div></div></div>
      <div className="lengthLine right"><div></div></div>
      <div className="TransverseLine top"><div></div></div>
      <div className="TransverseLine bottom"><div></div></div>
    </div>
  );
}

export function CommentCard({ nicName, fromName, message, createdAt }) {
  return (
    <MessageBox
      to={nicName}
      from={fromName}
      message={message}
    />
  );
}
