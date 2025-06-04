import { Link } from "react-router-dom";
import styles from "./index.module.scss";
import { Skill } from "../Skill";
import { deleteSkill } from "../../services/skillApi";
import { useEffect, useState } from "react";
type Props = {
  allSkillRequests: {
  _id: string;
  skillOffered: string;
  skillRequested: string;
  userOffering: { _id: string; name: string; email: string };
  createdAt: string;
}[];
  user: { _id: string; name?: string; email?: string };
  setSelectedSkillId?: (id: string) => void;
  setViewModalOpen?: (open: boolean) => void;
  loading?: boolean;
  title?: string;
  inProfilePage?: boolean;
  isModerator?: boolean;
};

export const SkillRequests: React.FC<Props> = ({ allSkillRequests, setSelectedSkillId, setViewModalOpen, loading = false, title, inProfilePage, user, isModerator }) => {
    const [alert, setAlert] = useState<{color: string; message: string} | null>(null);
    useEffect(() => {
    if (alert) { const timer = setTimeout(()=>{setAlert(null)}, 3000);
        return () => clearTimeout(timer);
        }
    }, [alert]);
    const onDelete = async (skillId: string) => {
        console.log("Deleting skill request with ID:", skillId);
    try {
      const response = await deleteSkill(skillId);
      if (response.status === 200) {
        setAlert({color: "green",message: "Skill request deleted successfully."});
        if (setSelectedSkillId) setSelectedSkillId('');
        if (setViewModalOpen) setViewModalOpen(false);
      }
    } catch (error) {
        console.error("Error deleting skill request:", error);
        setAlert({color: "red", message: "Failed to delete skill request."});
    }
  };
  return (
    <div className={styles.allRequests}>
      <div className={styles.sectionHeader}>
        {title}
        <Link to="/skillCreate" className={styles.addLink}>
          + Create Skill Request
        </Link>
      </div>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : allSkillRequests.length ? (
        <ul className={styles.skillsList}>
          {[...allSkillRequests]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((skill) => (
              <Skill
                onDelete={onDelete}
                isModerator={isModerator}
                key={skill._id}
                skill={skill}
                setSelectedSkillId={setSelectedSkillId as (id: string) => void}
                setViewModalOpen={setViewModalOpen as (open: boolean) => void}
                user={{ _id: user?._id, name: user?.name }}
                inProfilePage={inProfilePage}
              />
            ))}
        </ul>
      ) : (
        <div className={styles.noRequests}>No skill requests yet.</div>
      )}
    </div>
  );
};