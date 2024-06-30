import { useState } from "react";
import Error from "./Error";
import {
  AccountIcon,
  EmailIcon,
  EyeIcon,
  ImageIcon,
  PasswordIcon,
  SlashEyeIcon
} from "./Vectors";

function Input({
  fieldName,
  type,
  error,
  register,
  children,
  showPassword,
  setShowPassword,
  placeholder,
}) {
  return (
    <div className="mb-4 space-y-1 text-start">
      <div className="flex items-center gap-4 rounded-lg bg-slate-50 px-5 py-4 shadow-sm focus-within:border-2 focus-within:border-primary focus-within:outline-none focus-within:ring-4 focus-within:ring-primary focus-within:ring-opacity-30">
        <label htmlFor={fieldName}>{children}</label>
        <input
          id={fieldName}
          spellCheck="false"
          type={type !== "password" ? type : showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...register(fieldName)}
          className="w-full border-0 bg-transparent font-medium text-slate-600 outline-none placeholder:text-slate-500"
        />
        {type === "password" && (
          <span
            onClick={() => {
              setShowPassword((cur) => !cur);
            }}
          >
            {showPassword ? <SlashEyeIcon /> : <EyeIcon />}
          </span>
        )}
      </div>
      {error && <Error message={error} />}
    </div>
  );
}

export function InputName({ register, error }) {
  return (
    <Input
      fieldName="name"
      type="text"
      register={register}
      error={error?.message}
      placeholder="Name"
    >
      <AccountIcon />
    </Input>
  );
}

export function InputEmail({ register, error }) {
  return (
    <Input
      fieldName="email"
      type="text"
      register={register}
      error={error?.message}
      placeholder="Email"
    >
      <EmailIcon />
    </Input>
  );
}

export function InputPassword({
  register,
  error,
  showPassword,
  setShowPassword,
  confirm = false,
}) {
  return (
    <Input
      fieldName={confirm ? "passwordConfirm" : "password"}
      type="password"
      register={register}
      error={error?.message}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      confirm={confirm}
      placeholder={confirm ? "Confirm password" : "Password"}
    >
      <PasswordIcon />
    </Input>
  );
}

export function CheckBox({ value, setValue, className, children }) {
  return (
    <div className={`flex items-start gap-2 sm:items-center ${className}`}>
      <input
        type="checkbox"
        checked={value}
        onChange={() => setValue((cur) => !cur)}
        className="h-4 w-4 accent-primary focus:border-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-30"
      />
      <span className="-mt-1 sm:mt-1">{children}</span>
    </div>
  );
}

export function InputFile({ field, error, imageUrl, setImageUrl }) {
  const [imageName, setImageName] = useState(null);

  const onImageChange = (e) => {
    field.onChange(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      setImageName(e.target.files[0].name);
      if (e.target.files[0].type.startsWith("image/"))
        setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="mb-4 space-y-1 text-start">
      <div className="space-y-4">
        <div className="flex items-center gap-4 overflow-hidden rounded-lg bg-slate-50 shadow-sm focus-within:border-2 focus-within:border-primary focus-within:outline-none focus-within:ring-4 focus-within:ring-primary focus-within:ring-opacity-30 hover:cursor-pointer">
          <label
            htmlFor="image"
            className=" flex w-full cursor-pointer items-center gap-4 px-6 py-4"
          >
            <ImageIcon />{" "}
            <span className="font-medium">{imageName || "Upload image"}</span>
          </label>
          <input
            id="image"
            type="file"
            name="image"
            onChange={onImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        {imageUrl && !error && (
          <div className="flex justify-center rounded-lg bg-slate-50 p-2 shadow-sm">
            <img
              src={imageUrl}
              alt={imageName}
              className="h-40 w-40 rounded-full object-cover"
            />
          </div>
        )}
      </div>
      {error && <Error message={error} />}
    </div>
  );
}
