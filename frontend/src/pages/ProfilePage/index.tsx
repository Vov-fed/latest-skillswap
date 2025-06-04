import { useEffect, useState } from "react";
import { getUser, getUserById, getUserIdByToken } from "../../services/userApi";
import styles from "./index.module.scss";
import { Button } from "../../components/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteSkill,
  getAllSkillRequestsFromSomeUser,
  getSkillsToModerate,
} from "../../services/skillApi";
import Cookies from "js-cookie";

import { Skill } from "../../components/Skill";
import { Alert } from "../../components/Alert";
import { createChat } from "../../services/chatAndMessageApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import ViewSkill from "../../components/ViewSkill";

type Skill = { _id: string; name: string };
type SkillRequest = {
  createdAt: string;
  _id: string;
  skillOffered: string;
  skillRequested: string;
  description?: string;
  userOffering: {
    _id: string;
    name: string;
    email: string;
  };
};
type Profile = {
  profilePicture?: string;
  name?: string;
  location?: string;
  bio?: string;
  email?: string;
  profession?: string;
  headerPicture?: string;
  skillRequestings?: SkillRequest[];
  skills?: Skill[];
  [key: string]: any;
};

export const ProfilePage = () => {
  // State variables
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mySkillRequests, setMySkillRequests] = useState<SkillRequest[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [alert, setAlert] = useState<{ color: "red" | "green" | "blue"; message: string; } | null>(null);
  const [ otherProfile, setOtherProfile ] = useState(false);
  const { otherProfileId } = useParams()
  const [isAdmin, setIsAdmin] = useState(false);
  // Define the type for skills to moderate
  type ModerationSkill = {
    _id: string;
    skillId: Skill & { userOffering?: string };
    reason?: string;
    [key: string]: any;
  };
  const [moderatorSkills, setModeratorSkills] = useState<ModerationSkill[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const handleCreateChat = async (userId: string) => {
    const currentUserId = getUserIdByToken();
    if (!currentUserId) return;
    try {
      const response = await createChat({participants: [userId, currentUserId]});
      console.log("Chat created successfully:", response);
      if (response) {
        navigate(`/chats/${response._id}`);
      } else {
        console.error("Failed to create chat, no chat ID returned.");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      setAlert({ color: "red", message: "Failed to create chat." });
    }
  };
  //functions
const onDelete = async (skillId: string) => {
  try {
    const response = await deleteSkill(skillId);
    if (response.status !== 200) {
      setAlert({ color: "red", message: "Failed to delete skill request." });
      return;
    }
    const userId = getUserIdByToken();
    if (!userId) return;
      // Wait for refetch to finish before setting alert
      const updated = await getAllSkillRequestsFromSomeUser(userId);
      setMySkillRequests(updated || []);
      setAlert({
        color: "green",
        message: "Skill request deleted successfully.",
      });
  } catch (error) {
    console.error("Error deleting skill request:", error);
    setAlert({ color: "red", message: "Failed to delete skill request." });
  }
};
useEffect(() => {
  if (isAdmin) {
    getSkillsToModerate()
      .then((skills) => {
        setModeratorSkills(skills.data || []);
        console.log("Moderator skills:", skills.data);
      })
      .catch(() => setModeratorSkills([]));
  } else {
    setModeratorSkills([]);
  }
}, [isAdmin]);

  useEffect(() => {
    if (otherProfileId) {
      setOtherProfile(true);
      getUserById(otherProfileId)
        .then((userData) => {
          setProfile(userData?.user || userData || null);
          setLoading(false);
        })
        .catch(() => setProfile(null));
    } else {
      getUser()
        .then((userData) => {
          setProfile(userData?.user || userData || null);
          if (userData?.user?.role === "admin") {
            setIsAdmin(true);
          }
          setLoading(false);
        })
        .catch(() => setProfile(null));
    }

    setLoadingSkills(true);
    const userId = getUserIdByToken();
    if (!userId) {
      setLoadingSkills(false);
      return;
    }
    getAllSkillRequestsFromSomeUser(userId)
      .then((skillRequests) => {
        setMySkillRequests(skillRequests || []);
      })
      .catch(() => setMySkillRequests([]))
      .finally(() => setLoadingSkills(false));

  }, [otherProfileId]);
  useEffect(() => {
    const userId = getUserIdByToken();
      if (!userId) return;
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
        window.location.reload();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  if (loading) return <div className={styles.profileContainer}>Loading...</div>;
  if (!profile)
    return (
      <div className={styles.profileContainer}>No profile data found.</div>
    );
  return (
    <section className={styles.profileContainer}>
      {alert && <Alert color={alert.color} children={alert.message} />}
      <div className={styles.coverSection}>
        <div
          className={styles.cover}
          style={profile.headerPicture ? { backgroundImage: `url(${profile.headerPicture})` } : {} }/>
        <div className={styles.avatarInfoRow}>
          <img
            src={profile.profilePicture ||  `https://ui-avatars.com/api/?name=${profile.name || "User"}&background=random&color=fff`}
            alt="User avatar"
            className={styles.avatar}
          />
          <div className={styles.basicInfo}>
            <h1 className={styles.name}>{profile.name ?? "No name"}</h1>
            {profile.profession && (
              <span className={styles.profession}>{profile.profession}</span>
            )}
            <span className={styles.location}>
              {profile.location ?? "Israel"}
            </span>
            {
              otherProfile ? (
                <div className={styles.actions}>
                  <div  className={styles.contactButtons} onClick={() => { if (otherProfileId) handleCreateChat(otherProfileId); }}>
                    <Button color="blue"><FontAwesomeIcon icon={faCommentDots} /></Button>
                  </div>
                  <Link to={`/user/${otherProfileId}/skills`}>
                    <Button color="red">Report...</Button>
                  </Link>
                </div>
              ) :
            <div className={styles.actions}>
              <Link to="/editProfile">
                <Button color="blue">Edit Profile</Button>
              </Link>
              <Link onClick={() => Cookies.remove("token")} to="/login">
                <Button color="red">Logout</Button>
              </Link>
            </div>
            }
          </div>
        </div>
      </div>
      <div className={styles.aboutSection}>
        {profile.bio && (
          <div className={styles.aboutCard}>
            <div className={styles.aboutTitle}>Bio</div>
            <div className={styles.aboutContent}>{profile.bio}</div>
          </div>
        )}
        <div className={styles.aboutCard}>
          <div className={styles.aboutTitle}>Email</div>
          <div className={styles.aboutContent}>
            {profile.email ?? "Not set"}
          </div>
        </div>
        {profile.skills?.length ? (
          <div className={styles.aboutCard + " " + styles.skillsCard}>
            <div className={styles.aboutTitle}>Skills</div>
            <ul className={styles.skillsList}>
              {profile.skills.map((skill) => (
                <li className={styles.skillChip} key={skill._id || skill.name}>
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {(
          mySkillRequests.length > 0 && !isAdmin || loadingSkills && !isAdmin
        ) ? (
          <div className={styles.aboutCard + " " + styles.skillRequests}>
            <div className={styles.aboutTitle}>Skill Requests</div>
            {loadingSkills ? (
              <div>Loading skill requests...</div>
            ) : mySkillRequests.length ? (
              <ul className={styles.skillsList}>
                {[...mySkillRequests]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
          .map((skill) => (
            <Skill
              key={skill._id}
              user={{ _id: profile._id, name: profile.name }}
              inProfilePage={true}
              onDelete={onDelete}
              skill={skill}
              setSelectedSkillId={setSelectedSkillId}
              setViewModalOpen={setViewModalOpen}
            />
          ))}
      </ul>
    ) : (
      <div style={{ color: "#9caec9", padding: "12px 0 0 0" }}>
        You have no skill requests yet.
      </div>
    )}
  </div>
) : moderatorSkills.length > 0 && (
  <div className={styles.skillRequests + " " + styles.aboutCard}>
    <div className={styles.aboutTitle}>Skills to Moderate:</div>
    <ul className={styles.skillsList}>
      {moderatorSkills.map((skill) => (
        <Skill
          key={skill._id}
          user={{ _id: skill.skillId.userOffering ?? ""}}
          reason={skill.reason}
          onDelete={onDelete}
          //@ts-expect-error next line is fine, all info is populated inside of skillId in backend
          skill={skill.skillId}
          setSelectedSkillId={setSelectedSkillId}
          setViewModalOpen={setViewModalOpen}
          isModerator={true}
        />
      ))}
    </ul>
  </div>
)}
      </div>
      {viewModalOpen && (
        <ViewSkill
          skillId={selectedSkillId || ""}
          currentUserId={getUserIdByToken() || ""}
          onClose={() => setViewModalOpen(false)}
          isModerator={isAdmin}
          onDelete={onDelete}
        />
        )}
    </section>
  );
};