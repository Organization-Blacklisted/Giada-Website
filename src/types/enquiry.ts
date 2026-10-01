export type EnquiryType =
  | "bespoke-rug-project"
  | "textile-in-glass-project"
  | "designer-architect-partnership"
  | "trade-programme"
  | "showroom-visit"
  | "general-enquiry";

export type EnquiryPayload = {
  firstName: string;
  lastName: string;
  email: string;
  type: EnquiryType;
  message: string;
};
