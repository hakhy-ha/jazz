import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

const otpStore = new Map<string, string>();

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async requestOtp(phone: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(phone, code);
    return { phone, code, message: 'OTP sent (development only)' };
  }

  async verifyOtp(phone: string, code: string) {
    const stored = otpStore.get(phone);
    if (!stored || stored !== code) {
      throw new UnauthorizedException('Invalid OTP');
    }
    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: `${phone}@jazz.local`,
          password: await bcrypt.hash(Math.random().toString(36), 10),
          name: `User ${phone.slice(-4)}`,
          phone
        }
      });
    }
    return this.buildTokens(user.id, user.email);
  }

  async register(email: string, password: string, name: string, phone?: string, firebaseUid?: string) {
    const hashed = await bcrypt.hash(password, 12);

    // Check if user already exists (possibly created by Firebase)
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      // Update existing user with password and additional details
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashed,
          name: name || user.name,
          phone: phone || user.phone,
          firebaseUid: firebaseUid || user.firebaseUid
        }
      });
    } else {
      // Create new user
      user = await this.prisma.user.create({
        data: { email, password: hashed, name, phone, firebaseUid }
      });
    }

    return this.buildTokens(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.buildTokens(user.id, user.email);
  }

  async loginWithFirebase(email: string, firebaseUid: string, name?: string) {
    let user = await this.prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) {
      // Try to find by email first
      user = await this.prisma.user.findUnique({ where: { email } });
      if (user) {
        // Update existing user with Firebase UID
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { firebaseUid }
        });
      } else {
        // Create new user
        const hashed = await bcrypt.hash(Math.random().toString(36), 10);
        user = await this.prisma.user.create({
          data: {
            email,
            firebaseUid,
            password: hashed,
            name: name || `User ${firebaseUid.slice(-4)}`
          }
        });
      }
    }
    return this.buildTokens(user.id, user.email);
  }

  async refresh(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.buildTokens(user.id, user.email);
  }

  async buildTokens(userId: string, email: string) {
    const accessToken = this.jwtService.sign({ sub: userId, email });
    const refreshToken = this.jwtService.sign({ sub: userId, email }, { secret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key', expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      }
    });
    return { accessToken, refreshToken };
  }
}
