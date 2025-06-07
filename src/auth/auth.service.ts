import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    // 1. Buscar usuário no banco pelo email, incluindo permissões
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { permissions: true },
    });

    // 2. Validar se usuário existe e senha confere
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // 3. Criar o payload (dados que ficarão no token)
    const payload = { sub: user.id, email: user.email, name: user.name, permissions: user.permissions.map(p => p.name) };

    // 4. Gerar o token JWT
    const token = this.jwtService.sign(payload);

    // 5. Retornar token e dados do usuário para o frontend
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        permissions: user.permissions.map(p => p.name),
      },
    };
  }
}
