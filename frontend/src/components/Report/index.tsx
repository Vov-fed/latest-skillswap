import React, { useState } from "react";
import styles from "./index.module.scss";
import { Input } from "../Input";
import { Button } from "../Button";
import { reportSkill } from "../../services/skillApi";
import { useFormik } from "formik";

interface ReportProps {
  skillId: string;
  onClose: () => void;
}
const reasons = [
  "Spam",
  "Offensive Content",
  "Scam/Fraud",
  "Incorrect Information",
  "Other"
];

export const Report: React.FC<ReportProps> = ({ skillId, onClose }) => {
  const [message, setMessage] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      reason: "",
      details: ""
    },
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      setSubmitting(true);
      try {
        const reportReason = values.reason === "Other" && values.details.trim() ? `Other: ${values.details.trim()}` : values.reason;
        const response = await reportSkill(skillId, reportReason);
        if (!response) {
          setMessage("Failed to report the skill. Please try again later.");
          setErrors({ reason: "Failed to report the skill. Please try again later." });
          return;
        }
        setMessage("Thank you for reporting! We will review the skill shortly.");
        resetForm();
        setTimeout(() => {
          setMessage("");
          onClose();
        }, 2000);
      } catch (err) {
        console.log("Error reporting skill:", err);
        setMessage("An error occurred while reporting the skill. Please try again later.");
        setErrors({ reason: "An error occurred while reporting the skill. Please try again later." });
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} className={styles.reportForm}>
        <div className={styles.closeButton} onClick={onClose}>X</div>
      <h2 className={styles.reportTitle}>Report this skill</h2>
      <label className={styles.reportLabel}>
        Reason
        <select name="reason" value={formik.values.reason} onChange={formik.handleChange} onBlur={formik.handleBlur} className={styles.reportSelect} >
          <option value="" disabled>
            Select a reason...
          </option>
          {reasons.map(r => (
            <option value={r} key={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      {formik.values.reason === "Other" && (
        <Input name="details" label="Describe what is wrong..." textarea={true} formik={formik} />
      )}
      <Button disabled={ formik.isSubmitting || !formik.values.reason || (formik.values.reason === "Other" && !formik.values.details) } children={formik.isSubmitting ? "Submitting..." : "Submit Report"} color="blue"/>
      {message && (
        <div className={`${styles.reportMessage} ${message.startsWith("Thank") ? styles.success : styles.error}`}>
          {message}
        </div>
      )}
    </form>
  );
};