import z from "zod";

export const VoterScanSchema = z.object({
  voterID: z.string().length(8, "Voter ID must be exactly 8 characters"),
});

export type IVoteScanForm = z.infer<typeof VoterScanSchema>;
