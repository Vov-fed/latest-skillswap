import { useEffect, useState } from "react";

import styles from "./index.module.scss";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import ViewSkill from "../../components/ViewSkill";
import { SkillRequests } from "../../components/SkillRequests";
import { fetchMainData } from "./functions";

export const LoggedIn = () => {

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const token = Cookies.get("token");
  const decodedToken: any = jwtDecode(token || "");
  const isAdmin = decodedToken.role === "admin" || false;
  const userId = decodedToken.userId;
  const [user, setUser] = useState<any>(null);
  type SkillRequest = {
    _id: string;
    skillOffered: string;
    skillRequested: string;
    userOffering: { _id: string; name: string; email: string; };
    createdAt: string;
  };
  
  const [allSkillRequests, setAllSkillRequests] = useState<SkillRequest[]>([]);
  const [mySkillRequests, setMySkillRequests] = useState<SkillRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      setLoading(true);
      fetchMainData().then((data) => {
    if (data) {
      setUser(data.user);
      setAllSkillRequests(data.allSkillRequests);
      setMySkillRequests(data.mySkillRequests);
    }
    setLoading(false);
  });
}, []);

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.greeting}>
        Hi{user?.name ? `, ${user.name}` : ""}!
      </h1>
      <SkillRequests title="All Skill Requests" allSkillRequests={allSkillRequests} setSelectedSkillId={setSelectedSkillId} setViewModalOpen={setViewModalOpen} loading={loading} user={{ _id: user?._id ?? userId, name: user?.name ?? "" }} isModerator={isAdmin}/>
      <SkillRequests allSkillRequests={mySkillRequests} title="My Skill Requests" setSelectedSkillId={setSelectedSkillId} setViewModalOpen={setViewModalOpen} loading={loading} user={{ _id: user?._id ?? userId, name: user?.name ?? "" }} inProfilePage={true}/>
      {viewModalOpen && selectedSkillId && (
        <ViewSkill skillId={selectedSkillId} isModerator={isAdmin} currentUserId={userId} onClose={() => { setViewModalOpen(false); setSelectedSkillId(null);}}/>
      )}
    </div>
  );
};
