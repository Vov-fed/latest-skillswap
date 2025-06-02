import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { deleteUser, getUser, updateUser } from "../../services/userApi";
import Cookies from "js-cookie";
import styles from "./index.module.scss";
import type { userFields } from "../../services/input";
import { editProfileInputSchema } from "../../services/input";
import { useNavigate, useLocation } from "react-router-dom";

type InputType = "number" | "email" | "password" | "text";
const inputFields: { name: keyof userFields; label: string; type?: InputType; maxWidth?: string; }[] = [
  { name: "name", label: "Name" },  { name: "email", label: "Email", type: "email" }, { name: "bio", label: "Bio" }, { name: "location", label: "Location" }, { name: "profilePicture", label: "Profile Picture URL" }, { name: "headerPicture", label: "Header Picture URL" }, { name: "profession", label: "Profession" }, { name: "currentPassword", label: "Current Password", type: "password" }, { name: "newPassword", label: "New Password", type: "password" }
];

export const EditProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignUp = location.pathname.includes("/addInfo");
  const deleteProfile = async () => {
  try {
    const response = await deleteUser();
    if (response) {
      Cookies.remove("token");
      alert("Profile deleted successfully.");
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Error deleting profile:", error);
  }
  }
  const [skillInput, setSkillInput] = useState("");
  const formik = useFormik<userFields>({
    initialValues: {
      name: "", email: "", bio: "", location: "", profilePicture: "", headerPicture: "", profession: "", skills: [], currentPassword: "", newPassword: ""
    },
    validate: editProfileInputSchema,
    onSubmit: async (values) => {
      try {
        const response = await updateUser(values);
        if (response) {
          navigate("/profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
      }
    }
  });

  useEffect(() => {
    (async () => {
      try {
        const userData = await getUser();
        if (userData?.user) {
          formik.setValues({ ...formik.initialValues, ...userData.user });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (
        trimmedSkill && !formik.values.skills.some((skill) => skill.name === trimmedSkill)
    ) {
      formik.setFieldValue("skills", [
        ...formik.values.skills, { name: trimmedSkill }
      ]);
    }
    setSkillInput("");
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skillId: string) => {
    formik.setFieldValue(
      "skills",
      formik.values.skills.filter((skill) => skill._id !== skillId)
    );
  };
  return (
    <div className={styles.editProfileContainer}>
      <h1>
        {isSignUp ? "Welcome to SkillSwap! let's get started" : "Edit Profile"}
      </h1>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        {inputFields
          .filter(field =>
            isSignUp
              ? field.name !== "currentPassword" && field.name !== "newPassword"
              : true
          )
          .map((field) => (
            <Input
              key={field.name}
              name={field.name}
              label={field.label}
              formik={formik}
              type={field.type || "text"}
              maxWidth="400px"
            />
          ))}
        <div className={styles.skillsSection}>
          <Input formik={formik} name="skillInput" label="Skills (comma-separated)" props={{ onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSkillInput(e.target.value), onKeyDown: handleSkillKeyDown, value: skillInput}}/>
          <div className={styles.skillsContainer}>
            {formik.values.skills.map((skill) => ( <div key={skill._id} className={styles.skillTag}> <span>{skill.name}</span>
              <button type="button" onClick={() => removeSkill(skill._id)} className={styles.removeSkill} aria-label={`Remove skill ${skill.name}`} >×</button></div>))}
          </div>
        </div>
        <div className={styles.profileButtons}>
        <Button children="Delete Profile" color="red" onClick={() => deleteProfile()}/>
        <Button children="Update Profile" loading={formik.isSubmitting} />
        </div>
      </form>
    </div>
  );
};