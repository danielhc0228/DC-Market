"use server";

import { z } from "zod";
import validator from "validator";

const phoneSchema = z.string().trim().refine(validator.isMobilePhone);

const tokenSchema = z.coerce.number().min(100000).max(999999); // token is string initially but 'coerce' forces type conversion to number.

export async function smsLogIn(prevState: unknown, formData: FormData) {}
