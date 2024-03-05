import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';


 

@Injectable()
export class AuthService {


  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
 



  public async signup(newUser: User): Promise<string> {
    const existingUser = await this.userService.findUserByEmail(newUser.email);
    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }
    const user: User = { ...newUser, password: newUser.password };
    await this.userService.createUser(user);
    return this.generateToken(user);
  }



  public async login(credentials: { email: string; password: string }): Promise<{ message: string; token: string }> {
    var generatedToken = null;   
    var decodedToken  = null;  
    var message  = null;
    try {
       const user =  await this.userService.findUnique(credentials.email);
       if (!user || !this.comparePasswords(credentials.password, user.password)) {
         throw new UnauthorizedException('Invalid email or password.');
       }
      generatedToken = await this.generateToken(user);
      decodedToken  = await this.verifyToken(generatedToken);
      if (decodedToken.email === credentials.email) {
        message = 'Login successful';
      } else {
        throw new Error('Token verification failed');
      }
    } catch (error) {
      console.log(error);
      return { message: error.message , token: generatedToken };
    }
    return { message: message, token: generatedToken };
  }



  
  private async verifyToken(token: string): Promise<string> {
    try {
      var decodedToken = await this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
  
      return decodedToken;
    } catch (error) {
      throw new Error(""+error.message);
    }
  }

  private async generateToken(user: User): Promise<string> {
    const payload = {  email: user.email };
    return this.jwtService.sign(payload,{secret: process.env.SECRET_KEY,expiresIn:"10d"});
  }

  private encodeBase64(value: string): string {
    return Buffer.from(value).toString('base64');
  }

  private decodeBase64(value: string): string {
    return Buffer.from(value, 'base64').toString('utf-8');
  }

  private comparePasswords(password: string, hashedPassword: string): boolean {
    const decodedPassword = this.decodeBase64(hashedPassword);
    return password === decodedPassword;
  }

}