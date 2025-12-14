import React from "react";
const checkID = async () => {};
export default async function layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ adminID: string }>;
}>) {
  const {adminID} = await params
  console.log(adminID);
  
  return <div>{children}</div>;
}
