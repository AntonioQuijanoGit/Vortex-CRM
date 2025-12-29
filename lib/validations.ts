import { z } from "zod";
import { CONTACT_STATUSES, DEAL_STATUSES } from "./constants";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  value: z.number().min(0, "Value must be positive"),
  status: z.enum(["active", "inactive", "lead"]),
  tags: z.array(z.string()),
  notes: z.string().optional(),
});

export const dealSchema = z.object({
  title: z.string().min(1, "Title is required"),
  contactId: z.string().min(1, "Contact is required"),
  value: z.number().min(1, "Value must be positive"),
  status: z.enum(["lead", "contacted", "proposal", "negotiation", "won", "lost"]),
  probability: z.number().min(0).max(100),
  closeDate: z.string().min(1, "Close date is required"),
  reminderDate: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()),
});

export const noteSchema = z.object({
  content: z.string().min(1, "Note content is required"),
  contactId: z.string().optional(),
  dealId: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type DealFormData = z.infer<typeof dealSchema>;
export type NoteFormData = z.infer<typeof noteSchema>;

