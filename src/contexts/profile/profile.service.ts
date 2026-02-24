import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileService {
  getProfile(id: string): string {
    console.log('Fetching profile for id:', id);
    return `Profile of user with id ${id}`;
  }
}
