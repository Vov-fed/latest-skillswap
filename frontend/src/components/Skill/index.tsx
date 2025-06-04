import { Button } from "../Button";
import styles from "./index.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";


type Props = {
  skill: {
    _id: string;
    skillOffered: string;
    skillRequested: string;
    userOffering: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt?: string;
};
    user: { _id: string; name?: string; email?: string };
    setSelectedSkillId: (id: string) => void;
    setViewModalOpen: (open: boolean) => void;
    inProfilePage?: boolean;
    onDelete?: (skillId: string) => void;
    isModerator?: boolean;
    reason?: string;
};

export const Skill: React.FC<Props> = ({
  skill,
  user,
  setSelectedSkillId,
  setViewModalOpen,
  inProfilePage,
  onDelete = () => { console.warn("onDelete function not provided"); },
  isModerator = false,
  reason,
}) => {
    const navigate = useNavigate();
  return (
    <>
    <li className={styles.skillChip} key={skill._id}>
    {
        inProfilePage || isModerator && (
            <div className={styles.chipActions}>
            <div className={styles.deleteBlock} onClick={() => {onDelete(skill._id);}}>
                <FontAwesomeIcon icon={faTrash} />
            </div>
            {!isModerator && (
            <div className={styles.editBlock} onClick={() => {
                navigate(`/skillEdit/${skill._id}`);
            }}>
                <FontAwesomeIcon icon={faPen} />
            </div>
            )}
            </div>
        )
    }
      <span className={styles.skillOffered}>{skill.skillOffered}</span>
      <span className={styles.arrowIcon}>→</span>
      <span className={styles.skillRequested}>{skill.skillRequested}</span>
      <span className={styles.skillUser + " " + (reason ? styles.red : "")}>
        {skill.userOffering.name ||
          skill.userOffering.email ||
          reason ||
          "Unknown"}
      </span>
      {skill.createdAt && (
        <div className={styles.skillDate}>
          {(() => {
            const date = new Date(skill.createdAt);
            const day = date.getDate().toString().padStart(2, "0");
            const month = date.toLocaleString([], { month: "long" });
            const year = date.getFullYear();
            const hour = date.getHours().toString().padStart(2, "0");
            const minute = date.getMinutes().toString().padStart(2, "0");
            return `${day} ${month} ${year}, ${hour}:${minute}`;
          })()}
        </div>
      )}
      {inProfilePage ? null : user?._id === skill.userOffering._id ? (
        <div className={styles.mineTag}>Yours</div>
      ) : (
        <div
          className={styles.viewTag}
          onClick={() => {
            setSelectedSkillId(skill._id);
            setViewModalOpen(true);
          }}>
          <Button children="View" color="blue" />
        </div>
      )}
    </li>
    </>
  );
};