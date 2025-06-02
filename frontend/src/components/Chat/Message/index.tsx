import styles from "./index.module.scss";

type Props = {
    msg: {
        _id: string;
        text: string;
        sender: string | { _id: string; name: string; profilePicture: string };
        reactions: { emoji: string; users: { _id: string; name: string; profilePicture: string }[] }[];
        createdAt: string;
    }
    userId: string;
    onReact: (msgId: string, emoji: string) => void;
    animatedReaction?: { messageId: string; emoji: string } | null;
};
export const Message: React.FC<Props> = ({ msg, userId, onReact, animatedReaction }) => {
    return (
            <div className={`${styles.messageBubble} ${msg.sender === userId || (typeof msg.sender === "object" && msg.sender._id === userId) ? styles.mine : ""}`}>
              <span>{msg.text}</span>
              <div className={styles.messageMeta}>
                { msg.reactions.length > 0 &&
                <div className={styles.reactionList}>
                  {msg.reactions.map(reaction => {
                          const mine = reaction.users.map((u: any) => u._id).includes(userId);
                          const isAnimated = animatedReaction?.messageId === msg._id && animatedReaction.emoji === reaction.emoji;
                          return (
                            <span
                              id={`reaction-${msg._id}-${reaction.emoji}`}
                              key={`${reaction.emoji}-${isAnimated ? "anim" : "static"}`}
                              onClick={() => { onReact(msg._id, reaction.emoji); }}
                              title={mine ? "Remove your reaction" : "React"}
                              className={`${styles.reactionItem} ${mine ? styles.mine : ""} ${isAnimated ? styles.animated : ""}`}>
                                {reaction.emoji}
                              <div className={styles.reactionAvatars}>
                              {reaction.users.length < 3 ?
                                reaction.users.map((user: any) => {
                                  return (
                                    <img key={`img-${user._id}`} src={user.profilePicture
                                      ? user.profilePicture
                                      : "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1200px-User_icon_2.svg.png"
                                    } alt={user.name} className={styles.emojiAvatar}/>
                                  );
                                }
                              ) : null}
                              </div>
                            </span>
                          );
                        })}
                </div>
                }
                <span className={styles.timestamp}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" })}
                </span>
                </div>
            </div>
    );
    }