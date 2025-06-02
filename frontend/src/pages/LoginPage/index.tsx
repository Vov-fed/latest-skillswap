import { useFormik } from "formik";
import { useState } from "react";
import Cookies from "js-cookie";
import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { FormItems } from "../../components/FormItems";
import { Input } from "../../components/Input";
import { Segment } from "../../components/Segment";
import { signInInputSchema } from "../../services/input";
import { signIn } from "../../services/userApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [submittingError, setSubmittingError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: signInInputSchema,
    onSubmit: async (values) => {
      try {
        setSubmittingError(null);
        const response = await signIn(values);
        const { token } = response;
        Cookies.set("token", token, { expires: 7 });
        console.log(Cookies.get("token"));
        navigate('/profile');
      } catch (err) {
        let errorMessage = "An unknown error occurred";
        if (axios.isAxiosError(err)) {
          errorMessage =
            err.response?.data?.message || err.message || errorMessage;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setSubmittingError(errorMessage);
        setTimeout(() => {
          setSubmittingError(null);
        }, 3000);
      }
    },
  });

  return (
    <Segment title="Sign In" center={true}>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Email" name="email" type="email" formik={formik} />
          <Input label="Password" name="password" type="password" formik={formik} />
          {submittingError && (
            <Alert color="red">{`Error: ${submittingError}`}</Alert>
          )}
          <Button loading={formik.isSubmitting}>Sign In</Button>
        </FormItems>
      </form>
    </Segment>
  );
};
