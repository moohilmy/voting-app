import React from "react";
const checkID = async () => {};
export default async function layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ voterID: string }>;
}>) {
  return <div>{children}</div>;
}
