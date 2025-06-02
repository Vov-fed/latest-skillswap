import { useFormik } from "formik";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { skillRequestInputSchema } from "../../services/input";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { createSkill, getSkillById, updateSkill } from "../../services/skillApi";
import { useNavigate, useParams } from "react-router-dom";

const inputFields: { name: string; label: string; }[] = [
  { name: "skillOffered", label: "Skill you can offer" },
  { name: "skillRequested", label: "Skill you need to get" },
  { name: "description", label: "Description", },
];

export const AddSkillRequest = () => {
  const [submitStatus, setSubmitStatus] = useState<{ success?: string; error?: string } | null>(null);
  const navigate = useNavigate();
  const { skillId } = useParams<{ skillId: string }>();
  const formik = useFormik({
    initialValues: {
      skillOffered: "",
      skillRequested: "",
      description: "",
    },
    validate: skillRequestInputSchema,
    onSubmit: async (values) => {
      setSubmitStatus(null);
      try {
        const response = skillId ? await updateSkill(skillId, values) : await createSkill(values);
        if (response) {
          navigate("/profile");
        }
      } catch (error: any) {
        setSubmitStatus({ error: error?.message || "Failed to create skill request." });
      }
    },
  });
  useEffect(() => {
    if (skillId) {
      const fetchSkill = async () => {
        try {
          const skill = await getSkillById(skillId);
          formik.setValues({
            skillOffered: skill.skillOffered,
            skillRequested: skill.skillRequested,
            description: skill.description,
          });
        } catch (e) {
            console.error("Error fetching skill:", e);
            navigate("/skillCreate");
            return;
        }
      };
      fetchSkill();
    }
  }, [skillId]);

  return (
    <div className={styles.container}>
      {
        skillId ? <h2 className={styles.title}>Edit Skill Swap Request</h2> : <h2 className={styles.title}>Create a Skill Swap Request</h2>
      }
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        {inputFields.map((field) => (
          <Input
            key={field.name}
            name={field.name}
            label={field.label}
            formik={formik}
            textarea={field.name === "description"}
            props={{
              rows: field.name === "description" ? 4 : undefined,
              placeholder: field.name === "skillOffered" ? "e.g. Web Development" : field.name === "skillRequested" ? "e.g. Graphic Design" : field.name === "description"}}
          />
        ))}
        <Button children={formik.isSubmitting ? "Submitting..." : "Create Request"} loading={formik.isSubmitting} />
        {submitStatus?.success && <div className={styles.success}>{submitStatus.success}</div>}
        {submitStatus?.error && <div className={styles.error}>{submitStatus.error}</div>}
      </form>
    </div>
  );
};