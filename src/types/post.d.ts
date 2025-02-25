
import { Prisma } from "@prisma/client";

export type PostWithAuthor = Prisma.PostGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        image: true;
        username: true;
      };
    };
    comments: {
      include: {
        author: {
          select: {
            id: true;
            username: true;
            image: true;
            name: true;
          };
        };
      };
    };
    likes: {
      select: {
        userId: true;
      };
    };
    _count: {
      select: {
        likes: true;
        comments: true;
      };
    };
  };
}>;

export interface Like {
  userId: string;
}
