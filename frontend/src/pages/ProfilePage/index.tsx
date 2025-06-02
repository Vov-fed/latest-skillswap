import { useEffect, useState } from "react";
import { getUser, getUserIdByToken } from "../../services/userApi";
import styles from "./index.module.scss";
import { Button } from "../../components/Button";
import { Link } from "react-router-dom";
import {
  deleteSkill,
  getAllSkillRequestsFromSomeUser,
} from "../../services/skillApi";
import Cookies from "js-cookie";
import { Skill } from "../../components/Skill";
import { Alert } from "../../components/Alert";

type Skill = { _id: string; name: string };
type SkillRequest = {
  createdAt: string;
  _id: string;
  skillOffered: string;
  skillRequested: string;
  description?: string;
  userOffering: string;
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

  //functions
const onDelete = async (skillId: string) => {
  try {
    const response = await deleteSkill(skillId);
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
    getUser()
      .then((userData) => {
        setProfile(userData?.user || userData || null);
        setLoading(false);
      })
      .catch(() => setProfile(null));

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
  }, []);
  useEffect(() => {
    const userId = getUserIdByToken();
      if (!userId) return;
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
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
      {/* Cover */}
      <div className={styles.coverSection}>
        <div
          className={styles.cover}
          style={profile.headerPicture ? { backgroundImage: `url(${profile.headerPicture})` } : {} }/>
        <div className={styles.avatarInfoRow}>
          <img
            src={profile.profilePicture || "https://i.pravatar.cc/100?img=3"}
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
            <div className={styles.actions}>
              <Link to="/editProfile">
                <Button color="blue">Edit Profile</Button>
              </Link>
              <Link onClick={() => Cookies.remove("token")} to="/login">
                <Button color="red">Logout</Button>
              </Link>
            </div>
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
          <div className={styles.aboutCard}>
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
            />
          ))}
      </ul>
    ) : (
      <div style={{ color: "#9caec9", padding: "12px 0 0 0" }}>
        You have no skill requests yet.
      </div>
    )}
  </div>
)}
      </div>
    </section>
  );
};