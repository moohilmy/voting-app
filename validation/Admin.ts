import z from "zod";

export const AdminSchema = z.object({
  userName: z.string().min(3, "user name is short"),
  pass: z.string().min(3, "short is short"),
});

export type IAdminForm = z.infer<typeof AdminSchema>;
