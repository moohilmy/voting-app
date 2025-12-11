"use client";
import React from "react";
type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  error?: { message?: string };
};
export default function InputField({ id, label,type, error, placeholder, autoComplete, ...rest }: TextInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className='text-sm font-medium text-green-800'>
        {label}
      </label>
      <input
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        id={id}
        className="w-full rounded-md border bg-white  text-black border-gray-300 p-1 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
        {...rest}
      />
      {error && <span className="text-sm text-red-600">{error.message}</span>}
    </div>
  );
}
