import { IncomingMessage, ServerResponse } from "http";
import { verify } from "jsonwebtoken";
import { AuthChecker } from "type-graphql";

import { User } from "./entities/User";

export type ContextType = {
  req: IncomingMessage & {
    headers: {
      authorization?: string;
    };
  };
  res: ServerResponse;
  user: User | null | undefined;
};

export type AuthContextType = ContextType & { user: User };

export async function getUserFromContext(
  context: ContextType,
): Promise<User | null> {
  const authHeader = context.req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return null;
  }

  try {
    const payload = verify(token, process.env.JWT_SECRET_KEY || "") as {
      id: number;
    };

    const user = await User.findOneBy({
      id: payload.id,
    });

    return user;
  } catch {
    console.info("Invalid JWT token ❌");
    return null;
  }
}

export const authChecker: AuthChecker<ContextType> = async (
  { context },
  roles,
) => {
  const user = await getUserFromContext(context);

  if (!user) {
    return false;
  }

  if (roles.length === 0) {
    return true;
  }

  return roles.includes(user.role);
};
