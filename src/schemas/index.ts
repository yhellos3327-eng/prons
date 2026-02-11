import * as v from 'valibot';

export const ProjectSchema = v.object({
  id: v.number(),
  title: v.string(),
  description: v.string(),
  image: v.optional(v.string()),
  video: v.optional(v.string()),
  tags: v.array(v.string()),
  liveUrl: v.optional(v.string()),
  behanceUrl: v.optional(v.string()),
});

export const ProjectListSchema = v.array(ProjectSchema);

export type Project = v.InferOutput<typeof ProjectSchema>;

export const LoginResponseSchema = v.object({
  token: v.string(),
});

export const UploadResponseSchema = v.object({
  url: v.string(),
});
