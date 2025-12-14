"use client";

import { AdminSchema, IAdminForm } from "@/validation/Admin";
import InputField from "../../InputField/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function AdminLogin() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAdminForm>({
    resolver: zodResolver(AdminSchema),
    mode: "onBlur",
  });
  const onSubmit: SubmitHandler<IAdminForm> = async (data) => {
    if (!data.userName || !data.pass) return;

    setIsSubmitting(true);
    setIsError(null);
    try {
      const response = await fetch("/api/admin/login", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setIsError(result.message || "An unknown error occurred");

        setIsSubmitting(false);
        return;
      }
      const { admin } = result;
      router.push(`/admin/${admin._id}`);
      setIsSubmitting(false);
    } catch (error) {
      setIsError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 p-6 bg-white rounded-lg shadow-md">
      {isError && <div className="text-2xl text-red-500 mb-4">{isError}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          id="username"
          {...register("userName")}
          label="user name"
          type="text"
          error={errors.userName}
          placeholder="Enter user name"
        />
        <InputField
          id="pass"
          {...register("pass")}
          label="pass"
          error={errors.pass}
          type="text"
          placeholder="Enter pass"
        />
        <button
          type="submit"
          className="mt-6 w-full cursor-pointer rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2  disabled:bg-green-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "login"}
        </button>
      </form>
    </div>
  );
}
