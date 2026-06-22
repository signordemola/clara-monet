import { zodResolver as baseZodResolver } from "@hookform/resolvers/zod"
import type { FieldValues, Resolver } from "react-hook-form"

export const zodResolver = <T extends FieldValues>(
  schema: unknown
): Resolver<T> => baseZodResolver(schema as never) as Resolver<T>
