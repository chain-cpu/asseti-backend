import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { InviteUserDto } from './dto/invite-user.dto';
import { Invite } from './invite.entity';
import { OWNER_ROLE_NAME } from '../../configs/roles.config';
import { Auth0ManagementService } from '../../core/services/auth0-management.service';
import { EmailService } from '../../core/services/email.service';
import { Account } from '../accounts/account.entity';
import { AuthService } from '../auth/auth.service';
import { Role } from '../roles/role.entity';
import { RolesService } from '../roles/roles.service';
import { UserService } from '../users/user.service';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(Invite)
    private invitesRepository: Repository<Invite>,

    private authService: AuthService,
    private usersService: UserService,
    private emailService: EmailService,
    private configService: ConfigService,
    private roleService: RolesService,
    private auth0ManagementService: Auth0ManagementService,
  ) {}

  findAll(): Promise<Invite[]> {
    return this.invitesRepository.find({
      relations: { role: true, account: true },
    });
  }

  findOne(id: string): Promise<Invite> {
    return this.invitesRepository.findOne({
      where: { id },
      relations: { role: true, account: true },
    });
  }

  delete(id: string): Promise<DeleteResult> {
    return this.invitesRepository.delete(id);
  }

  async invite(inviteUserDto: InviteUserDto, token: string) {
    const authProfile = await this.authService.getProfile(token);

    const creator = await this.usersService.getUserByAuth0Sub(authProfile.sub);

    const role = await this.roleService.getRoleByName(inviteUserDto.role);

    if (!role) throw new NotFoundException(`Role not found`);
    if (role.name === OWNER_ROLE_NAME)
      throw new NotFoundException(`Unable to assign owner role`);

    const user = await this.usersService.getUserByEmail(inviteUserDto.email);
    const invite = await this.invitesRepository.findOne({
      where: { email: inviteUserDto.email },
    });
    if (user || invite)
      throw new BadRequestException('User with this email is already invited');

    const newInvite = await this.createInvite(
      creator.id,
      inviteUserDto.email,
      role,
      creator.account,
    );

    const name = creator.lastName
      ? creator.name.concat(' ', creator.lastName)
      : creator.name;

    await this.emailService.sendInvite(
      inviteUserDto.email,
      this.createLink(inviteUserDto.email, role.name),
      name,
    );
    return newInvite;
  }

  async activate(token: string) {
    const authProfile = await this.authService.getProfile(token);

    let user = await this.usersService.getUserByEmail(authProfile.email);
    if (user) throw new BadRequestException('Invited user exists');

    const invite = await this.invitesRepository.findOne({
      where: {
        email: authProfile.email,
      },
      relations: { role: true, account: true },
    });
    if (!invite) throw new BadRequestException('Invite does not exist');

    user = await this.usersService.createUser(
      authProfile.sub,
      invite.email,
      authProfile.name,
      invite.role,
      invite.account,
    );
    await this.invitesRepository.delete(invite.id);

    try {
      await this.auth0ManagementService.updateUser(authProfile.sub, {
        email_verified: true,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('auth0ManagementService error: ', err);
    }

    return user;
  }

  private async createInvite(
    creatorId: string,
    email: string,
    role: Role,
    account: Account,
  ): Promise<Invite> {
    const invite = new Invite();
    invite.creator = creatorId;
    invite.email = email;
    invite.role = role;
    invite.account = account;
    return this.invitesRepository.save(invite);
  }

  private createLink(email: string, roleName: string): string {
    const id = Buffer.from(`${email} ${roleName}`).toString('base64');

    return `${this.configService.get('FRONTEND_CLIENT_URL')}activate?id=${id}`;
  }
}
