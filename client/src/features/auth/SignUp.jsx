import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Form from "../../ui/Form";
import {
  CheckBox,
  InputEmail,
  InputFile,
  InputName,
  InputPassword,
} from "../../ui/Inputs";
import FormButton from "../../ui/FormButton";
import { RegisterIcon, SmallLoader } from "../../ui/Vectors";
import FormLink from "../../ui/FormLink";
import { useAuth } from "../../contexts/auth";
import Error from "../../ui/Error";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

const signupSchema = yup.object().shape({
  name: yup
    .string()
    .required("Please provide your full name")
    .min(6, "Your name should contain at least 6 characters")
    .max(30, "Your name must contain a maximum of 30 characters"),
  email: yup
    .string()
    .required("Please provide your email")
    .email("Please provide a valid email"),
  password: yup
    .string()
    .required("Please provide your password")
    .min(8, "Your password must contain at least 8 characters")
    .matches(
      /^(?=.*[a-z])/,
      "Your password must contain one lowercase character",
    )
    .matches(
      /^(?=.*[A-Z])/,
      "Your password must contain one uppercase character",
    )
    .matches(/^(?=.*[0-9])/, "Your password must contain one number character")
    .matches(
      /^(?=.*[!@#\$%\^&\*])/,
      "Your password must contain one special case character",
    ),
  image: yup
    .mixed()
    .test(
      "fileFormat",
      "Unsupported Format",
      (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type)),
    ),

  // passwordConfirm: yup
  //   .string()
  //   .oneOf([yup.ref("password")], "Passwords not match"),
});

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  // const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [agree, setAgree] = useState(false);

  const { register: signup, isLoading, error, dispatch } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(signupSchema) });

  useEffect(() => {
    dispatch({ type: "user/error", payload: "" });
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("username", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("passwordConfirm", data.password);
    formData.append("image", data.image);
    signup(Object.fromEntries(formData));
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {error && <Error message={error} center={true} form={true} />}
      <InputName register={register} error={errors.name} />
      <InputEmail register={register} error={errors.email} />
      <InputPassword
        register={register}
        error={errors.password}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <InputFile
            field={field}
            error={errors.image?.message}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
          />
        )}
      />
      <CheckBox value={agree} setValue={setAgree} className="mb-5">
        <FormLink
          text="I agree with the"
          link="Terms & Conditions"
          to="#"
          center={false}
        />
      </CheckBox>
      <FormButton disabled={isLoading}>
        {isLoading ? (
          <>
            <SmallLoader /> Loading
          </>
        ) : (
          <>
            <RegisterIcon /> Register
          </>
        )}
      </FormButton>
      <FormLink text="Already have an account?" link="Login" to="/login" />
    </Form>
  );
}

export default SignUp;
