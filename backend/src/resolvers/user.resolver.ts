import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import User from 'src/db/models/user.entity';
import RepoService from 'src/repo.service';
import UserInput from './input/user.input';

@Resolver(() => User)
class UserResolver {
   constructor(private readonly repoService: RepoService) {}

  @Query(() => [User])
  public async getUsers(): Promise<User[]> {
    return await this.repoService.userRepo.find();
  }
  @Query(() => User, {nullable: true})
  public async getUser(@Args('id') id: number): Promise<User> {
    return await this.repoService.userRepo.findOne(id);
  }

  @Mutation(() => User)
  public async createOrLoginUser(@Args('data') input: UserInput): 
    Promise<User> {
      let user = await this.repoService.userRepo.findOne({
        email: input.email.toLocaleLowerCase().trim()
      })

      if(!user) {
        const newUser = this.repoService.userRepo.create({ 
          email: input.email.toLocaleLowerCase().trim()
        });

        user = await this.repoService.userRepo.save(newUser);
      }
      return user
  }
}
export default UserResolver;