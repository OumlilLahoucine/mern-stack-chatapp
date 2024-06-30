import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Form from "../../ui/Form";
import { CheckBox, InputEmail, InputPassword } from "../../ui/Inputs";
import FormButton from "../../ui/FormButton";
import { LoginIcon, LogoIcon, SmallLoader } from "../../ui/Vectors";
import FormLink from "../../ui/FormLink";
import { useAuth } from "../../contexts/auth";
import Error from "../../ui/Error";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Please provide your email")
    .email("Please provide a valid email"),
  password: yup.string().required("Please provide your password"),
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, error, dispatch } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  useEffect(() => {
    dispatch({ type: "user/error", payload: "" });
  }, []);

  const onSubmit = async (data) => {
    login(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {error && <Error message={error} center={true} form={true} />}
      <InputEmail register={register} error={errors.email} />
      <InputPassword
        register={register}
        error={errors.password}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
      <div className="mb-4 flex items-center justify-between">
        <CheckBox rememberMe={rememberMe} setRememberMe={setRememberMe}>
          Remember me
        </CheckBox>
        <FormLink link="Forgot Password?" to="#" />
      </div>
      <FormButton disabled={isLoading}>
        {isLoading ? (
          <>
            <SmallLoader /> Loading
          </>
        ) : (
          <>
            <LoginIcon /> Login
          </>
        )}
      </FormButton>
      <FormLink text="Don't have an account?" link="Register" to="/register" />
    </Form>
  );
}

export default Login;
