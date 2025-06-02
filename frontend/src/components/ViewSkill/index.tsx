import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Button } from "../Button";
import { fetchSkillById } from '../../services/skillApi';
import { getUserById, getUserIdByToken } from "../../services/userApi";
import { Report } from "../Report";
import { createChat } from "../../services/chatAndMessageApi";
import { useNavigate } from "react-router-dom";

interface ViewSkillProps {
  skillId: string;
  currentUserId: string;
  onClose?: () => void;
}

const ViewSkill: React.FC<ViewSkillProps> = ({ skillId, onClose }) => {
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const userId = getUserIdByToken();
  const navigate = useNavigate();
  const loadSkill = async () => {
    setLoading(true);
    const data = await fetchSkillById(skillId);
    setSkill(data);
    try {
        const userOfferingInfo = await getUserById(data.userOffering);
        setSkill((prevSkill: any) => ({
          ...prevSkill,
          userOfferingInfo: {
            name: userOfferingInfo.user.name || userOfferingInfo.user.email || "Unknown",
            email: userOfferingInfo.user.email || "Unknown"
          }
        }));
    } catch (error) {
        console.error("Error fetching user offering info:", error);
        setSkill((prevSkill: any) => ({
          ...prevSkill,
          userOfferingInfo: {
            name: "Unknown",
            email: "Unknown"
          }
        }));
    }
    setLoading(false);

  };

  useEffect(() => {
    loadSkill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillId]);


  if (loading || !skill) return <div>Loading...</div>;

  return (
    <div className={styles.viewSkillContainer}>
      <div className={styles.viewSkillModal}>
        <div className={styles.viewSkill}>
          {onClose && (<button className={styles.modalClose} onClick={onClose}>x</button>)}
          <div>
            <span className={styles.viewSkillTitle}>{skill.skillOffered}</span>
            <span className={styles.viewSkillArrow}>→</span>
            <span className={styles.viewSkillTitle}>{skill.skillRequested}</span>
          </div>
          {skill.description && (
            <div className={styles.viewSkillDesc}>{skill.description}</div>
          )}
          <div className={styles.viewSkillInfo}>
            <div>
              <span className={styles.viewSkillLabel}>Offered by: </span>
              <span className={styles.viewSkillValue}>
                {skill.userOfferingInfo?.name
                  ? skill.userOfferingInfo.name
                  : skill.userOfferingInfo?.email
                  ? skill.userOfferingInfo.email
                  : "Unknown"}
              </span>
            </div>
            <div>
              <span className={styles.viewSkillLabel}>When: </span>
              <span className={styles.viewSkillValue}>
                {(() => {
                  if (!skill.createdAt) return "Unknown date";
                  const date = new Date(skill.createdAt);
                  const day = date.getDate().toString().padStart(2, '0');
                  const month = date.toLocaleString([], { month: 'long' });
                  const year = date.getFullYear();
                  const hour = date.getHours().toString().padStart(2, '0');
                  const minute = date.getMinutes().toString().padStart(2, '0');
                  return `${day} ${month} ${year}, ${hour}:${minute}`;
                })()}
              </span>
            </div>
            <div className={styles.viewSkillActions}>
              <div className={styles.viewSkillButton} onClick={async () => {
                const response = await createChat({participants: [userId, skill.userOffering], isGroup: false,});
                if (response && response._id) {
                  navigate(`/chats/${response._id}`);
                } else {
                  console.error("Failed to create chat");
                }
                }}>
                <Button children={`Contact ${skill.userOfferingInfo?.name}`} color="blue" />
              </div>
                <div className={styles.viewSkillButton} onClick={() => setReportModalOpen(true)}>
                    <Button children="Report..." color="red"/>
                </div>
            </div>
          </div>
        </div>
      </div>
      {reportModalOpen && (
        <div className={styles.reportModal}>
          <Report skillId={skillId} onClose={() => setReportModalOpen(false)}/>
        </div>
      )}
    </div>
  );
};

export default ViewSkill;