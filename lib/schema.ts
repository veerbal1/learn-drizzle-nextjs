import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users",{
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const posts = pgTable("posts",{
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    authorId: integer("author_id").references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const comments = pgTable("comments",{
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    postId: integer("post_id").references(() => posts.id),
    authorId: integer("author_id").references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// relations
export const userRelations = relations(users,({many})=>({
    posts: many(posts),
    comments: many(comments),
}))

export const postRelations = relations(posts,({one,many})=>({
    author: one(users, {
        fields: [posts.authorId],
        references: [users.id],
    }),
    comments: many(comments),
}))

export const commentRelations = relations(comments,({one})=>({
    post: one(posts, {
        fields: [comments.postId],
        references: [posts.id],
    }),
    
}))
