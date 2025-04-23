export default function BotMessage({ text, boardLink }) {
  if (boardLink) {
    return (
      <div className="message bot">
        {text}
        <a
          href={boardLink}
          target="_blank"
          rel="noopener noreferrer"
          className="board-link"
        >
          Go to board
        </a>
      </div>
    );
  }

  return <div className="message bot">{text}</div>;
};
