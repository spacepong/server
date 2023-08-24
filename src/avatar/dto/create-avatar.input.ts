import { Field, InputType } from '@nestjs/graphql';

import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

import { FileUpload } from '../scalars/file-upload.scalar';

@InputType()
export class CreateAvatarInput {
  @Field(() => String)
  userId: string;

  @Field(() => GraphQLUpload)
  avatar: Promise<FileUpload>;
}
