import styles from "./index.module.scss";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: (e: React.FormEvent) => void;
  sending: boolean;
  fullWidth?: boolean;
};
export const ChatInput: React.FC<Props> = ({ value, onChange, onSend, sending, fullWidth }) => {
  return (
    <form className={`${styles.chatInputContainer} ${fullWidth && styles.fullWidth}`} onSubmit={onSend}>
      <input className={styles.chatInput} value={value} onChange={onChange} placeholder="Type a message…" disabled={sending} autoFocus />
      <button className={styles.chatSendButton} type="submit" disabled={sending || !value.trim()}>
        Send
      </button>
    </form>
  );
}