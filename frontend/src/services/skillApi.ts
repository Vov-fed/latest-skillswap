import Cookies from "js-cookie";
import axios from "axios";

export const getSkills = async () => {
    const response = await axios.get("http://localhost:3000/skills/");
    return response.data;
}

export const createSkill = async (data: any) => {
    const token = Cookies.get("token");
    if (!token) {
        throw new Error("No token found");
    }
    const response = await axios.post(
        "http://localhost:3000/skills/",
        data,
        {
            headers: {
                Authorization: token,
            },
        }
    );
    return response.data;
};

export const getAllSkillRequestsFromSomeUser = async (id: string) =>{
    const response = await axios.get(
        `http://localhost:3000/skills/from/${id}`
    );
    return response.data;
}

export const reportSkill = async (skillId: string, reason:string) => {
    const token = Cookies.get("token");
    console.log("Reporting skill with ID:", skillId, "for reason:", reason);
    if (!token) {
        throw new Error("No token found");
    }
    const response = await axios.post(
        `http://localhost:3000/skills//${skillId}/report`,
        {
            reason: reason,
        },
        {
            headers: {
                authorization: token,
            },
        }
    );
    return response.data;
}

export const fetchSkillById = async (skillId: string) => {
    const response = await axios.get(`http://localhost:3000/skills/${skillId}`);
    if (!response.data) {
        throw new Error("Skill not found");
    }
    return response.data;
};

export const deleteSkill = async (skillId: string) => {
    const token = Cookies.get("token");
    if (!token) {
        throw new Error("No token found");
    }
    const response = await axios.delete(
        `http://localhost:3000/skills/${skillId}`,
        {
            headers: {
                Authorization: token,
            },
        }
    );
    return response.data;
}
export const getSkillById = async (skillId: string) => {
    const response = await axios.get(`http://localhost:3000/skills/${skillId}`);
    if (!response.data) {
        throw new Error("Skill not found");
    }
    return response.data;
}

export const updateSkill = async (skillId: string, data: any) => {
    const token = Cookies.get("token");
    if (!token) {
        throw new Error("No token found");
    }
    const response = await axios.put(
        `http://localhost:3000/skills/${skillId}`,
        data,
        {
            headers: {
                Authorization: token,
            },
        }
    );
    return response.data;
}