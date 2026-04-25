import { z } from "zod";

export const roomDetailsSchema = z.object({
  roomType: z.enum(["Office", "Conference Room", "Home Studio", "Other"]),
  length: z.coerce.number().positive("Length must be greater than 0"),
  width: z.coerce.number().positive("Width must be greater than 0"),
  height: z.coerce.number().positive("Height must be greater than 0"),
  ceilingType: z.enum(["Hard Ceiling", "Acoustic Tile", "Open Ceiling"]),
  floorType: z.enum(["Hard Floor", "Carpet", "Mixed"]),
  windows: z.enum(["None", "Small", "Large"])
});

export const leadCaptureSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  projectName: z.string().optional(),
  additionalNotes: z.string().max(1000, "Notes must be 1000 characters or fewer").optional(),
  marketingConsent: z.boolean()
});

export const productSelectionSchema = z.object({
  selectedProductIds: z.array(z.string()).min(1, "Select at least one product")
});

export type RoomDetailsFormValues = z.infer<typeof roomDetailsSchema>;
export type LeadCaptureFormValues = z.infer<typeof leadCaptureSchema>;
