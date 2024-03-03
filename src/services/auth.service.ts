import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {

  private readonly users: User[] = []; // This will be replaced with actual user storage (e.g., database)
  

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}


 
  public async signup(newUser: User): Promise<string> {
    // Check if the email is already registered
    const existingUser = this.users.find(user => user.email === newUser.email);
    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }
    // Encode the password using Base64 (replace this with your actual encoding logic)
    const encodedPassword = this.encodeBase64(newUser.password);
    // Create a new user object with the encoded password
    const user: User = { ...newUser, password: encodedPassword };
    this.users.push(user);
    return this.generateToken(user);
  }


  

  public async login(credentials: { email: string; password: string }): Promise<{ message: string; token: string }> {
    // Find the user by email
    var generatedToken = null;   var decodedToken  = null;  var message  = null;
    try {
      const user = await this.userService.findUserByEmail(credentials.email);

      if (!user || !this.comparePasswords(credentials.password, user.password)) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      // Authentication successful, generate token
      generatedToken = await this.generateToken(user);
      decodedToken  = this.verifyToken(generatedToken);
      
      if (decodedToken.email === credentials.email) {
        message = 'Login successful';
      } else {
        throw new Error('Token verification failed');
      }

     } catch (error:any) {
      console.log(error);
      return { message: error.message , token: generatedToken };
    }
    
    return { message: message, token: generatedToken };
  }



  private async verifyToken(token: string): Promise<any> {
    try {
      const decodedToken = await this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
      return decodedToken;
    } catch (error) {
      // Handle token verification errors
      throw new Error('Token verification failed');
    }
  }

  private async generateToken(user: User): Promise<string> {
    const payload = {  email: user.email };
    return this.jwtService.sign(payload,{secret:"asaf1234",expiresIn:"10m"});
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