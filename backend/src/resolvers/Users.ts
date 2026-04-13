import argon2 from "argon2";
import { validate } from "class-validator";
import Cookies from "cookies";
import { sign } from "jsonwebtoken";
import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

import { ContextType, getUserFromContext } from "../auth";
import { User, UserCreateInput } from "../entities/User";
import { AuthPayload } from "../types/AuthPayload";

@Resolver()
export class UsersResolver {
  @Authorized("owner")
  @Query(() => [User])
  async users(): Promise<User[] | null> {
    const users = await User.find();
    if (users !== null) {
      return users;
    } else {
      return null;
    }
  }

  @Authorized()
  @Query(() => User)
  async user(
    @Arg("id", () => ID) id: number,
    @Ctx() context: ContextType,
  ): Promise<User | null> {
    const user = await User.findOneBy({ id: context.user?.id });
    if (user) {
      return user;
    } else {
      return null;
    }
  }

  @Mutation(() => AuthPayload)
  async signIn(
    @Arg("email") email: string,
    @Arg("password") password: string,
  ): Promise<AuthPayload | null> {
    try {
      const user = await User.findOneBy({ email });
      if (!user) {
        throw new Error("Identifiants invalides");
      }

      const isValidPassword = await argon2.verify(
        user.hashedPassword,
        password,
      );

      if (!isValidPassword) {
        return null;
      }

      const token = sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET_KEY || "",
        {
          expiresIn: "7d",
        },
      );

      return {
        token,
        user,
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  @Mutation(() => AuthPayload)
  async signUp(
    @Arg("data", () => UserCreateInput) data: UserCreateInput,
  ): Promise<AuthPayload> {
    const errors = await validate(data);

    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    }

    try {
      const existingUser = await User.findOneBy({ email: data.email });

      if (existingUser) {
        throw new Error("Cet email est déjà utilisé");
      }

      const hashedPassword = await argon2.hash(data.password);

      const newUser = User.create({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        hashedPassword,
      });

      await newUser.save();

      const token = sign({ id: newUser.id }, process.env.JWT_SECRET || "", {
        expiresIn: "7d",
      });

      return {
        user: newUser,
        token,
      };
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Impossible de créer le compte");
    }
  }

  // @Mutation(() => User, { nullable: true })
  // async updateUser(
  //     @Arg("id", () => ID) id: number,
  //     @Arg("data", () => UserUpdateInput) data: UserUpdateInput
  // ): Promise<User | null> {
  //     const user = await User.findOneBy({ id });
  //     if (user !== null) {

  //         await user.save();
  //         return user;
  //     } else {
  //         return null;
  //     }
  // }

  @Mutation(() => User, { nullable: true })
  async deleteUser(@Arg("id", () => ID) id: number): Promise<User | null> {
    const user = await User.findOneBy({ id });
    if (user !== null) {
      await user.remove();
      Object.assign(user, { id });
      return user;
    } else {
      return null;
    }
  }

  // @Authorized()
  @Query(() => User, { nullable: true })
  async me(@Ctx() context: ContextType): Promise<User | null> {
    return getUserFromContext(context);
  }

  @Mutation(() => Boolean)
  async signout(@Ctx() context: ContextType): Promise<boolean> {
    const cookies = new Cookies(context.req, context.res);
    cookies.set("token", "", { maxAge: 0 });
    return true;
  }
}
