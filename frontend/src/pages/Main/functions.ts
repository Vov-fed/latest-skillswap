import { getUser, getUserIdByToken } from "../../services/userApi";
import {
  getAllSkillRequestsFromSomeUser,
  getSkills,
} from "../../services/skillApi";
export async function fetchMainData() {
    const userId = getUserIdByToken();
    if (!userId) {
      return;
    }
    try {
      const userData = await getUser();
      const userObj = userData?.user || userData || null;
      const user = {
        _id: userObj?._id || userId,
        name: userObj?.name || "",
        email: userObj?.email || "",
        profilePicture: userObj?.profilePicture || "",
      };
      const [allSkills, mySkills] = await Promise.all([
        getSkills(),
        getAllSkillRequestsFromSomeUser(userId),
      ]);
      const allSkillRequests = allSkills
      const mySkillRequests = mySkills
      return {
        user,
        allSkillRequests,
        mySkillRequests,
      }; 
    } catch {
        console.error("Error fetching main data");
    } finally {
        // You can handle any final state updates here if needed
    }
  }