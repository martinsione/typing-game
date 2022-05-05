import { z } from "zod";
import { ApiRequestFunction } from "../enums/api-request-function.enum";
import { QueryOrderDirection } from "../enums/query-order-direction.enum";

export const GAME_QUERY_SCHEMA = z.object({
  request: z.object({
    head: z.object({
      function: z.enum([ApiRequestFunction.GAME_QUERY]),
    }),
    body: z.object({
      limit: z.number().int(),
      orderBy: z.object({
        direction: z.enum([QueryOrderDirection.ASC, QueryOrderDirection.DESC]),
        fieldPath: z.string().nonempty(),
      }),
      lastKey: z.number().int().optional(),
      userId: z.string().nonempty().optional(),
    }),
    signature: z.string().nonempty(),
  }),
});

export type GAME_QUERY_TYPE = z.infer<typeof GAME_QUERY_SCHEMA>;
