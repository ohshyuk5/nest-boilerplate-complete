import { User } from '@interface-adapters/interfaces/users/user.interface';
import { BaseResponse } from '@libs/structure/interface-adapters/base-classes/base-response';
import { User as UserEntity } from '../domain/entities/user.entity';

export class UserResponse extends BaseResponse implements User {
  constructor(user: UserEntity) {
    super(user);

    const props = user.getCopy();
    this.email = props.email.value;
    this.name = {
      familyName: props.name.familyName,
      givenName: props.name.givenName,
      nickName: props.name.nickname,
    };
    this.portfolios =
      props.portfolios?.map((portfolio) => {
        return {
          id: portfolio.id.value,
          createdAt: portfolio.createdAt.value.toISOString(),
          updatedAt: portfolio.updatedAt.value.toISOString(),
          link: portfolio.link.value,
        };
      }) ?? [];
  }

  email: string;
  name: {
    familyName: string;
    givenName: string;
    nickName: string;
  };
  portfolios: {
    id: string;
    link: string;
    createdAt: string;
    updatedAt: string;
  }[];
}
