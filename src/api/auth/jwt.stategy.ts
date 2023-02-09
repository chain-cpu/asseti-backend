import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${config.get('AUTH0_ISSUER_URL')}.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: `${config.get('AUTH0_AUDIENCE')}`,
      issuer: `${config.get('AUTH0_ISSUER_URL')}`,
      algorithms: ['RS256'],
    });
  }

  validate(payload: any): any {
    // eslint-disable-next-line no-console
    console.log('validate', payload);
    return payload;
  }
}
