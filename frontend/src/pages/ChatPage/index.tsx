import { useParams } from "react-router-dom";
import ChatPanel from "../../components/Chat/ChatPanel";

export const ChatPage = () => {
    const { chatId } = useParams();
    return (
        <div>
            <ChatPanel open={true} fullWidth={true} chatOpened={chatId} />
        </div>
    );
};
export default ChatPage;