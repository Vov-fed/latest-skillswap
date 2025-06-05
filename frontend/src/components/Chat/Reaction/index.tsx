import type React from "react";
import styles from "./index.module.scss";

const emojiOptions = ["👍", "😂", "🎉", "❤️", "😮", "😢", "🔥"];
const moreEmojiOptions = ["😎", "🤔", "😡", "🥳", "🤗", "💔", "😱", "🤩", "🙌", "💪"];
type Props = {
    msg: {
        _id: string;
        reactions: { emoji: string; users: { _id: string; name: string; profilePicture: string }[] }[];
        sender: string | { _id: string; name: string; profilePicture: string };
        createdAt: string;
        text: string;
    };
    userId: string;
    onReact: (msgId: string, emoji: string) => void;
    activeMsgId: string | null;
    setActiveMsgId: (msgId: string | null) => void;
    animatedReaction?: { messageId: string; emoji: string } | null;
    reactionMap: { [emoji: string]: { users: { _id: string; name: string; profilePicture: string }[] }[] };
    fullWidth?: boolean;
    mine?: boolean;
    pickerClose?: (msgId: string | null) => void;
};

export const ReactionPicker: React.FC<Props> = ({userId, onReact, activeMsgId, setActiveMsgId, msg, reactionMap, fullWidth, mine, pickerClose}) => {
    const handleEmojiClick = (msgId: string, emoji: string) => {
    onReact(msgId, emoji);
    };
    return <div className={`${styles.reactionsRow} ${fullWidth ? styles.fullWidth : ""} ${mine ? styles.mine : ""}`} data-reaction-picker>
        {emojiOptions.map((emoji) => {
            const users = reactionMap[emoji] || [];
            const userReacted = users.some((r) => r.users.some((u) => u._id === userId));
            return (
                <span key={emoji} className={`${styles.emojiBtn} ${userReacted ? styles.activeEmoji : ""}`} onClick={() => { handleEmojiClick(msg._id, emoji); if (pickerClose) pickerClose(msg._id); }}>
                    {emoji}
                </span>
            );
        })}
        <span className={styles.moreEmojiBtn} onClick={() => setActiveMsgId(msg._id)}>+</span>
        {activeMsgId === msg._id && (
            <div className={styles.emojiPickerPopup}>
                {moreEmojiOptions.map((emoji) => (
                    <span key={emoji} className={styles.emojiPickerItem} onClick={() => { onReact(msg._id, emoji); setActiveMsgId(null); } }>
                        {emoji}
                    </span>
                ))}
            </div>
        )}
    </div>;
}