import { z } from "zod";

export type CreateVoteType = {
    clubHouseID: string;
    telegramID: string;
}
export const createVoteSchema = z.object({
    clubHouseID: z.string().min(5, "Club House ID is required"),
    telegramID: z.string().min(5, "Telegram ID is required"),
});
export type ICreateVoteForm = z.infer<typeof createVoteSchema>;