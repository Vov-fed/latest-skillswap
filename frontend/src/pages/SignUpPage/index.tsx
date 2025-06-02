import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { signUp } from '../../services/userApi'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { signInInputSchema } from '../../services/input'
import { tokenExistCheck } from '../../services/tokenExistCheck'


export const SignUpPage = () => {
  const [submittingError, setSubmittingError] = useState<string | null>(null)
  const navigate = useNavigate()

    useEffect(() => {
      if (tokenExistCheck()) {
        navigate("/profile");
      }
    }, [navigate]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordAgain: '',
    },
    validate: signInInputSchema,
    onSubmit: async (values) => {
try {
  const response = await signUp(values);
  Cookies.set('token', response.token, { expires: 1 })
  navigate('/addInfo')
} catch (err) {
  let errorMessage = 'An unknown error occurred';
  if (axios.isAxiosError(err)) {
    errorMessage = err.response?.data?.message || err.message || errorMessage;
  } else if (err instanceof Error) {
    errorMessage = err.message;
  }
  setSubmittingError(errorMessage);
  setTimeout(() => {
    setSubmittingError(null)
  }, 3000)
}
    },
  })

  return (
    <Segment title="Sign Up" center={true}>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Name" name="name" formik={formik} />
          <Input label="Email" name="email" type="text" formik={formik} />
          <Input label="Password" name="password" type="password" formik={formik} />
          <Input label="Password again" name="passwordAgain" type="password" formik={formik} />
          {!formik.isValid && !!formik.submitCount && <Alert color="red">Some fields are invalid</Alert>}
          {submittingError && <Alert color="red">{submittingError}</Alert>}
          <Button loading={formik.isSubmitting}>Sign Up</Button>
        </FormItems>
      </form>
    </Segment>
  )
} 